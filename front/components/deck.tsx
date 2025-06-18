"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CardData } from "@/app/types/card";

type DeckProps = {
    // ユーザーが選択したカードの配列
    selectedCards: CardData[];

    // 削除ボタンが押されたときに呼ばれる関数（引数は削除するカードのインデックス）
    onRemoveCard: (index: number) => void;
}

export default function Deck({ selectedCards, onRemoveCard }: DeckProps) {
    const [isFullscreen, setIsFullscreen] = useState(false); // デッキ拡大

    //  デッキ拡大時にbodyにクラスを追加・削除
    useEffect(() => {
        const body = document.body; // body要素を取得
        if (isFullscreen) {
            body.classList.add("fullscreen");
        } else {
            body.classList.remove("fullscreen");
        }

        return () => {
            body.classList.remove("fullscreen");
        };
    }, [isFullscreen]);

    return (
        <section id="deck" className={`deck-wrapper ${isFullscreen ? "rotate-wrapper" : ""}`}>
            <div className="deck-outside">
                <div className="deck-inside">
                    {selectedCards.map((card, index) => (
                        <button key={index} className="card-wrap">
                            <span className="card-close" onClick={(e) => {
                                // e.stopPropagation();
                                onRemoveCard(index);
                            }}><Image src="http://127.0.0.1:8000/storage/images/icons/close.svg" width={15} height={15} alt="close" /></span>
                            <Image src="/assets/img/card.svg" className="card" width={20} height={20} alt="card" />
                            <Image src={card.card_img} className="card-img" width={80} height={80} alt={card.name} />
                            <p className="card-name">{card.name}</p>
                        </button>
                    ))}
                </div>
                <div className="deck-bottom">
                    <button className="sound">
                        <Image src="http://127.0.0.1:8000/storage/images/icons/sound.svg" width={50} height={50} alt="サウンド" />
                    </button>
                    <button className="zoom" onClick={() => setIsFullscreen(!isFullscreen)}>
                        <Image src={
                            isFullscreen
                                ? "http://127.0.0.1:8000/storage/images/icons/zoom-out.svg"
                                : "http://127.0.0.1:8000/storage/images/icons/zoom-up.svg"
                        } width={50} height={50}
                            alt={isFullscreen ? "デッキ拡大" : "デッキ縮小"} />
                    </button>
                </div>
            </div>
        </section>
    );
}