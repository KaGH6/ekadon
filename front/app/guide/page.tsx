"use client";

import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import "../../public/assets/css/guide.css";
import PageTop from "@/components/PageTop";
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
                    <div className="guide-top">
                        <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/ekadon-kun.png" alt="えかどん" className="ekadon" width={70} height={70} />
                        <h1>えかどん 使い方ガイド</h1>
                    </div>
                    <nav>
                        <ol>
                            <li><a href="#guide-1">基本機能</a></li>
                            <li><a href="#guide-2">カテゴリー</a></li>
                            <li><a href="#guide-3">カード</a></li>
                            <li><a href="#guide-4">デッキ</a></li>
                            <li><a href="#guide-5">その他</a></li>
                        </ol>
                    </nav>


                    {/* 基本機能 */}
                    <div className="guide" aria-labelledby="sec-basic">
                        <h2 id="sec-basic" className="section__title">
                            <span id="guide-1" className="badge">1</span> 基本機能
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
                                <p className="card__desc">① 好きなカテゴリーを選択します。</p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">2</span>
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
                                    ① カテゴリーの中のカード一覧から、好きなカードを選択します。</p>
                                <p className="card__desc">
                                    ② 選択したカードはデッキに表示されます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">3</span>
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
                                    ① 音声ボタンを押下すると、デッキ上のカードの音声が流れます。</p>
                                <p className="card__desc">
                                    ② 拡大・縮小ボタンで、デッキを画面幅に合わせたり元に戻したりすることができます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">4</span>
                                    <h3 className="card__title">デッキ上のカード削除</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-10.png"
                                                alt="デッキ上のカード削除"
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
                                    ① カードの
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/close.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    ボタンで、個別のカードを削除することができます。
                                </p>
                                <p className="card__desc">
                                    ② デッキのゴミ箱ボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/trash.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    で、デッキ上のカード全てを削除することができます。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* カテゴリー */}
                    <div className="guide" aria-labelledby="sec-create">
                        <h2 id="sec-create" className="section__title">
                            <span id="guide-2" className="badge">2</span> カテゴリー
                        </h2>

                        <article className="card-row">
                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">カテゴリー作成</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-4.png"
                                                alt="カテゴリー作成"
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
                                    ① カテゴリー作成ボタンから、カテゴリーを作成することができます。
                                </p>
                                <p className="card__desc">
                                    ② 名前を入力し、アイコン画像を選択して完成ボタンを押下します。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">2</span>
                                    <h3 className="card__title">カテゴリー編集</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-5.png"
                                                alt="カテゴリー編集"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 編集したいカテゴリーのオプションボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    を押下し、編集ボタンを選択します。
                                </p>
                                <p className="card__desc">
                                    ② 名前や画像を変更し、完成ボタンを押下します。
                                </p>
                                <p className="card__desc">
                                    ⭐PCの場合は右クリック、タブレット・スマートフォンの場合は長押しでもメニューを表示できます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">3</span>
                                    <h3 className="card__title">カテゴリー削除</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-6.png"
                                                alt="カテゴリー削除"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 削除したいカテゴリーのオプションボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    から削除を選択し、確認画面で削除を確定します。
                                </p>
                                <p className="card__desc">
                                    ※ カテゴリーを削除すると、カテゴリー内のカードもすべて削除されるため、ご注意ください。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* カード */}
                    <div className="guide" aria-labelledby="sec-create">
                        <h2 id="sec-create" className="section__title">
                            <span id="guide-3" className="badge">3</span> カード
                        </h2>

                        <article className="card-row">
                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">カード作成</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-7.png"
                                                alt="カード作成"
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
                                    ① 画像を選択しカード名を入力。
                                </p>
                                <p className="card__desc">
                                    ② 所属カテゴリーを選び、完成ボタンを押下します。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">2</span>
                                    <h3 className="card__title">カード編集</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-8.png"
                                                alt="カード編集"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 編集したいカードのオプションボタン&nbsp;
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    &nbsp;を押下し、編集ボタンを選択します。
                                </p>
                                <p className="card__desc">
                                    ② カード名や画像を編集します。
                                </p>
                                <p className="card__desc">
                                    ③ 所属カテゴリーを選び、完成ボタンを押下します。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">3</span>
                                    <h3 className="card__title">カード削除</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-9.png"
                                                alt="カード削除"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 削除したいカードのオプションボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    から削除を選択し、確認画面で削除を確定します。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* デッキ機能 */}
                    <div className="guide" aria-labelledby="sec-deck">
                        <h2 id="sec-deck" className="section__title">
                            <span id="guide-4" className="badge">4</span> デッキ
                        </h2>

                        <article className="card-row">


                            <div className="card">
                                <div className="card__head">
                                    <span className="step">1</span>
                                    <h3 className="card__title">デッキ保存</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-11.png"
                                                alt="デッキ保存"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① デッキ上にカードが並んだ状態でデッキ保存ボタンを押下すると、デッキ上のカードとその並び順が保存されます。
                                </p>
                                <p className="card__desc">
                                    ② 保存したデッキは、デッキ一覧で確認できます。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">2</span>
                                    <h3 className="card__title">保存したデッキの編集</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-12.png"
                                                alt="保存デッキの編集"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 編集したいデッキのオプションボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    を押下し、編集ボタンを選択します。
                                </p>
                                <p className="card__desc">
                                    ② 自動的にカテゴリー一覧へ移動するため、好きなカードを選択できます。
                                </p>
                                <p className="card__desc">
                                    ③ カードを追加・削除後、デッキ保存ボタンを押下します。
                                </p>
                                <p className="card__desc">
                                    ※ 編集をキャンセルしたい場合は、「編集をキャンセル❌」を選択します。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">3</span>
                                    <h3 className="card__title">編集したデッキの保存</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-13.png"
                                                alt="編集したデッキの保存"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 3.「保存したデッキの編集」の③でデッキ保存ボタンを押下後、ウィンドウが表示されます。
                                </p>
                                <p className="card__desc">
                                    ② デッキ名や画像を編集し、保存ボタンで編集完了です。
                                </p>
                            </div>

                            <div className="card">
                                <div className="card__head">
                                    <span className="step">4</span>
                                    <h3 className="card__title">保存したデッキの削除</h3>
                                </div>
                                <div className="mock">
                                    <div className="mock__screen">
                                        <div className="mock__figure">
                                            <Image
                                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/guides-14.png"
                                                alt="保存デッキの削除"
                                                fill
                                                sizes="(min-width: 1000px) 300px, (min-width: 640px) 45vw, 90vw"
                                                quality={95}
                                                className="guides-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="card__desc">
                                    ① 削除したいデッキのオプションボタン
                                    <Image
                                        src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/option.svg"
                                        alt="オプションボタン"
                                        width={5} height={5}
                                        className="guide-option"
                                    />
                                    から削除を選択し、確認画面で削除を確定します。
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* その他 */}
                    <div className="guide" aria-labelledby="sec-others">
                        <h2 id="sec-others" className="section__title">
                            <span id="guide-5" className="badge">5</span> その他
                        </h2>
                        <div className="notice">
                            <span className="notice__icon" aria-hidden="true">⚠</span>
                            <p className="notice__text"><b>デフォルトのカテゴリーとカードの編集・削除はできません。</b></p>
                        </div>
                    </div>

                    <PageTop showOnTop={true} />
                </div>
            </section>
        </AuthGuard>
    );
}
