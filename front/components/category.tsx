"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import axios from 'axios';
import { CategoryData } from "@/app/types/category";


type CategoryProps = {
    // onSelectedCategory: (category: CategoryData) => void;
    categories: CategoryData[];
    editModeId: number | null;
    onOptionButtonClick?: (id: number) => void;
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
    onOptionButtonClick,
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
    //             const res = await axios.get<CategoryData[]>("http://52.194.120.11/api/list-category");
    //             console.log(res.data);
    //             setCategories(res.data);
    //         } catch (err) {
    //             console.error("カテゴリー取得エラー:", err);
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    const sortedCategories = [...categories].sort(
        (a, b) => a.id - b.id
    );

    // 今のユーザーIDを取得
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    useEffect(() => {
        const stored = localStorage.getItem("user_id");
        if (stored) {
            const n = Number(stored);
            if (!isNaN(n)) setCurrentUserId(n);
        }
    }, []);

    // デフォルト項目操作時のメッセージ
    const [guardMessage, setGuardMessage] = useState<string | null>(null);

    // 編集ボタンハンドラ
    const handleEditClick = (category: CategoryData) => {
        if (category.user_id === 3 && currentUserId !== 3) {
            setGuardMessage("デフォルトのカテゴリは編集できません");
            return;
        }
        onEdit(category.id);
    };

    // 削除ボタンハンドラ
    const handleDeleteClick = (category: CategoryData) => {
        if (category.user_id === 3 && currentUserId !== 3) {
            setGuardMessage("デフォルトのカテゴリは削除できません");
            return;
        }
        onConfirmDelete(category.id);
    };

    return (
        <>
            {sortedCategories.map((category) => (
                <div
                    key={category.id}
                    onContextMenu={(e) => onContextMenu(e, category.id)}
                    onTouchStart={() => onTouchStart(category.id)}
                    onTouchEnd={onTouchEnd}
                    className="category-item"
                >
                    <button
                        className="option-button"
                        onClick={e => {
                            e.stopPropagation(); // 親要素の Link ナビゲーションを防ぐ
                            onOptionButtonClick?.(category.id); // メニューを表示
                        }}
                    >
                        <img src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg" alt="option" />
                    </button>
                    <Link href={`/categories/${category.id}/cards`} className="category-wrap">
                        <Image
                            src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/category.svg"
                            alt="カテゴリー枠"
                            className="category"
                            width={40}
                            height={40}
                        />
                        <Image
                            src={category.category_img}
                            alt={category.name}
                            className="category-img"
                            width={80}
                            height={80}
                            unoptimized
                        />
                        <div className="category-name-wrap">
                            <p className="category-name">{category.name}</p>
                        </div>
                    </Link>

                    {editModeId === category.id && (
                        <div className="edit-delete-menu">
                            <button onClick={() => handleEditClick(category)}>編集</button>
                            <button onClick={() => handleDeleteClick(category)}>削除</button>
                        </div>
                    )}
                </div>
            ))}

            {/* デフォルト項目ガード用モーダル */}
            {guardMessage && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{guardMessage}</p>
                        <div className="modal-buttons">
                            <button
                                className="cancel-btn"
                                onClick={() => setGuardMessage(null)}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}