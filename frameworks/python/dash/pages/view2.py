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
                            html.H1("HERE Dash View 2"),
                            html.H1("Dash app view in an HERE container", className="tag"),
                        ],
                    ),
                ],
            ),
            html.Main(
                className="col gap10 left width-full",
                children=[
                    html.Fieldset(
                        className="width-full",
                        children=[
                            html.Label("Context Received", htmlFor="context-display"),
                            html.Pre(id="context-display", className="width-full", style={"minHeight": "110px"}),
                        ],
                    ),
                    html.Button(
                        "Clear",
                        id="btn-clear",
                        n_clicks=0,
                        className="secondary",
                    ),
                ],
            ),
            # Hidden div for callback outputs (required by Dash)
            html.Div(id="hidden-output-v2", style={"display": "none"}),
        ],
    )
