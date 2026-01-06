from dash import html

def get_layout():
    return html.Div(
        className="col fill gap20",
        children=[
            html.Header(
                className="row spread middle",
                children=[
                    html.Div(
                        className="col",
                        children=[
                            html.H1("OpenFin Dash View 1"),
                            html.H1("Dash app view in an OpenFin container", className="tag"),
                        ],
                    ),
                ],
            ),
            html.Main(
                className="col gap10 left width-full",
                children=[
                    html.Div(
                        className="col gap10",
                        children=[
                            html.Button(
                                "Broadcast FDC3 User Context",
                                id="btn-broadcast-user",
                                n_clicks=0,
                            ),
                            html.Button(
                                "Broadcast FDC3 App Context",
                                id="btn-broadcast-app",
                                n_clicks=0,
                            ),
                        ],
                    ),
                ],
            ),
            # Hidden div for callback outputs (required by Dash)
            html.Div(id="hidden-output-v1", style={"display": "none"}),
        ],
    )
