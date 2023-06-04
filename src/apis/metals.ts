import { z } from "zod";

// XAU -> gold
// XAG -> silver
// XPT -> platinum
// XPD -> palladium


export const MetalPriceSchema = z.record(z.string(), z.number());

export const MetalPriceResponseSchema = z.object({
    success: z.boolean(),
    base: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    rates: z.record(z.string(), MetalPriceSchema),
}).passthrough();

export type MetalPriceResponse = z.infer<typeof MetalPriceResponseSchema>;
export type MetalPrice = z.infer<typeof MetalPriceSchema>;