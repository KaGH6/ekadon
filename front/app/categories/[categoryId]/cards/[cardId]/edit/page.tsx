"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditCard() {
    const { categoryId, cardId } = useParams();
    const router = useRouter();

    const [cardName, setCardName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // カード取得
    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`);
                // const data = res.data;
                setCardName(res.data.name);
                setSelectedCategory(res.data.category_id);
                console.log("取得した画像URL:", res.data.card_img);
                setImagePreviewUrl(res.data.card_img);
            } catch (error) {
                console.error("カード取得失敗:", error);
            }
        };
        fetchCard();
    }, [cardId]);

    // useEffect(() => {
    //     console.log("imagePreviewUrl:", imagePreviewUrl);
    // }, [imagePreviewUrl]);

    // カテゴリー一覧取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list-category`);
                setCategories(res.data);
            } catch (error) {
                console.error("カテゴリ取得失敗:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !selectedCategory) {
            alert("すべての項目を入力してください");
            return;
        }

        const formData = new FormData();
        formData.append("name", cardName);
        if (imageFile) {
            formData.append("card_img", imageFile);
        }
        formData.append("category_id", selectedCategory.toString());
        // formData.append("user_id", "1"); // 仮ユーザーID

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
        } catch (error) {
            console.error("カード更新失敗:", error);
            alert("カード更新に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="create-edit" className="bac">
            <section id="input">
                <div className="content_wrap">
                    <form className="create-card" onSubmit={handleSubmit}>
                        <h3 className="mb05">1. カード編集</h3>
                        <label className="card-wrap">
                            <input
                                type="file"
                                id="img-file"
                                className="img-file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            {imagePreviewUrl && (
                                <Image
                                    src={imagePreviewUrl}
                                    alt="カード画像"
                                    className="select-img"
                                    width={80}
                                    height={80}
                                    onClick={() => document.getElementById("img-file")?.click()}
                                />
                            )}
                            <p className="select-img-text bold">画像を選択</p>
                            <textarea
                                className="put-name"
                                maxLength={12}
                                placeholder="カード名を入力（12文字まで）"
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                            />
                        </label>

                        <h3 className="mt3 mb05">2. カテゴリー選択</h3>
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
                    </form>
                </div>
            </section>
        </div>
    );
}
