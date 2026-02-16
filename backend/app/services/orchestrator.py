from __future__ import annotations

import signal
import subprocess
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from app.config.settings import get_settings


@dataclass
class ProcessStatus:
    running: bool
    pid: Optional[int]


class Orchestrator:
    def __init__(self, tileserver_binary: Path, tileserver_config: Path) -> None:
        self._tileserver_binary = tileserver_binary
        self._tileserver_config = tileserver_config
        self._tileserver_process: Optional[subprocess.Popen] = None
        self._lock = threading.Lock()

    def _ensure_tileserver_config(self) -> None:
        if not self._tileserver_config.exists():
            raise FileNotFoundError(f"Tileserver config not found: {self._tileserver_config}")

    def _ensure_tileserver_binary(self) -> None:
        if not self._tileserver_binary.exists():
            raise FileNotFoundError(f"Tileserver binary not found: {self._tileserver_binary}")

    def prepare_tileserver_config(self) -> None:
        self._ensure_tileserver_config()

    def start_tileserver(self) -> ProcessStatus:
        with self._lock:
            if self._tileserver_process and self._tileserver_process.poll() is None:
                return self.tileserver_status()

            self._ensure_tileserver_binary()
            self.prepare_tileserver_config()
            self._tileserver_process = subprocess.Popen(
                [str(self._tileserver_binary), "--config", str(self._tileserver_config)]
            )
            return self.tileserver_status()

    def stop_tileserver(self) -> ProcessStatus:
        with self._lock:
            if not self._tileserver_process or self._tileserver_process.poll() is not None:
                self._tileserver_process = None
                return self.tileserver_status()

            self._tileserver_process.terminate()
            try:
                self._tileserver_process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self._tileserver_process.kill()
                self._tileserver_process.wait(timeout=5)
            finally:
                self._tileserver_process = None
            return self.tileserver_status()

    def restart_tileserver(self) -> ProcessStatus:
        self.stop_tileserver()
        return self.start_tileserver()

    def sighup_tileserver(self) -> ProcessStatus:
        with self._lock:
            if not self._tileserver_process or self._tileserver_process.poll() is not None:
                return self.tileserver_status()
            self._tileserver_process.send_signal(signal.SIGHUP)
            return self.tileserver_status()

    def tileserver_status(self) -> ProcessStatus:
        running = self._tileserver_process is not None and self._tileserver_process.poll() is None
        pid = self._tileserver_process.pid if running else None
        return ProcessStatus(running=running, pid=pid)

    def start(self) -> None:
        self.start_tileserver()

    def shutdown(self) -> None:
        self.stop_tileserver()


_orchestrator: Optional[Orchestrator] = None


def get_orchestrator() -> Orchestrator:
    global _orchestrator
    if _orchestrator is None:
        settings = get_settings()
        _orchestrator = Orchestrator(
            tileserver_binary=settings.tileserver_binary_path,
            tileserver_config=settings.tileserver_config_path,
        )
    return _orchestrator
