"""View 1 - Broadcast FDC3 Context."""

import streamlit.components.v1 as components

fdc3_view_html = """
<link rel="stylesheet" href="http://localhost:8500/styles.css">
<header class="row spread middle">
  <div class="col gap5">
    <h1>OpenFin Streamlit View 1</h1>
    <h1 class="tag">Streamlit app view in an OpenFin container</h1>
  </div>
</header>
<div class="col gap10" style="margin-top: 20px">
    <button style="max-width: 250px" onclick="parent.broadcastFdc3UserContext()">
        Broadcast FDC3 User Context
    </button>
    <button style="max-width: 250px" class="secondary" onclick="parent.broadcastFdc3AppContext()">
        Broadcast FDC3 App Context
    </button>
</div>
"""

components.html(fdc3_view_html, height=400)
