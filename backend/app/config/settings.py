from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
import os


@dataclass(frozen=True)
class Settings:
    arcturus_root: Path
    tileserver_config_path: Path
    tileserver_binary_path: Path
    frontend_dist_path: Path


def _default_root() -> Path:
    return Path(__file__).resolve().parents[3]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    root_value = os.environ.get("ARCTURUS_ROOT")
    arcturus_root = Path(root_value).resolve() if root_value else _default_root()
    config_value = os.environ.get("TILESERVER_CONFIG_PATH")
    tileserver_config_path = (
        Path(config_value).resolve()
        if config_value
        else arcturus_root / "tileserver.config.toml"
    )
    tileserver_binary_value = os.environ.get("TILESERVER_RS_BINARY")
    tileserver_binary_path = (
        Path(tileserver_binary_value).resolve()
        if tileserver_binary_value
        else arcturus_root.parent / "tileserver-rs" / "target" / "release" / "tileserver-rs"
    )
    frontend_dist_value = os.environ.get("FRONTEND_DIST_PATH")
    frontend_dist_path = (
        Path(frontend_dist_value).resolve()
        if frontend_dist_value
        else arcturus_root / "frontend" / "dist"
    )
    return Settings(
        arcturus_root=arcturus_root,
        tileserver_config_path=tileserver_config_path,
        tileserver_binary_path=tileserver_binary_path,
        frontend_dist_path=frontend_dist_path,
    )
