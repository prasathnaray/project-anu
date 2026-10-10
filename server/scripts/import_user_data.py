#!/usr/bin/env python3
"""Safely import user_data CSV rows into the configured test PostgreSQL database.

The importer only reads TEST_DB. It never falls back to DATABASE_URL, never
deletes rows, and is dry-run by default. Use --apply to commit an upsert.
"""

from __future__ import annotations

import argparse
import csv
import base64
import hashlib
import hmac
import os
import re
import secrets
import sys
from pathlib import Path
from urllib.parse import urlparse


EXPECTED_COLUMNS = [
    "user_profile_photo",
    "user_name",
    "user_email",
    "user_contact_num",
    "user_dob",
    "user_gender",
    "user_password",
    "user_role",
    "created_at",
    "status",
    "description",
    "people_id",
    "centre_id",
    "center_name",
]

REQUIRED_COLUMNS = {
    "user_name",
    "user_email",
    "user_password",
    "user_role",
    "status",
}

BCRYPT_RE = re.compile(r"^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$")
UUID_RE = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-"
    r"[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
)


def load_project_env() -> None:
    """Load only simple KEY=VALUE entries from server/v1/.env if present."""
    env_file = Path(__file__).resolve().parents[1] / "v1" / ".env"
    if not env_file.exists():
        return
    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def clean(value: str | None) -> str | None:
    value = (value or "").strip()
    return value or None


def read_rows(csv_path: Path) -> list[dict[str, str | None]]:
    with csv_path.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        missing = REQUIRED_COLUMNS - set(columns)
        unexpected = set(columns) - set(EXPECTED_COLUMNS)
        if missing:
            raise ValueError(f"CSV is missing required columns: {sorted(missing)}")
        if unexpected:
            raise ValueError(f"CSV has unexpected columns: {sorted(unexpected)}")

        rows: list[dict[str, str | None]] = []
        seen_emails: set[str] = set()
        for line_number, raw in enumerate(reader, start=2):
            row = {column: clean(raw.get(column)) for column in EXPECTED_COLUMNS}
            email = (row["user_email"] or "").lower()
            password = row["user_password"] or ""
            if not email or "@" not in email:
                raise ValueError(f"Line {line_number}: invalid user_email")
            if email in seen_emails:
                raise ValueError(f"Line {line_number}: duplicate user_email {email}")
            if not BCRYPT_RE.fullmatch(password):
                raise ValueError(
                    f"Line {line_number}: user_password is not a bcrypt hash; refusing plaintext import"
                )
            if row["user_role"] not in {"99", "101", "102", "103"}:
                raise ValueError(f"Line {line_number}: unsupported user_role")
            if row["status"] not in {"active", "inactive", "suspended"}:
                raise ValueError(f"Line {line_number}: unsupported status")
            # The live schema requires super-admins (role 99) to be
            # institution-independent. Normalize an exported centre_id away
            # rather than bypassing that integrity rule.
            if row["user_role"] == "99":
                row["centre_id"] = None
                row["center_name"] = None
            for uuid_column in ("people_id", "centre_id"):
                if row[uuid_column] and not UUID_RE.fullmatch(row[uuid_column] or ""):
                    raise ValueError(f"Line {line_number}: invalid {uuid_column}")
            row["user_email"] = email
            seen_emails.add(email)
            rows.append(row)
    return rows


def connection_info(database_url: str) -> str:
    parsed = urlparse(database_url)
    host = parsed.hostname or "unknown-host"
    port = parsed.port or 5432
    database = parsed.path.lstrip("/") or "unknown-database"
    return f"{parsed.scheme}://{host}:{port}/{database}"


def encryption_keys() -> tuple[bytes, bytes]:
    """Derive separate encryption and lookup keys from a local secret."""
    try:
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.hkdf import HKDF
    except ImportError as exc:
        raise RuntimeError(
            "cryptography is required. Install it with: python -m pip install cryptography"
        ) from exc

    configured = os.environ.get("USER_DATA_ENCRYPTION_KEY") or os.environ.get("BASE64_KEY")
    if configured:
        try:
            master = base64.urlsafe_b64decode(configured + "=" * (-len(configured) % 4))
        except ValueError as exc:
            raise RuntimeError("USER_DATA_ENCRYPTION_KEY must be URL-safe base64") from exc
        if len(master) != 32:
            raise RuntimeError("USER_DATA_ENCRYPTION_KEY must decode to exactly 32 bytes")
    else:
        secret_key = os.environ.get("SECRET_KEY")
        if not secret_key:
            raise RuntimeError("Set USER_DATA_ENCRYPTION_KEY or SECRET_KEY before encrypting")
        master = hashlib.sha256(secret_key.encode("utf-8")).digest()
        print("Warning: using a derived test key from SECRET_KEY; configure USER_DATA_ENCRYPTION_KEY for production.")

    def derive(label: bytes) -> bytes:
        return HKDF(
            algorithm=hashes.SHA256(), length=32, salt=None, info=label
        ).derive(master)

    return derive(b"project-anu/user-data/aes-256-gcm"), derive(
        b"project-anu/user-data/email-lookup"
    )


def encrypt_value(value: str | None, field: str, key: bytes) -> str | None:
    if value is None:
        return None
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    nonce = secrets.token_bytes(12)
    ciphertext = AESGCM(key).encrypt(nonce, value.encode("utf-8"), field.encode("utf-8"))
    return base64.urlsafe_b64encode(nonce + ciphertext).decode("ascii")


def lookup_value(value: str | None, key: bytes) -> str | None:
    if value is None:
        return None
    return hmac.new(key, value.encode("utf-8"), hashlib.sha256).hexdigest()


def import_rows(database_url: str, rows: list[dict[str, str | None]], apply: bool) -> None:
    try:
        import psycopg
    except ImportError as exc:
        raise RuntimeError(
            "psycopg is required. Install it with: python -m pip install 'psycopg[binary]>=3.2'"
        ) from exc

    encryption_key, lookup_key = encryption_keys()
    encrypted_rows = []
    for row in rows:
        encrypted = dict(row)
        encrypted["user_name_enc"] = encrypt_value(row["user_name"], "user_name", encryption_key)
        encrypted["user_email_enc"] = encrypt_value(row["user_email"], "user_email", encryption_key)
        encrypted["user_contact_num_enc"] = encrypt_value(
            row["user_contact_num"], "user_contact_num", encryption_key
        )
        encrypted["user_email_lookup"] = lookup_value(row["user_email"], lookup_key)
        encrypted_rows.append(encrypted)

    columns = ", ".join(EXPECTED_COLUMNS)
    encrypted_columns = [
        "user_name_enc",
        "user_email_enc",
        "user_contact_num_enc",
        "user_email_lookup",
    ]
    all_columns = EXPECTED_COLUMNS + encrypted_columns
    columns = ", ".join(all_columns)
    placeholders = ", ".join(f"%({column})s" for column in all_columns)
    updates = ", ".join(
        f"{column} = EXCLUDED.{column}"
        for column in all_columns
        if column != "user_email"
    )
    sql = f"""
        INSERT INTO public.user_data ({columns})
        VALUES ({placeholders})
        ON CONFLICT (user_email) DO UPDATE SET {updates}
    """

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database(), current_user")
            database_name, database_user = cursor.fetchone()
            print(f"Connected to database={database_name} user={database_user}")
            if not apply:
                print(f"Dry run: {len(rows)} validated rows; no changes committed.")
                connection.rollback()
                return
            cursor.executemany(sql, encrypted_rows)
            print(f"Applied {cursor.rowcount} AES-256-GCM companion-field upserts to public.user_data.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="commit the upsert; without this flag the script only validates",
    )
    args = parser.parse_args()

    load_project_env()
    database_url = os.environ.get("TEST_DB")
    if not database_url:
        raise RuntimeError("TEST_DB is not configured; refusing to use any other database URL")
    if not args.csv_path.is_file():
        raise FileNotFoundError(args.csv_path)

    rows = read_rows(args.csv_path)
    print(f"Validated {len(rows)} rows from {args.csv_path}")
    print(f"Target: {connection_info(database_url)}")
    import_rows(database_url, rows, args.apply)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
