"""FastAPI entrypoint for Vercel's Python runtime (framework preset: fastapi).

The SPA build (dist/) is registered with app.frontend() so Vercel promotes it
to the CDN with an index.html fallback for deep links; API routes always take
priority. Run locally with:  uvicorn app:app --port 8000
"""

from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from agent.graph import AgentRateLimitError, AgentUpstreamError, run_agent
from agent.schemas import AgentResponse

app = FastAPI(title="Portfolio Agent", version="1.0.0")

app.frontend("/", directory="dist", check_dir=False)


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class AgentRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[Turn] = Field(default_factory=list, max_length=40)


@app.post("/api/agent", response_model=AgentResponse)
def agent_turn(request: AgentRequest) -> AgentResponse:
    try:
        return run_agent(
            request.message, [turn.model_dump() for turn in request.history]
        )
    except AgentRateLimitError as exc:
        raise HTTPException(status_code=429, detail="Rate limited, retry shortly") from exc
    except AgentUpstreamError as exc:
        raise HTTPException(status_code=502, detail="Upstream model failure") from exc


@app.get("/health")
@app.get("/api/agent/health")
def health() -> dict:
    return {"ok": True}
