"use client";

import Image from 'next/image';
import { useState } from "react"; // 入力値を一時的に保存
import { useRouter } from "next/navigation";// ページ遷移
// import axios from "axios"; // API（Laravel）へデータを送る
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

// 画像生成
function b64ToBlob(b64: string, mime = "image/png"): Blob {
    const byteChars = atob(b64);
    const len = byteChars.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = byteChars.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

export default function CreateCategoryPage() {
    const router = useRouter();

    // Reactの状態（state）を定義
    const [name, setName] = useState(""); // カテゴリー名
    const [categoryImg, setCategoryImg] = useState<File | null>(null); // 画像ファイル
    const [error, setError] = useState(""); // エラーメッセージ
    const [previewUrl, setPreviewUrl] = useState<string>("https://api.ekadon.com/storage/images/icons/select-img.svg"); // 選択した画像を表示するため
    const [loadingGen, setLoadingGen] = useState(false); // 画像自動生成

    // フォーム送信処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 画面の再読み込み防止

        // 入力チェック（バリデーション）
        if (!categoryImg) {
            setError("画像を選択してください");
            return;
        }

        //  Laravelに送るデータを用意（FormData）
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category_img", categoryImg);

            // トークンを取得（保存名が"token"か確認）
            const token = localStorage.getItem("token");

            // axiosで、Authorizationヘッダー付きでAPIに送信（POST）
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-category`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true, // Sanctum認証ではこれが必須！
            });

            // 成功したら一覧ページへ移動して、再フェッチさせる
            router.push("/categories");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError("カテゴリー作成に失敗しました");
        }
    };

    // 画像生成API（CORS回避：b64優先）
    const handleAutoGenerate = async () => {
        if (!name.trim()) { alert("先にカテゴリー名を入力してください"); return; }
        if (loadingGen) return;

        setLoadingGen(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auto-image`,
                { type: "category", name },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined, withCredentials: true }
            );

            const { url, b64, mime } = res.data as { url: string; b64?: string | null; mime?: string };

            let blob: Blob;
            if (b64) {
                blob = b64ToBlob(b64, mime || "image/png");  // fetch不要（CORS回避）
            } else {
                // 互換: 本番S3などb64を返さない場合
                blob = await (await fetch(url)).blob();
            }

            const file = new File([blob], `${name}.png`, { type: mime || "image/png" });
            setCategoryImg(file);
            setPreviewUrl(URL.createObjectURL(file));
        } catch (err: any) {
            console.error(err);
            const s = err?.response?.status;
            const c = err?.response?.data?.code;
            const m = err?.response?.data?.message;
            const d = err?.response?.data?.devMessage;

            if (s === 403 || c === "org_unverified") { alert(m ?? "OpenAIの組織が未認証です。Verify Organization を完了してください。"); return; }
            if (s === 402 || c === "billing_limit") { alert(m ?? "OpenAIの無料枠/利用上限に達したか、支払い設定がありません。"); return; }
            if (s === 429 || c === "rate_limited") { alert(m ?? "混み合っています。少し待って再試行してください。"); return; }
            if (s === 400 || c === "bad_request") { alert(m ?? "画像生成パラメータに問題があります。" + (d ? `\n\n詳細: ${d}` : "")); return; }
            alert(m ?? "自動生成に失敗しました" + (d ? `\n\n詳細: ${d}` : ""));
        } finally {
            setLoadingGen(false);
        }
    };

    return (
        <AuthGuard>
            <div id="create-edit" className="bac">
                <div id="input">
                    <div onSubmit={handleSubmit} className="content_wrap">
                        <form className="create-category">
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
                                <button type="button" className="auto-generate-btn" onClick={handleAutoGenerate} disabled={loadingGen}>
                                    {loadingGen ? "生成中..." : "自動生成"}
                                    <Image src="https://api.ekadon.com/storage/images/icons/ai-image.svg" alt="自動生成" className="ai-image" width={70} height={70} />
                                </button>
                            </div>
                            <label className="create-wrap select-category-img">
                                <input type="file" id="img-file" className="select-img" multiple accept="image/*" style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCategoryImg(file); // 実際に送信するファイル
                                            setPreviewUrl(URL.createObjectURL(file)); // プレビュー表示用URL
                                        }
                                    }}
                                />
                                <Image src={previewUrl} alt="選択画像" className="select-img" width={100} height={100} />
                                <p className="select-img-text bold">画像を選択</p>
                            </label>



                            <button type="submit" className="submit-button">完成</button>
                        </form>

                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}