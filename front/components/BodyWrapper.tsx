"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");

    return (
        <>
            {!isAuthPage && <Header selectedCards={[]} />}
            {children}
        </>
    );
}