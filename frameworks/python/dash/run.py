"""Dash / OpenFin example runner.

Start the Dash app with:

    uv run run.py

The Dash app is defined in `dash_app.py`.
"""

from __future__ import annotations

import os
import platform
import subprocess
import threading
import time

from dash_app import app


def launch_openfin() -> None:
    openfin_url = "fin://localhost:8050/assets/manifest.fin.json"
    print(f"Launching OpenFin: {openfin_url}")

    system = platform.system()
    if system == "Windows":
        os.startfile(openfin_url)  # type: ignore[attr-defined]
    elif system == "Darwin":
        subprocess.run(["open", openfin_url], check=False)
    else:
        print(f"Cannot automatically launch OpenFin on {system}. Please open: {openfin_url}")


def main() -> None:
    # Keep defaults aligned with the manifest URLs and README.
    #
    # Note: In debug mode, Dash/Flask's reloader spawns a second process and would
    # otherwise trigger `launch_openfin()` twice. We disable the reloader here to
    # make behavior deterministic.
    threading.Thread(target=lambda: (time.sleep(2), launch_openfin()), daemon=True).start()

    app.run(debug=True, host="0.0.0.0", port=8050, use_reloader=False)


if __name__ == "__main__":
    main()
