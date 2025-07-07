import { CardData } from "./card";

export type Deck = {
    id: number;
    name: string | null; // 任意の名前
    user_id: number;
    cards: (CardData & { pivot: { position: number } })[]; // カード＋順番情報
};
