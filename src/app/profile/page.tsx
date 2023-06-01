"use client";

import { Container } from "@/components/Container";
import { Tab, TabList } from "@tremor/react";

export default function ProfilePage() {
    return <Container>
        <TabList>
            <Tab value="balance" text="Balance"/>
            <Tab value="transactions" text="Transactions"/>
        </TabList>
    </Container>;
}