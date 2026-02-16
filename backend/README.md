# Arcturus Backend

FastAPI backend for the Arcturus orchestrator.

## Environment

- `ARCTURUS_ROOT` (optional): path to the arcturus directory. Defaults to the repo arcturus folder.
- `TILESERVER_CONFIG_PATH` (optional): path to tileserver.config.toml (overrides ARCTURUS_ROOT).
- `TILESERVER_RS_BINARY` (optional): path to the tileserver-rs binary.
- `FRONTEND_DIST_PATH` (optional): path to the built frontend assets.

## OpenAPI workflow

- Run `python scripts/export_openapi.py` to write `openapi.generated.json`.
- Frontend uses that file to generate `schema.generated.d.ts`.

## API

- `GET /api/health`: service health and tileserver process status.
- `GET /api/tileserver/config`: tileserver configuration as parsed from TOML.
- `GET /api/tileserver/sources`: list of configured tileserver sources.
- `GET /api/maps`: list of configured map styles.
- `GET /api/maps/{map_id}`: style JSON for a configured map.
- `GET /api/processes/tileserver`: tileserver process status.
- `POST /api/processes/tileserver/start|stop|restart|sighup`: tileserver process control.
