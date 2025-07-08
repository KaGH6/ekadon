let voices: SpeechSynthesisVoice[] = [];

// 利用可能な音声を取得（非同期）
const loadVoices = (): Promise<void> => {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        const interval = setInterval(() => {
            voices = synth.getVoices();
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

// デッキのカードを読み上げ & カード拡大表示 & 言語自動切替
export const speakDeckCardsWithExpand = async (
    texts: string[],
    onExpandIndex: (index: number | null) => void
) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    await loadVoices();
    const synth = window.speechSynthesis;

    const speakNext = (index: number) => {
        if (index >= texts.length) {
            onExpandIndex(null); // 読み上げ完了したら拡大解除
            return;
        }

        const text = texts[index];
        const utterance = new SpeechSynthesisUtterance(text);

        // ローマ字だけの文字列なら英語、それ以外は日本語
        const isEnglish = isRomajiOnly(text);
        utterance.lang = isEnglish ? "en-US" : "ja-JP";

        const matchedVoice = voices.find(v =>
            v.lang.startsWith(isEnglish ? "en" : "ja")
        );
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        utterance.rate = 0.95;  // 少しゆっくり（0.95倍速）
        utterance.pitch = 1.1;  // 少し高めの声

        utterance.onstart = () => {
            onExpandIndex(index); // 該当のカードを拡大表示
        };

        utterance.onend = () => {
            speakNext(index + 1); // 次のテキストへ
        };

        synth.speak(utterance);
    };

    speakNext(0);
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
    const matchedVoice = voices.find(v =>
        v.lang.startsWith(isEnglish ? "en" : "ja")
    );
    if (matchedVoice) {
        utterance.voice = matchedVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
};