import React, { useMemo, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Target, ShieldAlert, Crosshair, Zap } from 'lucide-react';
import { RSI, SMA, EMA } from 'technicalindicators';

interface TradingSignalsProps {
    symbol: string;
    price: number;
    change24h: number;
    sparkline: number[];
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export const TradingSignals: React.FC<TradingSignalsProps> = ({ symbol, price, change24h, sparkline }) => {

    const [riskLevel, setRiskLevel] = useState<RiskLevel>('MEDIUM');

    // Algorithmic Signal Generation
    const signal = useMemo(() => {
        const isBullish = change24h > 0;
        const volatility = Math.abs(change24h);

        // --- Technical Analysis ---
        // Calculate RSI if we have enough data points (CoinGecko gives 168 points for 7d)
        let rsiValue = 50;
        let rsiStatus = 'NEUTRAL';

        if (sparkline && sparkline.length > 14) {
            const rsiInput = {
                values: sparkline,
                period: 14
            };
            const rsiResult = RSI.calculate(rsiInput);
            if (rsiResult.length > 0) {
                rsiValue = rsiResult[rsiResult.length - 1];
            }
        }

        if (rsiValue > 70) rsiStatus = 'OVERBOUGHT';
        else if (rsiValue < 30) rsiStatus = 'OVERSOLD';

        // 1. Determine Direction (Momentum + RSI Confluence)
        let direction = isBullish ? 'LONG' : 'SHORT';

        // RSI Reversal Logic
        // If Price is dropping but RSI is Oversold -> Potential Long Reversal
        if (direction === 'SHORT' && rsiStatus === 'OVERSOLD') direction = 'LONG (Reversal)';
        if (direction === 'LONG' && rsiStatus === 'OVERBOUGHT') direction = 'SHORT (Reversal)';

        if (volatility < 0.2 && riskLevel !== 'EXTREME') direction = 'NEUTRAL'; // Too flat, unless we are degen

        // 2. Risk Configurations
        const config = {
            'LOW': {
                leverageBase: 3,
                leverageMax: 5,
                slDist: 0.02, // 2% wide stop
                tpMult: 1.5,
                label: 'Conservative'
            },
            'MEDIUM': {
                leverageBase: 5,
                leverageMax: 10,
                slDist: 0.01, // 1% moderate stop
                tpMult: 2.0,
                label: 'Balanced'
            },
            'HIGH': {
                leverageBase: 20,
                leverageMax: 30,
                slDist: 0.005, // 0.5% tight stop
                tpMult: 3.0,
                label: 'Aggressive'
            },
            'EXTREME': {
                leverageBase: 50,
                leverageMax: 100,
                slDist: 0.002, // 0.2% scalp stop
                tpMult: 5.0, // Moonbag
                label: 'Degen'
            }
        }[riskLevel];

        // Adjust leverage slightly by volatility (inverse)
        let leverage = config.leverageBase;
        if (volatility < 1.0) leverage = config.leverageMax;

        const leverageType = riskLevel === 'LOW' ? "Cross" : "Isolated";

        // 3. Entry Zone
        const entryBufferPct = riskLevel === 'EXTREME' ? 0.0005 : 0.0015;
        const entryPrice = price;
        const entryLow = price * (1 - entryBufferPct);
        const entryHigh = price * (1 + entryBufferPct);

        // 4. Stop Loss
        const slPrice = direction === 'LONG'
            ? entryPrice * (1 - config.slDist)
            : entryPrice * (1 + config.slDist);

        // 5. Take Profit
        const riskDistance = Math.abs(entryPrice - slPrice);
        const reward1 = riskDistance * (config.tpMult === 1.5 ? 1.0 : 1.5); // TP1 is closer for conservatives
        const reward2 = riskDistance * config.tpMult;

        const tp1Price = direction === 'LONG'
            ? entryPrice + reward1
            : entryPrice - reward1;

        const tp2Price = direction === 'LONG'
            ? entryPrice + reward2
            : entryPrice - reward2;

        // 6. Metrics
        const estLoss = (Math.abs(entryPrice - slPrice) / entryPrice * 100 * leverage).toFixed(1);
        const estGain = (Math.abs(entryPrice - tp1Price) / entryPrice * 100 * leverage).toFixed(1);

        return {
            direction,
            leverage: `${leverage}x`,
            leverageType,
            entry: `${entryLow.toFixed(price < 1 ? 5 : 2)} - ${entryHigh.toFixed(price < 1 ? 5 : 2)}`,
            tp1: tp1Price.toFixed(price < 1 ? 5 : 2),
            tp2: tp2Price.toFixed(price < 1 ? 5 : 2),
            sl: slPrice.toFixed(price < 1 ? 5 : 2),
            rr: `1:${config.tpMult.toFixed(1)}`,
            estLoss,
            estGain,
            rsi: rsiValue.toFixed(0),
            rsiStatus,
            timeframe: riskLevel === 'EXTREME' ? 'Scalp (1m-5m)' : 'Intraday (1H-4H)'
        };

    }, [price, change24h, riskLevel]);

    const isLong = signal.direction === 'LONG';
    const accentColor = isLong ? 'text-green-500' : 'text-red-500';
    const bgAccent = isLong ? 'bg-green-500' : 'bg-red-500';

    const riskColors = {
        'LOW': 'text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
        'MEDIUM': 'text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20',
        'HIGH': 'text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
        'EXTREME': 'text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
    };

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col gap-5 shadow-inner">
            <div className={`absolute top-0 left-0 w-1 h-full ${bgAccent}`} />

            {/* Risk Selector */}
            <div className="flex gap-2 p-1 bg-black/20 rounded-lg overflow-x-auto">
                {(['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] as RiskLevel[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => setRiskLevel(level)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${riskLevel === level ? riskColors[level] + ' bg-white/5' : 'text-gray-500 border-transparent hover:text-white'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-xl font-black ${accentColor} flex items-center gap-2 tracking-wide`}>
                        {isLong ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                        {signal.direction}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono flex items-center gap-1">
                            <Zap size={10} className={riskLevel === 'EXTREME' ? 'text-purple-500' : ''} />
                            {signal.leverage} {signal.leverageType}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">RR {signal.rr}</span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex flex-col items-end ${isLong ? 'bg-green-950/30 border-green-500/20 text-green-400' : 'bg-red-950/30 border-red-500/20 text-red-400'}`}>
                    <span>High Conviction</span>
                    <span className="text-[10px] opacity-60 font-normal">{signal.timeframe}</span>
                </div>
            </div>

            {/* Entry Block */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative group">
                <div className="absolute -left-[1px] top-4 bottom-4 w-[3px] bg-blue-500 rounded-r-none" />
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 text-sm text-blue-400 font-semibold">
                        <Crosshair size={16} /> ENTRY ZONE
                    </div>
                </div>
                <div className="text-2xl text-white font-mono font-bold tracking-tight">{signal.entry}</div>
            </div>

            {/* Risk Management Grid */}
            <div className="grid grid-cols-2 gap-4">

                {/* Take Profit */}
                <div className={`rounded-xl p-4 border relative overflow-hidden ${isLong ? 'bg-green-500/5 border-green-500/10' : 'bg-green-500/5 border-green-500/10'}`}>
                    <div className="flex items-center gap-2 text-sm text-green-400 font-bold mb-2">
                        <Target size={16} /> TAKE PROFIT
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-white font-mono font-bold text-lg">{signal.tp1}</span>
                            <span className="text-green-500/60 text-xs font-mono">TP1</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-white/70 font-mono text-sm">{signal.tp2}</span>
                            <span className="text-green-500/40 text-xs font-mono">TP2</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dashed border-green-500/20">
                        <div className="text-xs text-green-400 flex justify-between">
                            <span>Est. Gain</span>
                            <span className="font-bold">+{signal.estGain}%</span>
                        </div>
                    </div>
                </div>

                {/* Stop Loss */}
                <div className={`rounded-xl p-4 border relative overflow-hidden ${isLong ? 'bg-red-500/5 border-red-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                    <div className="flex items-center gap-2 text-sm text-red-400 font-bold mb-2">
                        <ShieldAlert size={16} /> STOP LOSS
                    </div>
                    <div className="text-white font-mono font-bold text-lg">{signal.sl}</div>
                    <div className="text-white/40 text-xs mt-1 font-medium">Strict Exit</div>

                    <div className="mt-7 pt-3 border-t border-dashed border-red-500/20">
                        <div className="text-xs text-red-400 flex justify-between">
                            <span>Risk</span>
                            <span className="font-bold">-{signal.estLoss}%</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Strategy Context */}
            {/* Strategy Context & Visuals */}
            <div className="space-y-4">
                {/* RSI Visual Meter */}
                <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono uppercase">
                        <span>Oversold</span>
                        <span className="text-white">RSI: {signal.rsi}</span>
                        <span>Overbought</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                        {/* Zones */}
                        <div className="absolute left-0 w-[30%] h-full bg-green-500/30" />
                        <div className="absolute right-0 w-[30%] h-full bg-red-500/30" />

                        {/* Marker */}
                        <div
                            className="absolute top-0 w-1 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
                            style={{ left: `${signal.rsi}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-600 mt-1 font-mono">
                        <span>0</span>
                        <span>30</span>
                        <span>70</span>
                        <span>100</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-gray-600 font-mono">
                        Strategy: {signal.timeframe} Momentum • Volatility Adjusted
                    </p>
                </div>
            </div>
        </div>
    );
};
