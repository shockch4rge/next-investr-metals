import { z } from "zod";

export const FidorPaginationSchema = z.object({
    current_page: z.number(),
    per_page: z.number(),
    total_entries: z.number(),
    total_pages: z.number(),
}).passthrough();

export const FidorAccountSchema = z.object({
    id: z.string(),
    account_number: z.string().nullable(),
    iban: z.string().nullable(),
    balance: z.number().nullable(),
    balance_available: z.number().nullable(),
    bic: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    nick: z.string(),
}).passthrough();

export const FidorAccountResponseSchema = z.object({
    data: z.array(FidorAccountSchema),
    collection: FidorPaginationSchema,
});

export const FidorTransactionSchema = z.object({
    id: z.string(),
    account_id: z.string(),
    transaction_type: z.string(),
    subject: z.string(),
    amount: z.number(),
    currency: z.string(),
    booking_date: z.string(),
    value_date: z.string(),
    booking_code: z.string(),
    return_transaction_id: z.string(),
    transaction_type_details: z.object({
        internal_transfer_id: z.string(),
        remote_account_id: z.string(),
        remote_name: z.string(),
        remote_nick: z.string(),
        remote_subject: z.string(),
        recipient: z.string(),
        recipient_name: z.string(),
    }).passthrough(),
    created_at: z.string(),
    updated_at: z.string(),
}).passthrough();

export const FidorTransactionsResponseSchema = z.object({
    data: z.array(FidorTransactionSchema),
    collection: FidorPaginationSchema,
});

export type FidorAccountResponse = z.infer<typeof FidorAccountResponseSchema>;
export type FidorAccount = z.infer<typeof FidorAccountSchema>;
export type FidorTransactionsResponse = z.infer<typeof FidorTransactionsResponseSchema>;
export type FidorTransaction = z.infer<typeof FidorTransactionSchema>;