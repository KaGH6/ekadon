"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

// ルートガード（認証ガード）
// ログインしていないユーザーが特定のページにアクセスできないようにする
const AuthGuard = ({ children }: Props) => {
    const router = useRouter();
    const [checked, setChecked] = useState(false); // トークンチェック完了フラグ

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // 安全性UP。ブラウザで動いてるときのみlocalStorageを使い、そうでないときはnullにする。

        if (!token) {
            router.push("/auth/login");
        } else {
            setChecked(true); // トークンがあれば表示許可
        }
    }, [router]);

    if (!checked) return null; // チェック中は何も表示しない（ちらつき防止）

    return <>{children}</>;
};

export default AuthGuard;
