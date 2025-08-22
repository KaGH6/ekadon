"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

// 画像生成
function b64ToBlob(b64: string, mime = "image/png"): Blob {
    const byte = atob(b64);
    const arr = new Uint8Array(byte.length);
    for (let i = 0; i < byte.length; i++) arr[i] = byte.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

export default function CardCreate() {
    const [cardName, setCardName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null); // 最初はファイルが選ばれていない（null）だが、選ばれたらFile型になる
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg"); // 選択した画像を表示するため
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingGen, setLoadingGen] = useState(false); // 画像自動生成
    const router = useRouter();

    // カテゴリ一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");  // トークン取得
                // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list-category`);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list-category`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("カテゴリ取得失敗:", error);
            }
        };
        fetchCategories();
    }, []);

    // 画像選択処理
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // // 画像ファイルが選ばれたときのファイルリスト（配列みたいなもの）
        // const files = e.target.files;

        // if (files && files.length > 0) { // 画像ファイルがあるか確認
        //     // 最初の1枚を変数に保存
        //     setImageFile(files[0]);
        // }
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file)); // ← プレビュー表示URL
        }
    };

    // 画像自動生成
    const handleAutoGenerate = async () => {
        if (!cardName.trim()) { alert("先にカード名を入力してください"); return; }
        if (loadingGen) return;

        setLoadingGen(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auto-image`,
                { type: "card", name: cardName },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined, withCredentials: true }
            );

            const { url, b64, mime } = res.data as { url: string; b64?: string | null; mime?: string };

            let blob: Blob;
            if (b64) {
                blob = b64ToBlob(b64, mime || "image/png"); // CORS回避（b64優先）
            } else {
                blob = await (await fetch(url)).blob();     // S3などb64無効時の互換
            }

            const file = new File([blob], `${cardName}.png`, { type: mime || "image/png" });
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } catch (err: any) {
            console.error(err);
            const s = err?.response?.status, c = err?.response?.data?.code;
            const m = err?.response?.data?.message, d = err?.response?.data?.devMessage;
            if (s === 403 || c === "org_unverified") return alert(m ?? "OpenAIの組織が未認証です。Verify Organization を完了してください。");
            if (s === 402 || c === "billing_limit") return alert(m ?? "OpenAIの無料枠/上限に達しました。");
            if (s === 429 || c === "rate_limited") return alert(m ?? "混み合っています。しばらくして再試行してください。");
            if (s === 400 || c === "bad_request") return alert((m ?? "パラメータ不正") + (d ? `\n\n詳細:${d}` : ""));
            alert(m ?? "自動生成に失敗しました" + (d ? `\n\n詳細:${d}` : ""));
        } finally {
            setLoadingGen(false);
        }
    };

    // フォーム送信処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // バリデーションやAPI送信の処理
        console.log("カード名:", cardName);
        console.log("画像ファイル:", imageFile);

        const token = localStorage.getItem("token"); // token取得

        if (!cardName || !imageFile || !selectedCategory) {
            alert("すべての項目を入力してください");
            return;
        }

        const formData = new FormData();
        formData.append("name", cardName);
        formData.append("card_img", imageFile);
        formData.append("category_id", selectedCategory.toString());
        // formData.append("user_id", "1"); // 動作確認用の仮ID

        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-card`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                body: formData,
            });

            if (res.ok) {
                // カテゴリーごとのカード一覧へ遷移
                router.push(`/categories/${selectedCategory}/cards`);
                // alert("カードを作成しました");
                // setCardName("");
                // setImageFile(null);
                // setSelectedCategory("");
            } else {
                const errorText = await res.text();
                console.error("カード作成失敗:", errorText);
                alert("カード作成に失敗しました");
            }
        } catch (error) {
            console.error("送信エラー:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthGuard>
            <div id="create-edit" className="bac">
                <section id="input">
                    <div className="content_wrap">
                        <form action="" className="create-card" onSubmit={handleSubmit}>
                            <div className="create-flex">
                                <h3>1. カード作成</h3>
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
                                <input type="file" id="img-file" className="img-file" accept="image/*"
                                    style={{ display: "none" }} onChange={handleImageChange} />
                                <Image src={imagePreviewUrl} alt="カード画像" className="select-img" width={30} height={30} onClick={() => document.getElementById("img-file")?.click()} />
                                <p className="select-img-text bold">画像を選択</p>
                                <textarea className="put-name" maxLength={12} placeholder="カード名を入力（12文字まで）" required value={cardName} onChange={(e) => setCardName(e.target.value)}></textarea>
                            </label>
                            <h3 className="mt3 mb05">2. カテゴリー選択</h3>
                            <select className="select-category" required value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value))}>
                                {/* <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/search-category.svg" alt="search-category" className="search-category" width={30} height={30} /> */}
                                <option value="">カテゴリを選択</option>
                                {categories.map((cate) => (
                                    <option key={cate.id} value={cate.id}>
                                        {cate.name}
                                    </option>
                                ))}
                            </select>

                            <button type="submit" className="submit-button mb5" disabled={isSubmitting}>{isSubmitting ? "送信中..." : "完成"}</button>
                        </form>

                    </div>
                </section>
            </div>
        </AuthGuard>
    );
}