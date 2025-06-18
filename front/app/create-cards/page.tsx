"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CardCreate() {
    const [cardName, setCardName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null); // 最初はファイルが選ばれていない（null）だが、選ばれたらFile型になる
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg"); // 選択した画像を表示するため
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    // カテゴリ一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://52.194.120.11/api/list-category");
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

    // フォーム送信処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // バリデーションやAPI送信の処理
        console.log("カード名:", cardName);
        console.log("画像ファイル:", imageFile);

        if (!cardName || !imageFile || !selectedCategory) {
            alert("すべての項目を入力してください");
            return;
        }

        const formData = new FormData();
        formData.append("name", cardName);
        formData.append("card_img", imageFile);
        formData.append("category_id", selectedCategory.toString());
        formData.append("user_id", "1"); // 動作確認用の仮ID

        setIsSubmitting(true);

        try {
            const res = await fetch("http://52.194.120.11/api/create-card", {
                method: "POST",
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
        <div id="create" className="bac">
            <section id="input">
                <div className="content_wrap">
                    <form action="" className="create-card" onSubmit={handleSubmit}>
                        <h3 className="mb05">1. カード作成</h3>
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
    );
}