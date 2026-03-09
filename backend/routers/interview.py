"""
AI Interview Simulator Router
POST /interview/start    — Generate AI interview questions for a role
POST /interview/evaluate — Submit answer and receive GPT-4 feedback
GET  /interview/history  — Retrieve past interview sessions
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI

from auth_utils import get_current_user
from database import get_supabase
from config import settings

router = APIRouter()
ai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

QUESTION_PROMPT = """You are an experienced technical interviewer.
Generate {count} interview questions for the role of {role} at {level} difficulty.
Mix: {mix_ratio}
Return JSON: {{ "role": "...", "questions": [ {{ "id": 1, "type": "technical|behavioural|situational", "question": "...", "expected_keywords": [...] }} ] }}"""

EVAL_PROMPT = """You are an expert interview coach. Evaluate the candidate's answer to the following interview question.
Assess:
1. Accuracy (0–40): Did they cover the key concepts?
2. Confidence (0–30): Is the language decisive and assertive?
3. Structure (0–30): Is the answer well-organised (STAR or clear logic)?
Provide a total score out of 100, specific strengths, areas to improve, and a model answer.
Return strict JSON: {{ "score": 0-100, "accuracy": 0-40, "confidence": 0-30, "structure": 0-30, "strengths": [...], "improvements": [...], "model_answer": "..." }}"""


class StartRequest(BaseModel):
    role: str
    level: str = "Mid"          # Junior | Mid | Senior
    count: int = 5
    mix_ratio: str = "60% technical, 30% behavioural, 10% situational"


class EvaluateRequest(BaseModel):
    session_id: str
    question: str
    answer: str


@router.post("/start", summary="Generate AI interview questions")
async def start_interview(body: StartRequest, current_user: dict = Depends(get_current_user)):
    prompt = QUESTION_PROMPT.format(
        count=body.count,
        role=body.role,
        level=body.level,
        mix_ratio=body.mix_ratio,
    )
    response = await ai.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Generate the questions now."},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    questions = json.loads(response.choices[0].message.content)

    sb = get_supabase()
    record = sb.table("interview_sessions").insert({
        "user_id": current_user["user_id"],
        "role": body.role,
        "level": body.level,
        "questions": questions,
        "answers": [],
        "status": "in_progress",
    }).execute()

    session_id = record.data[0]["id"]
    return {"session_id": session_id, **questions}


@router.post("/evaluate", summary="Evaluate a candidate's interview answer")
async def evaluate_answer(body: EvaluateRequest, current_user: dict = Depends(get_current_user)):
    response = await ai.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": EVAL_PROMPT},
            {"role": "user", "content": f"Question: {body.question}\n\nCandidate Answer: {body.answer}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    evaluation = json.loads(response.choices[0].message.content)

    # Append answer + evaluation to the session
    sb = get_supabase()
    session = sb.table("interview_sessions").select("answers").eq("id", body.session_id).execute()
    if not session.data:
        raise HTTPException(status_code=404, detail="Session not found.")
    answers = session.data[0].get("answers", [])
    answers.append({"question": body.question, "answer": body.answer, "evaluation": evaluation})
    sb.table("interview_sessions").update({"answers": answers}).eq("id", body.session_id).execute()

    return {"evaluation": evaluation}


@router.get("/history", summary="List past interview sessions")
async def interview_history(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    result = (
        sb.table("interview_sessions")
        .select("id, role, level, status, created_at")
        .eq("user_id", current_user["user_id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"sessions": result.data}
