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

export const FidorTransferSchema = z.object({
    id: z.string(),
    subject: z.string(),
    account_id: z.string(),
    user_id: z.string(),
    receiver: z.string(),
    recipient_name: z.string(),
    amount: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    currency: z.string(),
    transaction_id: z.string(),
    external_uid: z.string(),
}).passthrough();

export const TransactionSchema = FidorTransferSchema.extend({
    account_id: z.string(),
    metal: z.string(),
    ounces: z.number(),
    price: z.number(),
    totalPrice: z.number(),
    type: z.enum(["buy", "sell"] as const)
});

export const FidorTransferResponseSchema = FidorTransferSchema;

export const SaleSchema = z.object({
    id: z.string(),
    buyer_id: z.string(),
    seller_id: z.string(),
    ounces: z.number(),
    price: z.number(),
    metal: z.string(),
    status: z.enum(["pending", "approved"] as const),
    // do not mix with FidorTransactionSchema
    created_at: z.string(),
});

export type FidorAccountResponse = z.infer<typeof FidorAccountResponseSchema>;
export type FidorAccount = z.infer<typeof FidorAccountSchema>;
export type FidorTransactionsResponse = z.infer<typeof FidorTransactionsResponseSchema>;
export type FidorTransaction = z.infer<typeof FidorTransactionSchema>;
export type FidorTransferResponse = z.infer<typeof FidorTransferResponseSchema>;
export type FidorTransfer = z.infer<typeof FidorTransferSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Sale = z.infer<typeof SaleSchema>;