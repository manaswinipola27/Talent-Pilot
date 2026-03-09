"""
Career Dashboard / Progress Router
GET /progress/summary  — Aggregated analytics: readiness, quiz avg, interview avg
GET /progress/timeline — Chronological activity log
"""
from fastapi import APIRouter, Depends, HTTPException
from auth_utils import get_current_user
from database import get_supabase

router = APIRouter()


@router.get("/summary", summary="Career readiness analytics summary")
async def progress_summary(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    uid = current_user["user_id"]

    # Fetch in parallel using multiple queries
    resume_res  = sb.table("resume_reports").select("readiness_score").eq("user_id", uid).order("created_at", desc=True).limit(1).execute()
    quizzes_res = sb.table("quizzes").select("score").eq("user_id", uid).eq("status", "completed").execute()
    interview_res = sb.table("interview_sessions").select("answers").eq("user_id", uid).execute()

    readiness_score = resume_res.data[0]["readiness_score"] if resume_res.data else 0

    quiz_scores = [q["score"] for q in quizzes_res.data if q.get("score") is not None]
    avg_quiz = round(sum(quiz_scores) / len(quiz_scores), 1) if quiz_scores else 0

    interview_scores = []
    for session in interview_res.data:
        for ans in (session.get("answers") or []):
            evaluation = ans.get("evaluation", {})
            if "score" in evaluation:
                interview_scores.append(evaluation["score"])
    avg_interview = round(sum(interview_scores) / len(interview_scores), 1) if interview_scores else 0

    overall_readiness = round((readiness_score * 0.4) + (avg_quiz * 0.3) + (avg_interview * 0.3), 1)

    return {
        "resume_readiness": readiness_score,
        "avg_quiz_score": avg_quiz,
        "avg_interview_score": avg_interview,
        "overall_readiness": overall_readiness,
        "quizzes_taken": len(quiz_scores),
        "interviews_taken": len(interview_res.data),
    }


@router.get("/timeline", summary="Chronological activity log")
async def progress_timeline(current_user: dict = Depends(get_current_user)):
    sb = get_supabase()
    uid = current_user["user_id"]

    resumes    = sb.table("resume_reports").select("id, created_at, readiness_score").eq("user_id", uid).execute()
    quizzes    = sb.table("quizzes").select("id, topic, score, created_at").eq("user_id", uid).execute()
    interviews = sb.table("interview_sessions").select("id, role, status, created_at").eq("user_id", uid).execute()

    timeline = []
    for r in resumes.data:
        timeline.append({"type": "resume", "date": r["created_at"], "detail": f"Resume analysed — Readiness: {r['readiness_score']}%"})
    for q in quizzes.data:
        timeline.append({"type": "quiz", "date": q["created_at"], "detail": f"Quiz: {q['topic']} — Score: {q.get('score', 'Pending')}%"})
    for i in interviews.data:
        timeline.append({"type": "interview", "date": i["created_at"], "detail": f"Interview: {i['role']} — {i['status']}"})

    timeline.sort(key=lambda x: x["date"], reverse=True)
    return {"timeline": timeline}
