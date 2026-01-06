"""
View 2 - Receive FDC3 Context

Displays incoming FDC3 context from other applications and provides a Clear button.
"""

import streamlit.components.v1 as components

fdc3_listener_html = """
<link rel="stylesheet" href="http://localhost:8500/styles.css">
<header class="row spread middle">
  <div class="col gap5">
    <h1>OpenFin Streamlit View 2</h1>
    <h1 class="tag">Streamlit app view in an OpenFin container</h1>
  </div>
</header>

<div class="col gap10" style="margin-top: 20px;">
    <fieldset class="width-full">
        <label>Context Received</label>
        <pre id="context-display"></pre>
    </fieldset>
    <div class="row left">
        <button class="secondary" onclick="parent.clearContextDisplay()">Clear</button>
    </div>
</div>
"""

components.html(fdc3_listener_html, height=400)
