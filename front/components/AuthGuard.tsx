"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

// ログインしていないユーザーが特定のページにアクセスできないようにする
const AuthGuard = ({ children }: Props) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/auth/login");
        }
    }, [router]);

    return <>{children}</>;
};

export default AuthGuard;
