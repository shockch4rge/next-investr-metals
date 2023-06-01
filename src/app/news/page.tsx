import { Container } from "@/components/Container";
import { Card, Subtitle, Tab, TabList, Title } from "@tremor/react";
import { nanoid } from "nanoid";
import Image from "next/image";

interface NewsItem {
    title: string;
    description: string;
    url: string;
}


const news = [
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
    {
        title: "Gold price falls as US dollar strengthens",
        description: "The price of gold fell on Monday as the US dollar strengthened, making the precious metal more expensive for holders of other currencies.",
        url: "https://picsum.photos/id/237/536/354",
    },
];


export default function NewsPage() {
    return <Container>
        <Title className="font-bold text-2xl">News</Title>
        <Subtitle className="mt-1">Stay up to date on the latest metal trading news</Subtitle>
        <TabList className="my-6" defaultValue="1w">
            <Tab value="1w" text="Past week" />
            <Tab value="1m" text="Past month" />
        </TabList>
        <section className="mt-1 flex flex-col space-y-4">
            {news.map(item => 
                <Card key={nanoid()} decoration="left" decorationColor="amber">
                    <div>
                        <Title className="font-bold text-xl">{item.title}</Title>
                    </div>
                    <div>
                        <Subtitle className="mt-1">{item.description}</Subtitle>
                    </div>
                </Card>)}
        </section>

    </Container>;
}