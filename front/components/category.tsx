"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from 'axios';
import { CategoryData } from "@/app/types/category";


type CategoryProps = {
    onSelectedCategory: (category: CategoryData) => void;
}

export default function Category({ onSelectedCategory }: CategoryProps) {

    // CategoryDataの配列
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get<CategoryData[]>("http://127.0.0.1:8000/api/list-category");
                console.log(res.data);
                setCategories(res.data);
            } catch (err) {
                console.error("カテゴリー取得エラー:", err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            {categories.map((category, index) => (
                <button key={category.id} onClick={() => onSelectedCategory(category)} className="category-wrap">
                    <Image src="/assets/img/category.svg" className="category" width={20} height={20} alt="category" />
                    <Image src={category.category_img} className="category-img" width={80} height={80} alt={category.name} />
                    <p className="category-name">{category.name}</p>
                </button>
            ))}
        </>
    );
}