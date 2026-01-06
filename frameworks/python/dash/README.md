# Dash / OpenFin (FDC3) example

A simple example showing integration of [Dash](https://dash.plotly.com/) (Python) with OpenFin using FDC3 for interoperability.

This example demonstrates bidirectional FDC3 messaging between a Dash application and other OpenFin applications using a multi-view architecture.

## Features

- **Platform Provider**: Dedicated provider window to initialize the OpenFin Platform (`assets/provider.html`).
- **Multi-View Support**: Two views served via Dash routing (`/view1` and `/view2`).
- **Broadcast FDC3 user context**: Send an instrument context (MSFT) on the current user channel (View 1).
- **Broadcast FDC3 app-channel context**: Send an instrument context (AAPL) on a custom app channel (View 1).
- **Receive context**: Display incoming FDC3 context from other applications (View 2).
- **Clear**: Reset the received context display (View 2).

## Try it on your machine

First, make sure `uv` is installed: https://github.com/astral-sh/uv

1. Install dependencies (creates a virtual environment automatically):
   ```sh
   uv sync
   ```

2. Start the app:
   ```sh
   uv run run.py
   ```

   This starts the Dash server and then attempts to launch OpenFin automatically with:
   `fin://localhost:8050/assets/manifest.fin.json`

3. If OpenFin doesn’t auto-launch on your machine, open this URL manually (copy/paste into your default browser):

   `fin://localhost:8050/assets/manifest.fin.json`

## How it works

### Architecture overview

The integration uses Dash routing for the two views and Dash clientside callbacks to trigger JavaScript functions that call the FDC3 API.

The integration consists of:

1. **Dash application** (`dash_app.py`) - Routing and clientside callbacks.
2. **Runner** (`run.py`) - Starts Dash and (optionally) launches OpenFin.
3. **Views** (`pages/`) - `view1.py` and `view2.py` define the layouts.
4. **Platform provider** (`assets/provider.html`) - Initializes the OpenFin Platform.
5. **JavaScript bridge** (`assets/openfin_bridge.js`) - FDC3 send/receive helpers (auto-loaded by Dash).

### Data flow

**Outbound (Dash → FDC3)**
1. User clicks a broadcast button in View 1.
2. A Dash clientside callback invokes a bridge function.
3. The bridge calls `fdc3.broadcast()` (user channel) or broadcasts on `CUSTOM-APP-CHANNEL`.

**Inbound (FDC3 → Dash)**
1. The bridge registers FDC3 context listeners on page load.
2. When another app broadcasts a context, the listener receives it.
3. View 2 updates the “Context Received” panel.
