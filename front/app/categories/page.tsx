"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';
import Pagenation from "@/components/pagenation";
import CreateEdit from "@/components/create-edit-button";
import Deck from "@/components/deck";
import Category from "@/components/category";
import { CategoryData } from "../types/category";

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCards, setSelectedCards] = useState<any[]>([]);

    //  特定のカードだけ削除
    const handleRemoveCard = (indexToRemove: number) => {
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // ページ表示時にLaravel APIからカテゴリ一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/list-category"); // API呼び出し
                console.log(res.data);
                console.log("isArray:", Array.isArray(res.data));

                // 配列かどうかで分岐して代入
                // const data = Array.isArray(res.data) ? res.data : res.data.data;

                //const data = await res.json(); // レスポンスをJSONで取得
                setCategories(res.data); // stateに保存
                console.log(categories);

                // エラーハンドリング
            } catch (error) {
                console.error("カテゴリー取得失敗:", error);
            }
        };

        fetchCategories(); // 関数実行
    }, []);

    // カテゴリ選択処理
    const handleSelectCategory = (category: CategoryData) => {
        setSelectedCards((prev) => [...prev, category]);
    };

    console.log("ステートに保存されたcategories:", categories);

    return (
        <>
            <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateEdit />
                    </div>

                    {/* カテゴリー一覧 */}
                    <div className="list-content">
                        {/* .mapで配列の中身を1つずつ表示 */}
                        {categories.map((category) => (
                            // カード一覧に遷移
                            <Link key={category.id} href={`/categories/${category.id}/cards`} className="category-wrap">
                                <Image src="/assets/images/icons/category.svg" alt="カテゴリー枠" className="category" width={40} height={40} />
                                <Image
                                    src={category.category_img.startsWith("http") ? category.category_img : `/assets/images/${category.category_img}`}
                                    alt={category.name}
                                    className="category-img"
                                    width={80} height={80}
                                />
                                <div className="category-name-wrap">
                                    <p className="category-name">{category.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}