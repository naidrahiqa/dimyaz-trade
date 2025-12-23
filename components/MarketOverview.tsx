import { CoinData } from '@/lib/api';

interface MarketOverviewProps {
    data: CoinData | null;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
    if (!data) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl"></div>)}
        </div>
    );

    const isPositive = data.price_change_percentage_24h >= 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Current Price</div>
                <div className="text-2xl font-bold text-white">
                    ${data.current_price.toLocaleString()}
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <div className="text-sm text-gray-500">24h Change</div>
                <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{data.price_change_percentage_24h.toFixed(2)}%
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <div className="text-sm text-gray-500">24h High</div>
                <div className="text-2xl font-bold text-white">
                    ${data.high_24h.toLocaleString()}
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                <div className="text-sm text-gray-500">Vol / Mkt Cap</div>
                <div className="text-xl font-bold text-white">
                    {((data.total_volume / data.market_cap) * 100).toFixed(2)}%
                </div>
            </div>
        </div>
    )
}
