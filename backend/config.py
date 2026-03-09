"""
Shared configuration loaded from .env
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"

    JWT_SECRET_KEY: str = "changeme"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"

    YOUTUBE_API_KEY: str = ""
    YOUTUBE_MAX_RESULTS: int = 10

    GOOGLE_API_KEY: str = ""
    GOOGLE_SEARCH_CX: str = ""

    PEXELS_API_KEY: str = ""
    NEWS_API_KEY: str = ""
    EXCHANGE_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
