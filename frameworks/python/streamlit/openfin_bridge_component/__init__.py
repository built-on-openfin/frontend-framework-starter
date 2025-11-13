from pathlib import Path
import streamlit.components.v1 as components


# Declare the custom component. The frontend is built with Vite into the
# "dist" directory inside the frontend folder.
_BUILD_DIR = Path(__file__).parent / "frontend" / "dist"

_openfin_bridge = components.declare_component(
    "openfin_bridge",
    path=str(_BUILD_DIR),
)


def openfin_bridge(event_type=None, data=None, key=None, default=None):
    """
    Single, invisible OpenFin bridge component.

    - Listens for OpenFin contexts and pushes them into Streamlit via the
      component return value.
    - Broadcasts contexts to OpenFin when `event_type`/`data` props change.

    Args:
        event_type (str|None): Event name to broadcast, e.g. 'ticker_selection_changed'.
        data (dict|None): Event payload. Mapping to OpenFin context is done in the frontend.
        key (str|None): Streamlit component key. Use a fixed key like 'openfin'.
        default: Default return value when no message has been received yet.

    Returns:
        dict|None: Latest value set by the frontend via Streamlit.setComponentValue.
    """
    return _openfin_bridge(eventType=event_type, data=data, key=key, default=default)
