import React from 'react';

export const FundamentalAnalysis: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-900/80 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-4">Market Sentiment</h3>
                <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-green-500 h-full w-[65%]"></div>
                    </div>
                    <span className="text-green-500 font-bold">Buy</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                    65% of indicators suggest a BUY signal on the 1H timeframe.
                </p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-900/80 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-4">Fundamental Data</h3>
                <ul className="space-y-3">
                    <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Market Cap</span>
                        <span className="text-white">$1.2T</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Circulating Supply</span>
                        <span className="text-white">19.5M BTC</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span className="text-gray-400">Max Supply</span>
                        <span className="text-white">21M BTC</span>
                    </li>
                </ul>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-900/80 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-4">News Feed</h3>
                <div className="space-y-4">
                    <div className="text-sm border-l-2 border-purple-500 pl-3">
                        <p className="text-gray-300 hover:text-white cursor-pointer transition-colors line-clamp-2">
                            Bitcoin breaks $44k resistance as ETFs approval looms closer.
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">2 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
