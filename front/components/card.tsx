"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from 'axios';
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
import { speakSingleText } from "@/lib/speech/speak";
// import Deck from "./deck";
// import List from "@/app/list/page";

type CardProps = {
    cards: CardData[];
    categoryId: string;
    onSelectedCard: (card: CardData) => void;
    editModeId: number | null;
    onOptionButtonClick?: (id: number) => void; // オプションボタン押下でメニューを出す
    onContextMenu: (e: React.MouseEvent, id: number) => void;
    onTouchStart: (id: number) => void;
    onTouchEnd: () => void;
    onEdit: (id: number) => void;
    onConfirmDelete: (id: number) => void;
    deletedCardId: number | null;
    currentUserId: number | null;
}

export default function Card({
    cards,
    categoryId,
    // onSelectedCard,
    editModeId,
    onOptionButtonClick, // オプションボタン押下でメニューを出す
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onEdit,
    onConfirmDelete,
    deletedCardId,
    currentUserId
}: CardProps) {
    // const [cards, setCards] = useState<CardData[]>([]); // CardDataの配列
    const addCard = useDeckStore((state) => state.addCard); // Zustandから追加
    const [guardMessage, setGuardMessage] = useState<string | null>(null);

    // 編集クリック時のガード
    const handleEditClick = (card: CardData) => {
        if (card.user_id === 3 && currentUserId !== 3) {
            setGuardMessage("デフォルトのカードは編集できません");
            return;
        }
        onEdit(card.id);
    };

    // 削除クリック時のガード
    const handleDeleteClick = (card: CardData) => {
        if (card.user_id === 3 && currentUserId !== 3) {
            setGuardMessage("デフォルトのカードは削除できません");
            return;
        }
        onConfirmDelete(card.id);
    };

    return (
        <>
            {cards
                .filter((card) => card.id !== deletedCardId) // ← ここで削除済みのカードを除外
                .map((card) => (
                    <div
                        key={card.id}
                        className="card-wrap"
                        // onClick={() => onSelectedCard(card)}
                        onClick={() => {
                            speakSingleText(card.name); // 音声読み上げ
                            addCard(card); // デッキに追加
                        }}
                        onContextMenu={(e) => onContextMenu(e, card.id)}
                        onTouchStart={() => onTouchStart(card.id)}
                        onTouchEnd={onTouchEnd}
                    >
                        <button
                            className="option-button"
                            onClick={e => {
                                e.stopPropagation();
                                onOptionButtonClick?.(card.id);
                            }}
                        >
                            <img src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg" alt="option" />
                        </button>
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
                                <button onClick={(e) => {
                                    e.stopPropagation(); // カードクリックでデッキに表示を無効化
                                    handleEditClick(card);
                                }}>編集</button>
                                <button onClick={(e) => {
                                    e.stopPropagation(); // カードクリックでデッキに表示を無効化
                                    handleDeleteClick(card);
                                }}>削除</button>
                            </div>
                        )}
                    </div>
                ))}

            {/* ガード用モーダル（オーバーレイ外クリックで閉じる） */}
            {guardMessage && (
                <div
                    className="modal-overlay"
                    onClick={() => setGuardMessage(null)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <p>{guardMessage}</p>
                        <div className="modal-buttons">
                            <button
                                className="cancel-btn"
                                onClick={() => setGuardMessage(null)}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}