import httpx
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

CODECHEF_BASE = "https://www.codechef.com/users"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AlgoOrbitEngine/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

from app.core.http_client import get_http_client

async def fetch_codechef(username: str) -> Dict[str, Any]:
    """
    Fetch Codeforces-style metrics from CodeChef user profile page:
    rating, stars, division, problems solved, avatar, and global/country ranks.
    """
    cleaned_username = username.strip().lstrip("@").rstrip("/").split("/")[-1]
    if not cleaned_username:
        raise ValueError("Invalid CodeChef handle provided.")

    url = f"{CODECHEF_BASE}/{cleaned_username}"

    client = get_http_client()
    try:
        resp = await client.get(url, headers=HEADERS)
    except Exception as e:
        logger.error(f"CodeChef request error: {e}")
        raise RuntimeError("Failed to connect to CodeChef.")

    if resp.status_code == 404:
        raise ValueError(f"CodeChef user '{cleaned_username}' not found.")
    elif resp.status_code != 200:
        raise RuntimeError(f"CodeChef returned status code {resp.status_code}.")

    html = resp.text

    # Check if profile actually exists
    if "rating-header" not in html and "rating-number" not in html:
        if "Page not found" in html or "could not be found" in html:
            raise ValueError(f"CodeChef user '{cleaned_username}' does not exist.")

    # 1. Rating
    rating = 0
    rating_match = re.search(r'class="rating-number"[^>]*>\s*(\d+)', html)
    if rating_match:
        try:
            rating = int(rating_match.group(1))
        except Exception:
            rating = 0
    else:
        js_rating = re.search(r'var\s+current_user_rating\s*=\s*(\d+)', html)
        if js_rating:
            rating = int(js_rating.group(1))

    # 2. Highest Rating
    highest_rating = rating
    max_match = re.search(r'Highest Rating[^\d]*(\d+)', html)
    if max_match:
        try:
            highest_rating = int(max_match.group(1))
        except Exception:
            highest_rating = rating

    # 3. Stars
    stars_count = 0
    star_block = re.search(r'class="rating-star"[^>]*>([\s\S]*?)</div>', html)
    if star_block:
        stars_count = star_block.group(1).count("&#9733;") or star_block.group(1).count("★")
    if stars_count == 0:
        if rating >= 2500:
            stars_count = 7
        elif rating >= 2200:
            stars_count = 6
        elif rating >= 2000:
            stars_count = 5
        elif rating >= 1800:
            stars_count = 4
        elif rating >= 1600:
            stars_count = 3
        elif rating >= 1400:
            stars_count = 2
        elif rating > 0:
            stars_count = 1

    stars_label = f"{stars_count}★" if stars_count > 0 else "Unrated"

    # 4. Division
    division = "Div 3"
    div_match = re.search(r'\((Div\s*\d+)\)', html)
    if div_match:
        division = div_match.group(1)
    elif rating >= 2000:
        division = "Div 1"
    elif rating >= 1600:
        division = "Div 2"
    elif rating >= 1400:
        division = "Div 3"
    elif rating > 0:
        division = "Div 4"

    # 5. Global & Country Ranks
    ranks_match = re.findall(r'<div class="rating-ranks">[\s\S]*?<strong>\s*([^<]+)\s*</strong>[\s\S]*?<strong>\s*([^<]+)\s*</strong>', html)
    global_rank = None
    country_rank = None
    if ranks_match:
        g_str, c_str = ranks_match[0]
        g_str = g_str.strip()
        c_str = c_str.strip()
        if g_str.isdigit():
            global_rank = int(g_str)
        if c_str.isdigit():
            country_rank = int(c_str)

    # Fallback for ranks
    if global_rank is None:
        og_rank = re.search(r'global rank\s*(\d+)', html, re.IGNORECASE)
        if og_rank:
            global_rank = int(og_rank.group(1))

    # 6. Solved Problems Count
    total_solved = 0
    patterns = [
        r'Total Problems Solved:\s*(\d+)',
        r'Problems Solved:\s*(\d+)',
        r'Fully Solved\s*\((\d+)\)',
        r'class="problems-solved"[^>]*>[\s\S]*?(\d+)',
        r'<h3>Total Problems Solved:\s*(\d+)</h3>',
    ]
    for p in patterns:
        m = re.search(p, html, re.IGNORECASE)
        if m:
            try:
                total_solved = int(m.group(1))
                break
            except Exception:
                pass

    # 7. User Details (Name and Avatar)
    name_match = re.search(r'<h1[^>]*class="h2-style"[^>]*>([^<]+)</h1>', html)
    name = name_match.group(1).strip() if name_match else cleaned_username

    avatar_url = ""
    avatar_match = re.search(r'<img[^>]+src="([^">]+/users/avatars/[^">]+)"', html) or re.search(r'<div class="user-details-container">[\s\S]*?<img[^>]+src="([^">]+)"', html)
    if avatar_match:
        avatar_url = avatar_match.group(1)

    return {
        "username": cleaned_username,
        "name": name,
        "avatar_url": avatar_url,
        "rating": rating,
        "max_rating": highest_rating,
        "stars": stars_label,
        "stars_count": stars_count,
        "division": division,
        "global_rank": global_rank,
        "country_rank": country_rank,
        "total_solved": total_solved,
        "profile_url": f"https://www.codechef.com/users/{cleaned_username}"
    }
