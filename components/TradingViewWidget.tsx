"use client";

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (!container.current) return;

            // Clear previous widget
            container.current.innerHTML = "";

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:${symbol}",
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(31, 41, 55, 1)",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
            container.current.appendChild(script);
        },
        [symbol]
    );

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
        </div>
    );
}

export default memo(TradingViewWidget);
