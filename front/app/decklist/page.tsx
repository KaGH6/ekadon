"use client";

import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/api/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDecks } from "@/lib/api/deck"; // API ユーティリティ
import Breadcrumbs from "@/components/breadcrumbs"; // パンくず
import CreateButton from "@/components/create-button"; // 作成ボタン
import Deck from "@/components/deck"; // 現在のデッキ表示
import { useDeckStore } from "@/store/deckStore"; // Zustand ストア
import AuthGuard from "@/components/AuthGuard"; // 認証ガード
import type { DeckType } from "@/lib/api/deck"; // デッキ型定義

// 型定義（API レスポンスに合わせて調整）
type CardData = {
    id: number;
    name: string;
    card_img: string;
    category_id: number;
    user_id: number;
};
type DeckData = {
    id: number;
    name: string;
    image_url: string | null;
    cards: CardData[];
};

export default function DeckListPage() {
    // const [decks, setDecks] = useState([]);
    const [decks, setDecks] = useState<DeckData[]>([]);
    const [editModeId, setEditModeId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const clearDeck = useDeckStore((s) => s.clearDeck);
    const addCard = useDeckStore((s) => s.addCard);
    const setIsSaved = useDeckStore((s) => s.setIsSaved);
    const setEditingDeckId = useDeckStore((s) => s.setEditingDeckId);
    const setBackupDeck = useDeckStore((s) => s.setBackupDeck);

    // Saved Deck 一覧を取得
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchDecks();
                setDecks(data);
            } catch (err) {
                console.error("デッキ一覧取得失敗:", err);
            }
        })();
    }, []);

    // 右クリック・長押しで編集メニューを出す
    const handleContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setEditModeId(id);
    };
    const handleTouchStart = (id: number) => {
        longPressTimer.current = setTimeout(() => setEditModeId(id), 600);
    };
    const handleTouchEnd = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };

    // 編集・削除メニュー以外をクリックしたら閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // .edit-delete-menu 内をクリックしたときは閉じない
            if (!target.closest(".edit-delete-menu")) {
                setEditModeId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 削除確定
    const handleDelete = async () => {
        if (confirmDeleteId == null) return;
        try {
            // axiosInstance はデフォルトで Authorization & withCredentials を付与
            await axiosInstance.delete(`/decks/${confirmDeleteId}`);

            // フロントのリストも即時に更新
            setDecks((prev) => prev.filter((d) => d.id !== confirmDeleteId));
            setEditModeId(null);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("デッキ削除失敗:", err);
        }
    };

    // デッキを選択してストアにセット
    const handleSelect = (deck: DeckData) => {
        clearDeck();
        deck.cards.forEach((c) => addCard(c));
        setIsSaved(true); // デッキを保存済みにする
    };

    return (
        <AuthGuard>
            {/* 現在のデッキを常に表示 */}
            <Deck />

            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Breadcrumbs />
                    </div>

                    {/* デッキ一覧 */}
                    <div id="deck-list" className="list-content">
                        {decks.map((d) => (
                            <div
                                key={d.id}
                                className="list-item"
                                onClick={() => handleSelect(d)}
                                onContextMenu={(e) => handleContextMenu(e, d.id)}
                                onTouchStart={() => handleTouchStart(d.id)}
                                onTouchEnd={handleTouchEnd}
                            >
                                <button
                                    className="option-button"
                                    onClick={e => {
                                        e.stopPropagation(); // 親の onClick／onTouch をキャンセル
                                        setEditModeId(d.id); // 編集モード on
                                    }}
                                >
                                    <img src="https://api.ekadon.com/storage/images/icons/option.svg" alt="option" />
                                </button>
                                <div className="list-link">
                                    <Image
                                        src="https://api.ekadon.com/storage/images/icons/deck.svg"
                                        width={80}
                                        height={80}
                                        alt="デッキ枠"
                                        className="decklist-icon"
                                    />
                                    {d.image_url && (
                                        <Image
                                            src={d.image_url}
                                            width={80}
                                            height={80}
                                            alt={d.name}
                                            className="decklist-img"
                                            unoptimized
                                        />
                                    )}
                                    <p className="list-name">{d.name}</p>
                                </div>

                                {/* 編集・削除 */}
                                {editModeId === d.id && (
                                    <div className="edit-delete-menu">
                                        <button
                                            onClick={() => {
                                                // 1. 編集前のカード配列をバックアップ
                                                setBackupDeck(d.cards);
                                                // 2. 既存のカードをストアにロード
                                                clearDeck();
                                                d.cards.forEach((c) => addCard(c));
                                                setIsSaved(false); // 再度編集→未保存扱いに
                                                setEditingDeckId(d.id); // どのデッキを編集中か保持
                                                // 3. カード選択画面へ
                                                router.push("/categories");
                                            }}
                                        >
                                            編集
                                        </button>
                                        <button onClick={() => setConfirmDeleteId(d.id)}>
                                            削除
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 削除確認モーダル */}
            {confirmDeleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>選択したマイリストを削除しますか？</p>
                        <div className="modal-buttons">
                            <button
                                className="cancel-btn"
                                onClick={() => setConfirmDeleteId(null)}
                            >
                                キャンセル
                            </button>
                            <button className="delete-btn" onClick={handleDelete}>
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    );
}
