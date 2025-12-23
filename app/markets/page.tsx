"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { fetchTopCoins, CoinData } from '@/lib/api';

export default function MarketsPage() {
    const [coins, setCoins] = useState<CoinData[]>([]);

    useEffect(() => {
        fetchTopCoins().then(setCoins);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Market Overview</h1>

                <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/5 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Asset</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">24h Change</th>
                                    <th className="px-6 py-4">Market Cap</th>
                                    <th className="px-6 py-4">Volume (24h)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coins.length > 0 ? coins.map((coin) => (
                                    <tr key={coin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3 text-white font-medium">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                            <span>{coin.name}</span>
                                            <span className="text-gray-500 text-xs uppercase">{coin.symbol}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white">
                                            ${coin.current_price.toLocaleString()}
                                        </td>
                                        <td className={`px-6 py-4 font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {coin.price_change_percentage_24h.toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4">
                                            ${coin.market_cap.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${coin.total_volume.toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center">Loading markets...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
