"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from 'axios';
// import Deck from "./deck";
// import List from "@/app/list/page";

export default function Card({ onSelectedCard }) {
    // const dummyCard = [{
    //     id: 1,
    //     name: "どうぶつどうぶつどうぶつ",
    //     image: "/assets/img/animal-bear.svg",
    // },
    // {
    //     id: 2,
    //     name: "ど",
    //     image: "/assets/img/icons/home.svg",
    // }
    // ];

    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/list-card");
                console.log(res.data);
                setCards(res.data);
            } catch (err) {
                console.error("カード取得エラー:", err);
            }
        };

        fetchCards();
    }, []);

    return (
        <>
            {cards.map((card, index) => (
                <button key={index} onClick={() => onSelectedCard(card)} className="card-wrap">
                    <Image src="../assets/img/card.svg" className="card" width={20} height={20} alt="card" />
                    <Image src={card.card_img} className="card-img" width={80} height={80} alt={card.name} />
                    <p className="card-name">{card.name}</p>
                </button>
            ))}
        </>
    );
}