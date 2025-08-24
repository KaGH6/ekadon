"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

function b64ToBlob(b64: string, mime = "image/png"): Blob {
    const byte = atob(b64);
    const arr = new Uint8Array(byte.length);
    for (let i = 0; i < byte.length; i++) arr[i] = byte.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

export default function EditCard() {
    const { categoryId, cardId } = useParams();
    const router = useRouter();

    const [cardName, setCardName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingGen, setLoadingGen] = useState(false); // 自動生成中フラグ

    // カード取得
    useEffect(() => {
        const fetchCard = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("ログイン情報が見つかりません。再度ログインしてください。");
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("ログイン情報が見つかりません。再度ログインしてください。");
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    const handleAutoGenerate = async () => {
        if (!cardName.trim()) {
            alert("先にカード名を入力してください");
            return;
        }
        if (loadingGen) return;

        setLoadingGen(true);
        try {
            const token = localStorage.getItem("token") || "";
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auto-image`,
                { type: "card", name: cardName },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );

            const { url, b64, mime } = res.data as {
                url: string;
                b64?: string | null;
                mime?: string;
            };

            let blob: Blob;
            if (b64) blob = b64ToBlob(b64, mime || "image/png");
            else blob = await (await fetch(url)).blob();

            const file = new File([blob], `${cardName}.png`, { type: mime || "image/png" });
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } catch (err: any) {
            console.error(err);
            const s = err?.response?.status, c = err?.response?.data?.code;
            const m = err?.response?.data?.message, d = err?.response?.data?.devMessage;
            if (s === 403 || c === "org_unverified") return alert(m ?? "OpenAIの組織が未認証です。Verify Organization を完了してください。");
            if (s === 402 || c === "billing_limit") return alert(m ?? "OpenAIの上限/支払い設定を確認してください。");
            if (s === 429 || c === "rate_limited") return alert(m ?? "混み合っています。少し待って再試行してください。");
            if (s === 400 || c === "bad_request") return alert((m ?? "パラメータ不正") + (d ? `\n\n詳細:${d}` : ""));
            alert(m ?? "自動生成に失敗しました" + (d ? `\n\n詳細:${d}` : ""));
        } finally {
            setLoadingGen(false);
        }
    };

    // 完了
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !selectedCategory) {
            alert("すべての項目を入力してください");
            return;
        }

        const token = localStorage.getItem("token"); // ← これを追加
        if (!token) {
            alert("ログイン情報が見つかりません。再度ログインしてください。");
            return;
        }

        const formData = new FormData();
        formData.append("name", cardName);
        if (imageFile) {
            formData.append("card_img", imageFile);
        }
        formData.append("category_id", selectedCategory.toString());

        setIsSubmitting(true);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}?_method=PUT`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
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
        <AuthGuard>
            <div id="create-edit" className="bac">
                <section id="input">
                    <div className="content_wrap">
                        <form className="create-card" onSubmit={handleSubmit}>
                            <div className="create-flex">
                                <h3 className="mb05">1. カード編集</h3>
                                {/* 自動生成ボタン */}
                                <button
                                    type="button"
                                    className="auto-generate-btn"
                                    onClick={handleAutoGenerate}
                                    disabled={loadingGen}
                                >
                                    {loadingGen ? "生成中..." : "自動生成"}
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/ai-image.svg"
                                        alt="自動生成"
                                        className="ai-image"
                                        width={70}
                                        height={70}
                                    />
                                </button>
                            </div>

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
                                        unoptimized
                                        onClick={() => document.getElementById("img-file")?.click()}
                                    />
                                )}
                                <p className="select-img-text bold">画像を選択</p>
                                <textarea
                                    className="put-name"
                                    maxLength={10}
                                    placeholder="カード名を入力（10文字まで）"
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
        </AuthGuard>
    );
}
