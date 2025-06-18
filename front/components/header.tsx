"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState } from "react";
import { CardData } from "@/app/types/card";
import { useRouter, usePathname } from "next/navigation";
// import "../../assets/css/sp.css";

type HeaderProps = {
    selectedCards: CardData[];
}

export default function Header({ selectedCards }: HeaderProps) { // selectedCards は CardData[] (カードデータの配列)として扱われる
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // 現在のパスを取得

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // タイトルをパスに応じて切り替える
    const getTitle = () => {
        if (pathname === "/") return "ホーム";
        if (pathname === "/menu") return "メニュー";
        if (pathname.startsWith("/categories") && pathname.includes("/cards")) return "カード 一覧";
        if (pathname.startsWith("/categories")) return "カテゴリー 一覧";
        if (pathname.startsWith("/checklists") && pathname.match(/^\/checklists\/\d+/)) return "チェックリスト詳細";
        if (pathname.startsWith("/checklists")) return "チェックリスト 一覧";
        return ""; // デフォルト
    };

    return (
        <header className="header">
            <div className="header__inner">

                {/* 前のページに戻るボタン */}
                <button onClick={() => router.back()}>
                    <Image src="https://ekadon.com/storage/images/icons/back.svg" alt="" className="header-back" width={30} height={30} />
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
                            <Link href="/auth/signup">新規登録（開発用）</Link>
                            <Link href="/auth/login">ログイン（開発用）</Link>
                            <Link href="/">ログアウト</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}