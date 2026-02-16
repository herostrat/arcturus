from __future__ import annotations

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.routes import router as api_router
from app.config.settings import get_settings
from app.services.orchestrator import get_orchestrator

@asynccontextmanager
async def lifespan(_: FastAPI):
    orchestrator = get_orchestrator()
    orchestrator.start()
    yield
    orchestrator.shutdown()


app = FastAPI(
    title="Arcturus Orchestrator API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(api_router)

settings = get_settings()
if settings.frontend_dist_path.exists():
    app.mount("/", StaticFiles(directory=str(settings.frontend_dist_path), html=True), name="frontend")
