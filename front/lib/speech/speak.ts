// デッキのカードを読み上げ
export const speakDeckCards = (texts: string[]) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    const synth = window.speechSynthesis;

    // ひらがな・カタカナ・漢字を含まない && アルファベットとスペースだけの場合
    const isRomajiOnly = (str: string) => {
        const trimmed = str.trim();
        return /^[a-zA-Z\s]+$/.test(trimmed);
    };

    const speakNext = (index: number) => {
        if (index >= texts.length) return;

        // const utterance = new SpeechSynthesisUtterance(texts[index]);
        const text = texts[index];
        const utterance = new SpeechSynthesisUtterance(text);

        // ローマ字だけの文字列なら英語、それ以外は日本語
        utterance.lang = isRomajiOnly(text) ? "en-US" : "ja-JP";
        // utterance.lang = "ja-JP";
        utterance.rate = 0.95;  // 少しゆっくり（0.95倍速）
        utterance.pitch = 1.1;  // 少し高めの声

        utterance.onend = () => {
            speakNext(index + 1); // 次のテキストへ
        };

        synth.speak(utterance);
    };

    speakNext(0);
};


// カードタップで読み上げ
export const speakSingleText = (text: string) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    // 再生中なら停止（重複防止）
    window.speechSynthesis.cancel();

    // ひらがな・カタカナ・漢字を含まない && アルファベットとスペースだけの場合
    const isRomajiOnly = (str: string) => {
        const trimmed = str.trim();
        return /^[a-zA-Z\s]+$/.test(trimmed);
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isRomajiOnly(text) ? "en-US" : "ja-JP";
    // utterance.lang = "ja-JP";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
};