"""
Jobs Router
GET /jobs/search — Search job listings relevant to user's skills and target role
"""
import json
from fastapi import APIRouter, Depends, Query
from openai import AsyncOpenAI

from auth_utils import get_current_user
from database import get_supabase
from config import settings

router = APIRouter()
ai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

JOB_PROMPT = """You are a job market analyst. Given the user's skills and target role,
generate 6 realistic and current job recommendations.
Each job should include: title, company (realistic), location, salary_range, required_skills (list), match_score (0-100), and a 1-sentence job_description.
Base them on real market trends as of your training data.
Return strict JSON: {{ "jobs": [ {{ "title":"...", "company":"...", "location":"...", "salary_range":"...", "required_skills":[...], "match_score":0-100, "job_description":"..." }} ] }}"""


@router.get("/search", summary="AI-powered job recommendations based on your profile")
async def search_jobs(
    role: str = Query(..., description="Target role"),
    current_user: dict = Depends(get_current_user),
):
    sb = get_supabase()
    resume = sb.table("resume_reports").select("skills, gaps").eq("user_id", current_user["user_id"]).order("created_at", desc=True).limit(1).execute()
    skills = resume.data[0].get("skills", []) if resume.data else []

    response = await ai.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": JOB_PROMPT},
            {"role": "user", "content": f"Target role: {role}\nUser skills: {', '.join(skills)}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.6,
    )
    jobs = json.loads(response.choices[0].message.content)
    return jobs
