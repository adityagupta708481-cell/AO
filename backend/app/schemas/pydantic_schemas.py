import re
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date

# ----------------- User Schemas -----------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128, description="Password must be between 8 and 128 characters")
    full_name: str = Field(..., min_length=2, max_length=100)
    college: Optional[str] = Field(None, max_length=150)
    branch: Optional[str] = Field(None, max_length=100)
    graduation_year: Optional[int] = Field(None, ge=2020, le=2035)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    college: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# ----------------- Platform Schemas -----------------
class PlatformConnect(BaseModel):
    leetcode: Optional[str] = None
    codeforces: Optional[str] = None
    github: Optional[str] = None
    hackerrank: Optional[str] = None
    codechef: Optional[str] = None

    @field_validator("leetcode", "codeforces", "github", "hackerrank", "codechef")
    @classmethod
    def sanitize_handle(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip().lstrip("@").rstrip("/").split("/")[-1].strip()
        if not cleaned:
            return None
        if not re.match(r"^[a-zA-Z0-9_\-\.]{1,50}$", cleaned):
            raise ValueError(
                f"Invalid handle format. Must be 1-50 characters containing only letters, numbers, hyphens, dots, or underscores."
            )
        return cleaned

class PlatformStatusItem(BaseModel):
    platform: str
    username: str
    last_synced_at: Optional[datetime] = None
    sync_status: str
    error_message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PlatformStatusResponse(BaseModel):
    platforms: List[PlatformStatusItem]

class LeetCodeStatsResponse(BaseModel):
    username: str
    total_solved: int = 0
    easy_solved: int = 0
    medium_solved: int = 0
    hard_solved: int = 0
    acceptance_rate: float = 0.0
    streak: int = 0
    total_active_days: int = 0
    contest_rating: float = 0.0
    global_rank: Optional[int] = None
    attended_contests_count: int = 0
    top_percentage: float = 0.0
    badge: Optional[str] = None
    avatar_url: Optional[str] = None
    reputation: int = 0
    topic_counts: Dict[str, int] = {}
    recent_submissions: List[Dict[str, Any]] = []
    updated_at: Optional[datetime] = None

class CodeforcesStatsResponse(BaseModel):
    username: str
    rating: int = 0
    max_rating: int = 0
    rank: str = "unrated"
    max_rank: str = "unrated"
    avatar: Optional[str] = None
    contribution: int = 0
    organization: Optional[str] = None
    total_solved: int = 0
    tags: Dict[str, int] = {}
    difficulty_distribution: Dict[str, int] = {}
    recent_submissions: List[Dict[str, Any]] = []

class GitHubStatsResponse(BaseModel):
    username: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    repo_count: int = 0
    followers: int = 0
    following: int = 0
    total_forks: int = 0
    languages: Dict[str, int] = {}
    stars: int = 0
    top_repos: List[Dict[str, Any]] = []
    last_commit: Optional[str] = None

class HackerRankStatsResponse(BaseModel):
    username: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    country: Optional[str] = None
    school: Optional[str] = None
    badges: List[Dict[str, Any]] = []
    total_badges: int = 0
    total_solved: int = 0
    problem_solving_stars: int = 0
    algorithms_score: float = 0.0
    scores: List[Dict[str, Any]] = []
    profile_url: Optional[str] = None

class CodeChefStatsResponse(BaseModel):
    username: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    rating: int = 0
    max_rating: int = 0
    stars: str = "Unrated"
    stars_count: int = 0
    division: str = "Div 3"
    global_rank: Optional[int] = None
    country_rank: Optional[int] = None
    total_solved: int = 0
    profile_url: Optional[str] = None

# ----------------- Academic & Aptitude Schemas -----------------
class CsTopicItem(BaseModel):
    id: int
    subject_name: str
    topic_name: str
    status: str
    last_reviewed: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CsTopicUpdate(BaseModel):
    status: str  # not_started | in_progress | revised | mastered

class AptitudeSubmit(BaseModel):
    category: str
    attempted: int
    correct: int
    avg_time_seconds: Optional[float] = None

class AptitudeMetricItem(BaseModel):
    id: int
    category: str
    attempted: int
    correct: int
    accuracy: float
    avg_time_seconds: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class AptitudeStatsResponse(BaseModel):
    total_attempted: int
    total_correct: int
    overall_accuracy: float
    categories: List[AptitudeMetricItem]

# ----------------- AI Engine Schemas -----------------
class AiEvaluationResponse(BaseModel):
    id: int
    overall_score: float
    tier_classification: str
    company_match_scores: Dict[str, float]
    weak_areas: List[Dict[str, Any]]
    action_plan_text: str
    created_at: datetime
    is_fallback: bool = False

    model_config = ConfigDict(from_attributes=True)

class CompanyMatchRequest(BaseModel):
    company: str

class CompanyMatchResponse(BaseModel):
    company: str
    tier: str
    match_score: float
    focus_topics: List[str]
    missing_topics: List[str]
    readiness_status: str

class InterviewEvalRequest(BaseModel):
    question: str
    answer: str

class InterviewEvalResponse(BaseModel):
    question: str
    relevance_score: float
    feedback: str
    missing_keywords: List[str]
    model_used: str

# ----------------- Revision Schemas -----------------
class RevisionItem(BaseModel):
    id: int
    topic_name: str
    category: str
    interval_stage: int
    next_revision_date: date
    last_performance: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class RevisionLog(BaseModel):
    performance: str  # easy | good | hard | forgot
