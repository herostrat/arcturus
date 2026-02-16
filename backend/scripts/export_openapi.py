from __future__ import annotations

import json
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_dir))

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
