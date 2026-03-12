"""
VidyāMitra — Intelligent Career Agent
FastAPI Backend Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import uvicorn

from routers import resume, evaluate, plan, quiz, interview, jobs, progress, auth

# ─────────────────────────────────────────────
# App Initialisation
# ─────────────────────────────────────────────
app = FastAPI(
    title="VidyāMitra — Intelligent Career Agent",
    description=(
        "An AI-powered platform bridging education and employability. "
        "Provides resume parsing, personalised upskilling plans, "
        "AI interview simulation, dynamic resource fetching, and career analytics."
    ),
    version="1.0.0",
    docs_url="/docs",          # Swagger UI
    redoc_url="/redoc",        # ReDoc alternative
    openapi_url="/openapi.json",
)

# ─────────────────────────────────────────────
# CORS Middleware
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Router Registration
# ─────────────────────────────────────────────
app.include_router(auth.router,      prefix="/auth",      tags=["Authentication"])
app.include_router(resume.router,    prefix="/resume",    tags=["Resume Intelligence"])
app.include_router(evaluate.router,  prefix="/evaluate",  tags=["Evaluation"])
app.include_router(plan.router,      prefix="/plan",      tags=["Upskilling Planner"])
app.include_router(quiz.router,      prefix="/quiz",      tags=["Quiz Engine"])
app.include_router(interview.router, prefix="/interview", tags=["AI Interview Simulator"])
app.include_router(jobs.router,      prefix="/jobs",      tags=["Job Recommendations"])
app.include_router(progress.router,  prefix="/progress",  tags=["Career Dashboard"])

# ─────────────────────────────────────────────
# Root redirect → Swagger docs
# ─────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "service": "VidyāMitra API", "version": "1.0.0"}

# ─────────────────────────────────────────────
# Exception Handlers for Graceful Degradation
# ─────────────────────────────────────────────
from fastapi.responses import JSONResponse
import httpx
import openai

@app.exception_handler(openai.APIError)
async def openai_exception_handler(request, exc):
    err_str = str(exc).lower()
    if "insufficient_quota" in err_str or "429" in err_str:
        return JSONResponse(
            status_code=402,
            content={"detail": "OpenAI API Quota Exceeded (429). Please top-up your OpenAI credits or update the API Key in the .env file to use AI features."}
        )
    return JSONResponse(status_code=400, content={"detail": f"OpenAI API Error: {str(exc)}"})

@app.exception_handler(httpx.HTTPStatusError)
async def httpx_exception_handler(request, exc):
    return JSONResponse(
        status_code=400, 
        content={"detail": f"External API request failed ({exc.response.status_code}). This typically happens if the API keys in your .env are empty (e.g. YouTube, NewsAPI)."}
    )


# ─────────────────────────────────────────────
# Dev entry point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
