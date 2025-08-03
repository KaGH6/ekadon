"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
import { saveDeck } from "@/lib/api/deck";
import { usePathname, useRouter } from "next/navigation";
import { speakDeckCards, speakSingleText } from "@/lib/speech/speak";
import Tooltip from '@/components/tooltip';
import axios from "@/lib/api/axiosInstance";

// type DeckProps = {
//     // ユーザーが選択したカードの配列
//     selectedCards: CardData[];

//     // 削除ボタンが押されたときに呼ばれる関数（引数は削除するカードのインデックス）
//     onRemoveCard: (index: number) => void;
// }

// タッチ端末判定用
function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasTouch =
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                // IE10 など
                // @ts-ignore
                navigator.msMaxTouchPoints > 0;
            setIsTouch(hasTouch);
        }
    }, []);
    return isTouch;
}

// export default function Deck({ selectedCards, onRemoveCard }: DeckProps) {
export default function Deck() {
    const [isFullscreen, setIsFullscreen] = useState(false); // デッキ拡大
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null); // 読み上げ時のデッキのカード拡大用

    // Zustandから状態と操作関数を取得
    const deck = useDeckStore((state) => state.deck);
    // const removeCard = useDeckStore((state) => state.removeCard);
    const isSaved = useDeckStore((s) => s.isSaved);
    const setIsSaved = useDeckStore((s) => s.setIsSaved);
    const editingDeckId = useDeckStore((s) => s.editingDeckId);
    const setEditingDeckId = useDeckStore((s) => s.setEditingDeckId);
    const restoreBackup = useDeckStore((s) => s.restoreBackup);
    const removeCardByIndex = useDeckStore((state) => state.removeCardByIndex);
    const clearDeck = useDeckStore((state) => state.clearDeck); // 全削除

    const isTouch = useIsTouchDevice(); // タッチ端末かどうか判定

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(
        "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg"
    );
    const [saving, setSaving] = useState(false);
    const isDisabled = isSaved && !editingDeckId;

    const pathname = usePathname(); // 現在のパスを取得
    const router = useRouter();

    // 編集モード時に既存の name／image を読み込んで初期セット
    useEffect(() => {
        if (!isModalOpen) return;

        if (editingDeckId) {
            // 編集モード：GET で既存データ取得
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/decks/${editingDeckId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
                .then(res => {
                    setName(res.data.name || "");
                    // 画像は既存のURLをそのままプレビュー
                    setPreviewUrl(res.data.image_url || "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg");
                    setThumbFile(null);
                })
                .catch(() => {
                    // 失敗時はプレースホルダーに戻す
                    setName("");
                    setPreviewUrl("https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg");
                    setThumbFile(null);
                });
        } else {
            // 新規モード：常にプレースホルダーにリセット
            setName("");
            setPreviewUrl("https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg");
            setThumbFile(null);
        }
    }, [isModalOpen, editingDeckId]);

    // // 画像プレビュー URL を更新
    useEffect(() => {
        if (!thumbFile) return;
        const url = URL.createObjectURL(thumbFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbFile]);
    // useEffect(() => {
    //     if (!thumbFile) {
    //         return;
    //     }
    //     const url = URL.createObjectURL(thumbFile);
    //     setPreviewUrl(url);
    //     return () => URL.revokeObjectURL(url);
    // }, [thumbFile]);

    // モーダルの open/close
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setName("");
        setThumbFile(null);
        setPreviewUrl("");
    };

    // デッキ保存処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームのデフォルト送信を防ぐ
        // if (isSaved) return; // すでに保存済み
        if (isDisabled) return;  // 編集モード以外で既に保存済みなら無視

        // 1) デッキ名を入力
        if (!name) {
            alert("デッキ名を入力してください");
            return;
        }

        // 2) 画像チェック（新規作成時は必須）
        if (!editingDeckId && !thumbFile) {
            alert("画像を選択してください");
            return;
        }

        // 3) カードIDと順番を組み立て（編集時で画像が未選択 かつ 既存画像もない場合はエラー）
        if (editingDeckId && !thumbFile) {
            // 既存の画像URLがない場合はエラー
            const currentImageExists = previewUrl !== "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/select-img.svg";
            if (!currentImageExists) {
                alert("画像を選択してください");
                return;
            }
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("token")!;
            const form = new FormData();
            form.append("name", name);

            // 画像が選択されている場合のみ追加
            if (thumbFile) {
                form.append("image", thumbFile);
            }

            // カードID＋順番を追加
            deck.forEach((card, idx) => {
                form.append(`cards[${idx}][id]`, String(card.id));
                form.append(`cards[${idx}][position]`, String(idx));
            });

            if (editingDeckId) {
                // 編集モード: メソッドオーバーライドでPUT相当を送信
                form.append("_method", "PUT");
                await axios.post(`/decks/${editingDeckId}`, form);
                alert("デッキを更新しました！");
                setEditingDeckId(null);
            } else {
                // 新規モード: POST
                // await saveDeck(form);
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/decks`,
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,  // Sanctum を使うなら必須
                    }
                );
                alert("デッキを保存しました！");
            }

            setIsSaved(true);
            clearDeck();
            closeModal();

            // 一覧へ戻って再フェッチ
            router.push("/decklist");
            router.refresh();
        } catch (err: any) {
            console.error(err);

            // エラーメッセージをより具体的に表示
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("保存に失敗しました。");
            }
        } finally {
            setSaving(false);
        }
    };

    // 連続読み上げ防止
    let isSpeaking = false;

    // 読み上げ + ハイライト関数
    const speakDeckCardsWithHighlight = (
        texts: string[],
        onSpeakIndex: (index: number | null) => void
    ) => {
        if (!("speechSynthesis" in window)) {
            alert("音声読み上げに対応していません。");
            return;
        }

        if (isSpeaking) return; // 再生中なら無視

        isSpeaking = true;
        const synth = window.speechSynthesis;

        // 一度キャンセルしてから再生
        synth.cancel();

        setTimeout(() => {
            const speakNext = (index: number) => {
                if (index >= texts.length) {
                    onSpeakIndex(null); // 終了時に解除
                    isSpeaking = false;
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(texts[index]);
                utterance.lang = "ja-JP";
                utterance.rate = 0.95;
                utterance.pitch = 1.1;

                utterance.onstart = () => {
                    onSpeakIndex(index); // 現在読み上げ中のindexを通知
                };

                utterance.onend = () => {
                    speakNext(index + 1); // 次へ
                };
                synth.speak(utterance);
            };
            speakNext(0);
        }, 100); // cancelの完了を待つため少し待つ
    };

    //  デッキ拡大時にbodyにクラスを追加・削除
    useEffect(() => {
        const body = document.body; // body要素を取得
        if (isFullscreen) {
            body.classList.add("fullscreen");
        } else {
            body.classList.remove("fullscreen");
        }

        return () => {
            body.classList.remove("fullscreen");
        };
    }, [isFullscreen]);

    // チェックリスト画面なら true
    const isChecklistPage = pathname.startsWith("/checklists");

    return (
        <section id="deck" className={`deck-wrapper ${isFullscreen ? "rotate-wrapper" : ""}`}>
            <div className="deck-outside">
                {/* デッキ保存ボタン */}
                <Tooltip content={
                    editingDeckId
                        ? "変更を保存"
                        : isSaved
                            ? "このデッキは保存済みです"
                            : "デッキを保存"
                }>
                    <button
                        className={`save${isSaved ? ' disabled' : ''}`}
                        onClick={openModal}
                        disabled={isDisabled}  // 編集モード以外で既に保存済みなら無効
                        // disabled={isSaved}
                        aria-disabled={isDisabled}
                    >
                        <Image
                            src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/saved.svg"
                            width={50}
                            height={50}
                            alt="保存"
                        />
                    </button>
                </Tooltip>

                {/* 編集モード中で /categories 以下ならキャンセルボタンを表示 */}
                {editingDeckId && pathname.startsWith("/categories") && (
                    <button
                        className="cancel-edit-btn"
                        onClick={() => {
                            // バックアップから復元して編集モード解除
                            restoreBackup();
                            setEditingDeckId(null);
                            // デッキ一覧に戻る
                            router.push("/decklist");
                        }}
                    >
                        編集をキャンセル❌
                    </button>
                )}

                {/* モーダル */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-window">
                            <h2>デッキを保存</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>1. デッキ名</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="例：朝にやること"
                                        disabled={saving}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>2. デッキアイコン画像</label>
                                    <label className="select-img-wrapper">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const f = e.target.files?.[0] || null;
                                                setThumbFile(f);
                                            }}
                                            disabled={saving}
                                        />

                                        <div className="preview-box">
                                            {previewUrl && (
                                                <Image
                                                    src={previewUrl}
                                                    alt="プレビュー"
                                                    fill
                                                    style={{ objectFit: "contain" }}
                                                />
                                            )}
                                            <p className="preview-label">画像を選択</p>
                                        </div>
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={closeModal} disabled={saving}>
                                        キャンセル
                                    </button>
                                    <button type="submit" disabled={saving}>
                                        保存
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="deck-inside">
                    {/* {selectedCards.map((card, index) => ( */}
                    {deck.map((card, index) => (
                        <button
                            key={index}
                            // className="card-wrap"
                            className={`card-wrap ${speakingIndex === index ? "speaking" : ""}`}
                        >
                            <span className="card-close" onClick={(e) => {
                                // e.stopPropagation();
                                // onRemoveCard(index);
                                e.stopPropagation();
                                // removeCard(card.id); // Zustandから削除
                                removeCardByIndex(index); // indexで削除
                            }}><Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/close.svg" width={15} height={15} alt="close" /></span>
                            <Image src="/assets/img/card.svg" className="card" width={20} height={20} alt="card" />
                            <Image src={card.card_img} className="card-img" width={80} height={80} alt={card.name} unoptimized />
                            <p className="card-name">{card.name}</p>
                        </button>
                    ))}
                </div>
                <div className="deck-bottom">
                    <Tooltip content="カードを読み上げ">
                        <button
                            className="sound"
                            onClick={() => {
                                const texts = deck.map((card) => card.name);
                                speakDeckCardsWithHighlight(texts, setSpeakingIndex);
                            }}
                        >
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/sound.svg" width={50} height={50} alt="サウンド" />
                        </button>
                    </Tooltip>

                    <Tooltip content={isFullscreen ? "デッキを縮小" : "デッキを拡大"}>
                        <button className="zoom" onClick={() => setIsFullscreen(!isFullscreen)}>
                            <Image src={
                                isFullscreen
                                    ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-out.svg"
                                    : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/zoom-up.svg"
                            } width={50} height={50}
                                alt={isFullscreen ? "デッキ拡大" : "デッキ縮小"} />
                        </button>
                    </Tooltip>

                    {/* 全削除ボタン */}
                    <Tooltip content="デッキ内を全削除">
                        <button
                            className="clear"
                            onClick={() => {
                                // if (confirm("デッキ内のすべてのカードを削除しますか？")) {
                                //     clearDeck();
                                // }
                                clearDeck(); // 確認なしで即削除
                            }}
                        >
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/trash.svg"
                                width={50}
                                height={50}
                                alt="デッキ内全削除"
                            />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </section >
    );
}