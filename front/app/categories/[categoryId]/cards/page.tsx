"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardData } from "@/app/types/card";
import Breadcrumbs from "@/components/breadcrumbs";
import CreateEdit from "@/components/create-button";
import Deck from "@/components/deck";
import Card from "@/components/card";
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

export default function CardList() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const [editModeId, setEditModeId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deletedCardId, setDeletedCardId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const { categoryId } = useParams();
    const router = useRouter();

    // ログイン中のユーザーIDを取得 :contentReference[oaicite:0]{index=0}
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/user");
                setCurrentUserId(res.data.id);
            } catch (e) {
                console.error("ユーザー取得失敗:", e);
            }
        })();
    }, []);

    // カード一覧取得
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get<CardData[]>(
                    `/categories/${categoryId}/cards`
                );
                setCards(res.data);
            } catch (err) {
                console.error("カード取得エラー:", err);
            }
        })();
    }, [categoryId]);


    // カード選択
    const handleSelectedCard = (card: CardData) => { // CardData型のオブジェクトのみ渡す
        setSelectedCards(prev => [...prev, card]);
        console.log(selectedCards);
    };

    // デッキからカード削除
    const handleRemoveCard = (indexToRemove: number) => { // :numberで型安全
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
        console.log(indexToRemove);
    };

    const handleEdit = (id: number) => {
        router.push(`/categories/${categoryId}/cards/${id}/edit`);
    };

    const handleDelete = async () => {
        if (confirmDeleteId === null) return;
        try {
            await axios.delete(`/cards/${confirmDeleteId}`);
            setCards((prev) => prev.filter((c) => c.id !== confirmDeleteId));
        } catch (err) {
            console.error("削除エラー:", err);
        } finally {
            setDeletedCardId(confirmDeleteId);
            setEditModeId(null);
            setConfirmDeleteId(null);
        }
    };

    // 長押し・右クリックの管理
    const handleContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setEditModeId(id);
    };

    // スマホの長押し開始時
    const handleTouchStart = (id: number) => {
        longPressTimer.current = setTimeout(() => {
            setEditModeId(id);
        }, 600);
    };

    // 指を離したら長押しキャンセル
    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    // 編集・削除メニュー以外をクリックしたら閉じる
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".edit-delete-menu")) {
                setEditModeId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <AuthGuard>
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Breadcrumbs />
                        <CreateEdit
                            createHref="/create-cards"
                            createIcon="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/create-card.svg"
                            tooltip="カード作成"
                        />
                    </div>
                    <div className="list-content">
                        <Card
                            cards={cards}
                            categoryId={categoryId as string}
                            onSelectedCard={handleSelectedCard}
                            editModeId={editModeId}
                            onOptionButtonClick={(id: number) => setEditModeId(id)}
                            onContextMenu={handleContextMenu}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onEdit={handleEdit}
                            onConfirmDelete={setConfirmDeleteId}
                            deletedCardId={deletedCardId}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </section>

            {/* 削除確認モーダル（オーバーレイ外クリックで閉じる） */}
            {confirmDeleteId !== null && (
                <div
                    className="modal-overlay"
                    onClick={() => setConfirmDeleteId(null)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <p>
                            選択したカードを削除しますか？<br />
                            削除すると<b>カードは完全に削除</b>されます。
                        </p>
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