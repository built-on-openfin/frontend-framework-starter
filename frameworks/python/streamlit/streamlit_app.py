"""
Streamlit OpenFin FDC3 Integration Example
"""

import streamlit as st
from pathlib import Path

st.set_page_config(
	page_title="OpenFin Streamlit",
	page_icon="📊",
	layout="wide",
	initial_sidebar_state="collapsed",
)

# Streamlit doesn't automatically load local CSS, so we inject it on startup.
_css_path = Path(__file__).parent / "assets" / "styles.css"
try:
	st.markdown(f"<style>{_css_path.read_text(encoding='utf-8')}</style>", unsafe_allow_html=True)
except OSError:
	pass

view1 = st.Page("pages/view1.py", title="View 1", icon="📤", url_path="view1")
view2 = st.Page("pages/view2.py", title="View 2", icon="📥", url_path="view2")

pg = st.navigation([view1, view2])
pg.run()
