"use client";

import type { MetalPriceChangeRate } from "@/apis/metals";
import { MetalPriceChangeRateResponseSchema } from "@/apis/metals";
import type { CurrencyType, MetalType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";
import { ApiRoutes } from "@/util/ApiRoutes";
import { calculateTimeframe, convertCurrency, formatCurrency } from "@/util/currencies";
import { CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/outline";
import { Badge, BadgeDelta, Card, Flex, Icon, Metric, Subtitle, Text } from "@tremor/react";
import { useEffect, useState } from "react";

async function getPriceChanges({ metal, timeframe }: { metal: MetalType; timeframe: TradingTimeframe }) {
    const res = await fetch(`${ApiRoutes.Base}/dashboard/trade/changes?timeframe=${timeframe}&metal=${metal}`);
    const data = await res.json();
    return MetalPriceChangeRateResponseSchema.parseAsync(data);
}

export const ChangePercentageMetricCard = () => {
    const [localePrices, setLocalePrices] = useState<MetalPriceChangeRate>({
        start_rate: 0,
        change: 0,
        change_pct: 0,
        end_rate: 0
    });
    const { currency, metalType, timeframe } = useTradingPreferences();

    useEffect(() => {
        (async () => {
            const { rates: { USD: priceChanges } } = await getPriceChanges({ metal: metalType, timeframe });
            const [startRate, endRate] = await convertCurrency({ 
                to: currency,
                rates: [priceChanges!.start_rate, priceChanges!.end_rate] 
            });

            setLocalePrices({
                ...priceChanges!,
                start_rate: startRate,
                end_rate: endRate
            });
        })();
    }, [currency, metalType, timeframe]);

    return <Card decoration="left" decorationColor="emerald">
        <Flex
            justifyContent="evenly"
            alignItems="center"
            className="truncate space-x-4"
        >
            <Icon color="emerald" variant="light" size="xl" icon={PresentationChartLineIcon}/>
            <div className={localePrices.end_rate > 0 ? "" : "w-48"}>
                <Flex alignItems="center">
                    <Text>Profit</Text>
                    <BadgeDelta deltaType={localePrices.change_pct < 0 ? "moderateDecrease" : "moderateIncrease"}>
                        {Math.abs(localePrices.change_pct).toFixed(2)}%
                    </BadgeDelta>
                </Flex>
                <Flex className="space-x-4 items-baseline">
                    <Metric>{formatCurrency(localePrices.end_rate, currency)}</Metric>
                    <Text className="truncate">from {formatCurrency(localePrices.start_rate, currency)}</Text>
                </Flex>
            </div>

        </Flex>
    </Card>;
};