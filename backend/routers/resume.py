"""
Resume Intelligence Router
POST /resume/parse  — Upload and parse resume, extract skills & gaps
GET  /resume/report — Retrieve last parsed resume report for logged-in user
"""
import io
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from openai import AsyncOpenAI

from PyPDF2 import PdfReader
from docx import Document

from auth_utils import get_current_user
from database import get_supabase
from config import settings

router = APIRouter()
ai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

SYSTEM_PROMPT = """You are an expert career analyst and resume reviewer.
Given the raw text of a resume, extract:
1. A bullet list of identified technical & soft skills.
2. A bullet list of likely skill gaps based on current industry trends.
3. A 2–3 sentence professional summary.
4. A readiness score out of 100 for the job market.
Respond in strict JSON with keys: skills, gaps, summary, readiness_score."""


def _extract_text_from_pdf(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    return "\n".join(page.extract_text() or "" for page in reader.pages).strip()


def _extract_text_from_docx(data: bytes) -> str:
    doc = Document(io.BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


@router.post("/parse", summary="Upload resume and extract skills & gaps")
async def parse_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Only PDF and DOCX files are accepted.")

    raw = await file.read()
    if len(raw) > 5 * 1024 * 1024:   # 5 MB guard
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5 MB.")

    if file.content_type == "application/pdf":
        resume_text = _extract_text_from_pdf(raw)
    else:
        resume_text = _extract_text_from_docx(raw)

    if not resume_text:
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file.")

    from ai_wrapper import generate_ai_response
    analysis = await generate_ai_response(
        system_prompt=SYSTEM_PROMPT, 
        user_prompt=f"Resume text:\n\n{resume_text[:8000]}", 
        temperature=0.3
    )

    # ── Persist to Supabase ───────────────────────────────────
    try:
        sb = get_supabase()
        sb.table("resume_reports").insert({
            "user_id": current_user["user_id"],
            "filename": file.filename,
            "skills": analysis.get("skills", []),
            "gaps": analysis.get("gaps", []),
            "summary": analysis.get("summary", ""),
            "readiness_score": analysis.get("readiness_score", 0),
        }).execute()
    except Exception as db_err:
        import logging
        logging.getLogger(__name__).warning("DB save failed (non-fatal): %s", db_err)

    return {"status": "parsed", "analysis": analysis}


@router.get("/report", summary="Get latest resume analysis report")
async def get_report(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    result = (
        sb.table("resume_reports")
        .select("*")
        .eq("user_id", current_user["user_id"])
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="No resume report found. Please upload your resume first.")
    return result.data[0]
