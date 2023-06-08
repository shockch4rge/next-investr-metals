import type { CurrencyType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { DateTime } from "luxon";
import { ApiRoutes } from "./ApiRoutes";

export const formatCurrency = (price: number, currency: CurrencyType) => {
    return currency === "EUR" ? `€${Intl.NumberFormat("de").format(price)}` : `$${Intl.NumberFormat("us").format(price)}`;
};

export const calculateTimeframe = (timeframe: TradingTimeframe) => {
    let startDate;
    const endDate = DateTime.now().minus({ days: 1, hours: 12 });

    if (timeframe === "1y") {
        startDate = DateTime.now().minus({ years: 1 });
    }

    if (timeframe === "6m") {
        startDate = DateTime.now().minus({ months: 6 });
    }

    if (timeframe === "1m") {
        startDate = DateTime.now().minus({ months: 1 });
    }

    if (timeframe === "1w") {
        startDate = DateTime.now().minus({ weeks: 1 });
    }

    return [startDate!.toISODate()!, endDate.toISODate()!];
};

export const convertCurrency = async ({ rates, from = "USD", to = "USD" }: { rates: number[]; from?: CurrencyType; to?: CurrencyType }) => {
    const res = await Promise.all(rates.map(r => {
        return fetch(ApiRoutes.ExchangeRate.Convert(from, to, r));
    }));

    const data = await Promise.all(res.map(r => r.json()));
    return data.map(d => d.result) as number[];
};