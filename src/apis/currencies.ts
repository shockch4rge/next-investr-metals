import { z } from "zod";

export const ExchangeRateResponseSchema = z.object({
    result: z.number(),
}).passthrough();

export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;