"use client";

import { useTradingPreferences, type CurrencyType, type MetalType } from "@/contexts/TradingPreferences";
import { ApiRoutes } from "@/util/ApiRoutes";
import { CheckIcon, MinusIcon, PlusIcon, ScaleIcon } from "@heroicons/react/outline";
import { Bold, Button, Card, Flex, Icon, Metric, Text, TextInput, Title } from "@tremor/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";

export interface TradingOptions { 
    ounces: number; 
    metal: MetalType; 
    currency: CurrencyType; 
    token: string;
    accountId: string;
}

async function trade({ ounces, metal, currency, token, accountId }: TradingOptions) {
    const res = await fetch(`${ApiRoutes.Base}/dashboard/trade/buy`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            ounces,
            metal,
            currency,
            accountId,
        }),
    });
}

export const TradingBox: React.FC = () => {
    const { data: session } = useSession();
    const { currency, metalType } = useTradingPreferences();

    return <Card decoration="top" decorationColor="amber">
        <Title className="mb-4 font-bold text-xl">
            Trade ({metalType})
        </Title>

        {session 
            ? <>
                <Formik
                    initialValues={{ ounces: "0" }}
                    validationSchema={Yup.object().shape({
                        ounces: Yup.number()
                            .positive("Value must be positive")
                            .min(0.001, "Value must be greater than 0.0001"),
                    })}
                    onSubmit={async ({ ounces }) => {
                        await trade({
                            ounces: parseFloat(ounces),
                            metal: metalType,
                            currency,
                            accountId: session.user.id!,
                            token: session.accessToken!,
                        });
                        toast.success("Trade successful!", {
                            bodyStyle: {
                                fontFamily: "Inter",
                            },
                            draggable: true,
                            icon: <Icon icon={CheckIcon} size="md" color="green" />,
                            position: "bottom-right"
                        });
                    }}
                >
                    {({ errors, isValid, isSubmitting, getFieldProps }) => 
                        <Form name="ounces">
                            <label htmlFor="ounces">
                                <Bold>Quantity (troy oz.)</Bold>
                            </label>
                            <TextInput 
                                {...getFieldProps("ounces")!}
                                id="ounces"
                                className="mt-2" 
                                placeholder="e.g. 1.2345" 
                                icon={ScaleIcon} 
                                disabled={isSubmitting}
                                error={!isValid}
                                type={"number" as unknown as undefined}
                                errorMessage={errors.ounces}
                            />
                            <Button 
                                className="mt-4"
                                type="submit" 
                                size="sm"
                                disabled={!isValid} 
                                loading={isSubmitting}
                                loadingText="Purchasing..."
                            >
                                Purchase
                            </Button>
                        </Form>
                    }
                </Formik>
                
                <ToastContainer toastClassName="rounded-lg" />
            </>
            : <Text>Login to your Fidor Bank account to trade and sell precious metals!</Text>
        }
    </Card>;
};