"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "@/lib/api/axiosInstance"; // axiosInstance に認証処理済み
import { CategoryData } from "@/app/types/category"; // CategoryDataの型定義

type Category = CategoryData;

export default function Footer() {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                // page.tsx と同じ list-category エンドポイントを叩る
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/list-category`,
                    { headers: { Authorization: `Bearer ${token}` } }
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
                    const target = `/categories/${cat.id}/cards`;
                    return (
                        <Link
                            key={cat.id}
                            href={target}
                            className={`footer-link${pathname === target ? " active" : ""}`}
                        >
                            <img
                                src={cat.category_img}
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
