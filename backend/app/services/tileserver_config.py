from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError:  # pragma: no cover - fallback for older runtimes
    import tomli as tomllib


TileserverConfig = Dict[str, Any]


def load_tileserver_config(config_path: Path) -> TileserverConfig:
    if not config_path.exists():
        raise FileNotFoundError(f"Tileserver config not found: {config_path}")

    raw_text = config_path.read_text(encoding="utf-8")
    data = tomllib.loads(raw_text) if raw_text.strip() else {}

    data.setdefault("files", "")
    data.setdefault("server", {})
    data.setdefault("sources", [])
    data.setdefault("styles", [])
    return data


def list_sources(config: TileserverConfig) -> List[Dict[str, Any]]:
    sources = config.get("sources", [])
    return sources if isinstance(sources, list) else []


def list_maps(config: TileserverConfig) -> List[Dict[str, Any]]:
    styles = config.get("styles", [])
    return styles if isinstance(styles, list) else []


def _resolve_path(config_path: Path, value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else (config_path.parent / path).resolve()


def load_map_style(config_path: Path, config: TileserverConfig, map_id: str) -> Dict[str, Any]:
    for style in list_maps(config):
        if style.get("id") == map_id:
            path_value = style.get("path")
            if not path_value:
                raise FileNotFoundError(f"Style path missing for map id: {map_id}")
            style_path = _resolve_path(config_path, str(path_value))
            if not style_path.exists():
                raise FileNotFoundError(f"Style file not found: {style_path}")
            return json.loads(style_path.read_text(encoding="utf-8"))

    raise KeyError(f"Map id not found: {map_id}")
