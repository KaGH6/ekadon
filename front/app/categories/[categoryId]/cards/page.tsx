"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardData } from "@/app/types/card";
import Pagenation from "@/components/pagenation";
import CreateEdit from "@/components/create-button";
import Deck from "@/components/deck";
import Card from "@/components/card";
import axios from "axios";
import AuthGuard from "@/components/AuthGuard";

export default function CardList() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const [editModeId, setEditModeId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [deletedCardId, setDeletedCardId] = useState<number | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const { categoryId } = useParams();
    const router = useRouter();

    // カード一覧取得
    useEffect(() => {
        const fetchCards = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("トークンがありません（未ログイン）");
                return;
            }

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/cards`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log("取得したカード一覧:", res.data);
                setCards(res.data); // ステートに保存
            } catch (error) {
                console.error("カード取得エラー:", error);
            }
        };

        fetchCards();
    }, [categoryId]);


    // カード選択
    const handleSelectedCard = (card: CardData) => { // CardData型のオブジェクトのみ渡す
        setSelectedCards(prev => [...prev, card]);
        console.log(selectedCards);
    };

    // const handleRemoveCard = (idToRemove) => {
    //     setSelectedCards(prev => prev.filter(card => card.id !== idToRemove));
    // };

    // デッキからカード削除
    const handleRemoveCard = (indexToRemove: number) => { // :numberで型安全
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
        console.log(indexToRemove);
    };

    // カード編集ボタン
    const handleEdit = (id: number) => {
        router.push(`/categories/${categoryId}/cards/${id}/edit`);
    };

    // カード削除機能
    const handleDelete = async () => {
        if (confirmDeleteId === null) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("ログイン情報が見つかりません。再度ログインしてください。");
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cards/${confirmDeleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCards(prev => prev.filter(card => card.id !== confirmDeleteId));
            setSelectedCards(prev => prev.filter(card => card.id !== confirmDeleteId)); // デッキ側も更新
            setDeletedCardId(confirmDeleteId);
            setEditModeId(null);
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("削除エラー:", err);
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
            {/* <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} /> */}
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateEdit
                            createHref="/create-cards"
                            createIcon="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/create-card.svg"
                        />
                    </div>
                    <div className="list-content">
                        <Card
                            cards={cards}
                            categoryId={categoryId as string}
                            onSelectedCard={handleSelectedCard}
                            editModeId={editModeId}
                            onContextMenu={handleContextMenu}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onEdit={handleEdit}
                            onConfirmDelete={setConfirmDeleteId}
                            deletedCardId={deletedCardId}
                        />
                    </div>
                </div>
            </section>

            {confirmDeleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>選択したカードを削除しますか？</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>キャンセル</button>
                            <button className="delete-btn" onClick={handleDelete}>削除</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    );
}