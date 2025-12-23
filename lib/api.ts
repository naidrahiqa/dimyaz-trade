import axios from 'axios';

// Interfaces
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// search for a coin to get its ID (e.g. "BTC" -> "bitcoin")
export async function searchCoin(query: string) {
  try {
    const { data } = await axios.get(`${COINGECKO_API}/search?query=${query}`);
    if (data.coins && data.coins.length > 0) {
      return data.coins[0]; // Return top match
    }
    return null;
  } catch (e) {
    console.error("CoinGecko Search Error", e);
    return null;
  }
}

// Mock Data for Fallback (Rate Limits)
const MOCK_COIN: CoinData = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin (Mock)",
  image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  current_price: 65432.10,
  market_cap: 1200000000000,
  market_cap_rank: 1,
  total_volume: 35000000000,
  high_24h: 66000,
  low_24h: 64000,
  price_change_percentage_24h: 2.5,
  sparkline_in_7d: {
    price: Array(168).fill(0).map((_, i) => 64000 + Math.random() * 2000)
  }
};

// Fetch detailed market data for a specific coin ID
export async function fetchCoinData(coinId: string): Promise<CoinData | null> {
  try {
    const { data } = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinId,
        order: 'market_cap_desc',
        per_page: 1,
        page: 1,
        sparkline: true
      }
    });
    if (data && data.length > 0) return data[0];
    return null;
  } catch (error: any) {
    console.error('API Error (returning mock):', error.message);
    // Fallback to mock if API fails (likely 429)
    return { ...MOCK_COIN, id: coinId, symbol: coinId === 'bitcoin' ? 'btc' : 'mock' };
  }
}

// Fetch Top 50 Coins for Market Page
export async function fetchTopCoins(): Promise<CoinData[]> {
  try {
    const { data } = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false
      }
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function fetchNews() {
  try {
    // Using a free news proxy or public RSS to JSON if possible. 
    // For reliability in this demo without API key, we might use a mock or a simpler endpoint.
    // Cryptocompare min-api typically needs a specific free endpoint.
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
    const data = await response.json();
    return data.Data.slice(0, 5); // Return top 5 news
  } catch (e) {
    console.error("News Fetch Error", e);
    return [];
  }
}
