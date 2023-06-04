"use client";

import { matchCurrencyType } from "@/util/currencies";
import { DonutChart } from "@tremor/react";

function parseSubject(subject: string) {
    const shares = subject.split(",");
    return shares.map(share => {
        const [ticker, count, price] = share.split("/");
        return {
            ticker,
            count: parseInt(count),
            price: parseInt(price),
        };
    });
}

export const ShareDistributionChart: React.FC<{ transaction: any }> = ({ transaction }) => {
    return <DonutChart 
        className="h-64"
        variant="donut" 
        index="ticker"
        category="price" 
        data={parseSubject(transaction.subject)}
        valueFormatter={value => matchCurrencyType(value, "us")}
    />;
};