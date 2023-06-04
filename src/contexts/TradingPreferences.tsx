"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type MetalType = "XAG" | "XAU" | "XPD" | "XPT";
export type CurrencyType = "EUR" | "SGD" | "USD";
export type TradingTimeframe = "1d" | "1m" | "1w" | "1y" | "6m";

interface State {
    metalType: MetalType;
    currency: CurrencyType;
    timeframe: TradingTimeframe;
    setMetalType: (value: MetalType) => void;
    setCurrency: (value: CurrencyType) => void;
    setTimeframe: (value: TradingTimeframe) => void;
}

const initialState = {
    metalType: "XAU",
    currency: "SGD",
    timeframe: "1w",
    // dummy functions
    setMetalType: () => {},
    setCurrency: () => {},
    setTimeframe: () => {},
} satisfies State;

export const TradingPreferencesContext = createContext<State>(initialState);

export const TradingPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currency, setCurrency] = useState<CurrencyType>(initialState.currency);
    const [metalType, setMetalType] = useState<MetalType>(initialState.metalType);
    const [timeframe, setTimeframe] = useState<TradingTimeframe>(initialState.timeframe);

    return <TradingPreferencesContext.Provider value={{ currency, setCurrency, timeframe, setTimeframe, setMetalType, metalType }}>
        {children}
    </TradingPreferencesContext.Provider>;
};

export const useTradingPreferences = () => useContext(TradingPreferencesContext);