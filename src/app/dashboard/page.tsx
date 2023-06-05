import { Container } from "@/components/Container";
import { TradingAdvisor } from "@/components/dashboard/TradingAdvisor";
import { TradingBox } from "@/components/dashboard/TradingBox";
import { TradingChart } from "@/components/dashboard/TradingChart";
import { ChangePercentageMetricCard } from "@/components/dashboard/TradingMetrics";
import { Card, Col, Grid, Subtitle, Title } from "@tremor/react";

export default async function DashboardPage() {   
    return <>
        <main>
            <Container>
                <Title className="font-bold text-2xl">Dashboard</Title>
                <Subtitle className="mt-1 mb-6">View and trade precious metals using live data.</Subtitle>

                <div className="grid grid-cols-3 grid-rows-4 grid-flow-row-dense gap-6">
                    <div className="col-span-1 row-span-1">
                        <ChangePercentageMetricCard />
                    </div>
                    <div className="col-span-1 row-span-1">
                        <ChangePercentageMetricCard />
                    </div>
                    <div className="col-span-1 row-span-1">
                        <TradingBox />
                    </div>
                    <div className="col-span-2 row-span-1">
                        <TradingChart />
                    </div>
                    <div className="col-span-1 row-span-2">
                        <TradingAdvisor />
                    </div>
                </div>
            </Container>
        </main>
    </>;
}