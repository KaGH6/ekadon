"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "@/lib/api/axiosInstance"; // axiosInstance に認証処理済み

type Category = {
    id: number;
    name: string;
    icon_url: string;
};

export default function Footer() {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/list-category` /* page.tsx と同じ */, {
                    headers: { Authorization: `Bearer ${token}` },
                }
                );
                setCategories(res.data);
            } catch (e) {
                console.error("Footer カテゴリ取得失敗:", e);
            }
        })();
    }, []);

    return (
        <footer className="footer">
            <nav className="footer-nav">
                {/* ホームアイコン */}
                <Link
                    href="/"
                    className={`footer-link${pathname === "/" ? " active" : ""}`}
                >
                    <img
                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/home.svg"
                        alt="ホーム"
                        className="footer-icon"
                    />
                </Link>

                {/* カテゴリーアイコン群 */}
                {categories.map((cat) => {
                    // 遷移先パスを定義
                    const targetPath = `/categories/${cat.id}/cards`;
                    // アクティブ判定（必要に応じて startsWith を使ってもOK）
                    const isActive = pathname === targetPath;

                    return (
                        <Link
                            key={cat.id}
                            href={targetPath}
                            className={`footer-link${isActive ? " active" : ""}`}
                        >
                            <img
                                src={cat.icon_url}
                                alt={cat.name}
                                className="footer-icon"
                            />
                        </Link>
                    );
                })}
            </nav>
        </footer>
    );
}
