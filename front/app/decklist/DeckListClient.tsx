// app/decklist/DeckListClient.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDecks } from "@/lib/api/deck";
import axiosInstance from "@/lib/api/axiosInstance";
import Breadcrumbs from "@/components/breadcrumbs";
import Deck from "@/components/deck";
import AuthGuard from "@/components/AuthGuard";
import CreateButton from "@/components/create-button";
import { useDeckStore } from "@/store/deckStore";

export default function DeckListClient({ initialDecks }) {
    // 初期データはサーバー側から props で受け取る
    const [decks, setDecks] = useState(initialDecks);
    const [editModeId, setEditModeId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    // 必要ならクライアントで再フェッチ
    useEffect(() => {
        (async () => {
            try {
                const data = await fetchDecks();
                setDecks(data);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    // Zustand まわり
    const clearDeck = useDeckStore((s) => s.clearDeck);
    const addCard = useDeckStore((s) => s.addCard);
    const setIsSaved = useDeckStore((s) => s.setIsSaved);
    const setEditingDeckId = useDeckStore((s) => s.setEditingDeckId);
    const setBackupDeck = useDeckStore((s) => s.setBackupDeck);

    // 長押し／右クリックハンドラ、削除ハンドラ、選択ハンドラはそのまま…

    return (
        <>
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top"><Breadcrumbs /></div>
                    <div id="deck-list" className="list-content">
                        {decks.map((d) => (
                            <div key={d.id} /* ...省略... */>
                                <div className="list-link">
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/deck.svg"
                                        width={80} height={80} alt="デッキ枠" unoptimized
                                    />
                                    <Image
                                        src={d.image_url!}
                                        width={80} height={80} alt={d.name} unoptimized
                                    />
                                    <p className="list-name">{d.name}</p>
                                </div>
                                {/* 編集／削除メニュー */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* モーダル */}
        </>
    );
}
