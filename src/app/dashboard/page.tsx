import { Container } from "@/components/Container";
import { TradingBox } from "@/components/dashboard/TradingBox";
import { TradingChart } from "@/components/dashboard/TradingChart";
import { Card, Col, Grid, Subtitle, Title } from "@tremor/react";

export default async function DashboardPage() {   
    return <>
        <main>
            <Container>
                <Title className="font-bold text-2xl">Dashboard</Title>
                <Subtitle className="mt-1 mb-6">View live trading data on various precious metals.</Subtitle>

                <Grid numColsLg={4} className="gap-6">
                    <Col numColSpanLg={3}>
                        <TradingChart />
                    </Col>
                    <Col numColSpanLg={1}>
                        <TradingBox />
                    </Col>
                </Grid>

                <Grid numColsMd={2} className="mt-6 gap-6">
                    <Card>
                        <div className="h-28" />
                    </Card>
                    <Card>
                        <div className="h-28" />
                    </Card>
                </Grid>
            </Container>
        </main>
    </>;
}