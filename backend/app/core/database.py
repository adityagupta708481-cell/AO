import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("algoorbit.database")

is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine_kwargs = {
    "pool_pre_ping": True,  # Actively tests connections before use (essential for Neon serverless wakeups)
}

if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL Configuration (Optimized for Neon Serverless & PgBouncer)
    engine_kwargs.update({
        "pool_size": 5,        # Conservative pool to stay well within Neon free tier limits
        "max_overflow": 10,    # Max burst connections during peak traffic
        "pool_timeout": 30,    # Seconds to wait for an available connection from pool
        "pool_recycle": 300,   # Recycle connections every 5 mins (matches Neon's 5-minute auto-suspend)
    })

engine = create_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that yields a database session per request.
    Automatically rolls back on error to prevent transaction abortion in PostgreSQL.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

