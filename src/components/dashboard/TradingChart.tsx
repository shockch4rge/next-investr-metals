"use client";

import { MetalPriceTimeframeResponseSchema } from "@/apis/metals";
import type { CurrencyType, MetalType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";
import { ApiRoutes } from "@/util/ApiRoutes";
import { convertCurrency, formatCurrency } from "@/util/currencies";
import { Card, AreaChart, Text, Metric, SelectBox, SelectBoxItem, Toggle, ToggleItem } from "@tremor/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

async function getMetalPrices({ timeframe, metal }: { metal: MetalType; timeframe: TradingTimeframe }) {
    const res = await fetch(`${ApiRoutes.Base}/dashboard/trade/prices?timeframe=${timeframe}&metal=${metal}`);
    const data = await res.json();
    return MetalPriceTimeframeResponseSchema.parseAsync(data);
}

export const TradingChart: React.FC = () => {
    const [localePrices, setLocalePrices] = useState<Array<{ date: string; Price: number }>>([]); 
    const { metalType, currency, setCurrency, timeframe, setTimeframe } = useTradingPreferences();    

    useEffect(() => {
        (async () => {
            const metalPrices = await getMetalPrices({ metal: metalType, timeframe, });
            const rates = Object.entries(metalPrices.rates);

            const convertedCurrencies = await convertCurrency({ 
                to: currency, 
                rates: rates.map(([_, r]) => r.USD!) 
            });

            setLocalePrices(
                rates.map(([date], i) => ({
                    date: DateTime.fromISO(date).toFormat("LLL dd"),
                    Price: convertedCurrencies[i],
                }))
            );
        })();
    }, [currency, metalType, timeframe]);

    return <>
        <Card>
            <Text>Current Price</Text>
            <div className="mt-1 flex space-x-4">
                <Metric>{metalType} {formatCurrency(localePrices.at(-1)?.Price ?? 0, currency)}</Metric>
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
                valueFormatter={value => formatCurrency(value, currency)}
            />
            <Toggle 
                className="mt-2 w-full flex justify-around" 
                defaultValue={timeframe}
                onValueChange={value => setTimeframe(value as TradingTimeframe)}
            >
                <ToggleItem className="w-full text-center justify-center" value="1y" text="1y"/>
                <ToggleItem className="w-full text-center justify-center" value="6m" text="6m"/>
                <ToggleItem className="w-full text-center justify-center" value="1m" text="1m"/>
                <ToggleItem className="w-full text-center justify-center" value="1w" text="1w"/>
            </Toggle>
        </Card>
    </>;
};