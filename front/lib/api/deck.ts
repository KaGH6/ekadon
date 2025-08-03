// import axios from "@/lib/api/axiosInstance";
// import axiosInstance from "./axiosInstance";
import axiosInstance from "@/lib/api/axiosInstance"; // 追記
import { CardData } from "@/app/types/card";  // CardDataの定義パスに合わせて修正
// const API_URL = process.env.NEXT_PUBLIC_API_URL; // 追記
const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL;
const DEFAULT_DECK_IMG =
    "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/deck-cards.svg";

// 1) S3のベースURL
// const S3_BASE = process.env.NEXT_PUBLIC_S3_BASE_URL;

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

// // デッキの型
// export type DeckType = {
//     id: number;
//     name: string;
//     image_url: string;
//     cards: { id: number; position: number }[];
// };

// // デッキ一覧取得（ログインユーザーに紐づくもの）
// export const fetchDecks = async () => {
//     const res = await axiosInstance.get("/decks");
//     // return res.data;
//     // API が返すフィールド名が `image`（または `image_url`）かどうかを確認
//     return res.data.map((d) => ({
//         id: d.id,
//         name: d.name,
//         // もしバックエンドが `image` プロパティで返しているならこちらを使う
//         image_url: d.image_url ?? d.image ?? null,
//         cards: d.cards,
//     }));
// };

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

// // デッキ保存
// export const saveDeck = async (
//     name: string,
//     cards: { id: number; position: number }[],
//     file: File
// ) => {
//     const form = new FormData();
//     form.append("name", name);
//     cards.forEach((c, i) => {
//         form.append(`cards[${i}][id]`, String(c.id));
//         form.append(`cards[${i}][position]`, String(c.position));
//     });
//     form.append("image", file);

//     return await axiosInstance.post("/decks", form, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// };


// // デッキ保存 (FormData: name, image?, cards[][id], cards[][position])
export const saveDeck = async (formData: FormData) => {
    const res = await axiosInstance.post("/decks", formData);
    return res.data;
};