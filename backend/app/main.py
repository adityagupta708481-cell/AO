import os
import uuid
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.core.security_headers import SecurityHeadersMiddleware
from app.core.rate_limiter import RateLimitingMiddleware
from app.core.http_client import close_http_client

# Import all models to register with Base metadata
import app.models.db_models  # noqa: F401

logger = logging.getLogger("algoorbit.app")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist with retry support for serverless cold-starts
    logger.info("Initializing database tables...")
    for attempt in range(1, 4):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info(f"Database tables verified/created on attempt {attempt}.")
            break
        except Exception as e:
            if attempt == 3:
                logger.error(f"Failed to initialize database tables after 3 attempts: {e}", exc_info=True)
                raise
            logger.warning(f"Database table initialization attempt {attempt} failed ({e}). Retrying in 2 seconds...")
            await asyncio.sleep(2)

    logger.info(f"AlgoOrbit API initialized successfully in [{settings.ENVIRONMENT}] mode.")
    yield
    logger.info("AlgoOrbit API shutting down.")
    await close_http_client()

is_prod = settings.ENVIRONMENT.lower() == "production"

app = FastAPI(
    title="AlgoOrbit API — Coding Platform Sync & AI Readiness Engine",
    description="Full-Stack Web Platform with Automated Coding Platform Sync & Hugging Face AI Readiness Engine",
    version="1.0.0",
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
    openapi_url=None if is_prod else "/openapi.json",
    lifespan=lifespan
)

# 1. GZip Compression Middleware (Compress JSON responses > 1KB)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 2. Security Headers Middleware (OWASP protection)
app.add_middleware(SecurityHeadersMiddleware)

# 3. Rate Limiting Middleware (anti brute-force & DDoS mitigation)
app.add_middleware(RateLimitingMiddleware)

# 4. Dynamic CORS Configuration
configured_origins = settings.get_cors_origins()
allow_all = configured_origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=configured_origins,
    allow_credentials=not allow_all,  # Browsers forbid allow_credentials=True when origin is wildcard *
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Retry-After"],
)

# 4. Global Error Handlers (Information Leak Prevention)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None)
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format clean error messages
    clean_errors = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []) if l != "body")
        clean_errors.append(f"{loc}: {err.get('msg', 'Invalid value')}" if loc else err.get("msg", "Invalid value"))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "; ".join(clean_errors) if clean_errors else "Validation error"}
    )

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())[:8]
    logger.error(f"Unhandled Exception [error_id={error_id}] on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please try again later.",
            "error_id": error_id
        }
    )

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# 5. Explicit Router Registrations
def register_routers():
    try:
        from app.api.routes_auth import router as auth_router
        app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

        from app.api.routes_platforms import router as platforms_router
        app.include_router(platforms_router, prefix="/api/platforms", tags=["Platforms"])

        from app.api.routes_ai import router as ai_router
        app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])

        from app.api.routes_academics import router as academics_router
        app.include_router(academics_router, prefix="/api", tags=["Academics"])

        from app.api.routes_revision import router as revision_router
        app.include_router(revision_router, prefix="/api/revisions", tags=["Revision"])
    except Exception as e:
        logger.error(f"Critical error loading API routers: {e}", exc_info=True)
        raise

register_routers()

