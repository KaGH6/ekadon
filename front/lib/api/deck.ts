import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// デッキ一覧取得（ログインユーザーに紐づくもの）
export const fetchDecks = async (token: string) => {
    const response = await axios.get(`${API_URL}/decks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// デッキを新規作成（カードIDの配列を送信）
export const saveDeck = async (cardIds: number[], token: string) => {
    const response = await axios.post(
        `${API_URL}/decks`,
        { card_ids: cardIds },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
