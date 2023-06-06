import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";
import { z } from "zod";
import { OAuthSessionProvider } from "@/components/OAuthSessionProvider";
import { NavBar } from "@/components/NavBar";
import { TradingPreferencesProvider } from "@/contexts/TradingPreferences";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ 
    subsets: ["latin"], 
    display: "swap" 
});

export const metadata = {
    title: "Investr • Metals",
    description: "A trading website for precious metals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextTopLoader />
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
