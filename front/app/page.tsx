"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import axios from 'axios';
import Breadcrumbs from "@/components/breadcrumbs";
import CreateButton from "@/components/create-button";
import Deck from "@/components/deck";
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
    const router = useRouter(); // ログインチェック
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // ログインチェック
    const [selectedCards, setSelectedCards] = useState<any[]>([]);

    // ログインチェック
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push("/auth/signup");
        }
    }, []);

    // ログイン判定中は描画しない（またはローディング表示）
    if (isAuthenticated === null) return null;

    //  特定のカードだけ削除
    const handleRemoveCard = (indexToRemove: number) => {
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    return (
        <AuthGuard>
            {/* <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} /> */}
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Breadcrumbs />
                        <CreateButton
                            createHref="/categories/create"
                            createIcon="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/create-category.svg"
                        />
                    </div>
                    <div className="home-list">
                        <Link href={`/categories`} className="home-content">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/checklist.svg" alt="チェックリスト" className="home-list-img" width={70} height={70} />
                            <h3>チェックリスト</h3>
                        </Link>
                        <Link href={`/categories`} className="home-content">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/card-category.svg" alt="カテゴリー" className="home-list-img" width={70} height={70} />
                            <h3>カテゴリー</h3>
                        </Link>
                    </div>
                </div>
            </section>
        </AuthGuard>
    );
}