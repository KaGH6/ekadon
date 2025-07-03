"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Pagenation from "@/components/pagenation";
import CreateButton from "@/components/create-button";
import Deck from "@/components/deck";
import Category from "@/components/category";
import { CategoryData } from "../types/category";
import AuthGuard from "@/components/AuthGuard";

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCards, setSelectedCards] = useState<any[]>([]);
    const [editModeId, setEditModeId] = useState<number | null>(null); // 編集・削除ボタン表示ID
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null); // タイマーを保持
    const router = useRouter();

    // デッキのカード削除
    const handleRemoveCard = (indexToRemove: number) => {
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // カテゴリー編集ボタン
    const handleEdit = (id: number) => {
        router.push(`/categories/${id}/edit`);
    };

    // カテゴリー削除機能
    const handleDelete = async () => {
        if (confirmDeleteId === null) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${confirmDeleteId}`);
            setCategories(prev => prev.filter(cate => cate.id !== confirmDeleteId)); //選択したIDと一致しないものだけを取り出して、新しい配列を作る。
            setEditModeId(null); // 削除後は編集・削除ボタンも閉じる
            setConfirmDeleteId(null); // 削除確認ポップアップを閉じる
        } catch (error) {
            console.error("削除エラー:", error);
        }
    };

    // ページ表示時にLaravel APIからカテゴリ一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list-category`); // API呼び出し
                // setCategories(res.data); // stateに保存
                // console.log(categories);

                const token = localStorage.getItem('token'); // 🔑 トークン取得
                if (!token) {
                    console.error("トークンがありません（未ログイン）");
                    return;
                }

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/list-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true, // Laravel Sanctum を使っている場合
                });
                setCategories(res.data);

                // エラーハンドリング
            } catch (error) {
                console.error("カテゴリー取得失敗:", error);
            }
        };
        fetchCategories(); // 関数実行
    }, []);

    // 長押し・右クリックの管理
    const handleContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault(); // ブラウザの右クリックメニューを無効化
        setEditModeId(id); // このIDのカテゴリーに編集メニューを表示
    };

    // スマホの長押し開始時
    const handleTouchStart = (id: number) => {
        longPressTimer.current = setTimeout(() => {
            setEditModeId(id);
        }, 600); // 600ms 長押しで編集ボタン表示
    };

    // 指を離したら長押しキャンセル
    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    // 編集・削除メニュー以外をクリックしたら閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // .edit-delete-menu内をクリックしたときは無視。それ以外ならメニューを閉じる
            if (!target.closest(".edit-delete-menu")) {
                setEditModeId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AuthGuard>
            {/* <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} /> */}
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateButton
                            createHref="/categories/create"
                            createIcon="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/create-category.svg"
                        />
                    </div>

                    {/* カテゴリー一覧 */}
                    <div className="list-content">
                        <Category
                            categories={categories}
                            editModeId={editModeId}
                            onContextMenu={handleContextMenu}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onEdit={handleEdit}
                            onConfirmDelete={setConfirmDeleteId}
                        />
                    </div>
                </div>
            </section>

            {confirmDeleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>選択したカテゴリーを削除しますか？<br></br>
                            削除すると<b>カテゴリー内のカードも全て削除</b>されます。</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>キャンセル</button>
                            <button className="delete-btn" onClick={handleDelete}>削除</button>
                        </div>
                    </div>
                </div>
            )}

        </AuthGuard>
    );
}