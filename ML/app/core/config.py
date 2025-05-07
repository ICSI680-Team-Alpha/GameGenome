import warnings
from typing import Annotated, Any, Literal
from pydantic import (
    AnyUrl,
    BeforeValidator,
    HttpUrl,
    PositiveInt,
    computed_field,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self
from pathlib import Path

# Get the directory where the config.py file is located
CONFIG_DIR = Path(__file__).parent.absolute()
# Get the project root (one level up)
PROJECT_ROOT = CONFIG_DIR.parent

def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    ML_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.ML_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    SENTRY_DSN: HttpUrl | None = None
    
    # MongoDB Atlas Settings
    DB_ATLAS_URI: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_NAME: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def DB_CONNECTION_STRING(self) -> str:
        # MongoDB Atlas connection string already contains username and password
        # but we replace placeholders in the URI if present
        conn_str = self.DB_ATLAS_URI
        conn_str = conn_str.replace("<db_username>", self.DB_USERNAME)
        conn_str = conn_str.replace("<db_password>", self.DB_PASSWORD)
        return conn_str

    
    # Recommendation service specific settings
    RECOMMENDATION_API_PREFIX: str = "/recommendation"
    MAX_RECOMMENDATIONS: PositiveInt = 20
    CONTENT_SIMILARITY_THRESHOLD: float = 0.7
    ENABLE_RECOMMENDATION_CACHE: bool = True
    RECOMMENDATION_CACHE_TTL: PositiveInt = 3600  # seconds
    MODEL_WEIGHTS_PATH: str = "models/recommender_weights.pkl"

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("DB_PASSWORD", self.DB_PASSWORD)
        return self


settings = Settings()