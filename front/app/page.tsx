"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import CreateButton from "@/components/create-button";
import Deck from "@/components/deck";
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";
import Tooltip from '@/components/tooltip';

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
                    </div>
                    <div className="home-list">
                        <Tooltip content="えかどんの使い方">
                            <Link href={`/guide`} className="home-content home-inst">
                                <Image src="https://api.ekadon.com/storage/images/icons/instruction.svg" alt="使い方" className="home-list-img" width={70} height={70} />
                                <h3>使い方</h3>
                            </Link>
                        </Tooltip>
                        <Tooltip content="保存したマイリストを確認">
                            <Link href={`/decklist`} className="home-content home-deck">
                                <Image src="https://api.ekadon.com/storage/images/icons/deck-blue.svg" alt="マイリスト" className="home-list-img" width={70} height={70} />
                                <h3>マイリスト</h3>
                            </Link>
                        </Tooltip>
                        <Tooltip content="カテゴリー一覧からカードを選択">
                            <Link href={`/categories`} className="home-content home-cate">
                                <Image src="https://api.ekadon.com/storage/images/icons/category-blue.svg" alt="カテゴリー" className="home-list-img" width={70} height={70} />
                                <h3>カテゴリー</h3>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
            </section>
        </AuthGuard>
    );
}