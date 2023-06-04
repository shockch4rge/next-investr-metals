import type { AuthOptions, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import type { OAuthConfig, Provider } from "next-auth/providers";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import type { JWT } from "next-auth/jwt";

export const FidorUrls = {
    Base: "https://api.tp.sandbox.fidorfzco.com",
    Authorization: "https://apm.tp.sandbox.fidorfzco.com/oauth/authorize",
    AccessToken: "https://apm.tp.sandbox.fidorfzco.com/oauth/token",
    RefreshToken: "https://apm.tp.sandbox.fidorfzco.com/oauth/token",
    CurrentUser: "https://apm.tp.sandbox.fidorfzco.com/users/current",
};

export const FidorProvider: OAuthConfig<any> = {
    id: "fidor",
    name: "Fidor",
    type: "oauth",
    version: "2.0",
    clientId: process.env.FIDOR_CLIENT_ID,
    clientSecret: process.env.FIDOR_CLIENT_SECRET,

    authorization: {
        url: FidorUrls.Authorization,
        params: {
            client_id: process.env.FIDOR_CLIENT_ID,
            redirect_uri: process.env.FIDOR_CALLBACK_URL,
            state: nanoid(10),
            response_type: "code",
        },
    },

    token: {
        request: async context => {
            const query = new URLSearchParams({
                grant_type: "authorization_code",
                code: context.params.code ?? "",
                redirect_uri: process.env.FIDOR_CALLBACK_URL,
                client_id: process.env.FIDOR_CLIENT_ID,
            }).toString();

            const res = await fetch(`${FidorUrls.AccessToken}?${query}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${Buffer.from(
                        `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
                    ).toString("base64")}`,
                },
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("cannot fetch tokens from fidor");
            }

            const data = await res.json();

            return {
                tokens: {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_at: DateTime
                        .now()
                        .plus({ seconds: data.expires_in })
                        .toMillis(),
                    state: data.state,
                }
            };
        }
    },

    userinfo: {
        request: async ({ tokens }) => {
            const res = await fetch(`${FidorUrls.Base}/users/current`, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${tokens.access_token}`,
                    "accept": "application/vnd.fidor.de; version=1,text/json",
                    "content-type": "application/json",
                },
                cache: "no-store",
            });

            const user = await res.json();
            return user;
        }
    },

    // TODO: which one is which?
    profile: async (profile, tokens) => {
        return {
            id: "helloworld",
            ...profile,
            ...tokens,
        };
    },
};

const refreshAccessToken = async (tokens: JWT) => {
    const query = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken!,
    }).toString();

    const res = await fetch(`${FidorUrls.RefreshToken}?${query}`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
            ).toString("base64")}`,
        },
    });

    const data = await res.json();

    return {
        ...tokens,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: DateTime.now()
            .plus({ seconds: data.expires_in })
            .toMillis(),
        state: data.state,
    };
};

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        FidorProvider,
    ],
    session: {
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = DateTime.now()
                    .plus({ seconds: account.expires_at })
                    .toMillis();
                token.userId = user.id;
                token.userEmail = user.email;
            }

            if (DateTime.now().toMillis() >= token.expiresAt!) {
                return refreshAccessToken(token);
            }

            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;
            session.user = {
                id: token.userId,
                email: token.userEmail,
            };

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };