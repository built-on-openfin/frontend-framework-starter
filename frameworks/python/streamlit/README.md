# Streamlit / HERE container integration

A simple example showing integration of [Streamlit](https://streamlit.io/) (Python) with HERE Core using FDC3 for interoperability.

This example demonstrates bidirectional FDC3 messaging between two Streamlit views using a multi-view layout.

## Features

- **Platform Provider**: A dedicated provider window that initializes the HERE Core Platform.
- **Multi-View Support**: Separate views for broadcasting and receiving context.
- **Broadcast FDC3 User Context**: Send an instrument context (MSFT) on the user channel (View 1).
- **Broadcast FDC3 App Context**: Send an instrument context (AAPL) on a custom app channel (View 1).
- **Receive Context**: Display incoming FDC3 context from other applications (View 2).
- **Clear**: Reset the received context display (View 2).

## Try it out

First, make sure `uv` is installed: https://github.com/astral-sh/uv

1. Install dependencies (creates a virtual environment automatically):

   ```sh
   uv sync
   ```

2. Start the app:

   ```sh
   uv run run.py
   ```

   This starts:

   - A small Flask static server on **http://localhost:8500** serving the HERE Core assets (manifest, provider, bridge JS, CSS).
   - The Streamlit server on **http://localhost:8501** serving the Streamlit views.  

3. Launch HERE Core

   If it doesn't open automatically, paste this into your browser:

   [fin://localhost:8500/manifest.fin.json](fin://localhost:8500/manifest.fin.json)

## How it works

### Architecture Overview

The integration consists of:

1. **Streamlit Application** (`streamlit_app.py`) - Defines Streamlit pages and navigation.
2. **Views** (`pages/`) - `view1.py` (broadcast) and `view2.py` (receive).
3. **Platform Provider** (`assets/provider.html`) - A plain HTML page referenced by the HERE Core manifest as `providerUrl`.
4. **OpenFin Bridge** (`assets/openfin_bridge.js`) - Loaded via `preloadScripts` in the manifest so each view can call `window.fdc3` / receive contexts.
5. **Manifest** (`assets/manifest.fin.json`) - Defines the HERE Core Platform configuration and the snapshot (two views).

### How the bridge works

- The manifest preloads `openfin_bridge.js` into each view.
- View 1 calls `parent.broadcastFdc3UserContext()` / `parent.broadcastFdc3AppContext()` from its embedded HTML.
- The bridge registers `fdc3.addContextListener(...)` and updates the `<pre id="context-display">` element in View 2.
