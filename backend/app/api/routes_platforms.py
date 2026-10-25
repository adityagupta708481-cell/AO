import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, PlatformConnection, SyncedDsaStats
from app.schemas.pydantic_schemas import (
    PlatformConnect, PlatformStatusResponse, PlatformStatusItem,
    LeetCodeStatsResponse, CodeforcesStatsResponse, GitHubStatsResponse,
    HackerRankStatsResponse, CodeChefStatsResponse
)
from app.services.sync_service import sync_all_for_user
from app.services.leetcode_scraper import fetch_leetcode
from app.services.codeforces_scraper import fetch_codeforces
from app.services.github_scraper import fetch_github
from app.services.hackerrank_scraper import fetch_hackerrank
from app.services.codechef_scraper import fetch_codechef

router = APIRouter()

@router.post("/connect", response_model=PlatformStatusResponse)
def connect_platforms(
    data: PlatformConnect,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save or update platform handles for the user."""
    platform_map = {
        "leetcode": data.leetcode,
        "codeforces": data.codeforces,
        "github": data.github,
        "hackerrank": data.hackerrank,
        "codechef": data.codechef
    }

    for platform_name, username in platform_map.items():
        if username is not None and username.strip():
            cleaned = username.strip()
            conn = db.query(PlatformConnection).filter(
                PlatformConnection.user_id == current_user.id,
                PlatformConnection.platform == platform_name
            ).first()

            if conn:
                if conn.username != cleaned:
                    conn.username = cleaned
                    conn.sync_status = "idle"
                    conn.error_message = None
            else:
                conn = PlatformConnection(
                    user_id=current_user.id,
                    platform=platform_name,
                    username=cleaned,
                    sync_status="idle"
                )
                db.add(conn)

    db.commit()

    # Return all platform connections
    connections = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id
    ).all()

    return {"platforms": [PlatformStatusItem.model_validate(c) for c in connections]}


@router.get("/status", response_model=PlatformStatusResponse)
def get_platforms_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve sync status and timestamps for all connected platforms."""
    connections = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id
    ).all()
    return {"platforms": [PlatformStatusItem.model_validate(c) for c in connections]}


@router.post("/sync-all", status_code=status.HTTP_202_ACCEPTED)
async def sync_all(
    background_tasks: BackgroundTasks,
    force: bool = False,
    current_user: User = Depends(get_current_user)
):
    """Trigger background sync for all connected platforms."""
    background_tasks.add_task(sync_all_for_user, current_user.id, force)
    return {"message": "Sync initiated in background for all connected platforms.", "status": "syncing"}


@router.get("/leetcode", response_model=LeetCodeStatsResponse)
async def get_leetcode_stats(
    force: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get LeetCode metrics and topic counts from database cache or live."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "leetcode"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="LeetCode handle not connected.")

    data = None
    if not force and conn.data_json:
        try:
            data = json.loads(conn.data_json)
        except Exception:
            data = None

    if not data or "streak" not in data:
        try:
            data = await fetch_leetcode(conn.username)
            conn.data_json = json.dumps(data)
            db.commit()
        except Exception as e:
            if not data:
                raise HTTPException(status_code=502, detail=f"Failed to fetch LeetCode data: {str(e)}")

    dsa_stats = db.query(SyncedDsaStats).filter(SyncedDsaStats.user_id == current_user.id).first()
    data["updated_at"] = dsa_stats.updated_at if dsa_stats else conn.last_synced_at
    return data


@router.get("/codeforces", response_model=CodeforcesStatsResponse)
async def get_codeforces_stats(
    force: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get Codeforces live or cached stats."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "codeforces"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="Codeforces handle not connected.")

    data = None
    if not force and conn.data_json:
        try:
            data = json.loads(conn.data_json)
        except Exception:
            data = None

    if not data or "total_solved" not in data:
        data = await fetch_codeforces(conn.username)
        conn.data_json = json.dumps(data)
        db.commit()

    return data


@router.get("/github", response_model=GitHubStatsResponse)
async def get_github_stats(
    force: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get GitHub repository stats, language breakdown, and stars."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "github"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="GitHub handle not connected.")

    data = None
    if not force and conn.data_json:
        try:
            data = json.loads(conn.data_json)
        except Exception:
            data = None

    if not data or "top_repos" not in data:
        data = await fetch_github(conn.username)
        conn.data_json = json.dumps(data)
        db.commit()

    return data


@router.get("/hackerrank", response_model=HackerRankStatsResponse)
async def get_hackerrank_stats(
    force: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get HackerRank live badges, stars, and track scores."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "hackerrank"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="HackerRank handle not connected.")

    data = None
    if not force and conn.data_json:
        try:
            data = json.loads(conn.data_json)
        except Exception:
            data = None

    if not data or "total_solved" not in data:
        data = await fetch_hackerrank(conn.username)
        conn.data_json = json.dumps(data)
        db.commit()

    return data


@router.get("/codechef", response_model=CodeChefStatsResponse)
async def get_codechef_stats(
    force: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get CodeChef live rating, stars, division, and solved count."""
    conn = db.query(PlatformConnection).filter(
        PlatformConnection.user_id == current_user.id,
        PlatformConnection.platform == "codechef"
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail="CodeChef handle not connected.")

    data = None
    if not force and conn.data_json:
        try:
            data = json.loads(conn.data_json)
        except Exception:
            data = None

    if not data or "profile_url" not in data:
        data = await fetch_codechef(conn.username)
        conn.data_json = json.dumps(data)
        db.commit()

    return data

