"use client";

import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
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

export default function EditCategory() {
    const { categoryId } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [categoryImg, setCategoryImg] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");
    const [loadingGen, setLoadingGen] = useState(false); // 自動生成中フラグ

    useEffect(() => {
        const fetchCategory = async () => {
            const token = localStorage.getItem("token"); // トークンを取得
            if (!token) {
                setError("ログイン情報が見つかりません。再度ログインしてください。");
                return;
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ヘッダーに付与
                    },
                });
                setName(res.data.name);
                setPreviewUrl(res.data.category_img);
            } catch (err) {
                console.error(err);
                setError("カテゴリーの読み込みに失敗しました");
            }
        };
        fetchCategory();
    }, [categoryId]);

    // 画像自動生成
    const handleAutoGenerate = async () => {
        if (!name.trim()) {
            alert("先にカテゴリー名を入力してください");
            return;
        }
        if (loadingGen) return;

        setLoadingGen(true);
        try {
            const token = localStorage.getItem("token") || "";
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auto-image`,
                { type: "category", name },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );

            const { url, b64, mime } = res.data as {
                url: string;
                b64?: string | null;
                mime?: string;
            };

            let blob: Blob;
            if (b64) {
                blob = b64ToBlob(b64, mime || "image/png");
            } else {
                // 本番（S3直配信など）で b64 を返さない場合
                blob = await (await fetch(url)).blob();
            }
            const file = new File([blob], `${name}.png`, { type: mime || "image/png" });

            setCategoryImg(file);
            setPreviewUrl(URL.createObjectURL(file));
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

    // 完成
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); // トークンを取得
        if (!token) {
            setError("ログイン情報が見つかりません。再度ログインしてください。");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (categoryImg) {
            formData.append("category_img", categoryImg);
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}?_method=PUT`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            router.push("/categories");
        } catch (err) {
            console.error(err);
            setError("カテゴリーの更新に失敗しました");
            return;
        }
    };

    return (
        <AuthGuard>
            <div id="create-edit" className="bac">
                <div id="input">
                    <div className="content_wrap">
                        <form onSubmit={handleSubmit} className="create-category">
                            <h3>1. カテゴリー名</h3>
                            <label className="create-wrap">
                                <input
                                    type="text"
                                    className="textbox"
                                    placeholder="カテゴリー名を入力（16文字まで）"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={16}
                                    required
                                />
                            </label>

                            <div className="create-flex">
                                <h3>2. カテゴリー画像</h3>
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

                            <label className="create-wrap select-category-img">
                                <input
                                    type="file"
                                    id="img-file"
                                    className="select-img"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCategoryImg(file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {/* <Image src={previewUrl} alt="選択画像" className="select-img" width={100} height={100} unoptimized /> */}
                                {previewUrl && (
                                    <Image
                                        src={previewUrl}
                                        alt="選択画像"
                                        width={100}
                                        height={100}
                                        priority
                                        className="select-img"
                                        unoptimized
                                        onClick={() => document.getElementById("img-file")?.click()}
                                    />
                                )}
                                <p className="select-img-text bold">画像を選択</p>
                            </label>

                            <button type="submit" className="submit-button">完成</button>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
