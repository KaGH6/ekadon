let voices: SpeechSynthesisVoice[] = [];

// 利用可能な音声を取得
const loadVoices = (): Promise<void> => {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;

        const load = () => {
            voices = synth.getVoices();
            if (voices.length > 0) {
                resolve();
            }
        };

        // すでに取得済みなら即resolve
        voices = synth.getVoices();
        if (voices.length > 0) {
            resolve();
            return;
        }

        // イベント + fallback の両方使う
        synth.onvoiceschanged = () => {
            load();
            resolve();
        };

        if (typeof synth.onvoiceschanged !== "undefined") {
            synth.onvoiceschanged = load;
        }

        const interval = setInterval(() => {
            load();
            if (voices.length > 0) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
};

// ローマ字だけか判定（半角英数字とスペースのみ）
const isRomajiOnly = (str: string) => {
    const trimmed = str.trim();
    return /^[a-zA-Z\s]+$/.test(trimmed);
};

// 言語に応じて適切な声を取得（女性優先）
const getVoiceForLang = (lang: string): SpeechSynthesisVoice | undefined => {
    if (lang === "ja-JP") {
        return voices.find(v => v.name === "Kyoko") || // macOS
            voices.find(v => v.name.includes("Google 日本語")) ||
            voices.find(v => v.name.includes("Mizuki")) || // Windows 日本語女性
            voices.find(v => v.lang === "ja-JP");
    }
    if (lang === "en-US") {
        return voices.find(v => v.name.includes("Google US English")) ||
            voices.find(v => v.name.includes("Zira")) || // Windows 女性英語音声
            voices.find(v => v.name.toLowerCase().includes("female")) ||
            voices.find(v => v.lang === "en-US");
    }
    return voices.find(v => v.lang.startsWith(lang));
};

// フラグで連続読み上げ防止
let isSpeaking = false;

// デッキのカードを読み上げ & カード拡大表示 & 言語自動切替
export const speakDeckCardsWithExpand = async (
    texts: string[],
    onExpandIndex: (index: number | null) => void
) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    const synth = window.speechSynthesis;
    await loadVoices();
    synth.cancel();

    // delayを入れることで Windows Chrome でも確実に動作する
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let index = 0; index < texts.length; index++) {
        const text = texts[index];
        const isEnglish = isRomajiOnly(text);
        const lang = isEnglish ? "en-US" : "ja-JP";
        const voice = getVoiceForLang(lang);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.voice = voice || null;
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        onExpandIndex(index); // 拡大表示

        await new Promise<void>((resolve) => {
            utterance.onend = () => resolve();
            utterance.onerror = () => resolve(); // エラーでも先に進む

            synth.speak(utterance);
        });
    }

    onExpandIndex(null); // 終了後に拡大解除
};


// カードタップで読み上げ
export const speakSingleText = async (
    text: string,
    onStart?: () => void,
    onEnd?: () => void
) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    await loadVoices();
    window.speechSynthesis.cancel(); // 再生中なら停止（重複防止）

    const utterance = new SpeechSynthesisUtterance(text);

    // ローマ字だけの文字列なら英語、それ以外は日本語
    const isEnglish = isRomajiOnly(text);
    utterance.lang = isEnglish ? "en-US" : "ja-JP";

    const voice = getVoiceForLang(utterance.lang);
    if (voice) {
        utterance.voice = voice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
};