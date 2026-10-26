"""Portfolio agent package.

Importing this package loads local .env values (development only — on Vercel
the keys come from project environment variables).
"""

from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
