import type { CurrencyType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { DateTime } from "luxon";

export const matchCurrencyType = (price: number, currency: CurrencyType) => {
    return currency === "EUR" ? `€${Intl.NumberFormat("de").format(price)}` : `$${Intl.NumberFormat("us").format(price)}`;
};

export const calculateTimeframe = (timeframe: TradingTimeframe) => {
    let startDate = DateTime.now().minus({ days: 2 })
        .toISODate();
    const endDate = DateTime.now().minus({ days: 1, hours: 12 })
        .toISODate();

    if (timeframe === "1y") {
        startDate = DateTime
            .now()
            .minus({ years: 1 })
            .toISODate()!;
    }

    if (timeframe === "6m") {
        startDate = DateTime
            .now()
            .minus({ months: 6 })
            .toISODate()!;
    }

    if (timeframe === "1m") {
        startDate = DateTime
            .now()
            .minus({ months: 1 })
            .toISODate()!;
    }

    if (timeframe === "1w") {
        startDate = DateTime
            .now()
            .minus({ weeks: 1 })
            .toISODate();
    }

    return [startDate, endDate];
};