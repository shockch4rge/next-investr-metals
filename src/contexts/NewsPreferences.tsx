"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type SentimentType = "Bearish" | "Bullish" | "Neutral" | "None";

interface State {
    preferredSentiment: SentimentType;
    setPreferredSentiment: (value: SentimentType) => void;
}

const initialState = {
    preferredSentiment: "None",
    setPreferredSentiment: () => {},
} satisfies State;

export const NewsPreferencesContext = createContext<State>(initialState);

export const NewsPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [preferredSentiment, setPreferredSentiment] = useState<SentimentType>(initialState.preferredSentiment);

    return <NewsPreferencesContext.Provider value={{ preferredSentiment, setPreferredSentiment }}>
        {children}
    </NewsPreferencesContext.Provider>;
};

export const useNewsPreferences = () => useContext(NewsPreferencesContext);