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
}

export default function Card({ categoryId, onSelectedCard }: CardProps) {
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

    return (
        <>
            {cards.map((card) => (
                <button key={card.id} onClick={() => onSelectedCard(card)} className="card-wrap">
                    <Image src="http://127.0.0.1:8000/storage/images/icons/card.svg" className="card" width={20} height={20} alt="card" />
                    <Image src={card.card_img} className="card-img" width={80} height={80} alt={card.name} />
                    <p className="card-name">{card.name}</p>
                </button>
            ))}
        </>
    );
}