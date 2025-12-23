import React, { useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Target, ShieldAlert, Crosshair } from 'lucide-react';
import { RSI, SMA, EMA } from 'technicalindicators';

interface TradingSignalsProps {
    symbol: string;
    price: number;
    change24h: number;
}

export const TradingSignals: React.FC<TradingSignalsProps> = ({ symbol, price, change24h }) => {

    // Algorithmic Signal Generation (Simulated for Demo based on current price/change)
    const signal = useMemo(() => {
        // In a real app, we would pass historical candles here to calculate RSI/MACD accurately.
        // For this demo, we infer momentum from 24h change and randomize slightly for "simulation" feel.

        const isBullish = change24h > 0;
        const trendStrength = Math.abs(change24h); // 0-10% usually

        let direction = isBullish ? 'LONG' : 'SHORT';
        if (trendStrength < 0.5) direction = 'NEUTRAL';

        // Entry Zone
        const entryBuffer = price * 0.002; // 0.2% buffer
        const entryLow = direction === 'LONG' ? price - entryBuffer : price + entryBuffer;
        const entryHigh = direction === 'LONG' ? price + entryBuffer : price - entryBuffer; // purely illustrative

        // Targets (RR 1:2, 1:3)
        const risk = price * 0.01; // 1% risk
        const tp1 = direction === 'LONG' ? price + risk * 1.5 : price - risk * 1.5;
        const tp2 = direction === 'LONG' ? price + risk * 3.0 : price - risk * 3.0;

        // Stop Loss
        const sl = direction === 'LONG' ? price - risk : price + risk;

        return {
            direction,
            entry: `${entryLow.toFixed(2)} - ${entryHigh.toFixed(2)}`,
            tp1: tp1.toFixed(2),
            tp2: tp2.toFixed(2),
            sl: sl.toFixed(2),
            timeframe: 'Scalp / Day (1H)'
        };

    }, [price, change24h]);

    if (signal.direction === 'NEUTRAL') {
        return (
            <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 h-full flex items-center justify-center text-gray-500">
                Waiting for clear setups...
            </div>
        )
    }

    const isLong = signal.direction === 'LONG';

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${isLong ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {isLong ? <ArrowUpCircle className="text-green-500" /> : <ArrowDownCircle className="text-red-500" />}
                        {signal.direction} <span className="text-gray-400 text-sm font-normal">Signal</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{signal.timeframe} • AI Analysis</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isLong ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    High Confidence
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Crosshair size={14} /> Entry Zone
                    </div>
                    <div className="text-white font-mono font-medium">{signal.entry}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                        <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                            <Target size={14} /> Take Profit
                        </div>
                        <div className="text-white font-mono font-medium">{signal.tp1}</div>
                        <div className="text-white/50 font-mono text-xs mt-1">TP2: {signal.tp2}</div>
                    </div>

                    <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                        <div className="flex items-center gap-2 text-sm text-red-400 mb-1">
                            <ShieldAlert size={14} /> Stop Loss
                        </div>
                        <div className="text-white font-mono font-medium">{signal.sl}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
