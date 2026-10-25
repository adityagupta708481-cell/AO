# pyrefly: ignore[missing-import]
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_client: Optional[httpx.AsyncClient] = None

def get_http_client() -> httpx.AsyncClient:
    """
    Get or create a shared singleton httpx.AsyncClient with connection pooling.
    Eliminates TCP and TLS handshake overhead across scrapers.
    """
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            timeout=15.0,
            follow_redirects=True,
            limits=httpx.Limits(max_keepalive_connections=20, max_connections=50, keepalive_expiry=30.0)
        )
    return _client

async def close_http_client():
    """Close the shared client on application shutdown."""
    global _client
    if _client is not None and not _client.is_closed:
        try:
            await _client.aclose()
        except Exception as e:
            logger.warning(f"Error closing shared httpx client: {e}")
        finally:
            _client = None
