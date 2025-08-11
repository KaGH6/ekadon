"use client";

import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import "../../public/assets/css/guide.css";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "使い方ガイド",
//     description: "絵カードアプリの基本操作・作成・デッキ機能の説明",
// };

export default function GuidePage() {
    return (
        <AuthGuard>
            <section id="guide">
                <div className="guide-wrapper">
                    <h1>えかどん 使い方</h1>
                    <nav>
                        <ul>
                            <li><a href="#basic-function">基本機能</a></li>
                            <li><a href="#create-function">作成機能</a></li>
                            <li><a href="#deck-function">デッキ機能</a></li>
                            <li><a href="#others-function">その他</a></li>
                        </ul>
                    </nav>


                    {/* 基本機能 */}
                    <div className="guide" aria-labelledby="sec-basic">
                        <h2 id="sec-basic" className="section__title">
                            <span className="badge">1</span> 基本機能
                        </h2>

                        <article className="card-row">
                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">カテゴリー一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-1.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">好きなカテゴリーを選択します。</p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">②</span>
                                    <h3 className="card__title">カード一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-2.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    カテゴリーの中のカード一覧から、好きなカードを選択します。<br />
                                    選択したカードはデッキに表示されます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">③</span>
                                    <h3 className="card__title">デッキ</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-3.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    音声ボタンでデッキ上のカードの音声が流れます。<br />
                                    拡大・縮小ボタンで、デッキを画面幅に合わせたり元に戻せます。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* 作成機能 */}
                    <div className="guide" aria-labelledby="sec-create">
                        <h2 id="sec-create" className="section__title">
                            <span className="badge">2</span> 作成機能
                        </h2>

                        <article className="card-row">
                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">カテゴリー一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-1.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">好きなカテゴリーを選択します。</p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">②</span>
                                    <h3 className="card__title">カード一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-2.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    カテゴリーの中のカード一覧から、好きなカードを選択します。<br />
                                    選択したカードはデッキに表示されます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">③</span>
                                    <h3 className="card__title">デッキ</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-3.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    音声ボタンでデッキ上のカードの音声が流れます。<br />
                                    拡大・縮小ボタンで、デッキを画面幅に合わせたり元に戻せます。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* デッキ機能 */}
                    <div className="guide" aria-labelledby="sec-deck">
                        <h2 id="sec-deck" className="section__title">
                            <span className="badge">3</span> デッキ機能
                        </h2>

                        <article className="card-row">
                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">カテゴリー一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-1.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">好きなカテゴリーを選択します。</p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">②</span>
                                    <h3 className="card__title">カード一覧画面</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-2.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    カテゴリーの中のカード一覧から、好きなカードを選択します。<br />
                                    選択したカードはデッキに表示されます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">③</span>
                                    <h3 className="card__title">デッキ</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-3.png"
                                                alt="使い方"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    音声ボタンでデッキ上のカードの音声が流れます。<br />
                                    拡大・縮小ボタンで、デッキを画面幅に合わせたり元に戻せます。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* その他 */}
                    <div className="guide" aria-labelledby="sec-others">
                        <h2 id="sec-others" className="section__title">
                            <span className="badge">4</span> その他
                        </h2>
                        <div className="notice">
                            <span className="notice__icon" aria-hidden="true">⚠</span>
                            <p className="notice__text">デフォルトのカテゴリー・カードの、編集・削除はできません。</p>
                        </div>
                    </div>
                </div>
            </section>
        </AuthGuard>
    );
}
