"use client";

import { DashboardLayout } from '@/components/DashboardLayout';
import TradingViewWidget from '@/components/TradingViewWidget';
import { useState } from 'react';

export default function TradePage() {
    const [leverage, setLeverage] = useState(10);
    const [orderType, setOrderType] = useState('Limit');
    const [side, setSide] = useState('Long');

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)]">
                {/* Chart */}
                <div className="lg:col-span-3 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden relative">
                    <TradingViewWidget symbol="BTCUSDT" />
                </div>

                {/* Order Form */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Place Order</h2>
                        <div className="flex bg-black rounded-lg p-1 mb-4">
                            <button
                                onClick={() => setSide('Long')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${side === 'Long' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Log
                            </button>
                            <button
                                onClick={() => setSide('Short')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${side === 'Short' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Short
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Order Type</label>
                            <select
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option>Limit</option>
                                <option>Market</option>
                                <option>Stop Limit</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Leverage ({leverage}x)</label>
                            <input
                                type="range"
                                min="1" max="100"
                                value={leverage}
                                onChange={(e) => setLeverage(parseInt(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Price (USDT)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Amount (BTC)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${side === 'Long' ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                        {side === 'Long' ? 'Buy / Long' : 'Sell / Short'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
