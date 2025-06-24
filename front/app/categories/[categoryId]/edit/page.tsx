"use client";

import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditCategory() {
    const { categoryId } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [categoryImg, setCategoryImg] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`);
                setName(res.data.name);
                setPreviewUrl(res.data.category_img);
            } catch (err) {
                console.error(err);
                setError("カテゴリーの読み込みに失敗しました");
            }
        };
        fetchCategory();
    }, [categoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            router.push("/categories");
        } catch (err) {
            console.error(err);
            setError("カテゴリーの更新に失敗しました");
        }
    };

    return (
        <div id="create-edit" className="bac">
            <div id="input">
                <div onSubmit={handleSubmit} className="content_wrap">
                    <form className="create-category">
                        <h3>1. カテゴリー名</h3>
                        <label className="create-wrap">
                            <input
                                type="text"
                                className="textbox"
                                placeholder="カテゴリー名を入力"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

                        <h3>2. カテゴリー画像</h3>
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
                            <Image src={previewUrl} alt="選択画像" className="select-img" />
                            <p className="select-img-text bold">画像を選択</p>
                        </label>

                        <button type="submit" className="submit-button">完成</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
