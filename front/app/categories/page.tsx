"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import axios from 'axios';
import axios from "@/lib/api/axiosInstance";
import Breadcrumbs from "@/components/breadcrumbs";
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
            await axios.delete(`/categories/${confirmDeleteId}`);
            setCategories((prev) => prev.filter((c) => c.id !== confirmDeleteId));
            setEditModeId(null);
            setConfirmDeleteId(null);
        } catch (error) {
            console.error("削除エラー:", error);
        }
    };

    // ログイン中のユーザーIDを取得
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/user");
                setCurrentUserId(res.data.id);
            } catch (e) {
                console.error("ユーザー情報の取得に失敗しました", e);
            }
        })();
    }, []);

    // カテゴリ一覧（相対パス＋インターセプタ任せ）
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`/list-category`);
                const sorted = res.data.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
                setCategories(sorted);
            } catch (error) {
                console.error("カテゴリー取得失敗:", error);
            }
        })();
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
                        <Breadcrumbs />
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
                            onOptionButtonClick={(id: number) => setEditModeId(id)}
                            onContextMenu={handleContextMenu}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onEdit={handleEdit}
                            onConfirmDelete={setConfirmDeleteId}
                            currentUserId={currentUserId} // ログイン中のユーザーIDを渡す
                        />
                    </div>
                </div>
            </section>

            {confirmDeleteId !== null && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>選択したカテゴリーを削除しますか？<br></br>
                            削除すると<b>カテゴリー内のカードも<br></br>
                                <span className="red">全て削除</span></b>されます。</p>
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