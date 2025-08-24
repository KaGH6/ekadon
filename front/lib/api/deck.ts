// import axios from "@/lib/api/axiosInstance";
// import axiosInstance from "./axiosInstance";
import axiosInstance from "@/lib/api/axiosInstance"; // 追記
import { CardData } from "@/app/types/card";  // CardDataの定義パスに合わせて修正
// const API_URL = process.env.NEXT_PUBLIC_API_URL; // 追記
const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL;
const DEFAULT_DECK_IMG =
    "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/deck-cards.svg";

// APIから返ってくるraw dataの型
interface RawDeck {
    id: number;
    name: string;
    image_url?: string; // 画像URLがある場合
    image?: string;
    cards: any[];
}

// デッキの型（フロントで使う型に合わせる）
export type DeckType = {
    id: number;
    name: string;
    image_url: string;
    cards: any[];
};

// デッキ一覧取得 → フロントの型にマッピングして返す
const DEFAULT_IMG =
    "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/deck-cards.svg";

export const fetchDecks = async (): Promise<DeckType[]> => {
    const res = await axiosInstance.get<RawDeck[]>("/decks");
    return res.data.map((d) => ({
        id: d.id,
        name: d.name,
        image_url:
            d.image_url
                ? d.image_url
                : d.image && S3_BASE
                    ? `${S3_BASE}/${d.image}`
                    : DEFAULT_IMG,
        cards: d.cards,
    }));
};

// デッキ保存 (FormData: name, image?, cards[][id], cards[][position])
export const saveDeck = async (formData: FormData) => {
    const res = await axiosInstance.post("/decks", formData);
    return res.data;
};