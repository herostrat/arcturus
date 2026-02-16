#!/usr/bin/env python3
import json
import signal
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

DEFAULT_PORT = 8081
DEFAULT_INTERVAL = 5
DEFAULT_TIMEOUT = 3
DEFAULT_RELOAD_INTERVAL = 60


def http_get_json(url, timeout):
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=timeout) as resp:
        data = resp.read().decode("utf-8")
        return resp.status, json.loads(data) if data else {}


def http_get_text(url, timeout):
    req = Request(url, headers={"Accept": "text/plain"})
    with urlopen(req, timeout=timeout) as resp:
        data = resp.read().decode("utf-8")
        return resp.status, data


def start_tileserver(binary_path, config_path):
    return subprocess.Popen([str(binary_path), "--config", str(config_path)])


def split_config_sources(config_text):
    lines = config_text.splitlines(keepends=True)
    section_indices = [
        idx for idx, line in enumerate(lines) if line.strip().startswith("[[")
    ]
    source_indices = [
        idx for idx in section_indices if lines[idx].strip() == "[[sources]]"
    ]
    if not source_indices:
        return lines, [], []

    blocks = []
    for i, start_idx in enumerate(source_indices):
        next_sections = [
            idx for idx in section_indices if idx > start_idx
        ]
        end_idx = next_sections[0] if next_sections else len(lines)
        blocks.append(lines[start_idx:end_idx])

    prefix = lines[:source_indices[0]]
    suffix = lines[source_indices[-1] + len(blocks[-1]):]
    return prefix, blocks, suffix


def write_config_with_sources(config_path, prefix, source_blocks, suffix, count):
    selected = source_blocks[:count]
    content = "".join(prefix + [line for block in selected for line in block] + suffix)
    config_path.write_text(content, encoding="utf-8")


def main():
    root_dir = Path(__file__).resolve().parents[1]
    binary_path = root_dir.parent / "tileserver-rs" / "target" / "release" / "tileserver-rs"
    config_path = root_dir / "tileserver.config.toml"

    if not binary_path.exists():
        print(f"tileserver-rs binary not found: {binary_path}", file=sys.stderr)
        sys.exit(1)

    original_config = config_path.read_text(encoding="utf-8")
    prefix, source_blocks, suffix = split_config_sources(original_config)
    source_count = len(source_blocks)
    stages = [count for count in (1, 2, 3) if count <= source_count]
    if not stages:
        stages = [source_count]

    write_config_with_sources(config_path, prefix, source_blocks, suffix, stages[0])

    print("Starting tileserver-rs...")
    print(f"  Binary: {binary_path}")
    print(f"  Config: {config_path}")
    process = start_tileserver(binary_path, config_path)

    base_url = f"http://localhost:{DEFAULT_PORT}"

    def handle_signal(signum, _frame):
        print(f"Received signal {signum}, stopping tileserver-rs...")
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
        config_path.write_text(original_config, encoding="utf-8")
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    def count_sources(payload):
        if isinstance(payload, dict):
            sources = payload.get("sources", [])
            return len(sources) if isinstance(sources, list) else 0
        if isinstance(payload, list):
            return len(payload)
        return 0

    next_stage_idx = 1
    next_reload_at = time.monotonic() + DEFAULT_RELOAD_INTERVAL

    try:
        while True:
            try:
                status_code, health = http_get_text(f"{base_url}/health", DEFAULT_TIMEOUT)
                data_status, data_json = http_get_json(f"{base_url}/data.json", DEFAULT_TIMEOUT)
                print(
                    f"health={status_code} data={data_status} sources={count_sources(data_json)}"
                )
            except HTTPError as exc:
                print(f"HTTP error: {exc.code} {exc.reason}")
            except URLError as exc:
                print(f"Connection error: {exc.reason}")
            except json.JSONDecodeError as exc:
                print(f"JSON error: {exc}")

            now = time.monotonic()
            if next_stage_idx < len(stages) and now >= next_reload_at:
                stage_count = stages[next_stage_idx]
                write_config_with_sources(
                    config_path, prefix, source_blocks, suffix, stage_count
                )
                process.send_signal(signal.SIGHUP)
                print(f"Reloaded config with {stage_count} sources")
                next_stage_idx += 1
                next_reload_at = now + DEFAULT_RELOAD_INTERVAL

            time.sleep(DEFAULT_INTERVAL)
    except KeyboardInterrupt:
        handle_signal(signal.SIGINT, None)


if __name__ == "__main__":
    main()
