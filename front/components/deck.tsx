"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
import { saveDeck } from "@/lib/api/deck";
import { usePathname } from "next/navigation";

// type DeckProps = {
//     // ユーザーが選択したカードの配列
//     selectedCards: CardData[];

//     // 削除ボタンが押されたときに呼ばれる関数（引数は削除するカードのインデックス）
//     onRemoveCard: (index: number) => void;
// }

// export default function Deck({ selectedCards, onRemoveCard }: DeckProps) {
export default function Deck() {
    const [isFullscreen, setIsFullscreen] = useState(false); // デッキ拡大

    // Zustandから状態と操作関数を取得
    const deck = useDeckStore((state) => state.deck);
    // const removeCard = useDeckStore((state) => state.removeCard);
    const removeCardByIndex = useDeckStore((state) => state.removeCardByIndex);

    const pathname = usePathname(); // 現在のパスを取得

    // デッキ保存処理
    const handleSaveDeck = async () => {
        try {
            const cardIds = deck.map((card) => card.id);
            await saveDeck(cardIds);
            alert("デッキを保存しました！");
        } catch (error) {
            console.error("デッキ保存エラー:", error);
            alert("保存に失敗しました。");
        }
    };

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

    // チェックリスト画面なら true
    const isChecklistPage = pathname.startsWith("/checklists");

    return (
        <section id="deck" className={`deck-wrapper ${isFullscreen ? "rotate-wrapper" : ""}`}>
            <div className="deck-outside">
                <div className="deck-inside">
                    {/* {selectedCards.map((card, index) => ( */}
                    {deck.map((card, index) => (
                        <button key={index} className="card-wrap">
                            <span className="card-close" onClick={(e) => {
                                // e.stopPropagation();
                                // onRemoveCard(index);
                                e.stopPropagation();
                                // removeCard(card.id); // Zustandから削除
                                removeCardByIndex(index); // indexで削除
                            }}><Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/close.svg" width={15} height={15} alt="close" /></span>
                            <Image src="/assets/img/card.svg" className="card" width={20} height={20} alt="card" />
                            <Image src={card.card_img} className="card-img" width={80} height={80} alt={card.name} unoptimized />
                            <p className="card-name">{card.name}</p>
                        </button>
                    ))}
                </div>
                <div className="deck-bottom">
                    <button className="sound">
                        <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/sound.svg" width={50} height={50} alt="サウンド" />
                    </button>
                    <button className="zoom" onClick={() => setIsFullscreen(!isFullscreen)}>
                        <Image src={
                            isFullscreen
                                ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-out.svg"
                                : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-up.svg"
                        } width={50} height={50}
                            alt={isFullscreen ? "デッキ拡大" : "デッキ縮小"} />
                    </button>

                    {/* 保存ボタンはチェックリスト画面のみ表示 */}
                    {isChecklistPage && (
                        <button className="save" onClick={handleSaveDeck}>
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/saved.svg"
                                width={50}
                                height={50}
                                alt="保存"
                            />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}