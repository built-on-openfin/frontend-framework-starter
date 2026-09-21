from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

import pytest


PROJECT_DIRECTORY = Path(__file__).resolve().parents[1]
URLS = (
    "http://127.0.0.1:8050/view1",
    "http://127.0.0.1:8050/view2",
    "http://127.0.0.1:8050/assets/manifest.fin.json",
    "http://127.0.0.1:8050/assets/provider.html",
    "http://127.0.0.1:8050/assets/openfin_bridge.js",
)


def wait_for(url: str) -> None:
    deadline = time.monotonic() + 30

    while time.monotonic() < deadline:
        try:
            with urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return
        except OSError:
            time.sleep(0.25)

    pytest.fail(f"Timed out waiting for {url}")


def test_dash_serves_application_and_here_assets() -> None:
    environment = {**os.environ, "OPENFIN_AUTO_LAUNCH": "0"}
    process = subprocess.Popen(
        [sys.executable, "run.py"],
        cwd=PROJECT_DIRECTORY,
        env=environment,
        start_new_session=True,
    )

    try:
        for url in URLS:
            wait_for(url)
    finally:
        os.killpg(process.pid, signal.SIGINT)
        process.wait(timeout=10)
