declare namespace NodeJS {
    interface ProcessEnv {
        readonly FIDOR_CLIENT_ID: string;
        readonly FIDOR_CLIENT_SECRET: string;
        readonly FIDOR_CALLBACK_URL: string;
        readonly NEWSAPI_API_KEY: string;
    }
}