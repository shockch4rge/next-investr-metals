"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/Container";
import { AppRoutes } from "@/util/AppRoutes";
import { DotsHorizontalIcon, UserCircleIcon } from "@heroicons/react/outline";
import { Button, Flex, SelectBox, SelectBoxItem, Title } from "@tremor/react";

import type { PropsWithChildren } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { MetalType } from "@/contexts/TradingPreferences";
import { useTradingPreferences } from "@/contexts/TradingPreferences";

export const NavBar: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    return <nav className="flex px-8 py-4 bg-white shadow-sm mb-5">
        <Container>
            <div className="flex justify-between">
                <div className="flex items-center space-x-10">
                    <Image
                        src="/investr-metals-logo.svg"
                        alt="logo"
                        priority
                        width={120}
                        height={80}
                    />
                    <div className="flex items-center space-x-6">
                        <NavLink href={AppRoutes.Dashboard()}>Dashboard</NavLink>
                        <NavLink href={AppRoutes.News()}>News</NavLink>
                        <NavLink href={AppRoutes.Explore()}>Explore</NavLink>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <MetalCategorySelect />
                    {session 
                        ? <Button icon={UserCircleIcon} onClick={() => router.push(AppRoutes.Profile())}>
                            Profile
                        </Button>
                        : <Button icon={UserCircleIcon} onClick={() => signIn()}>
                            Login
                        </Button>
                    }
                    {session && <Button onClick={() => signOut()}>Log Out</Button>}
                </div>
            </div>
        </Container>
    </nav>;
};

const NavLink: React.FC<PropsWithChildren<{ href: string }>> = ({ href, children }) => {
    const path = usePathname();

    return <Title className={`${path === href ? "font-bold" : ""} transition`}>
        <Link href={href} className="transition">
            {children}
        </Link>
    </Title>;
};

const MetalCategorySelect: React.FC = () => {
    const [isLoading, setLoading] = useState(false);
    const { metalType, setMetalType } = useTradingPreferences();

    return <SelectBox
        icon={isLoading ? DotsHorizontalIcon : undefined} 
        defaultValue={metalType}
        onValueChange={value => {
            setLoading(true);
            setMetalType(value as MetalType);
            setTimeout(() => setLoading(false), 1000);
        }}
    >
        <SelectBoxItem value="gold" text="Gold (XAU)"/>
        <SelectBoxItem value="silver" text="Silver (XAG)"/>
        <SelectBoxItem value="platinum" text="Platinum (XPL)" />
        <SelectBoxItem value="palladium" text="Palladium (XPD)"/>
    </SelectBox>;
};