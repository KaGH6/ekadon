"use client";

import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "使い方ガイド",
//     description: "絵カードアプリの基本操作・作成・デッキ機能の説明",
// };

export default function InstructionPage() {
    return (
        <AuthGuard>
            <section id="instruction">
                <h1>えかどん 使い方</h1>
                <nav>
                    <ul>
                        <li><a href="#basic-function">基本機能</a></li>
                        <li><a href="#create-function">作成機能</a></li>
                        <li><a href="#deck-function">デッキ機能</a></li>
                        <li><a href="#others-function">その他</a></li>
                    </ul>
                </nav>

                <div id="basic-function">
                    <h2>基本機能</h2>
                    <ol>
                        <li>
                            <h3>カテゴリー一覧画面</h3>
                            <p>好きなカテゴリーを選択します。</p>
                            <img src="" alt="" />
                            <p>選択したカードはデッキに表示されます。</p>
                        </li>
                    </ol>
                </div>
            </section>
        </AuthGuard>
    );
}
