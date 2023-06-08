import { z } from "zod";

// XAU -> gold
// XAG -> silver
// XPT -> platinum
// XPD -> palladium

export const lol = {
    "success": true,
    "base": "XAU",
    "start_date": "2021-04-22",
    "end_date": "2021-04-23",
    "rates": {
        "USD": {
            "start_rate": 1783.23371272,
            "end_rate": 1776.82044877,
            "change": -6.41326395,
            "change_pct": -0.3596
        }
    }
};

const CURRENCIES = ["SGD", "USD", "EUR"] as const;
const METALS = ["XAU", "XAG", "XPT", "XPD"] as const;

export const MetalPriceBaseSchema = z.object({
    success: z.boolean(),
    base: z.enum(METALS),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

export const MetalPriceTimeframeSchema = z.record(z.enum(CURRENCIES), z.number());

export const MetalPriceTimeframeResponseSchema = MetalPriceBaseSchema.extend({
    rates: z.record(z.string(), MetalPriceTimeframeSchema),
}).passthrough();

export const MetalPriceChangeRateSchema = z.object({
    start_rate: z.number(),
    end_rate: z.number(),
    change: z.number(),
    change_pct: z.number(),
});

export const MetalPriceChangeRateResponseSchema = MetalPriceBaseSchema.extend({
    rates: z.record(z.enum(CURRENCIES), MetalPriceChangeRateSchema),
});

export const MetalPriceLatestResponseSchema = MetalPriceBaseSchema.extend({
    rates: z.record(z.enum(CURRENCIES), z.number()),
});

export type MetalPriceResponse = z.infer<typeof MetalPriceTimeframeResponseSchema>;
export type MetalPrice = z.infer<typeof MetalPriceTimeframeSchema>;
export type MetalPriceChangeRate = z.infer<typeof MetalPriceChangeRateSchema>;