"use client";

import { ApiRoutes } from "@/util/ApiRoutes";
import { ai } from "@/util/ai";
import { ChatIcon, InformationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { Accordion, AccordionBody, AccordionHeader, Bold, Button, Card, Flex, Icon, List, ListItem, Subtitle, Text, TextInput, Title } from "@tremor/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { useState } from "react";
import * as Yup from "yup";

async function promptChatGpt(text: string) {
    const res = await fetch(`${ApiRoutes.Base}/dashboard/trade/advice?prompt=${text}`);
    const data = await res.json() as { response: string };
    return data.response;
}

export const TradingAdvisor: React.FC = () => {
    const [prompts, setPrompts] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    return <Card className="overflow-y-auto">
        <Flex justifyContent="start" className="space-x-1">
            <Icon icon={ChatIcon} size="lg" />
            <Title className="font-bold">Trading Advisor</Title>
            <Icon 
                icon={InformationCircleIcon} 
                size="md" 
                color="blue" 
                tooltip="Powered by OpenAI's ChatGPT"
            />
        </Flex>

        <Accordion className="my-2">
            <AccordionHeader><Bold>Guidelines</Bold></AccordionHeader>
            <AccordionBody>
                <Text>
                    Ask the chatbot for tips and information about trading precious metals.
                    <br/>
                    <div className="mt-4">
                        <Bold>
                            Example prompts:
                        </Bold>
                        <List>
                            <ListItem >
                                <div>
                                    <Text>
                                        How are precious metals like gold, platinum and silver doing?
                                    </Text>
                                </div>
                            </ListItem>
                            <ListItem>
                                <Text>
                                    What are the most common symbols for precious metals?
                                </Text>
                            </ListItem>
                        </List>
                    </div>
                    
                </Text>
            </AccordionBody>
        </Accordion>

        <Formik 
            initialValues={{
                prompt: "",
            }}
            validationSchema={Yup.object({
                prompt: Yup.string()
                    .required("Cannot send an empty prompt.")
                    .max(100, "Prompt cannot be longer than 100 characters."),
            })}
            onSubmit={async ({ prompt }) => {
                const response = await promptChatGpt(prompt);
                setPrompts([...prompts, prompt]);
                setResponses([...responses, response]);
            }}
        >
            {({ errors, isSubmitting, isValid, touched, getFieldProps }) =>
                <Form name="prompt">
                    <TextInput 
                        {...getFieldProps("prompt")}
                        className="mt-6" 
                        placeholder="Ask something..." 
                        icon={QuestionMarkCircleIcon}
                        disabled={isSubmitting}
                        error={!isValid} 
                        errorMessage={errors.prompt} 
                    />
                    <Button className="mt-4" type="submit" size="sm" disabled={!isValid || !touched.prompt} loading={isSubmitting} loadingText="Submitting...">Submit</Button>
                </Form>
            }

        </Formik>

        {responses.length > 0 && 
            <div className="mt-6">
                <Subtitle className="mb-2 font-bold">Responses</Subtitle>
                {responses.map((response, i) => 
                    <>
                        <div>
                            <Bold>You: </Bold>
                            <Text key={nanoid()}>
                                {prompts[i]}
                            </Text>
                        </div>
                        <div className="mt-2">
                            <Bold>AI: </Bold>
                            <Text key={nanoid()}>
                                {response}
                            </Text>
                        </div>
                    </>
                )}
            </div>
        }

    </Card>;
};