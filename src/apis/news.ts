import { z } from "zod";

export const NewsApiArticleSchema = z.object({
    source: z.object({
        id: z.string().nullable(),
        name: z.string(),
    }),
    author: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    url: z.string(),
    urlToImage: z.string().nullable(),
    publishedAt: z.string(),
    content: z.string(),
}).passthrough();

export const NewsApiResponseSchema = z.object({
    status: z.string(),
    totalResults: z.number(),
    articles: z.array(NewsApiArticleSchema),
}).passthrough();

export const AlphaVantageNewsArticleSchema = z.object({
    title: z.string(),
    url: z.string(),
    time_published: z.string(),
    authors: z.array(z.string()),
    summary: z.string(),
    banner_image: z.string(),
    source: z.string(),
    category_within_source: z.string(),
    source_domain: z.string(),
    topics: z.array(z.object({
        topic: z.string(),
        relevance_score: z.string(),
    })),
    overall_sentiment_score: z.number(),
    overall_sentiment_label: z.string(),
    ticker_sentiment: z.array(z.object({
        ticker: z.string(),
        relevance_score: z.string(),
        ticker_sentiment_score: z.string(),
        ticker_sentiment_label: z.string(),
    }))
}).passthrough();

export const AlphaVantageNewsResponseSchema = z.object({
    items: z.number(),
    sentiment_score_definition: z.string(),
    relevance_score_definition: z.string(),
    feed: z.array(AlphaVantageNewsArticleSchema)
}).passthrough();

export type NewsApiResponse = z.infer<typeof NewsApiResponseSchema>;
export type NewsApiArticle = z.infer<typeof NewsApiArticleSchema>;
export type AlphaVantageNewsResponse = z.infer<typeof AlphaVantageNewsResponseSchema>;
export type AlphaVantageNewsArticle = z.infer<typeof AlphaVantageNewsArticleSchema>;