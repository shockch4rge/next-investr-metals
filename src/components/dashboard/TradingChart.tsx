"use client";

import { MetalPriceResponseSchema, type MetalPriceResponse, MetalPrice } from "@/apis/metals";
import type { CurrencyType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";
import { Card, AreaChart, TabList, Tab, Text, Metric, Subtitle, SelectBox, SelectBoxItem } from "@tremor/react";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";

async function getMetalPrices({ timeframe, metal }: { metal: "XAG" | "XAU" | "XPD" | "XPT"; timeframe: TradingTimeframe }) {
    let startDate = DateTime.now().minus({ days: 2 })
        .toISODate();
    const endDate = DateTime.now().minus({ days: 1 })
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
    
    const url = `https://api.metalpriceapi.com/v1/timeframe?start_date=${startDate}&end_date=${endDate}&base=${metal}&currencies=USD`;
    const res = await fetch(url, {
        headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_METALPRICE_API_KEY!,
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();

    return MetalPriceResponseSchema.parseAsync(data);
}

async function getConvertedCurrency({ currency, rates }: { currency: CurrencyType; rates: number[] }) {
    const res = await Promise.all(rates.map(r => {
        const url = `https://api.exchangerate.host/convert?from=USD&to=${currency}&amount=${r}&places=2`;
        return fetch(url);
    }));
    const data = await Promise.all(res.map(r => r.json()));
    return data as any[];
}


export const TradingChart: React.FC = () => {
    const [localePrices, setLocalePrices] = useState<Array<{ date: string; Price: number }>>([]); 
    const { metalType, currency, setCurrency, timeframe, setTimeframe } = useTradingPreferences();    

    const matchCurrencyType = (price: number) => {
        return currency === "EUR" ? `€${Intl.NumberFormat("de").format(price)}` : `$${Intl.NumberFormat("us").format(price)}`;
    };

    useEffect(() => {
        (async () => {
            const metalPrices = await getMetalPrices({ metal: metalType, timeframe, });
            const rates = Object.entries(metalPrices.rates);

            const convertedCurrencies = await getConvertedCurrency({ currency, rates: rates.map(([_, r]) => r.USD) });

            setLocalePrices(
                rates.map(([date], i) => ({
                    date: DateTime.fromISO(date).toFormat("LLL dd"),
                    Price: convertedCurrencies[i].result
                }))
            );
        })();
    }, [currency, metalType, timeframe]);

    return <>
        <Card>
            <Text>Current Price</Text>
            <div className="mt-1 flex space-x-4">
                <Metric>{matchCurrencyType(localePrices.at(-1)?.Price ?? 0)}</Metric>
                <SelectBox 
                    className="w-12"
                    defaultValue={currency} 
                    onValueChange={value => setCurrency(value as CurrencyType)}
                >
                    <SelectBoxItem value="SGD" text="SGD"/>
                    <SelectBoxItem value="USD" text="USD"/>
                    <SelectBoxItem value="EUR" text="EUR"/>
                </SelectBox>
            </div>

            <AreaChart
                className="mt-8"
                data={localePrices}
                index="date"
                showLegend={false}
                categories={["Price"]}
                colors={["indigo"]}
                valueFormatter={matchCurrencyType}
            />
            <TabList className="flex justify-evenly w-full" onValueChange={value => setTimeframe(value as TradingTimeframe)}>
                <Tab value="1y" text="1y"/>
                <Tab value="6m" text="6m"/>
                <Tab value="1m" text="1m"/>
                <Tab value="1w" text="1w"/>
                <Tab value="1d" text="1d"/>
            </TabList>
        </Card>
    </>;
};