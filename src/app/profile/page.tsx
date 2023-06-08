import { Container } from "@/components/Container";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Bold, Button, Callout, Col, Divider, Flex, Grid, Metric, Subtitle, Text, Title } from "@tremor/react";
import { authOptions } from "../auth/[...nextauth]/route";
import { buildHeaders } from "@/util/buildHeaders";
import { getServerSession } from "next-auth";
import type { FidorTransaction, Transaction } from "@/apis/profile";
import { FidorAccountResponseSchema, FidorTransactionsResponseSchema, TransactionSchema } from "@/apis/profile";
import { formatCurrency } from "@/util/currencies";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { tri } from "try-v2";
import { DateTime } from "luxon";
import { ApiRoutes } from "@/util/ApiRoutes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { AppRoutes } from "@/util/AppRoutes";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { SignoutButton } from "@/components/profile/SignoutButton";


async function getAccount(token: string) {
    const res = await fetch(ApiRoutes.Fidor.Accounts, {
        headers: buildHeaders(token),
    });

    const data = await res.json();
    const [err, account] = await tri(FidorAccountResponseSchema.parseAsync(data));

    if (err) {
        throw new Error("Malformed request for Fidor account data");
    }

    return account.data[0];
}

async function getTransactions(token: string) {
    const res = await fetch(ApiRoutes.Fidor.Transactions, {
        headers: buildHeaders(token),
    });

    const data = await FidorTransactionsResponseSchema.parseAsync(await res.json());
    const transactions: Transaction[] = [];

    for (const transaction of data.data.filter(transactionFilter)) {
        const snap = await getDoc(
            doc(db, "transactions", transaction.transaction_type_details.internal_transfer_id)
        );

        if (!snap.exists()) continue;

        transactions.push(await TransactionSchema.parseAsync(snap.data()));
    }
    return transactions;
}


function transactionFilter(transaction: FidorTransaction) {
    return /INVESTR-METALS/gm.test(transaction.subject);
}


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        redirect(AppRoutes.Dashboard());
    }
    
    const account = await getAccount(session.accessToken);
    const transactions = await getTransactions(session.accessToken);

    return <Container>
        <Title className="font-bold text-2xl">
            Account Info
        </Title>
        <Subtitle className="mt-1">
            View your account details, such as balance and previous transactions.
        </Subtitle>
        <div className="mt-8">
            <Title>Current Balance:</Title>
            <Metric>{formatCurrency((account.balance ?? 0) / 100, "USD")}</Metric>
        </div>

        {/* <SignoutButton /> */}

        <Divider /> 
        <Grid className="gap-4" numColsLg={5}>
            <Col numColSpanLg={2}>
                <Accordion>
                    <AccordionHeader>
                        Account Details
                    </AccordionHeader>
                    <AccordionBody>
                        <div className="mt-4">
                            <Title>Account ID</Title>
                            <Subtitle>{account.id}</Subtitle>
                        </div>

                        <div className="mt-4">
                            <Title>Account Number</Title>
                            <Subtitle>{account.account_number}</Subtitle>
                        </div>

                        <div className="mt-4">
                            <Title>IBAN</Title>
                            <Subtitle>{account.iban}</Subtitle>
                        </div>
                    </AccordionBody>
                </Accordion>
                

                <Callout className="mt-6" title={"Quick Note"} icon={InformationCircleIcon}>
                    As Investr has partnered with Fidor Bank for its services, this means that we do not have permission to edit your account information directly.
                    Please contact Fidor Bank or visit their website if you like to change your account details.
                </Callout>
            </Col>

            <Col numColSpanLg={3}>
                <Title className="mt-4 font-bold text-2xl">
                    Transactions
                </Title>

                <AccordionList className="mt-6">
                    {transactions.map(transaction => {
                        return <Accordion key={transaction.id}>
                            <AccordionHeader>
                                {transaction.subject}
                            </AccordionHeader>
                            <AccordionBody>
                                <Flex>
                                    <div>
                                        <div className="mt-4">
                                            <Title><Bold>Transaction ID</Bold></Title>
                                            <Text>{transaction.id}</Text>
                                        </div>

                                        <div className="mt-4">
                                            <Title><Bold>Recipient Name</Bold></Title>
                                            <Text>{transaction.recipient_name}</Text>
                                        </div>

                                        <div className="mt-4">
                                            <Title><Bold>Timestamp</Bold></Title>
                                            <Text>
                                                Created at: {DateTime.fromISO(transaction.created_at).toLocaleString(DateTime.DATETIME_MED)}
                                            </Text>
                                        </div>
                                    </div>
                                    {/* <ShareDistributionChart transaction={transaction} /> */}
                                </Flex>
                            </AccordionBody>
                        </Accordion>;
                    })}
                    
                </AccordionList>
                {/* <pre>{JSON.stringify(transactions, null, 2)}</pre> */}
            </Col>
        </Grid>

    </Container>;
}