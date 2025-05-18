"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function CardCreate() {
    const [cardName, setCardName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null); // 最初はファイルが選ばれていない（null）だが、選ばれたらFile型になる

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 画像ファイルが選ばれたときのファイルリスト（配列みたいなもの）
        const files = e.target.files;

        if (files && files.length > 0) { // 画像ファイルがあるか確認
            // 最初の1枚を変数に保存
            setImageFile(files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // バリデーションやAPI送信の処理
        console.log("カード名:", cardName);
        console.log("画像ファイル:", imageFile);
    };

    return (
        <div id="create">
            <section id="input">
                <div className="content_wrap">
                    <form action="" className="create-card" onSubmit={handleSubmit}>
                        <h3 className="mb05">1. カード作成</h3>
                        <label className="card-wrap">
                            <Image src="../assets/images/card.svg" className="card" alt="card" width={80} height={80} />
                            <input type="file" id="img-file" className="select-img" multiple accept="image/*"
                                style={{ display: "none" }} onChange={handleImageChange} />
                            <Image src="../assets/images/icons/select-img.svg" alt="select" className="select-img" width={30} height={30} onClick={() => document.getElementById("img-file")?.click()} />
                            <p className="select-img-text bold">画像を選択</p>
                            <textarea className="put-name" maxLength={12} placeholder="カード名を入力（12文字まで）" required value={cardName} onChange={(e) => setCardName(e.target.value)}></textarea>
                        </label>
                        <h3 className="mt3 mb05">2. カテゴリー選択</h3>
                        <label className="select-category">
                            <Image src="../assets/images/icons/search-category.svg" alt="search-category" className="search-category" width={30} height={30} />
                        </label>

                        <button type="submit" className="submit-button mb5">完成</button>
                    </form>

                </div>
            </section>
        </div>
    );
}