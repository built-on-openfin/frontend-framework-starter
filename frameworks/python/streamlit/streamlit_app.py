# -*- coding: utf-8 -*-
# Copyright 2024-2025 Streamlit Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import streamlit as st
import yfinance as yf
import pandas as pd
import altair as alt
from openfin_bridge_component import openfin_bridge

st.set_page_config(
    page_title="Stock peer analysis dashboard",
    page_icon=":chart_with_upwards_trend:",
    layout="wide",
)

"""
# :material/query_stats: Stock peer analysis

Easily compare stocks against others in their peer group.
"""

# We will call the OpenFin bridge component exactly once per run.
# Use these to accumulate any outbound send we want to perform.
pending_event_type = None
pending_data = None

""  # Add some space.

cols = st.columns([1, 3])
# Will declare right cell later to avoid showing it when no data.

STOCKS = [
    "AAPL",
    "ABBV",
    "ACN",
    "ADBE",
    "ADP",
    "AMD",
    "AMGN",
    "AMT",
    "AMZN",
    "APD",
    "AVGO",
    "AXP",
    "BA",
    "BK",
    "BKNG",
    "BMY",
    "BRK.B",
    "BSX",
    "C",
    "CAT",
    "CI",
    "CL",
    "CMCSA",
    "COST",
    "CRM",
    "CSCO",
    "CVX",
    "DE",
    "DHR",
    "DIS",
    "DUK",
    "ELV",
    "EOG",
    "EQR",
    "FDX",
    "GD",
    "GE",
    "GILD",
    "GOOG",
    "GOOGL",
    "HD",
    "HON",
    "HUM",
    "IBM",
    "ICE",
    "INTC",
    "ISRG",
    "JNJ",
    "JPM",
    "KO",
    "LIN",
    "LLY",
    "LMT",
    "LOW",
    "MA",
    "MCD",
    "MDLZ",
    "META",
    "MMC",
    "MO",
    "MRK",
    "MSFT",
    "NEE",
    "NFLX",
    "NKE",
    "NOW",
    "NVDA",
    "ORCL",
    "PEP",
    "PFE",
    "PG",
    "PLD",
    "PM",
    "PSA",
    "REGN",
    "RTX",
    "SBUX",
    "SCHW",
    "SLB",
    "SO",
    "SPGI",
    "T",
    "TJX",
    "TMO",
    "TSLA",
    "TXN",
    "UNH",
    "UNP",
    "UPS",
    "V",
    "VZ",
    "WFC",
    "WM",
    "WMT",
    "XOM",
]

DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN", "TSLA", "META"]


def stocks_to_str(stocks):
    return ",".join(stocks)


if "tickers_input" not in st.session_state:
    st.session_state.tickers_input = st.query_params.get(
        "stocks", stocks_to_str(DEFAULT_STOCKS)
    ).split(",")


# Callback to update query param when input changes
def update_query_param():
    if st.session_state.tickers_input:
        st.query_params["stocks"] = stocks_to_str(st.session_state.tickers_input)
    else:
        st.query_params.pop("stocks", None)


top_left_cell = cols[0].container(
    border=True, height="stretch", vertical_alignment="center"
)

with top_left_cell:
    # Selectbox for stock tickers
    tickers = st.multiselect(
        "Stock tickers",
        options=sorted(set(STOCKS) | set(st.session_state.tickers_input)),
        default=st.session_state.tickers_input,
        placeholder="Choose stocks to compare. Example: NVDA",
        accept_new_options=True,
        key="ticker_selector",
    )

# Broadcast ticker changes via OpenFin (defer actual send to the single bridge call)
if "last_tickers" not in st.session_state:
    st.session_state.last_tickers = []

# Compare order-insensitively to avoid false diffs due to ordering
def _normalize_ticker_list(lst):
    return sorted([str(t).upper() for t in (lst or [])])

current_norm = _normalize_ticker_list(tickers)
last_norm = _normalize_ticker_list(st.session_state.last_tickers)

if current_norm != last_norm:
    # If the change originated from an inbound OpenFin update, skip outbound once
    if st.session_state.get("_suppress_outbound_tickers_once"):
        st.session_state._suppress_outbound_tickers_once = False
        st.session_state.last_tickers = tickers
    else:
        pending_event_type = "ticker_selection_changed"
        pending_data = {
            "tickers": tickers,
            "previous_tickers": st.session_state.last_tickers,
        }
        st.session_state.last_tickers = tickers

# Time horizon selector
horizon_map = {
    "1 Months": "1mo",
    "3 Months": "3mo",
    "6 Months": "6mo",
    "1 Year": "1y",
    "5 Years": "5y",
    "10 Years": "10y",
    "20 Years": "20y",
}

# If we received an inbound horizon earlier, resolve it to our UI label and
# apply it BEFORE instantiating the horizon widget. Streamlit forbids changing
# a widget's value after it has been created in the same run.
if "_inbound_horizon_value" in st.session_state or "_inbound_horizon_label" in st.session_state:
    desired_label = None
    if st.session_state.get("_inbound_horizon_value"):
        inv = st.session_state.get("_inbound_horizon_value")
        # Find the label whose value matches the inbound value
        for label, val in horizon_map.items():
            if val == inv:
                desired_label = label
                break
    if not desired_label and st.session_state.get("_inbound_horizon_label"):
        # Fallback: if we got a label-like horizon (e.g., '6 Months')
        candidate = st.session_state.get("_inbound_horizon_label")
        if candidate in horizon_map:
            desired_label = candidate

    if desired_label:
        # Apply inbound horizon to the widget's state. Only set suppression if this
        # actually changes the current value or our last_horizon tracker.
        current_label = st.session_state.get("horizon_selector")
        last_label = st.session_state.get("last_horizon")
        st.session_state["horizon_selector"] = desired_label
        st.session_state["last_horizon"] = desired_label
        if desired_label != current_label or desired_label != last_label:
            st.session_state["_suppress_outbound_horizon_once"] = True

    # Clear temp fields; no rerun needed since the widget will read the updated state
    st.session_state.pop("_inbound_horizon_value", None)
    st.session_state.pop("_inbound_horizon_label", None)

with top_left_cell:
    # Buttons for picking time horizon
    horizon = st.pills(
        "Time horizon",
        options=list(horizon_map.keys()),
        default="3 Months",
        key="horizon_selector",
    )

# Broadcast horizon changes via OpenFin (defer actual send to the single bridge call)
if "last_horizon" not in st.session_state:
    st.session_state.last_horizon = None

if horizon != st.session_state.last_horizon:
    # Suppress outbound if this change originated from an inbound OpenFin context
    if st.session_state.get("_suppress_outbound_horizon_once"):
        st.session_state._suppress_outbound_horizon_once = False
        st.session_state.last_horizon = horizon
    else:
        # If another outbound is pending (e.g., tickers), this will overwrite it.
        # Deterministic rule: the latest change wins. If you need to send both,
        # consider queueing or splitting into two frames in a future enhancement.
        pending_event_type = "horizon_changed"
        pending_data = {
            "horizon": horizon,
            "horizon_value": horizon_map[horizon],
            "previous_horizon": st.session_state.last_horizon,
        }
        st.session_state.last_horizon = horizon

# Now call the OpenFin bridge exactly once with any pending outbound props,
# and receive any inbound messages.
openfin_message = openfin_bridge(
    key="openfin",
    event_type=pending_event_type,
    data=pending_data,
    default=None,
)

# Handle inbound OpenFin contexts (tickers and time horizon)
if isinstance(openfin_message, dict):
    # Process each distinct message only once using the component's ts field.
    incoming_ts = openfin_message.get("ts")
    last_ts = st.session_state.get("_last_openfin_ts")
    if incoming_ts is None or incoming_ts != last_ts:
        if incoming_ts is not None:
            st.session_state._last_openfin_ts = incoming_ts

        if "payload" in openfin_message:
            payload = openfin_message["payload"]
            action = payload.get("action")
            if action == "update_tickers":
                new_tickers = [str(t).upper() for t in payload.get("tickers", [])]
                # Only update/rerun if the inbound selection is different (order-insensitive)
                current_input = [str(t).upper() for t in st.session_state.get("tickers_input", [])]
                if sorted(new_tickers) != sorted(current_input):
                    st.session_state.tickers_input = new_tickers
                    # Align tracking and suppress the immediate outbound echo
                    st.session_state.last_tickers = new_tickers
                    st.session_state._suppress_outbound_tickers_once = True
                    st.rerun()
            elif action == "update_horizon":
                # Map inbound horizonValue (e.g., '6mo') to the label used by the UI (e.g., '6 Months').
                inbound_value = payload.get("horizonValue")
                inbound_label = payload.get("horizon")
                # horizon_map is already defined below; we may need to stash first
                # then apply after control creation. Stash here and the block below will apply.
                st.session_state._inbound_horizon_value = inbound_value
                st.session_state._inbound_horizon_label = inbound_label
                # Trigger an immediate rerun so the pre-widget block at the top of the
                # script can apply the inbound horizon before the pills widget is
                # instantiated. Without this, the value would be applied one run late
                # (appearing as if it shows the previous selection).
                st.rerun()

tickers = [t.upper() for t in tickers]

# Update query param when text input changes
if tickers:
    st.query_params["stocks"] = stocks_to_str(tickers)
else:
    # Clear the param if input is empty
    st.query_params.pop("stocks", None)

if not tickers:
    top_left_cell.info("Pick some stocks to compare", icon=":material/info:")
    st.stop()


right_cell = cols[1].container(
    border=True, height="stretch", vertical_alignment="center"
)


@st.cache_resource(show_spinner=False, ttl="6h")
def load_data(tickers, period):
    tickers_obj = yf.Tickers(tickers)
    data = tickers_obj.history(period=period)
    if data is None:
        raise RuntimeError("YFinance returned no data.")
    return data["Close"]


# Load the data
try:
    data = load_data(tickers, horizon_map[horizon])
except yf.exceptions.YFRateLimitError as e:
    st.warning("YFinance is rate-limiting us :(\nTry again later.")
    load_data.clear()  # Remove the bad cache entry.
    st.stop()

empty_columns = data.columns[data.isna().all()].tolist()

if empty_columns:
    st.error(f"Error loading data for the tickers: {', '.join(empty_columns)}.")
    st.stop()

# Normalize prices (start at 1)
normalized = data.div(data.iloc[0])

# Check for NaN values in the latest data
latest_values = normalized.iloc[-1]
nan_tickers = latest_values[latest_values.isna()].index.tolist()

if nan_tickers:
    st.warning(f"⚠️ Missing recent data for: {', '.join(nan_tickers)}. These may show incomplete results.")
    # Optionally, you could remove these tickers:
    # normalized = normalized.drop(columns=nan_tickers)
    # tickers = [t for t in tickers if t not in nan_tickers]

latest_norm_values = {normalized[ticker].iat[-1]: ticker for ticker in tickers}
max_norm_value = max(latest_norm_values.items())
min_norm_value = min(latest_norm_values.items())

bottom_left_cell = cols[0].container(
    border=True, height="stretch", vertical_alignment="center"
)

with bottom_left_cell:
    cols = st.columns(2)

    # Handle NaN values gracefully
    max_delta = f"{round(max_norm_value[0] * 100)}%" if pd.notna(max_norm_value[0]) else "N/A"
    min_delta = f"{round(min_norm_value[0] * 100)}%" if pd.notna(min_norm_value[0]) else "N/A"

    cols[0].metric(
        "Best stock",
        max_norm_value[1],
        delta=max_delta,
        width="content",
    )
    cols[1].metric(
        "Worst stock",
        min_norm_value[1],
        delta=min_delta,
        width="content",
    )


# Plot normalized prices
with right_cell:
    st.altair_chart(
        alt.Chart(
            normalized.reset_index().melt(
                id_vars=["Date"], var_name="Stock", value_name="Normalized price"
            )
        )
        .mark_line()
        .encode(
            alt.X("Date:T"),
            alt.Y("Normalized price:Q").scale(zero=False),
            alt.Color("Stock:N"),
        )
        .properties(height=400)
    )

""
""

# Plot individual stock vs peer average
"""
## Individual stocks vs peer average

For the analysis below, the "peer average" when analyzing stock X always
excludes X itself.
"""

if len(tickers) <= 1:
    st.warning("Pick 2 or more tickers to compare them")
    st.stop()

NUM_COLS = 4
cols = st.columns(NUM_COLS)

for i, ticker in enumerate(tickers):
    # Calculate peer average (excluding current stock)
    peers = normalized.drop(columns=[ticker])
    peer_avg = peers.mean(axis=1)

    # Create DataFrame with peer average.
    plot_data = pd.DataFrame(
        {
            "Date": normalized.index,
            ticker: normalized[ticker],
            "Peer average": peer_avg,
        }
    ).melt(id_vars=["Date"], var_name="Series", value_name="Price")

    chart = (
        alt.Chart(plot_data)
        .mark_line()
        .encode(
            alt.X("Date:T"),
            alt.Y("Price:Q").scale(zero=False),
            alt.Color(
                "Series:N",
                scale=alt.Scale(domain=[ticker, "Peer average"], range=["red", "gray"]),
                legend=alt.Legend(orient="bottom"),
            ),
            alt.Tooltip(["Date", "Series", "Price"]),
        )
        .properties(title=f"{ticker} vs peer average", height=300)
    )

    cell = cols[(i * 2) % NUM_COLS].container(border=True)
    cell.write("")
    cell.altair_chart(chart, use_container_width=True)

    # Create Delta chart
    plot_data = pd.DataFrame(
        {
            "Date": normalized.index,
            "Delta": normalized[ticker] - peer_avg,
        }
    )

    chart = (
        alt.Chart(plot_data)
        .mark_area()
        .encode(
            alt.X("Date:T"),
            alt.Y("Delta:Q").scale(zero=False),
        )
        .properties(title=f"{ticker} minus peer average", height=300)
    )

    cell = cols[(i * 2 + 1) % NUM_COLS].container(border=True)
    cell.write("")
    cell.altair_chart(chart, use_container_width=True)

""
""

"""
## Raw data
"""

data
