"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export const OAuthSessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return <SessionProvider basePath="/auth">
        {children}
    </SessionProvider>;
};