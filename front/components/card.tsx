"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from 'axios';
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
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
    // onSelectedCard,
    editModeId,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onEdit,
    onConfirmDelete,
    deletedCardId
}: CardProps) {
    const [cards, setCards] = useState<CardData[]>([]); // CardDataの配列
    const addCard = useDeckStore((state) => state.addCard); // Zustandから追加

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await axios.get<CardData[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/cards`);
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
                    // onClick={() => onSelectedCard(card)}
                    onClick={() => addCard(card)}
                    onContextMenu={(e) => onContextMenu(e, card.id)}
                    onTouchStart={() => onTouchStart(card.id)}
                    onTouchEnd={onTouchEnd}
                >
                    <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/card.svg" className="card" width={20} height={20} alt="card" />
                    <Image
                        src={card.card_img}
                        alt={card.name}
                        width={80}
                        height={80}
                        className="card-img"
                        unoptimized
                    />
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