import type { SentimentType } from "@/contexts/NewsPreferences";
import { Card, Title, Subtitle, Text, Icon } from "@tremor/react";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { ArrowSmRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { NewsArticleRedirectButton } from "./NewsArticleRedirectButton";

interface Props {
    title: string;
    description: string;
    url: string;
    timestamp: string;
    sentiment?: SentimentType;
}

const mapSentimentColor = (sentiment: string) => {
    switch (sentiment) {
        case "Bearish":
        case "Somewhat-Bearish":
            return "red";
        case "Bullish":
        case "Somewhat-Bullish":
            return "green";
        case "Neutral":
            return "gray";
        default:
            return "gray";
    }
};

export const NewsArticleCard: React.FC<Props> = ({ title, description, url, timestamp, sentiment = "None" }) => {
    return <Card key={nanoid()} decoration="left" decorationColor={mapSentimentColor(sentiment)}>
        <Text>{DateTime.fromISO(timestamp).toISODate()}</Text>
        <div>
            <Title className="mt-1 font-bold text-xl">{title}</Title>
        </div>
        <div>
            <Subtitle className="mt-1">{description}</Subtitle>
        </div>
        <NewsArticleRedirectButton url={url} />
    </Card>;
};