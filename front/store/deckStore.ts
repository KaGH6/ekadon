import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// CardData 型の定義
export type CardData = {
    id: number;
    name: string;
    card_img: string;
    category_id: number;
    user_id: number;
    created_at?: string;
    updated_at?: string;
};

// Zustandで管理する状態の型
type DeckState = {
    deck: CardData[];
    addCard: (card: CardData) => void;
    removeCard: (id: number) => void;
    removeCardByIndex: (index: number) => void;
    clearDeck: () => void;
};

// Zustand Store の作成
export const useDeckStore = create<DeckState>()(
    persist(
        (set, get) => ({
            deck: [], // 状態の中身。deck=カードの配列（現在のデッキ）。

            // カードを追加
            addCard: (card) => {
                // 重複防止チェック
                // const exists = get().deck.some((c) => c.id === card.id);
                // if (!exists) {
                //     set((state) => ({ deck: [...state.deck, card] }));
                // }

                // 重複OK
                set((state) => ({ deck: [...state.deck, card] }));
            },

            // 指定IDのカードを削除
            removeCard: (id) =>
                set((state) => ({
                    deck: state.deck.filter((c) => c.id !== id),
                })),

            // インデックスで1枚だけ削除
            removeCardByIndex: (index) =>
                set((state) => ({
                    deck: state.deck.filter((_, i) => i !== index),
                })),

            // デッキを全削除
            clearDeck: () => set({ deck: [] }),
        }),

        // 状態をローカルに保存
        {
            name: 'deck-storage', // localStorageに保存されるキー名
        }
    )
);
