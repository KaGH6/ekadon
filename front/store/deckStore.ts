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
    isSaved: boolean; // 現在のデッキが保存済みかどうか
    editingDeckId: number | null; // 編集中のデッキID（nullなら新規作成）
    backupDeck: CardData[]; // 編集前のカード配列を退避
    setBackupDeck: (cards: CardData[]) => void; // 退避用アクション
    restoreBackup: () => void; // 編集キャンセル時にバックアップから復元
    addCard: (card: CardData) => void;
    removeCard: (id: number) => void;
    removeCardByIndex: (index: number) => void;
    clearDeck: () => void; // 全削除
    setIsSaved: (flag: boolean) => void; // フラグのsetter
    setEditingDeckId: (id: number | null) => void; // 編集中のデッキIDをセット
};

// Zustand Store の作成
export const useDeckStore = create<DeckState>()(
    persist(
        (set, get) => ({
            deck: [], // 状態の中身。deck=カードの配列（現在のデッキ）。
            isSaved: false, // デッキが保存済みかどうかのフラグ
            editingDeckId: null, // 編集中のデッキID
            setEditingDeckId: (id) => set({ editingDeckId: id }), // 編集中のデッキIDをセット
            backupDeck: [],
            setBackupDeck: (cards) => set({ backupDeck: cards }),
            restoreBackup: () => {
                const b = get().backupDeck;
                set({
                    deck: b,
                    isSaved: true,
                    editingDeckId: null,
                });
            },

            // カードを追加
            addCard: (card) => {
                // 重複防止チェック
                // const exists = get().deck.some((c) => c.id === card.id);
                // if (!exists) {
                //     set((state) => ({ deck: [...state.deck, card] }));
                // }

                // 重複OKで追加
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
            clearDeck: () => set({ deck: [], isSaved: false }), // クリア時は保存済フラグも false
            setIsSaved: (flag) => set({ isSaved: flag }),
        }),

        // 状態をローカルに保存
        {
            name: 'deck-storage', // localStorageに保存されるキー名
        }
    )
);
