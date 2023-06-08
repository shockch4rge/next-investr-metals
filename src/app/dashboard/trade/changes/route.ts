import { MetalPriceChangeRateResponseSchema } from "@/apis/metals";
import type { MetalType, TradingTimeframe } from "@/contexts/TradingPreferences";
import { ApiRoutes } from "@/util/ApiRoutes";
import { calculateTimeframe } from "@/util/currencies";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const timeframe = searchParams.get("timeframe")! as TradingTimeframe;
    const metal = searchParams.get("metal")! as MetalType;

    const [startDate, endDate] = calculateTimeframe(timeframe);
    const res = await fetch(ApiRoutes.MetalPrice.Change(startDate, endDate, metal), {
        headers: {
            "X-API-KEY": process.env.METALPRICE_API_KEY!,
            "Content-Type": "application/json",
        },
    });

    const data = await MetalPriceChangeRateResponseSchema.parseAsync(await res.json());
    return NextResponse.json(data);
}