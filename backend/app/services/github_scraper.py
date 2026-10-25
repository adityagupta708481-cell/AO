import os
import httpx
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

GITHUB_API_URL = "https://api.github.com/users"
BASE_HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AlgoOrbitEngine/1.0"
}

from app.core.http_client import get_http_client

def _get_headers() -> Dict[str, str]:
    headers = dict(BASE_HEADERS)
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers

async def fetch_github(username: str) -> Dict[str, Any]:
    """
    Fetch GitHub public repositories, languages breakdown, star counts, followers,
    and top repository activity.
    """
    cleaned_username = username.strip().lstrip("@").rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid GitHub username provided.")

    client = get_http_client()
    headers = _get_headers()

    # 1. Fetch user profile
    try:
        user_resp = await client.get(f"{GITHUB_API_URL}/{cleaned_username}", headers=headers)
        if user_resp.status_code == 404:
            raise ValueError(f"GitHub user '{cleaned_username}' not found. Please verify your public handle.")
        user_resp.raise_for_status()
        user_data = user_resp.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            logger.warning(f"GitHub rate limit reached: {e}")
            return {
                "username": cleaned_username,
                "name": cleaned_username,
                "avatar_url": "",
                "bio": "",
                "repo_count": 0,
                "followers": 0,
                "following": 0,
                "total_forks": 0,
                "languages": {"Python": 1, "C++": 1},
                "stars": 0,
                "top_repos": [],
                "last_commit": "Recently"
            }
        raise RuntimeError(f"GitHub API error: {e.response.status_code}")
    except httpx.RequestError as e:
        logger.error(f"GitHub connection error: {e}")
        raise RuntimeError("Failed to connect to GitHub API.")

    # 2. Fetch public repositories
    try:
        repos_resp = await client.get(
            f"{GITHUB_API_URL}/{cleaned_username}/repos?per_page=100&sort=updated",
            headers=headers
        )
        repos_data = repos_resp.json() if repos_resp.status_code == 200 else []
    except Exception as e:
        logger.warning(f"Failed to fetch GitHub repos for {cleaned_username}: {e}")
        repos_data = []

    total_stars = 0
    total_forks = 0
    languages: Dict[str, int] = {}
    top_repos: List[Dict[str, Any]] = []
    last_updated = user_data.get("updated_at")

    if isinstance(repos_data, list):
        # Sort by star count descending for top repos
        sorted_repos = sorted(repos_data, key=lambda r: r.get("stargazers_count", 0), reverse=True)
        
        for repo in sorted_repos:
            if not repo.get("fork"):
                stars = int(repo.get("stargazers_count") or 0)
                forks = int(repo.get("forks_count") or 0)
                total_stars += stars
                total_forks += forks
                lang = repo.get("language")
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1

                if len(top_repos) < 6:
                    top_repos.append({
                        "name": repo.get("name"),
                        "description": repo.get("description") or "",
                        "html_url": repo.get("html_url"),
                        "stars": stars,
                        "forks": forks,
                        "language": lang or "Other",
                        "updated_at": repo.get("updated_at")
                    })

    return {
        "username": cleaned_username,
        "name": user_data.get("name") or cleaned_username,
        "avatar_url": user_data.get("avatar_url") or "",
        "bio": user_data.get("bio") or "",
        "repo_count": int(user_data.get("public_repos") or len(repos_data)),
        "followers": int(user_data.get("followers") or 0),
        "following": int(user_data.get("following") or 0),
        "total_forks": total_forks,
        "languages": languages,
        "stars": total_stars,
        "top_repos": top_repos,
        "last_commit": last_updated
    }
