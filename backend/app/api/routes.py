from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.config.settings import get_settings
from app.services.tileserver_config import (
    load_map_style,
    load_tileserver_config,
    list_maps,
    list_sources,
)
from app.services.orchestrator import get_orchestrator

router = APIRouter(prefix="/api")


@router.get("/health", tags=["system"])
def get_health():
    orchestrator = get_orchestrator()
    tileserver = orchestrator.tileserver_status()
    return {
        "status": "ok",
        "tileserver": {
            "running": tileserver.running,
            "pid": tileserver.pid,
        },
    }


@router.get("/tileserver/config", tags=["tileserver"])
def get_tileserver_config():
    settings = get_settings()
    try:
        return load_tileserver_config(settings.tileserver_config_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/tileserver/sources", tags=["tileserver"])
def get_tileserver_sources():
    settings = get_settings()
    try:
        config = load_tileserver_config(settings.tileserver_config_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"sources": list_sources(config)}


@router.get("/maps", tags=["maps"])
def list_configured_maps():
    settings = get_settings()
    try:
        config = load_tileserver_config(settings.tileserver_config_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"maps": list_maps(config)}


@router.get("/maps/{map_id}", tags=["maps"])
def get_map_style_json(map_id: str):
    settings = get_settings()
    try:
        config = load_tileserver_config(settings.tileserver_config_path)
        style_json = load_map_style(settings.tileserver_config_path, config, map_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return style_json


@router.get("/processes/tileserver", tags=["processes"])
def get_tileserver_process_status():
    orchestrator = get_orchestrator()
    status = orchestrator.tileserver_status()
    return {"running": status.running, "pid": status.pid}


@router.post("/processes/tileserver/start", tags=["processes"])
def start_tileserver_process():
    orchestrator = get_orchestrator()
    try:
        status = orchestrator.start_tileserver()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"running": status.running, "pid": status.pid}


@router.post("/processes/tileserver/stop", tags=["processes"])
def stop_tileserver_process():
    orchestrator = get_orchestrator()
    status = orchestrator.stop_tileserver()
    return {"running": status.running, "pid": status.pid}


@router.post("/processes/tileserver/restart", tags=["processes"])
def restart_tileserver_process():
    orchestrator = get_orchestrator()
    try:
        status = orchestrator.restart_tileserver()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"running": status.running, "pid": status.pid}


@router.post("/processes/tileserver/sighup", tags=["processes"])
def sighup_tileserver_process():
    orchestrator = get_orchestrator()
    status = orchestrator.sighup_tileserver()
    return {"running": status.running, "pid": status.pid}
