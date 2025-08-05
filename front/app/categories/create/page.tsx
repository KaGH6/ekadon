"use client";

import Image from 'next/image';
import { useState } from "react"; // 入力値を一時的に保存
import { useRouter } from "next/navigation";// ページ遷移
// import axios from "axios"; // API（Laravel）へデータを送る
import axios from "@/lib/api/axiosInstance";
import AuthGuard from "@/components/AuthGuard";

export default function CreateCategoryPage() {
    const router = useRouter();

    // Reactの状態（state）を定義
    const [name, setName] = useState(""); // カテゴリー名
    const [categoryImg, setCategoryImg] = useState<File | null>(null); // 画像ファイル
    const [error, setError] = useState(""); // エラーメッセージ
    const [previewUrl, setPreviewUrl] = useState<string>("https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg"); // 選択した画像を表示するため


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

                            <h3>2. カテゴリー画像</h3>
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