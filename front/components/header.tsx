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
    const editingDeckId = useDeckStore((s) => s.editingDeckId);

    // ページが変わったらハンバーガーメニューを閉じる
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

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
        if (editingDeckId && pathname.startsWith("/categories")) return "🔴デッキ編集中";
        if (pathname === "/") return "ホーム";
        if (pathname === "/menu") return "メニュー";
        if (/^\/categories\/\d+\/cards\/\d+\/edit$/.test(pathname)) return "カード 編集";
        if (pathname.startsWith("/categories") && pathname.includes("/cards")) return "カード 一覧";
        if (pathname.startsWith("/create-cards")) return "カード 作成";
        if (pathname.startsWith("/categories/") && pathname.includes("create")) return "カテゴリー 作成";
        if (pathname.startsWith("/categories/") && pathname.includes("edit")) return "カテゴリー 編集";
        if (pathname.startsWith("/categories")) return "カテゴリー 一覧";
        if (pathname.startsWith("/decklist")) return "デッキ 一覧";
        if (pathname.startsWith("/guide")) return "使い方ガイド";
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

                {/* 前のページに戻るボタン：ホーム画面以外でボタンを表示 */}
                {pathname !== "/" && (
                    <button onClick={() => router.back()}>
                        <Image
                            src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/back.svg"
                            alt="前のページへ戻る"
                            className="header-back"
                            width={30}
                            height={30}
                        />
                    </button>
                )}

                {/* タイトル表示 */}
                <h3 className="header-title">{getTitle()}</h3>

                {/* メニューボタン */}
                <button onClick={toggleMenu} className={`drawer__button ${menuOpen ? "active" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* メニュー外の黒背景だけをキャッチ */}
                {menuOpen && (
                    <div
                        className="drawer__overlay"
                        onClick={() => setMenuOpen(false)}
                    />
                )}

                {/* ナビ本体 */}
                <nav className={`drawer__nav ${menuOpen ? "active" : ""}`}>
                    <div className="drawer__nav__inner">
                        <ul className="drawer__nav__menu">
                            <li className="drawer__nav__item">
                                <h3>一覧</h3>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/menu-home.svg"
                                        alt="ホーム"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    ホーム
                                </Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/categories" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/menu-category.svg"
                                        alt="カテゴリー"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    カテゴリー 一覧</Link>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/decklist" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/menu-deck.svg"
                                        alt="デッキ一覧"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    デッキ一覧</Link>
                            </li>
                            <li className="drawer__nav__item nav-border">
                                <Link className="drawer__nav__link" href="/guide" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/instruction-blue.svg"
                                        alt="使い方ガイド"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    使い方ガイド</Link>
                            </li>

                            <li className="drawer__nav__item">
                                <h3>作成</h3>
                            </li>
                            <li className="drawer__nav__item">
                                <Link className="drawer__nav__link" href="/categories/create" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/menu-create.svg"
                                        alt="カテゴリー作成"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    カテゴリー作成
                                </Link>
                            </li>
                            <li className="drawer__nav__item nav-border">
                                <Link className="drawer__nav__link" href="/create-cards" onClick={() => setMenuOpen(false)}>
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/menu-create.svg"
                                        alt="カード作成"
                                        className="drawer__nav__icon"
                                        width={30}
                                        height={30}
                                    />
                                    カード作成</Link>
                            </li>


                            <li className="auth drawer__nav__item">
                                {isAuthenticated ? (
                                    <>
                                        <button onClick={handleLogout} className="drawer__nav__link logout-button">
                                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/logout.svg"
                                                alt="ログアウト" className="drawer__nav__icon"
                                                width={30} height={30} />
                                            ログアウト
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/signup">新規登録</Link>
                                        <Link href="/auth/login">ログイン</Link>
                                    </>
                                )}
                            </li>
                        </ul>
                        <div className="menu-bottom">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/ekadon.png" alt="えかどん" className="menu-ekadon" width={70} height={70} />
                            <p>&copy; 2025 ekadon.</p>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}