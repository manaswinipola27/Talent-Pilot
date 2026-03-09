"""
Dynamic Resource Fetcher Router (Evaluate)
GET /evaluate/resources — Fetch YouTube, Google, Pexels resources for skill gaps
GET /evaluate/news      — Live industry news via NewsAPI
GET /evaluate/market    — Currency/market rates via Exchange API
"""
from fastapi import APIRouter, Depends, Query
import httpx

from auth_utils import get_current_user
from config import settings

router = APIRouter()


async def _youtube_search(query: str) -> list[dict]:
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": settings.YOUTUBE_MAX_RESULTS,
        "key": settings.YOUTUBE_API_KEY,
        "order": "relevance",
        "videoDuration": "medium",
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, timeout=10)
        r.raise_for_status()
        items = r.json().get("items", [])
    return [
        {
            "title": i["snippet"]["title"],
            "channel": i["snippet"]["channelTitle"],
            "thumbnail": i["snippet"]["thumbnails"]["medium"]["url"],
            "url": f"https://www.youtube.com/watch?v={i['id']['videoId']}",
            "published": i["snippet"]["publishedAt"],
        }
        for i in items
    ]


async def _google_search(query: str) -> list[dict]:
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": settings.GOOGLE_API_KEY,
        "cx": settings.GOOGLE_SEARCH_CX,
        "q": query,
        "num": 6,
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, timeout=10)
        r.raise_for_status()
        items = r.json().get("items", [])
    return [{"title": i.get("title"), "link": i.get("link"), "snippet": i.get("snippet")} for i in items]


async def _pexels_search(query: str) -> list[dict]:
    url = "https://api.pexels.com/v1/search"
    headers = {"Authorization": settings.PEXELS_API_KEY}
    params = {"query": query, "per_page": 6, "orientation": "landscape"}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=headers, params=params, timeout=10)
        r.raise_for_status()
        photos = r.json().get("photos", [])
    return [{"url": p["src"]["large"], "photographer": p["photographer"], "alt": p.get("alt", query)} for p in photos]


@router.get("/resources", summary="Fetch learning resources for a skill topic")
async def get_resources(
    topic: str = Query(..., description="Skill or topic to search for"),
    current_user: dict = Depends(get_current_user),
):
    import asyncio
    youtube_task = _youtube_search(f"{topic} tutorial")
    google_task  = _google_search(f"{topic} free course certification")
    pexels_task  = _pexels_search(topic)

    youtube, google, pexels = await asyncio.gather(
        youtube_task, google_task, pexels_task, return_exceptions=True
    )
    return {
        "topic": topic,
        "youtube": youtube if not isinstance(youtube, Exception) else [],
        "articles": google  if not isinstance(google, Exception)  else [],
        "visuals":  pexels  if not isinstance(pexels, Exception)   else [],
    }


@router.get("/news", summary="Live industry and tech news")
async def get_news(
    category: str = Query("technology", description="News category"),
    current_user: dict = Depends(get_current_user),
):
    url = "https://newsapi.org/v2/top-headlines"
    params = {"category": category, "language": "en", "pageSize": 10, "apiKey": settings.NEWS_API_KEY}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params, timeout=10)
        r.raise_for_status()
    articles = r.json().get("articles", [])
    return {"category": category, "articles": articles}


@router.get("/market", summary="Live currency and market exchange rates")
async def get_market(
    base: str = Query("USD", description="Base currency code"),
    current_user: dict = Depends(get_current_user),
):
    url = f"https://v6.exchangerate-api.com/v6/{settings.EXCHANGE_API_KEY}/latest/{base}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=10)
        r.raise_for_status()
    return r.json()
