import httpx
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

HACKERRANK_BASE = "https://www.hackerrank.com/rest/hackers"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AlgoOrbitEngine/1.0",
    "Accept": "application/json"
}

from app.core.http_client import get_http_client

async def fetch_hackerrank(username: str) -> Dict[str, Any]:
    """
    Fetch public HackerRank profile metrics: badges, skill stars, track scores,
    and profile metadata (avatar, country, school, total solved).
    """
    cleaned_username = username.strip().lstrip("@").rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid HackerRank username provided.")

    client = get_http_client()

    # 1. Fetch user profile metadata
    profile_url = f"{HACKERRANK_BASE}/{cleaned_username}"
    user_name = cleaned_username
    avatar = ""
    country = ""
    school = ""

    try:
        user_resp = await client.get(profile_url, headers=HEADERS)
        if user_resp.status_code == 404:
            raise ValueError(f"HackerRank user '{cleaned_username}' not found.")
        elif user_resp.status_code == 200:
            user_json = user_resp.json()
            model = user_json.get("model", {})
            user_name = model.get("name") or cleaned_username
            avatar = model.get("avatar") or ""
            country = model.get("country") or ""
            school = model.get("school") or ""
    except ValueError:
        raise
    except Exception as e:
        logger.warning(f"Failed to fetch HackerRank profile info for {cleaned_username}: {e}")

    # 2. Fetch badges
    badges_url = f"{HACKERRANK_BASE}/{cleaned_username}/badges"
    try:
        resp = await client.get(badges_url, headers=HEADERS)
    except Exception as e:
        logger.error(f"HackerRank badges request error: {e}")
        raise RuntimeError("Failed to connect to HackerRank API.")

    if resp.status_code == 404:
        raise ValueError(f"HackerRank user '{cleaned_username}' not found.")
    elif resp.status_code != 200:
        raise RuntimeError(f"HackerRank returned status {resp.status_code}.")

    try:
        badges_data = resp.json()
    except Exception:
        badges_data = {}

    raw_models = badges_data.get("models", [])
    badges_list = []
    problem_solving_stars = 0
    total_solved = 0

    for b in raw_models:
        badge_name = b.get("badge_name", "Unknown")
        earned_stars = int(b.get("stars") or 0)
        max_stars = int(b.get("total_stars") or 5)
        total_points = b.get("total_points") or 0
        current_points = float(b.get("current_points") or 0.0)
        category = b.get("category_name") or ""
        solved = int(b.get("solved") or 0)

        if badge_name.lower() in ("problem solving", "problem-solving"):
            problem_solving_stars = earned_stars

        # Strictly include ONLY badges that the user actually OWNS (earned_stars >= 1)
        if earned_stars > 0:
            total_solved += solved
            badges_list.append({
                "badge_name": badge_name,
                "stars": earned_stars,
                "max_stars": max_stars,
                "points": int(current_points) if current_points > 0 else int(total_points or 0),
                "category": category,
                "solved": solved
            })

    # 3. Fetch scores / tracks
    scores_url = f"{HACKERRANK_BASE}/{cleaned_username}/scores_elo"
    scores_list = []
    algo_score = 0.0

    try:
        scores_resp = await client.get(scores_url, headers=HEADERS)
        if scores_resp.status_code == 200:
            raw_scores = scores_resp.json()
            if isinstance(raw_scores, list):
                for s in raw_scores:
                    track_name = s.get("name", "")
                    practice = s.get("practice") or {}
                    score = float(practice.get("score") or 0.0)
                    rank = practice.get("rank")

                    if track_name.lower() in ("algorithms", "problem solving") and score > algo_score:
                        algo_score = score

                    scores_list.append({
                        "track": track_name,
                        "score": score,
                        "rank": rank
                    })
    except Exception as e:
        logger.warning(f"Failed to fetch HackerRank scores_elo: {e}")

    return {
        "username": cleaned_username,
        "name": user_name,
        "avatar": avatar,
        "country": country,
        "school": school,
        "badges": badges_list,
        "total_badges": len(badges_list),
        "total_solved": total_solved,
        "problem_solving_stars": problem_solving_stars,
        "algorithms_score": algo_score,
        "scores": scores_list[:10],
        "profile_url": f"https://www.hackerrank.com/profile/{cleaned_username}"
    }
