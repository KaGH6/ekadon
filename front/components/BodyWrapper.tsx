"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");

    return (
        <>
            {!isAuthPage && <Header selectedCards={[]} />}
            {children}
            {!isAuthPage && <Footer />}
        </>
    );
}