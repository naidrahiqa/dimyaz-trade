const axios = require('axios');

async function checkApi() {
    try {
        console.log("Fetching Bitcoin data with sparkline...");
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin',
                order: 'market_cap_desc',
                per_page: 1,
                page: 1,
                sparkline: true
            }
        });

        const coin = response.data[0];
        console.log("Coin fetched:", coin.id);

        if (coin.sparkline_in_7d) {
            console.log("Sparkline data found!");
            console.log("Format check:", JSON.stringify(coin.sparkline_in_7d).slice(0, 50) + "...");
            if (Array.isArray(coin.sparkline_in_7d.price)) {
                console.log("Sparkline price is an array. Length:", coin.sparkline_in_7d.price.length);
            } else {
                console.error("Sparkline price is NOT an array!");
            }
        } else {
            console.error("Sparkline data MISSING in response!");
            console.log("Keys found:", Object.keys(coin));
        }

    } catch (error) {
        console.error("API Request Failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

checkApi();
