"""Structured response schemas for the portfolio agent.

The agent's final answer is an AgentResponse: typed content blocks the
frontend renders as native components instead of parsing markdown text.
"""

from typing import Annotated, Literal, Union

from pydantic import BaseModel, Field


class TextBlock(BaseModel):
    """A paragraph of plain prose."""

    type: Literal["text"]
    content: str = Field(description="Paragraph text in plain prose. No markdown, no URLs — write domains like 'nova-ecomm.vercel.app' as plain text.")


class BulletsBlock(BaseModel):
    """A short list of bullet points."""

    type: Literal["bullets"]
    items: list[str] = Field(description="2-6 short bullet items. No leading dashes or bullet characters.")


class ProjectCardBlock(BaseModel):
    """A rich card for one featured project."""

    type: Literal["project_card"]
    title: str = Field(description="Exact project title")
    emoji: str = Field(description="Single emoji that represents the project")
    stack: list[str] = Field(description="Tech stack entries")
    href: str = Field(description="Live URL if available, otherwise the repo URL")
    repo: str = Field(description="GitHub repository URL")
    summary: str = Field(description="One sentence on what makes this project stand out")


class ContactCardBlock(BaseModel):
    """A contact card with clickable details."""

    type: Literal["contact_card"]
    headline: str = Field(description="A short, warm one-line invitation")
    email: str
    phone: str | None = Field(default=None, description="WhatsApp/phone number")


Block = Annotated[
    Union[TextBlock, BulletsBlock, ProjectCardBlock, ContactCardBlock],
    Field(discriminator="type"),
]

# Intents that must be grounded in tools/knowledge (guards against hallucination).
GROUNDED_INTENTS = frozenset(
    {"bio", "skills", "projects", "experience", "contact", "availability"}
)


class AgentResponse(BaseModel):
    """The agent's final structured answer for one user turn."""

    intent: Literal[
        "bio",
        "skills",
        "projects",
        "experience",
        "availability",
        "contact",
        "smalltalk",
        "fallback",
    ]
    blocks: list[Block] = Field(
        description="1-3 content blocks in reading order. Use project_card for each featured project mentioned, contact_card when sharing contact details, bullets for lists."
    )
    sources: list[str] = Field(
        default_factory=list,
        description=(
            "Leave empty for grounded answers — the runtime derives these from "
            "the tools you called. Only set them when no tools applied."
        ),
    )
    trace: list[str] = Field(
        default_factory=list,
        description="Short step labels for tools you called, in order, e.g. ['searched knowledge base', 'listed projects']. Empty if no tools called.",
    )
    suggestions: list[str] = Field(
        default_factory=list,
        description="2-3 short follow-up questions the visitor might ask next",
    )


def make_fallback_response() -> AgentResponse:
    """Deterministic fallback used when the agent has no grounded sources."""
    return AgentResponse(
        intent="fallback",
        blocks=[
            TextBlock(
                type="text",
                content="I don't have a confident answer for that one — but Qazi would love to hear from you directly.",
            ),
            ContactCardBlock(
                type="contact_card",
                headline="Ask him anything",
                email="qazithekingston@gmail.com",
                phone="+92 314 1935787",
            ),
        ],
        sources=[],
        trace=[],
        suggestions=[
            "What projects has he built?",
            "Is he available for hire?",
            "What's his tech stack?",
        ],
    )
