from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Driven Scheme Matching for Marginalized Entrepreneurs"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # PostgreSQL Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/scheme_db"
    )
    SYNC_DATABASE_URL: str = os.getenv(
        "SYNC_DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/scheme_db"
    )

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"


settings = Settings()
