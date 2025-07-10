"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { CardData } from "@/app/types/card";
import { useRouter, usePathname } from "next/navigation";
import { useDeckStore } from "@/store/deckStore";

type HeaderProps = {
    selectedCards: CardData[];
}

export default function Header({ selectedCards }: HeaderProps) { // selectedCards は CardData[] (カードデータの配列)として扱われる
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname(); // 現在のパスを取得

    // ログイン状態かどうかを真偽値（true/false）でisAuthenticatedにセット
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // タイトルをパスに応じて切り替える
    const getTitle = () => {
        if (pathname === "/") return "ホーム";
        if (pathname === "/menu") return "メニュー";
        if (pathname.startsWith("/categories") && pathname.includes("/cards")) return "カード 一覧";
        if (pathname.startsWith("/create-cards")) return "カード 作成";
        if (pathname.startsWith("/cards/") && pathname.includes("edit")) return "カード 編集";
        if (pathname.startsWith("/categories/") && pathname.includes("create")) return "カテゴリー 作成";
        if (pathname.startsWith("/categories/") && pathname.includes("edit")) return "カテゴリー 編集";
        if (pathname.startsWith("/categories")) return "カテゴリー 一覧";
        if (pathname.startsWith("/checklists") && pathname.match(/^\/checklists\/\d+/)) return "チェックリスト詳細";
        if (pathname.startsWith("/checklists")) return "チェックリスト 一覧";
        return ""; // デフォルト
    };

    // ログアウト処理
    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            localStorage.removeItem("token"); // JWTトークン削除
            setIsAuthenticated(false); // ログアウトボタン表示
            setMenuOpen(false);

            useDeckStore.getState().clearDeck(); // Zustandのdeckをリセット

            // ログイン画面へリダイレクト
            router.push("/auth/login");
        } catch (err) {
            console.error("ログアウト失敗", err);
            localStorage.removeItem("token"); // JWTトークン削除
            setIsAuthenticated(false); // ログアウトボタン表示
            setMenuOpen(false); // メニューを閉じる
            useDeckStore.getState().clearDeck(); // Zustandのdeckをリセット
            router.push("/auth/login"); // ログイン画面へリダイレクト
        }
    };

    if (isAuthenticated === null) return null; // Hydrationエラー防止

    return (
        <header className="header">
            <div className="header__inner">

                {/* 前のページに戻るボタン */}
                <button onClick={() => router.back()}>
                    <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/back.svg" alt="" className="header-back" width={30} height={30} />
                </button>

                {/* タイトル表示 */}
                <h3 className="header-title">{getTitle()}</h3>

                {/* メニューボタン */}
                <button onClick={toggleMenu} className={`drawer__button ${menuOpen ? "active" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`drawer__nav ${menuOpen ? "active" : ""}`}>
                    <div className="drawer__nav__inner">
                        <ul className="drawer__nav__menu">
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/">ホーム</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/categories">カテゴリー 一覧</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/categories/create">カテゴリー作成</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/create-cards">カード作成</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/">チェックリスト一覧</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/">チェックリスト作成</Link>
                            </li>
                        </ul>

                        <div className="auth">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/auth/signup">新規登録（開発用）</Link>
                                    <Link href="/auth/login">ログイン（開発用）</Link>
                                    <button onClick={handleLogout} className="drawer__nav__link">ログアウト</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/signup">新規登録</Link>
                                    <Link href="/auth/login">ログイン</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}