"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from 'axios';
import { CardData } from "@/app/types/card";
// import Deck from "./deck";
// import List from "@/app/list/page";

type CardProps = {
    categoryId: string;
    onSelectedCard: (card: CardData) => void;
    editModeId: number | null;
    onContextMenu: (e: React.MouseEvent, id: number) => void;
    onTouchStart: (id: number) => void;
    onTouchEnd: () => void;
    onEdit: (id: number) => void;
    onConfirmDelete: (id: number) => void;
    deletedCardId: number | null;
}

export default function Card({
    categoryId,
    onSelectedCard,
    editModeId,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onEdit,
    onConfirmDelete,
    deletedCardId
}: CardProps) {
    const [cards, setCards] = useState<CardData[]>([]); // CardDataの配列

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await axios.get<CardData[]>(`http://127.0.0.1:8000/api/categories/${categoryId}/cards`);
                console.log(res.data);
                setCards(res.data);
            } catch (err) {
                console.error("カード取得エラー:", err);
            }
        };

        if (categoryId) fetchCards();
    }, [categoryId]);

    // 削除IDが来たらそのカードだけ除外する
    useEffect(() => {
        if (deletedCardId !== null) {
            setCards(prev => prev.filter(card => card.id !== deletedCardId));
        }
    }, [deletedCardId]);

    return (
        <>
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="card-wrap"
                    onClick={() => onSelectedCard(card)}
                    onContextMenu={(e) => onContextMenu(e, card.id)}
                    onTouchStart={() => onTouchStart(card.id)}
                    onTouchEnd={onTouchEnd}
                >
                    <Image src="https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/card.svg" className="card" width={20} height={20} alt="card" />
                    <Image src={card.card_img.startsWith("http") ? card.card_img : `/assets/images/${card.card_img}`} className="card-img" width={80} height={80} alt={card.name} />
                    <p className="card-name">{card.name}</p>

                    {editModeId === card.id && (
                        <div className="edit-delete-menu">
                            <button onClick={() => onEdit(card.id)}>編集</button>
                            <button onClick={() => onConfirmDelete(card.id)}>削除</button>
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}