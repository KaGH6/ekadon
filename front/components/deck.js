"use client";

import Image from "next/image";
import { useState } from "react";

export default function Deck({ selectedCards, onRemoveCard }) {
    return (
        <section id="deck">
            <div className="deck-outside">
                <div className="deck-inside">
                    {selectedCards.map((card, index) => (
                        <button key={index} className="card-wrap">
                            <span className="card-close" onClick={(e) => {
                                // e.stopPropagation();
                                onRemoveCard(index)
                            }}><Image src="/assets/img/icons/close.svg" width={15} height={15} alt="close" /></span>
                            <Image src="/assets/img/card.svg" className="card" width={20} height={20} alt="card" />
                            <Image src={card.card_img} className="card-img" width={80} height={80} alt="{card.name}" />
                            <p className="card-name">{card.name}</p>
                        </button>
                    ))}
                </div>
                <div className="deck-bottom">
                    <button className="sound"><Image src="/assets/img/icons/sound.svg" width={50} height={50} alt="aa" /></button>
                    <button className="template-swich"><Image src="/assets/img/icons/template-swich.svg" width={50} height={50} alt="aa" /></button>
                </div>
            </div>
        </section>
    );
}