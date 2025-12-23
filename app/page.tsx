"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import TradingViewWidget from '@/components/TradingViewWidget';
import { MarketOverview } from '@/components/MarketOverview';
import { TradingSignals } from '@/components/TradingSignals';
import { NewsFeed } from '@/components/NewsFeed';
import { fetchCoinData, searchCoin, fetchNews, CoinData } from '@/lib/api';
import { Search } from 'lucide-react';

export default function Home() {
  const [symbol, setSymbol] = useState('BTCUSDT'); // TradingView Symbol
  const [coinId, setCoinId] = useState('bitcoin'); // CoinGecko ID
  const [displaySymbol, setDisplaySymbol] = useState('BTC'); // UI display

  const [inputSymbol, setInputSymbol] = useState('BTC');
  const [marketData, setMarketData] = useState<CoinData | null>(null);
  const [news, setNews] = useState<any[]>([]);

  // Load Initial Data
  useEffect(() => {
    const init = async () => {
      const data = await fetchCoinData(coinId);
      setMarketData(data);
      const newsData = await fetchNews();
      setNews(newsData);
    };
    init();
  }, [coinId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSymbol.trim()) return;

    // Search CoinGecko for ID
    const result = await searchCoin(inputSymbol.toLowerCase());
    if (result) {
      setCoinId(result.id);
      setDisplaySymbol(result.symbol.toUpperCase());
      setSymbol(`${result.symbol.toUpperCase()}USDT`); // Guessing pair for TV

      const data = await fetchCoinData(result.id);
      setMarketData(data);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {marketData ? (
                <img src={marketData.image} alt={marketData.symbol} className="w-8 h-8 rounded-full" />
              ) : null}
              {displaySymbol} <span className="text-gray-500 text-lg font-normal">/ USDT</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Dimyaz Trade Professional Terminal</p>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value)}
              placeholder="Search Coin (e.g. sol, pepe)"
              className="bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4 group-focus-within:text-blue-400" />
          </form>
        </div>

        {/* Market Overview Cards */}
        <MarketOverview data={marketData} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area - Spans 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden h-[600px] shadow-2xl relative z-0">
              <TradingViewWidget symbol={symbol} />
            </div>
          </div>

          {/* Sidebar - Signals & News */}
          <div className="space-y-6">
            <TradingSignals
              symbol={displaySymbol}
              price={marketData?.current_price || 0}
              change24h={marketData?.price_change_percentage_24h || 0}
              sparkline={marketData?.sparkline_in_7d?.price || []}
            />
            <NewsFeed news={news} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
