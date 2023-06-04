"use client";

import { ArrowSmRightIcon } from "@heroicons/react/outline";
import { Button, Icon, Subtitle } from "@tremor/react";
import Link from "next/link";

export const NewsArticleRedirectButton: React.FC<{ url: string }> = ({ url }) => {
    return <Link href={url} target="_blank" className="w-32 mt-6 flex items-center text-blue-400">
        <Subtitle className="text-blue-400">
            Read more
        </Subtitle>
        <Icon icon={ArrowSmRightIcon} />
    </Link>;
};