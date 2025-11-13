# Streamlit OpenFin Integration

An example showing integration of [Streamlit](https://streamlit.io/) (Python) with OpenFin / HERE Core.

It extends the Stock Peers example from the Streamlit app gallery: https://demo-stockpeers.streamlit.app/

## How it works

This project demonstrates a bidirectional communication bridge between a Python Streamlit application and the OpenFin platform using the FDC3 Interop API. The integration enables seamless data sharing between Streamlit and other OpenFin applications.

### Architecture Overview

The integration consists of three main components:

1. **Streamlit Application** (`streamlit_app.py`) - The Python backend that renders the UI and handles business logic
2. **Custom Streamlit Component** (`openfin_bridge_component/`) - A Python wrapper that declares the bridge component
3. **React Frontend Bridge** (`openfin_bridge_component/frontend/`) - A TypeScript/React component that interfaces with OpenFin's Interop API

### How the Bridge Works

#### Component Structure

The custom Streamlit component acts as an invisible bridge embedded in the Streamlit app:

- **Python Side**: The `openfin_bridge()` function (defined in `__init__.py`) is called once per render cycle with optional outbound event data
- **Frontend Side**: A React component connects to OpenFin's Interop API and joins a shared context group (`stockpeers`)
- **Communication**: Data flows bidirectionally between Python and OpenFin via Streamlit's component API

#### Data Flow

**Outbound (Python → OpenFin)**:
1. Streamlit detects UI changes (e.g., user selects new stock tickers or time horizon)
2. The app calls `openfin_bridge(event_type="ticker_selection_changed", data={...})`
3. The frontend bridge maps the event to a context object (e.g., `instrumentList` for tickers)
4. The context is broadcast via `group.setContext()` to all OpenFin apps in the same context group

**Inbound (OpenFin → Python)**:
1. The frontend bridge listens for context changes via `group.addContextHandler()`
2. When another OpenFin app broadcasts a context, the handler receives it
3. The context is mapped to a Streamlit-friendly payload (e.g., `action: "update_tickers"`)
4. The payload is sent to Python via `Streamlit.setComponentValue()`
5. Streamlit processes the update and triggers a rerun to reflect the changes

#### Context Mapping

The bridge translates between Streamlit's data model and standard contexts:

- **Ticker Selection**: Maps to `fdc3.instrumentList` context containing multiple instruments
- **Time Horizon**: Maps to custom `streamlit.timeHorizon` context with horizon label and value
- **Self-Echo Suppression**: Prevents feedback loops by hashing contexts and ignoring recently broadcast messages

#### Key Features

- **Session Context Groups**: Uses OpenFin Interop to join a shared context group for multi-app communication
- **State Synchronization**: Maintains state consistency across Streamlit reruns and OpenFin context updates
- **Bidirectional Updates**: Both Streamlit and external OpenFin apps can update shared state
- **Smart Suppression**: Avoids infinite loops by temporarily suppressing self-echoed contexts

#### Context Handlers

The `context.ts` helper module handles bidirectional mapping:

**Outbound Mapping**:
- `ticker_selection_changed` → `instrumentList` with array of instruments
- `horizon_changed` → Custom `streamlit.timeHorizon` context
- Generic events → Custom `streamlit.event` context

**Inbound Mapping**:
- `instrument` or `instrumentList` → `action: "update_tickers"` with ticker array
- Custom `streamlit.timeHorizon` → `action: "update_horizon"` with horizon label and value
- Other contexts → Passed through with original type for custom handling

### Dependencies

**Python Side**:
- `streamlit` - Web application framework
- `streamlit-component-lib` - Custom component development tools
- `yfinance` - Stock market data retrieval
- `pandas` - Data manipulation
- `altair` - Data visualization

**Frontend Side**:
- `react` & `react-dom` - UI component framework
- `streamlit-component-lib` - Streamlit bridge library
- `vite` - Build tool for fast development and optimized bundles
- `typescript` - Type-safe JavaScript

**OpenFin**:
- The OpenFin runtime is not a direct dependency but is expected to be running when the app is launched in an OpenFin container
- The app gracefully handles cases where OpenFin is not available (e.g., when running in a standard browser)

## Try it on your machine

1. Start a virtual environment and get the dependencies (requires [uv](https://github.com/astral-sh/uv)):

   ```sh
   $ uv venv

   $ source .venv/bin/activate

   $ uv sync
   ```

2. Build the client bridge

   ```sh
   $ cd openfin_bridge_component/frontend
  
   $ npm install
  
   $ npm run build
   ```

3. Start the app:  

   (From the root directory)  

   ```sh
   $ streamlit run streamlit_app.py
   ```
