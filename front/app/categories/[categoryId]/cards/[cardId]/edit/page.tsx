"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCardPage() {
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`);
                const data = await res.json();
                setCardName(data.name);
                setSelectedCategory(data.category_id);
                setImagePreviewUrl(data.card_img);
            } catch (error) {
                console.error("カード取得失敗:", error);
            }
        };
        fetchCard();
    }, [cardId]);

    // カテゴリー一覧取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list-category`);
                const data = await res.json();
                setCategories(data);
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
        formData.append("user_id", "1"); // 仮ユーザー

        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`, {
                method: "POST", // PUT ではなく POST + _method に対応する場合
                body: formData,
            });

            if (res.ok) {
                router.push(`/categories/${selectedCategory}/cards`);
            } else {
                const errorText = await res.text();
                console.error("カード更新失敗:", errorText);
                alert("カード更新に失敗しました");
            }
        } catch (error) {
            console.error("送信エラー:", error);
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
                            <Image
                                src={imagePreviewUrl}
                                alt="カード画像"
                                className="select-img"
                                width={30}
                                height={30}
                                onClick={() => document.getElementById("img-file")?.click()}
                            />
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
