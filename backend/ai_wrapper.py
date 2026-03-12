import json
import logging
from openai import AsyncOpenAI
import openai
from config import settings

logger = logging.getLogger(__name__)

ai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_ai_response(system_prompt: str, user_prompt: str, temperature: float = 0.6) -> dict:
    """Wrapper that tries OpenAI, and falls back to mock demo data if API quota runs out."""
    try:
        response = await ai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=temperature,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        err_str = str(e).lower()
        if "insufficient_quota" in err_str or "429" in err_str or "invalid" in err_str or "auth" in err_str:
            logger.warning("OpenAI Error: %s. Faking response with Mock Data for development.", err_str)
            return _get_mock_data(system_prompt, user_prompt)
        raise e


def _get_mock_data(system_prompt: str, user_prompt: str) -> dict:
    p = system_prompt.lower()
    
    # RESUME ANALYST
    if "resume" in p and ("analyst" in p or "reviewer" in p or "skill" in p):
        return {
            "skills": ["JavaScript", "React", "Node.js", "Python", "Team Leadership"],
            "gaps": ["Docker", "AWS/Cloud", "CI/CD Pipelines"],
            "summary": "Experienced software developer with a strong foundation in frontend technologies and emerging skills in full-stack architecture. Ready to transition into a Senior UI Developer role.",
            "readiness_score": 75
        }
        
    # PLAN
    if "structured 4-week upskilling plan" in p or "upskilling plan" in p:
        return {
            "target_role": "Full Stack Engineer (Demo)",
            "weeks": [
                {
                    "week_number": 1,
                    "title": "Cloud Computing Fundamentals",
                    "focus": "AWS Core Services",
                    "goals": ["Understand EC2", "Setup S3", "Learn IAM"],
                    "resources_needed": ["AWS Free Tier", "Video Tutorials"]
                },
                {
                    "week_number": 2,
                    "title": "Containerization",
                    "focus": "Docker Basics",
                    "goals": ["Write Dockerfiles", "Run Containers", "Docker Compose"],
                    "resources_needed": ["Docker Desktop"]
                },
                {
                    "week_number": 3,
                    "title": "Orchestration & CI/CD",
                    "focus": "Kubernetes & GitHub Actions",
                    "goals": ["K8s Pods", "Deployments", "Automate builds"],
                    "resources_needed": ["Minikube", "GitHub Repository"]
                },
                {
                    "week_number": 4,
                    "title": "Capstone Project",
                    "focus": "Deploy a Full Stack App",
                    "goals": ["Containerize Backend", "Deploy Frontend", "Configure Domain"],
                    "resources_needed": ["Vercel", "Render/AWS"]
                }
            ]
        }
        
    # QUIZ
    if "multiple-choice quiz" in p:
        return {
            "topic": "Containerization & Docker (Demo)",
            "questions": [
                {
                    "id": 1,
                    "question": "What is the primary purpose of a Dockerfile?",
                    "options": {
                        "A": "To create a virtual machine",
                        "B": "To define the steps required to build a Docker image",
                        "C": "To orchestrate containers across multiple nodes",
                        "D": "To store database credentials securely"
                    },
                    "answer": "B",
                    "explanation": "A Dockerfile contains all the layered instructions that Docker uses to automatically build a complete image."
                },
                {
                    "id": 2,
                    "question": "Which command is used to see running Docker containers?",
                    "options": {
                        "A": "docker view",
                        "B": "docker ps",
                        "C": "docker containers",
                        "D": "docker status"
                    },
                    "answer": "B",
                    "explanation": "'docker ps' lists all currently running containers in your active Docker daemon."
                }
            ]
        }
        
    # INTERVIEW EVALUATION
    if "evaluate how well the candidate" in p:
        return {
            "score": 8,
            "feedback": "Good answer! You successfully identified the core concepts. However, you could improve by giving a concrete example from your past experience.",
            "ideal_answer": "Ideally, you should outline the steps linearly and then provide a specific real-world example highlighting challenges you faced."
        }
        
    # INTERVIEW QUESTION GENERATION
    if "generate exactly 3" in p or "interview questions" in p:
        return {
            "questions": [
                "Tell me about a time you had to learn a completely new technology under a tight deadline. How did you approach it?",
                "Can you explain the difference between Monolithic and Microservice architectures?",
                "Describe your experience with CI/CD. How do you ensure your deployments are safe and error-free?"
            ]
        }
        
    # JOB MARKET RECOMMENDATIONS
    if "job recommendations" in p or "market analyst" in p:
        return {
            "jobs": [
                {
                    "title": "Cloud Engineer",
                    "company": "Amazon Web Services (Demo)",
                    "location": "Remote / Hybrid",
                    "salary_range": "$120,000 - $150,000",
                    "required_skills": ["AWS", "Python", "Linux", "Docker"],
                    "match_score": 85,
                    "job_description": "Design and maintain secure, highly available cloud infrastructures."
                },
                {
                    "title": "DevOps Specialist",
                    "company": "Tech Innovations Inc.",
                    "location": "New York, NY",
                    "salary_range": "$135,000 - $160,000",
                    "required_skills": ["CI/CD", "Kubernetes", "Terraform", "Git"],
                    "match_score": 70,
                    "job_description": "Implement automated deployment pipelines and orchestrate containerized microservices."
                }
            ]
        }

    # Fallback
    return {"message": "Mock Response based on your prompt.", "status": "demo_mode"}
