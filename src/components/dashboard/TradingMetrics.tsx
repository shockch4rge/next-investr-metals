"use client";

import type { CurrencyType, MetalType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";
import { calculateTimeframe, matchCurrencyType } from "@/util/currencies";
import { CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/outline";
import { Badge, BadgeDelta, Card, Flex, Icon, Metric, Subtitle, Text } from "@tremor/react";
import { useEffect, useState } from "react";

export const lol ={ 
    "success": true, 
    "base":"XAU", 
    "start_date":"2021-04-22", 
    "end_date":"2021-04-23", 
    "rates":{ 
        "USD":{ 
            "start_rate": 1783.23371272, 
            "end_rate": 1776.82044877, 
            "change": -6.41326395, 
            "change_pct": -0.3596 
        } 
    } 
};

async function getPriceChanges({ metal, timeframe }: { metal: MetalType; timeframe: TradingTimeframe }) {
    const [startDate, endDate] = calculateTimeframe(timeframe);
    const url = `https://api.metalpriceapi.com/v1/change?start_date=${startDate}&end_date=${endDate}&base=${metal}&currencies=USD`;
    const res = await fetch(url, {
        headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_METALPRICE_API_KEY!,
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();
    return data;
}

export const ChangePercentageMetricCard = () => {
    const [priceMetrics, setPriceMetrics] = useState<any>(undefined);
    const { currency, metalType, timeframe } = useTradingPreferences();

    useEffect(() => {
        (async () => {
            // TODO: use currency exchange api too
            const priceChanges = await getPriceChanges({ metal: metalType, timeframe });
            console.log(priceChanges);

            setPriceMetrics(priceChanges.rates.USD);
        })();
    }, [currency, metalType, timeframe]);

    return <Card className="relative" decoration="left" decorationColor="emerald">
        <Flex
            justifyContent="evenly"
            alignItems="center"
            className="truncate space-x-4"
        >
            <Icon color="emerald" variant="light" size="xl" icon={PresentationChartLineIcon}/>
            {priceMetrics && 
                <div>
                    <Flex alignItems="center">
                        <Text>Profit</Text>
                        <BadgeDelta deltaType={priceMetrics.change_pct < 0 ? "moderateDecrease" : "increase"}>{Math.abs(priceMetrics.change_pct)}%</BadgeDelta>
                    </Flex>
                    <Flex className="space-x-4 items-baseline">
                        <Metric>{matchCurrencyType(priceMetrics.end_rate.toFixed(2), currency)}</Metric>
                        <Text className="truncate">from {matchCurrencyType(priceMetrics.start_rate.toFixed(2), currency)}</Text>
                    </Flex>
                </div>
            }

        </Flex>
    </Card>;
};