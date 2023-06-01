import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id?: string;
        };
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: DefaultSession["user"] & {
            id?: string;
        };
        userId?: string;
        userEmail?: string | null;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}