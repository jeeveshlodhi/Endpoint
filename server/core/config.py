from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "URL Fetcher API"
    DEBUG: bool = True
    ALLOWED_HOSTS: List[str] = ["*"]

    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    class Config:
        env_file = ".env"

settings = Settings()
