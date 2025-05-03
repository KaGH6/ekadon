"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Pagenation from "@/components/pagenation";
import CreateEdit from "@/components/create-edit";
import Deck from "@/components/deck";
import Card from "@/components/card";

export default function List() {
    const [selectedCards, setSelectedCards] = useState([]);
    const handleSelectedCard = (card) => {
        setSelectedCards(prev => [...prev, card]);
        console.log(selectedCards);
    };

    // const handleRemoveCard = (idToRemove) => {
    //     setSelectedCards(prev => prev.filter(card => card.id !== idToRemove));
    // };

    const handleRemoveCard = (indexToRemove) => {
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
                        <CreateEdit />
                    </div>
                    <div className="list-content">
                        <Card onSelectedCard={handleSelectedCard} />
                    </div>
                </div>
            </section>
        </>
    );
}