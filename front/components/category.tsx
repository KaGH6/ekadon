"use client";

import Image from "next/image";
import Link from "next/link";
// import { useEffect, useState } from "react";
// import axios from 'axios';
import { CategoryData } from "@/app/types/category";


type CategoryProps = {
    // onSelectedCategory: (category: CategoryData) => void;
    categories: CategoryData[];
    editModeId: number | null;
    onContextMenu: (e: React.MouseEvent, id: number) => void;
    onTouchStart: (id: number) => void;
    onTouchEnd: () => void;
    onEdit: (id: number) => void;
    onConfirmDelete: (id: number) => void;
}

export default function Category({
    // onSelectedCategory,
    categories,
    editModeId,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onEdit,
    onConfirmDelete,
}: CategoryProps) {

    // CategoryDataの配列
    // const [categories, setCategories] = useState<CategoryData[]>([]);

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const res = await axios.get<CategoryData[]>("http://127.0.0.1:8000/api/list-category");
    //             console.log(res.data);
    //             setCategories(res.data);
    //         } catch (err) {
    //             console.error("カテゴリー取得エラー:", err);
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    return (
        <>
            {categories.map((category) => (
                <div
                    key={category.id}
                    onContextMenu={(e) => onContextMenu(e, category.id)}
                    onTouchStart={() => onTouchStart(category.id)}
                    onTouchEnd={onTouchEnd}
                    className="category-item"
                >
                    <Link href={`/categories/${category.id}/cards`} className="category-wrap">
                        <Image
                            src="https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/category.svg"
                            alt="カテゴリー枠"
                            className="category"
                            width={40}
                            height={40}
                        />
                        <Image
                            src={
                                category.category_img.startsWith("http")
                                    ? category.category_img
                                    : `/assets/images/${category.category_img}`
                            }
                            alt={category.name}
                            className="category-img"
                            width={80}
                            height={80}
                        />
                        <div className="category-name-wrap">
                            <p className="category-name">{category.name}</p>
                        </div>
                    </Link>

                    {editModeId === category.id && (
                        <div className="edit-delete-menu">
                            <button onClick={() => onEdit(category.id)}>編集</button>
                            <button onClick={() => onConfirmDelete(category.id)}>削除</button>
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}