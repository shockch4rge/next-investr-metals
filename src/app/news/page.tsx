import { Container } from "@/components/Container";
import type { AlphaVantageNewsResponse, NewsApiArticle, NewsApiResponse } from "@/apis/news";
import { Flex, Legend, Subtitle, Tab, TabList, Title } from "@tremor/react";
import { nanoid } from "nanoid";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import type { SentimentType } from "@/contexts/NewsPreferences";
import { DateTime } from "luxon";
import type { TradingTimeframe } from "@/contexts/TradingPreferences";
import { calculateTimeframe } from "@/util/currencies";

async function getAlphaVantageNews(currency: "monthly" | "weekly") {
    const time = (currency === "weekly" ? DateTime.now().minus({ days: 7 }): DateTime.now().minus({ weeks: 4 })).toISO({ 
        format: "basic", 
        suppressSeconds: true,
        suppressMilliseconds: true,
        includePrefix: true,
        includeOffset: false,
    });

    const res = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=balldwodwjkod`);
    const data = await res.json() as AlphaVantageNewsResponse;

    return data.feed;
}


async function getNewsApiNews(timeframe: TradingTimeframe) {
    const [startDate, endDate] = calculateTimeframe(timeframe);

    const res = await fetch(`https://newsapi.org/v2/everything?q=metals&language=en&from=${startDate}&to=${endDate}`, {
        headers: {
            "X-Api-Key": process.env.NEWSAPI_API_KEY
        }
    });

    const data = await res.json() as NewsApiResponse;
    return data.articles;
}

export default async function NewsPage() {
    const avNews = await getAlphaVantageNews("monthly");
    const naNews = await getNewsApiNews("1m");
    
    return <Container className="pb-12">
        <Title className="font-bold text-2xl">News</Title>
        <Flex justifyContent="between">
            <Subtitle className="mt-1">Stay up to date on the latest metal trading news.</Subtitle>
            <Legend 
                colors={["green", "gray", "red"]}    
                categories={[
                    "Bullish",
                    "Neutral",
                    "Bearish",
                ]} 
            />
        </Flex>
        <TabList className="my-6" defaultValue="1w">
            <Tab value="1w" text="Past week" />
            <Tab value="1m" text="Past month" />
        </TabList>
        <section className="mt-1 flex flex-col space-y-4">
            {avNews.map(article => 
                <NewsArticleCard
                    key={nanoid()}
                    title={article.title} 
                    description={article.summary}
                    url={article.url} 
                    timestamp={article.time_published}
                    sentiment={article.overall_sentiment_label as SentimentType} 
                />
            )}
            {naNews.map(article => 
                <NewsArticleCard
                    key={nanoid()}
                    title={article.title} 
                    description={article.description}
                    timestamp={article.publishedAt}
                    url={article.url} 
                />
            )}
        </section>

    </Container>;
}