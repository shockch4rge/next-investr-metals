import { ExchangeRateResponseSchema } from "@/apis/currencies";
import { MetalPriceLatestResponseSchema } from "@/apis/metals";
import type { Transaction } from "@/apis/profile";
import { FidorTransferResponseSchema } from "@/apis/profile";
import type { TradingOptions } from "@/components/dashboard/TradingBox";
import type { MetalType, CurrencyType } from "@/contexts/TradingPreferences";
import { db } from "@/db/firebase";
import { ApiRoutes } from "@/util/ApiRoutes";
import { buildHeaders } from "@/util/buildHeaders";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const token = request.headers.get("Authorization")!.slice(7);
    const { accountId, ounces, currency, metal } = await request.json() as TradingOptions;

    const priceRes = await fetch(ApiRoutes.MetalPrice.Latest(metal), {
        headers: {
            "X-API-KEY": process.env.METALPRICE_API_KEY!,
            "Content-Type": "application/json",
        },
    });

    const priceData = await MetalPriceLatestResponseSchema.parseAsync(await priceRes.json());
    const price = priceData.rates.USD!;

    const totalPrice = ounces * price;
    const convertedPriceRes = await fetch(ApiRoutes.ExchangeRate.Convert(currency, "SGD", totalPrice));
    const convertedPrice = await ExchangeRateResponseSchema.parseAsync(await convertedPriceRes.json());

    const res = await fetch(ApiRoutes.Fidor.InternalTransfers, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify({
            external_uid: nanoid(),
            account_id: accountId,
            receiver: "studentA07@email.com",
            amount: Math.round(convertedPrice.result * 100),
            currency: "EUR",
            subject: `INVESTR-METALS - ${ounces} troy ounces of ${metal} at ${convertedPrice.result}`,
        }),
    });

    const transfer = await FidorTransferResponseSchema.parseAsync(await res.json());

    const document: Transaction = {
        ...transfer,
        account_id: accountId,
        ounces,
        metal,
        price,
        type: "buy",
        totalPrice: Math.round(totalPrice * 100),
    };

    await setDoc(doc(db, "transactions", transfer.id), document);
    return NextResponse.json(transfer);
}