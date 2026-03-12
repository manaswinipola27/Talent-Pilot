"""
Quiz Engine Router
POST /quiz/generate  — Generate domain-specific quiz from skill gap
POST /quiz/submit    — Submit answers and receive scores
GET  /quiz/history   — Get quiz history for current user
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

QUIZ_PROMPT = """Generate a {count}-question multiple-choice quiz on the topic: {topic}.
Each question must have exactly 4 options (A, B, C, D) and one correct answer.
Return strict JSON:
{{ "topic": "...", "questions": [ {{ "id": 1, "question": "...", "options": {{"A":"...","B":"...","C":"...","D":"..."}}, "answer": "A", "explanation": "..." }} ] }}"""


class QuizRequest(BaseModel):
    topic: str
    count: int = 10


class SubmitRequest(BaseModel):
    quiz_id: str
    responses: dict[str, str]   # { "1": "A", "2": "C", ... }


@router.post("/generate", summary="Generate a quiz on a skill topic")
async def generate_quiz(body: QuizRequest, current_user: dict = Depends(get_current_user)):
    from ai_wrapper import generate_ai_response
    quiz_data = await generate_ai_response(
        system_prompt=QUIZ_PROMPT.format(count=body.count, topic=body.topic),
        user_prompt="Generate the quiz.",
        temperature=0.6
    )

    sb = get_supabase()
    record = sb.table("quizzes").insert({
        "user_id": current_user["user_id"],
        "topic": body.topic,
        "questions": quiz_data,
        "status": "pending",
    }).execute()

    quiz_id = record.data[0]["id"]
    # Return questions without answers
    questions_sanitised = [
        {k: v for k, v in q.items() if k != "answer" and k != "explanation"}
        for q in quiz_data.get("questions", [])
    ]
    return {"quiz_id": quiz_id, "topic": body.topic, "questions": questions_sanitised}


@router.post("/submit", summary="Submit quiz answers and get score")
async def submit_quiz(body: SubmitRequest, current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    result = sb.table("quizzes").select("*").eq("id", body.quiz_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Quiz not found.")

    quiz = result.data[0]
    questions = quiz["questions"].get("questions", [])
    correct = 0
    review = []
    for q in questions:
        qid = str(q["id"])
        user_ans = body.responses.get(qid, "")
        is_correct = user_ans == q["answer"]
        if is_correct:
            correct += 1
        review.append({
            "id": qid,
            "question": q["question"],
            "your_answer": user_ans,
            "correct_answer": q["answer"],
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
        })

    score = round((correct / len(questions)) * 100) if questions else 0
    sb.table("quizzes").update({
        "responses": body.responses,
        "score": score,
        "status": "completed",
    }).eq("id", body.quiz_id).execute()

    return {"score": score, "correct": correct, "total": len(questions), "review": review}


@router.get("/history", summary="Get all past quiz results")
async def quiz_history(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    result = (
        sb.table("quizzes")
        .select("id, topic, score, status, created_at")
        .eq("user_id", current_user["user_id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"quizzes": result.data}
