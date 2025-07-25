// デッキのカードを読み上げ
export const speakDeckCards = (texts: string[]) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    const synth = window.speechSynthesis;

    const speakNext = (index: number) => {
        if (index >= texts.length) return;

        const utterance = new SpeechSynthesisUtterance(texts[index]);

        utterance.lang = "ja-JP";
        utterance.rate = 1.2;  // 読み上げ速度（少し速め）
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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
};
