import type { CurrencyType, MetalType } from "@/contexts/TradingPreferences";

export const ApiRoutes = {
    Base: "http://localhost:3000",

    Fidor: {
        Base: "https://api.tp.sandbox.fidorfzco.com",
        Authorization: "https://apm.tp.sandbox.fidorfzco.com/oauth/authorize",
        AccessToken: "https://apm.tp.sandbox.fidorfzco.com/oauth/token",
        RefreshToken: "https://apm.tp.sandbox.fidorfzco.com/oauth/token",
        CurrentUser: "https://apm.tp.sandbox.fidorfzco.com/users/current",
        InternalTransfers: "https://api.tp.sandbox.fidorfzco.com/internal_transfers",
        Accounts: "https://api.tp.sandbox.fidorfzco.com/accounts",
        Transactions: `https://api.tp.sandbox.fidorfzco.com/transactions`,
    },
    MetalPrice: {
        Latest: (metal: MetalType) => `https://api.metalpriceapi.com/v1/latest?base=${metal}&currencies=USD`,
        Change: (startDate: string, endDate: string, metal: MetalType) => 
            `https://api.metalpriceapi.com/v1/change?start_date=${startDate}&end_date=${endDate}&base=${metal}&currencies=USD`,
        Timeframe: (startDate: string, endDate: string, metal: MetalType) => 
            `https://api.metalpriceapi.com/v1/timeframe?start_date=${startDate}&end_date=${endDate}&base=${metal}&currencies=USD`,
    },
    ExchangeRate: {
        Convert: (from: CurrencyType, to: CurrencyType, amount: number) => 
            `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&places=2`,
    },
    NewsApi: {
        Everything: (topic: string) => `https://newsapi.org/v2/everything?q=${topic}&language=en`
    },
    AlphaVantage: {
        NewsSentiment: (tickers: string) => `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=balldwodwjkod`,
    }
};