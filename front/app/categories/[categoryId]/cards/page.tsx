"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CardData } from "@/app/types/card";
import Pagenation from "@/components/pagenation";
import CreateEdit from "@/components/create-edit-button";
import Deck from "@/components/deck";
import Card from "@/components/card";

export default function CardList() {
    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const { categoryId } = useParams();

    const handleSelectedCard = (card: CardData) => { // CardData型のオブジェクトのみ渡す
        setSelectedCards(prev => [...prev, card]);
        console.log(selectedCards);
    };

    // const handleRemoveCard = (idToRemove) => {
    //     setSelectedCards(prev => prev.filter(card => card.id !== idToRemove));
    // };

    const handleRemoveCard = (indexToRemove: number) => { // :numberで型安全
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
        console.log(indexToRemove);
    };


    return (
        <>
            <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateEdit
                            createHref="/create-cards"
                            editHref="/cards/edit"
                            createIcon="http://127.0.0.1:8000/storage/images/icons/create-card.svg"
                            editIcon="http://127.0.0.1:8000/storage/images/icons/edit-card.svg"
                        />
                    </div>
                    <div className="list-content">
                        <Card categoryId={categoryId} onSelectedCard={handleSelectedCard} />
                    </div>
                </div>
            </section>
        </>
    );
}