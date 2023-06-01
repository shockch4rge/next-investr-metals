"use client";

import type { CurrencyType } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";
import { Card, AreaChart, TabList, Tab, Text, Metric, Subtitle, SelectBox, SelectBoxItem } from "@tremor/react";
import { useEffect, useState } from "react";

export const TradingChart: React.FC = () => {
    const actualPrice = 1977.74;

    const [price, setPrice] = useState(1977.74);
    const { metalType, currency, setCurrency } = useTradingPreferences();

    const chartdata = [
        {
            date: "Jan 22",
            "Trading Volume": 2890.23,
        },
        {
            date: "Feb 22",
            "Trading Volume": 2756.42,
        },
        {
            date: "Mar 22",
            "Trading Volume": 3322.87,
        },
        {
            date: "Apr 22",
            "Trading Volume": 3470.70,
        },
        {
            date: "May 22",
            "Trading Volume": 3475.15,
        },
        {
            date: "Jun 22",
            "Trading Volume": 3129.52,
        },
    ];

    useEffect(() => {
        fetch(`https://api.exchangerate.host/convert?from=USD&to=${currency.toUpperCase()}&amount=${actualPrice}&places=2`)
            .then(res => res.json())
            .then(data => setPrice(data.result));
    }, [currency]);

    const formatPrice = (price: number) => {
        // display either dollar or euro depending on the currency type
        return currency === "eur" ? `€${Intl.NumberFormat("de").format(price)}` : `$${Intl.NumberFormat("us").format(price)}`;
    };

    return <>
        <Card className="mt-6">
            <Text>Current Price</Text>
            <div className="mt-1 flex space-x-4">
                <Metric>{formatPrice(price)}</Metric>
                <SelectBox 
                    className="w-12"
                    defaultValue={currency} 
                    onValueChange={value => setCurrency(value as CurrencyType)}
                >
                    <SelectBoxItem value="sgd" text="SGD"/>
                    <SelectBoxItem value="usd" text="USD"/>
                    <SelectBoxItem value="eur" text="EUR"/>
                </SelectBox>
            </div>

            <AreaChart
                className="mt-4"
                data={chartdata}
                index="date"
                showLegend={false}
                categories={["Trading Volume"]}
                colors={["indigo"]}
                valueFormatter={formatPrice}
            />
            <TabList className="flex justify-evenly w-full">
                <Tab value="1y" text="1y"/>
                <Tab value="6m" text="6m"/>
                <Tab value="1m" text="1m"/>
                <Tab value="1w" text="1w"/>
                <Tab value="1d" text="1d"/>
            </TabList>
        </Card>
    </>;
};