"""
Upskilling Planner Router
POST /plan/generate — Generate personalised learning path from resume gaps
GET  /plan/current  — Retrieve active learning plan
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

PLANNER_PROMPT = """You are an expert learning path designer.
Given a list of skill gaps and target role, generate a personalised 8-week upskilling plan.
Each week should contain:
- Focus topic
- 2 recommended free courses/certifications (with platform name)
- 1 project idea to validate the skill
Respond in strict JSON: { "role": "...", "weeks": [ { "week": 1, "focus": "...", "courses": [...], "project": "..." }, ... ] }"""


class PlanRequest(BaseModel):
    target_role: str
    gaps: list[str] | None = None   # Optional override; if None, fetched from DB


@router.post("/generate", summary="Generate personalised upskilling plan")
async def generate_plan(body: PlanRequest, current_user: dict = Depends(get_current_user)):
    gaps = body.gaps
    if not gaps:
        # Auto-fetch from latest resume report
        sb = get_supabase()
        result = (
            sb.table("resume_reports")
            .select("gaps")
            .eq("user_id", current_user["user_id"])
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="No resume gaps found. Upload your resume first.")
        gaps = result.data[0].get("gaps", [])

    from ai_wrapper import generate_ai_response
    plan = await generate_ai_response(
        system_prompt=PLANNER_PROMPT, 
        user_prompt=f"Target role: {body.target_role}\nSkill gaps: {', '.join(gaps)}", 
        temperature=0.5
    )

    sb = get_supabase()
    sb.table("learning_plans").upsert({
        "user_id": current_user["user_id"],
        "target_role": body.target_role,
        "plan": plan,
    }).execute()

    return {"status": "generated", "plan": plan}


@router.get("/current", summary="Retrieve active learning plan")
async def get_plan(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    result = (
        sb.table("learning_plans")
        .select("*")
        .eq("user_id", current_user["user_id"])
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="No learning plan found.")
    return result.data[0]
