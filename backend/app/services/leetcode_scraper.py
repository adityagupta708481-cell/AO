import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

LEETCODE_QUERY = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
      userAvatar
      realName
      reputation
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    userCalendar {
      streak
      totalActiveDays
    }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    topPercentage
    badge { name }
  }
  recentAcSubmissionList(username: $username, limit: 15) {
    id
    title
    titleSlug
    timestamp
  }
}
"""

HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AlgoOrbitEngine/1.0",
}

from app.core.http_client import get_http_client

async def fetch_leetcode(username: str) -> Dict[str, Any]:
    """
    Fetch LeetCode public profile metrics via the official GraphQL API.
    Returns normalized dictionary with solved counts, contest rating, topic counts, streak, and recent submissions.
    """
    cleaned_username = username.strip().lstrip("@").rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid LeetCode username provided.")

    payload = {
        "query": LEETCODE_QUERY,
        "variables": {"username": cleaned_username}
    }

    client = get_http_client()
    try:
        response = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=HEADERS)
        if response.status_code == 404:
            raise ValueError(f"LeetCode profile '{cleaned_username}' not found. Please verify your public profile handle.")
        response.raise_for_status()
        data = response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"LeetCode HTTP error: {e}")
        raise RuntimeError(f"LeetCode service returned HTTP error: {e.response.status_code}")
    except httpx.RequestError as e:
        logger.error(f"LeetCode connection error: {e}")
        raise RuntimeError("Failed to connect to LeetCode. Network or rate limit issue.")

    if not data or "data" not in data or not data["data"].get("matchedUser"):
        raise ValueError(f"Invalid LeetCode handle '{cleaned_username}'. Please verify your public profile URL.")

    matched_user = data["data"]["matchedUser"]
    submit_stats = matched_user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])

    total_solved = 0
    easy_solved = 0
    medium_solved = 0
    hard_solved = 0
    total_submissions = 0
    total_ac = 0

    for item in submit_stats:
        diff = item.get("difficulty", "").lower()
        cnt = item.get("count", 0)
        subs = item.get("submissions", 0)
        if diff == "all":
            total_solved = cnt
            total_ac = cnt
            total_submissions = subs
        elif diff == "easy":
            easy_solved = cnt
        elif diff == "medium":
            medium_solved = cnt
        elif diff == "hard":
            hard_solved = cnt

    acceptance_rate = round((total_ac / total_submissions * 100), 2) if total_submissions > 0 else 0.0

    # User Calendar (streak, totalActiveDays)
    user_calendar = matched_user.get("userCalendar") or {}
    streak = int(user_calendar.get("streak") or 0)
    total_active_days = int(user_calendar.get("totalActiveDays") or 0)

    # User Profile (avatar, reputation, ranking)
    profile = matched_user.get("profile") or {}
    avatar_url = profile.get("userAvatar") or ""
    reputation = int(profile.get("reputation") or 0)

    # Topic counts
    topic_counts: Dict[str, int] = {}
    tag_counts_raw = matched_user.get("tagProblemCounts") or {}
    for level in ["fundamental", "intermediate", "advanced"]:
        for item in tag_counts_raw.get(level) or []:
            name = item.get("tagName", "")
            solved = item.get("problemsSolved", 0)
            if name:
                topic_counts[name] = solved

    # Contest Ranking
    contest_ranking = data["data"].get("userContestRanking") or {}
    contest_rating = float(contest_ranking.get("rating", 0.0) or 0.0)
    global_rank = contest_ranking.get("globalRanking") or profile.get("ranking")
    attended_contests_count = int(contest_ranking.get("attendedContestsCount") or 0)
    top_percentage = float(contest_ranking.get("topPercentage") or 0.0)
    badge_name = contest_ranking.get("badge", {}).get("name") if contest_ranking.get("badge") else None

    # Recent submissions
    recent_submissions = data["data"].get("recentAcSubmissionList") or []

    return {
        "username": cleaned_username,
        "total_solved": total_solved,
        "easy_solved": easy_solved,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
        "acceptance_rate": acceptance_rate,
        "streak": streak,
        "total_active_days": total_active_days,
        "contest_rating": round(contest_rating, 1),
        "global_rank": global_rank,
        "attended_contests_count": attended_contests_count,
        "top_percentage": round(top_percentage, 2),
        "badge": badge_name,
        "avatar_url": avatar_url,
        "reputation": reputation,
        "topic_counts": topic_counts,
        "recent_submissions": recent_submissions,
    }
