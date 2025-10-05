"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { CardData } from "@/app/types/card";
import { useDeckStore } from "@/store/deckStore"; // Zustandから追加
import { saveDeck } from "@/lib/api/deck";
import { usePathname, useRouter } from "next/navigation";
import { speakDeckCards, speakSingleText } from "@/lib/speech/speak";
import Tooltip from '@/components/tooltip';
import axios from "@/lib/api/axiosInstance";

// 画像生成
function b64ToBlob(b64: string, mime = "image/png"): Blob {
    const byte = atob(b64);
    const arr = new Uint8Array(byte.length);
    for (let i = 0; i < byte.length; i++) arr[i] = byte.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

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

    // デッキ内の横スクロール設定用
    const insideRef = useRef<HTMLDivElement>(null);
    const [isOverflow, setIsOverflow] = useState(false);
    const cardRefs = useRef<Array<HTMLButtonElement | null>>([]); // 音声ボタン押下で自動スクロール

    const isTouch = useIsTouchDevice(); // タッチ端末かどうか判定

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(
        "https://api.ekadon.com/storage/images/icons/select-img.svg"
    );
    const [saving, setSaving] = useState(false);
    const isDisabled = isSaved && !editingDeckId;

    const [loadingGenThumb, setLoadingGenThumb] = useState(false); // 画像生成

    const pathname = usePathname(); // 現在のパスを取得
    const router = useRouter();

    // デッキ内の横スクロール設定用
    useEffect(() => {
        const el = insideRef.current;
        if (!el) return;

        // オーバーフロー判定関数
        const checkOverflow = () => {
            setIsOverflow(el.scrollWidth > el.clientWidth);
        };

        // 初回判定
        checkOverflow();
        // ウィンドウリサイズのたびにも判定
        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
        };
    }, [deck]); // deckが変わるたび再実行

    // 音声ボタン押下で、デッキ内自動スクロール
    useEffect(() => {
        if (speakingIndex === null) return;
        const el = cardRefs.current[speakingIndex];
        if (!el) return;

        // smooth に中央寄せスクロール
        el.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    }, [speakingIndex]);

    // 編集モード時に既存の name／image を読み込んで初期セット
    useEffect(() => {
        if (!isModalOpen) return;

        if (editingDeckId) {
            console.log("ssaaaaa:", editingDeckId);
            // 編集モード：GET で既存データ取得
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/decks/${editingDeckId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
                .then(res => {
                    console.log(res.data);
                    setName(res.data.name || "");
                    // 画像は既存のURLをそのままプレビュー
                    setPreviewUrl(res.data.image_url || "https://api.ekadon.com/storage/images/icons/select-img.svg");
                    setThumbFile(null);
                })
                .catch(() => {
                    // 失敗時はプレースホルダーに戻す
                    setName("");
                    setPreviewUrl("https://api.ekadon.com/storage/images/icons/select-img.svg");
                    setThumbFile(null);
                });
        } else {
            // 新規モード：常にプレースホルダーにリセット
            setName("");
            setPreviewUrl("https://api.ekadon.com/storage/images/icons/select-img.svg");
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

    // モーダルの open/close
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setName("");
        setThumbFile(null);
        setPreviewUrl("");
    };

    // 画像生成
    const handleAutoGenerateThumb = async () => {
        if (!name.trim()) { alert("先にマイリスト名を入力してください"); return; }
        if (loadingGenThumb) return;

        setLoadingGenThumb(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auto-image`,
                { type: "deck", name },
                { withCredentials: true } // axiosInstance により Authorization は自動付与
            );

            const { url, b64, mime } = res.data as { url: string; b64?: string | null; mime?: string };
            let blob: Blob;

            if (b64) blob = b64ToBlob(b64, mime || "image/png");
            else blob = await (await fetch(url)).blob();

            const file = new File([blob], `${name}.png`, { type: mime || "image/png" });
            setThumbFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } catch (err: any) {
            console.error(err);
            const s = err?.response?.status, c = err?.response?.data?.code;
            const m = err?.response?.data?.message, d = err?.response?.data?.devMessage;
            if (s === 403 || c === "org_unverified") return alert(m ?? "OpenAIの組織が未認証です。Verify Organization を完了してください。");
            if (s === 402 || c === "billing_limit") return alert(m ?? "OpenAIの無料枠/上限に達しました。");
            if (s === 429 || c === "rate_limited") return alert(m ?? "混み合っています。しばらくして再試行してください。");
            if (s === 400 || c === "bad_request") return alert((m ?? "パラメータ不正") + (d ? `\n\n詳細:${d}` : ""));
            alert(m ?? "自動生成に失敗しました" + (d ? `\n\n詳細:${d}` : ""));
        } finally {
            setLoadingGenThumb(false);
        }
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
            const currentImageExists = previewUrl !== "https://api.ekadon.com/storage/images/icons/select-img.svg";
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
                setEditingDeckId(null);
            } else {
                // 新規モード: POST
                await saveDeck(form);
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

    // デッキ内の個別のカードを読み上げ（タップした1枚だけ）
    const speakSingleInDeck = (text: string, index: number) => {
        if (!("speechSynthesis" in window)) {
            alert("音声読み上げに対応していません。");
            return;
        }

        const synth = window.speechSynthesis;
        // 連続読み上げや他の発話を止めてから開始
        synth.cancel();

        // cancel直後の発話を安定させるため少し待つ
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "ja-JP";
            utterance.rate = 0.95;
            utterance.pitch = 1.1;

            utterance.onstart = () => setSpeakingIndex(index);   // ハイライトON
            utterance.onend = () => setSpeakingIndex(null);      // ハイライトOFF

            synth.speak(utterance);
        }, 50);
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
                            ? "マイリストに保存済みです"
                            : "マイリストに保存"
                }>
                    <button
                        className={`save${isSaved ? ' disabled' : ''}`}
                        onClick={openModal}
                        disabled={isDisabled}  // 編集モード以外で既に保存済みなら無効
                        // disabled={isSaved}
                        aria-disabled={isDisabled}
                    >
                        <Image
                            src="https://api.ekadon.com/storage/images/icons/saved.svg"
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
                            <h2>マイリストに保存</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>1. マイリスト名</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="マイリスト名を入力（16文字まで）"
                                        disabled={saving}
                                        maxLength={16}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="create-flex">
                                        <label>2. マイリスト画像</label>
                                        <button
                                            type="button"
                                            className="auto-generate-btn ai-button"
                                            onClick={handleAutoGenerateThumb}
                                            disabled={saving || loadingGenThumb}
                                        >
                                            {loadingGenThumb ? "生成中..." : "自動生成"}
                                            <Image
                                                src="https://api.ekadon.com/storage/images/icons/ai-image.svg"
                                                alt="自動生成"
                                                className="ai-image"
                                                width={70}
                                                height={70}
                                            />
                                        </button>
                                    </div>
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

                <div
                    ref={insideRef}
                    className={`deck-inside ${isOverflow ? "left-align" : "center-align"}`}
                >
                    {deck.map((card, index) => (
                        <button
                            key={index}
                            className={`card-wrap ${speakingIndex === index ? "speaking" : ""}`}
                            ref={el => { cardRefs.current[index] = el; }}
                            onClick={() => speakSingleInDeck(card.name, index)}
                        >
                            <span className="card-close" onClick={(e) => {
                                // e.stopPropagation();
                                // onRemoveCard(index);
                                e.stopPropagation();
                                // removeCard(card.id); // Zustandから削除
                                removeCardByIndex(index); // indexで削除
                            }}><Image src="https://api.ekadon.com/storage/images/icons/close.svg" width={15} height={15} alt="close" /></span>
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
                            <Image src="https://api.ekadon.com/storage/images/icons/sound.svg" width={50} height={50} alt="サウンド" />
                        </button>
                    </Tooltip>

                    <Tooltip content={isFullscreen ? "デッキを縮小" : "デッキを拡大"}>
                        <button className="zoom" onClick={() => setIsFullscreen(!isFullscreen)}>
                            <Image src={
                                isFullscreen
                                    ? "https://api.ekadon.com/storage/images/icons/zoom-out.svg"
                                    : "https://api.ekadon.com/storage/images/icons/zoom-up.svg"
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
                                src="https://api.ekadon.com/storage/images/icons/trash.svg"
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