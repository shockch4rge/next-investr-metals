import { TradingChart } from "@/components/dashboard/TradingChart";
import { Card, Grid, Subtitle, Title } from "@tremor/react";


export default function DashboardPage() {   
    return <>
        <main>
            <div className="container mx-auto">
                <Title className="font-bold text-2xl">Dashboard</Title>
                <Subtitle className="mt-1">View live trading data on various precious metals</Subtitle>
                <TradingChart />

                <Grid numColsMd={2} className="mt-6 gap-6">
                    <Card>
                        <div className="h-28" />
                    </Card>
                    <Card>
                        <div className="h-28" />
                    </Card>
                </Grid>
            </div>
        </main>
    </>;
}