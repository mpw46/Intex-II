"""
db_config.py — shared database connectivity for all ML notebooks.

Resolution order:
  1. DB_CONNECTION_STRING env var (SQLAlchemy/pyodbc URL) — used by GitHub Actions
  2. appsettings.Development.json in the backend project — used for local dev
     (same file ASP.NET Core loads; format is ADO.NET, converted automatically)
  3. Neither found → USE_DB = False, notebooks fall back to local CSV files

Usage in notebooks:
    from db_config import engine, USE_DB, text
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_adonet_to_sqlalchemy(conn_str: str) -> str | None:
    """Convert an ADO.NET SQL Server connection string to a SQLAlchemy URL."""
    parts: dict[str, str] = {}
    for segment in conn_str.split(";"):
        segment = segment.strip()
        if "=" not in segment:
            continue
        key, _, value = segment.partition("=")
        parts[key.strip().lower()] = value.strip()

    # Required fields
    server_raw = parts.get("server") or parts.get("data source") or ""
    database   = parts.get("initial catalog") or parts.get("database") or ""
    user       = parts.get("user id") or parts.get("uid") or ""
    password   = parts.get("password") or parts.get("pwd") or ""

    if not (server_raw and database and user and password):
        return None

    # Strip tcp: prefix and ,port suffix
    server = re.sub(r"^tcp:", "", server_raw, flags=re.IGNORECASE)
    server = re.sub(r",\d+$", "", server)

    from urllib.parse import quote_plus
    pw_encoded = quote_plus(password)

    # Prefer pymssql (no system ODBC driver needed); fall back to pyodbc
    try:
        import pymssql as _  # noqa: F401
        return f"mssql+pymssql://{user}:{pw_encoded}@{server}/{database}"
    except ImportError:
        return (
            f"mssql+pyodbc://{user}:{pw_encoded}@{server}/{database}"
            "?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=yes&TrustServerCertificate=no"
        )


def _conn_str_from_appsettings() -> str | None:
    """Look for appsettings.Development.json relative to ml-pipelines/."""
    here = Path(__file__).parent
    candidate = here / ".." / "backend" / "Intex2.API" / "Intex2.API" / "appsettings.Development.json"
    candidate = candidate.resolve()
    if not candidate.is_file():
        return None
    try:
        data = json.loads(candidate.read_text(encoding="utf-8"))
        adonet = (
            data.get("ConnectionStrings", {}).get("IntexConnection")
            or data.get("ConnectionStrings", {}).get("intexconnection")
        )
        if not adonet:
            return None
        return _parse_adonet_to_sqlalchemy(adonet)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Main resolution logic
# ---------------------------------------------------------------------------

_conn_url: str | None = os.environ.get("DB_CONNECTION_STRING") or _conn_str_from_appsettings()

USE_DB = False
engine = None
text = None  # re-exported so notebooks don't need a separate sqlalchemy import

if _conn_url:
    try:
        from sqlalchemy import create_engine
        from sqlalchemy import text as _text
        engine = create_engine(_conn_url)
        text = _text
        USE_DB = True
        print("✓ DB connection established (source:",
              "env var" if os.environ.get("DB_CONNECTION_STRING") else "appsettings.Development.json",
              ")")
    except ImportError:
        print("⚠ sqlalchemy not installed — pip install sqlalchemy pymssql")
    except Exception as exc:
        print(f"⚠ DB connection failed: {exc}")
else:
    print("⚠ No DB connection found — falling back to local CSV files")
    print("  Set DB_CONNECTION_STRING env var, or add the connection string to")
    print("  backend/Intex2.API/Intex2.API/appsettings.Development.json")
