"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditCard() {
    const { categoryId, cardId } = useParams();
    const router = useRouter();

    const [cardName, setCardName] = useState("");
    const [cardImg, setCardImg] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`);
                setCardName(res.data.name);
                setSelectedCategory(res.data.category_id);
                setPreviewUrl(res.data.card_img);
            } catch (err) {
                console.error(err);
                setError("カードの読み込みに失敗しました");
            }
        };
        fetchCard();
    }, [cardId]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list-category`);
                setCategories(res.data);
            } catch (err) {
                console.error("カテゴリ取得失敗:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !selectedCategory) {
            alert("すべての項目を入力してください");
            return;
        }

        const formData = new FormData();
        formData.append("name", cardName);
        if (cardImg) {
            formData.append("card_img", cardImg);
        }
        formData.append("category_id", selectedCategory.toString());
        formData.append("user_id", "1"); // 仮ユーザーID

        setIsSubmitting(true);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}?_method=PUT`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            router.push(`/categories/${selectedCategory}/cards`);
        } catch (err) {
            console.error("カード更新失敗:", err);
            setError("カード更新に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="create-edit" className="bac">
            <div id="input">
                <div onSubmit={handleSubmit} className="content_wrap">
                    <form className="create-card">
                        <h3>1. カード名</h3>
                        <label className="card-wrap">
                            <textarea
                                className="put-name"
                                maxLength={12}
                                placeholder="カード名を入力（12文字まで）"
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                            />
                        </label>

                        <h3>2. カード画像</h3>
                        <label className="card-wrap select-category-img">
                            <input
                                type="file"
                                id="img-file"
                                className="select-img"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setCardImg(file);
                                        setPreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <Image src={previewUrl} alt="選択画像" className="select-img" />
                            <p className="select-img-text bold">画像を選択</p>
                        </label>

                        <h3>3. カテゴリー選択</h3>
                        <select
                            className="select-category"
                            required
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        >
                            <option value="">カテゴリを選択</option>
                            {categories.map((cate) => (
                                <option key={cate.id} value={cate.id}>
                                    {cate.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="submit-button mb5" disabled={isSubmitting}>
                            {isSubmitting ? "送信中..." : "完成"}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
