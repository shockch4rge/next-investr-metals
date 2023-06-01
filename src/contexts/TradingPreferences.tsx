"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type MetalType = "gold" | "palladium" | "platinum" | "silver";
export type CurrencyType = "eur" | "sgd" | "usd";

interface State {
    metalType: MetalType;
    currency: CurrencyType;
    setMetalType: (value: MetalType) => void;
    setCurrency: (value: CurrencyType) => void;
}

const initialState = {
    metalType: "gold",
    currency: "sgd",
    // dummy function
    setMetalType: () => {},
    setCurrency: () => {},
} satisfies State;

export const TradingPreferencesContext = createContext<State>(initialState);

export const TradingPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [currency, setCurrency] = useState<CurrencyType>(initialState.currency);
    const [metalType, setMetalType] = useState<MetalType>(initialState.metalType);

    return <TradingPreferencesContext.Provider value={{ currency, setCurrency, setMetalType, metalType }}>
        {children}
    </TradingPreferencesContext.Provider>;
};

export const useTradingPreferences = () => useContext(TradingPreferencesContext);