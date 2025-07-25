"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
import { saveDeck } from "@/lib/api/deck";
import { usePathname } from "next/navigation";
import { speakDeckCards, speakSingleText } from "@/lib/speech/speak";
import Tooltip from '@/components/tooltip';

// type DeckProps = {
//     // ユーザーが選択したカードの配列
//     selectedCards: CardData[];

//     // 削除ボタンが押されたときに呼ばれる関数（引数は削除するカードのインデックス）
//     onRemoveCard: (index: number) => void;
// }

// タッチ端末判定用
function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasTouch =
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                // IE10 など
                // @ts-ignore
                navigator.msMaxTouchPoints > 0;
            setIsTouch(hasTouch);
        }
    }, []);
    return isTouch;
}

// export default function Deck({ selectedCards, onRemoveCard }: DeckProps) {
export default function Deck() {
    const [isFullscreen, setIsFullscreen] = useState(false); // デッキ拡大
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null); // 読み上げ時のデッキのカード拡大用

    // Zustandから状態と操作関数を取得
    const deck = useDeckStore((state) => state.deck);
    // const removeCard = useDeckStore((state) => state.removeCard);
    const removeCardByIndex = useDeckStore((state) => state.removeCardByIndex);
    const clearDeck = useDeckStore((state) => state.clearDeck); // 全削除

    const isTouch = useIsTouchDevice(); // タッチ端末かどうか判定
    const pathname = usePathname(); // 現在のパスを取得

    // デッキ保存処理
    const handleSaveDeck = async () => {
        try {
            const cardIds = deck.map((card) => card.id);
            const name = prompt("デッキ名を入力してください");
            if (!name) {
                alert("デッキ名が未入力のため、保存をキャンセルしました。");
                return;
            }

            await saveDeck(cardIds, name); // nameがある時だけ1回呼ぶ
            alert("デッキを保存しました！");
        } catch (error) {
            console.error("デッキ保存エラー:", error);
            alert("保存に失敗しました。");
        }
    };

    // 連続読み上げ防止
    let isSpeaking = false;

    // 読み上げ + ハイライト関数
    const speakDeckCardsWithHighlight = (
        texts: string[],
        onSpeakIndex: (index: number | null) => void
    ) => {
        if (!("speechSynthesis" in window)) {
            alert("音声読み上げに対応していません。");
            return;
        }

        if (isSpeaking) return; // 再生中なら無視

        isSpeaking = true;
        const synth = window.speechSynthesis;

        // 一度キャンセルしてから再生
        synth.cancel();

        setTimeout(() => {
            const speakNext = (index: number) => {
                if (index >= texts.length) {
                    onSpeakIndex(null); // 終了時に解除
                    isSpeaking = false;
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(texts[index]);
                utterance.lang = "ja-JP";
                utterance.rate = 0.95;
                utterance.pitch = 1.1;

                utterance.onstart = () => {
                    onSpeakIndex(index); // 現在読み上げ中のindexを通知
                };

                utterance.onend = () => {
                    speakNext(index + 1); // 次へ
                };
                synth.speak(utterance);
            };
            speakNext(0);
        }, 100); // cancelの完了を待つため少し待つ
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
                        <button
                            key={index}
                            // className="card-wrap"
                            className={`card-wrap ${speakingIndex === index ? "speaking" : ""}`}
                        >
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
                    <Tooltip content="カードを読み上げ">
                        <button
                            className="sound"
                            onClick={() => {
                                const texts = deck.map((card) => card.name);
                                speakDeckCardsWithHighlight(texts, setSpeakingIndex);
                            }}
                        >
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/sound.svg" width={50} height={50} alt="サウンド" />
                        </button>
                    </Tooltip>

                    <Tooltip content={isFullscreen ? "デッキを縮小" : "デッキを拡大"}>
                        <button className="zoom" onClick={() => setIsFullscreen(!isFullscreen)}>
                            <Image src={
                                isFullscreen
                                    ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-out.svg"
                                    : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-up.svg"
                            } width={50} height={50}
                                alt={isFullscreen ? "デッキ拡大" : "デッキ縮小"} />
                        </button>
                    </Tooltip>

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

                    {/* 全削除ボタン */}
                    <Tooltip content="デッキ内を全削除">
                        <button
                            className="clear"
                            onClick={() => {
                                // if (confirm("デッキ内のすべてのカードを削除しますか？")) {
                                //     clearDeck();
                                // }
                                clearDeck(); // 確認なしで即削除
                            }}
                        >
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/trash.svg"
                                width={50}
                                height={50}
                                alt="デッキ内全削除"
                            />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </section >
    );
}