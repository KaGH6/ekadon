import axios from "@/lib/api/axiosInstance"; // 追記
import axiosInstance from "./axiosInstance";
const API_URL = process.env.NEXT_PUBLIC_API_URL; // 追記

// API が返してくるデッキ型
interface RawDeck {
    id: number;
    name: string;
    image_url?: string;
    image?: string;
    cards: { id: number; position: number }[];
}

// デッキの型
export type DeckType = {
    id: number;
    name: string;
    image_url: string;
    cards: { id: number; position: number }[];
};

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

// デッキ一覧を取得し、DeckType[] にマッピング
export const fetchDecks = async (): Promise<DeckType[]> => {
    // RawDeck[] を返すと型が分かるようにジェネリクスを添える
    const res = await axiosInstance.get<RawDeck[]>("/decks");

    // map のコールバックに(d: RawDeck)と書くと暗黙anyを防げる
    return res.data.map((d: RawDeck) => ({
        id: d.id,
        name: d.name,
        // image_url フィールド名が異なる場合にも対応
        image_url: d.image_url ?? d.image ?? "",
        cards: d.cards,
    }));
};

// // デッキ保存
// export const saveDeck = async (
//     name: string,
//     cards: { id: number; position: number }[]
// ) => {
//     const res = await axiosInstance.post("/decks", { name, cards });
//     return res.data;
// };

// デッキ保存 (FormData: name, image?, cards[][id], cards[][position])
export const saveDeck = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
        `${API_URL}/decks`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // Sanctum 使っている場合は必須
        }
    );
    return res.data;
};