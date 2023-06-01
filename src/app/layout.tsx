import "./globals.css";
import { Inter } from "next/font/google";
import { z } from "zod";
import { OAuthSessionProvider } from "@/components/OAuthSessionProvider";
import { NavBar } from "@/components/NavBar";
import { TradingPreferencesProvider } from "@/contexts/TradingPreferences";

const inter = Inter({ 
    subsets: ["latin"], 
    display: "swap" 
});

export const metadata = {
    title: "Investr • Metals",
    description: "A trading website for precious metals",
};

export const envSchema = z.object({
    FIDOR_CLIENT_ID: z.string(),
    FIDOR_CLIENT_SECRET: z.string(),
    FIDOR_CALLBACK_URL: z.string(),
    NEWSAPI_API_KEY: z.string(),
});

envSchema.parse(process.env);

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <OAuthSessionProvider>
                    <TradingPreferencesProvider>
                        <NavBar />
                        {children}
                    </TradingPreferencesProvider>
                </OAuthSessionProvider>
            </body>
        </html>
    );
}
