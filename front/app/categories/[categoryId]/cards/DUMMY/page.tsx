"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CardData } from "@/app/types/card";
import Deck from "@/components/deck";
import Card from "@/components/card";
import ParentList from "@/components/list-dummy";

export default function CardList() {
    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const handleSelectedCard = (card: CardData) => { // CardData型のオブジェクトのみ渡す
        setSelectedCards(prev => [...prev, card]);
        console.log(selectedCards);
    };

    const handleRemoveCard = (indexToRemove: number) => { // :numberで型安全
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
        console.log(indexToRemove);
    };


    return (
        <>
            <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} />
            <ParentList>
                <Card onSelectedCard={handleSelectedCard} />
            </ParentList>
        </>
    );
}