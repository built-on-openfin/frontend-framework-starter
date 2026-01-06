"""
Dash Plotly OpenFin FDC3 Integration Example
"""

from dash import Dash, html, dcc, clientside_callback, Output, Input
from pages import view1, view2

app = Dash(__name__, suppress_callback_exceptions=True)

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')
])

@app.callback(Output('page-content', 'children'),
              [Input('url', 'pathname')])
def display_page(pathname):
    if pathname == '/view2':
        return view2.get_layout()
    else:
        return view1.get_layout()

clientside_callback(
    """
    function(n_clicks) {
        return window.dash_clientside.openfin.broadcastUserContext(n_clicks);
    }
    """,
    Output("hidden-output-v1", "children", allow_duplicate=True),
    Input("btn-broadcast-user", "n_clicks"),
    prevent_initial_call=True,
)

clientside_callback(
    """
    function(n_clicks) {
        return window.dash_clientside.openfin.broadcastAppContext(n_clicks);
    }
    """,
    Output("hidden-output-v1", "children", allow_duplicate=True),
    Input("btn-broadcast-app", "n_clicks"),
    prevent_initial_call=True,
)

clientside_callback(
    """
    function(n_clicks) {
        return window.dash_clientside.openfin.clearContext(n_clicks);
    }
    """,
    Output("hidden-output-v2", "children", allow_duplicate=True),
    Input("btn-clear", "n_clicks"),
    prevent_initial_call=True,
)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8050)
