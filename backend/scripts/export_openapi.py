from __future__ import annotations

import json
from pathlib import Path

from fastapi.openapi.utils import get_openapi

from app.main import app


def main() -> None:
    output_path = Path(__file__).resolve().parents[1] / "openapi.generated.json"
    schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    output_path.write_text(json.dumps(schema, indent=2), encoding="utf-8")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
