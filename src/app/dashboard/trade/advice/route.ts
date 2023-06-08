import { ai } from "@/util/ai";
import { NextResponse } from "next/server";
import { tri } from "try-v2";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt")!;

    const [err, res] = await tri(ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    }));

    const response = res?.data.choices[0].message?.content;
    
    if (err || !response) {
        return NextResponse.json({
            response: "Sorry, I don't understand that."
        });
    }
    
    return NextResponse.json({
        response,
    });
}