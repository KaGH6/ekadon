export const speakDeckCards = (texts: string[]) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    const synth = window.speechSynthesis;

    const isRomaji = (str: string) => /^[a-zA-Z\s]+$/.test(str);

    const speakNext = (index: number) => {
        if (index >= texts.length) return;

        const text = texts[index];
        const utterance = new SpeechSynthesisUtterance(text);

        // ローマ字だけの文字列なら英語、それ以外は日本語
        utterance.lang = isRomaji(text) ? "en-US" : "ja-JP";
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        utterance.onend = () => {
            speakNext(index + 1);
        };

        synth.speak(utterance);
    };

    speakNext(0);
};
export const speakSingleText = (text: string) => {
    if (!("speechSynthesis" in window)) {
        alert("音声読み上げに対応していません。");
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const isRomaji = /^[a-zA-Z\s]+$/.test(text);

    utterance.lang = isRomaji ? "en-US" : "ja-JP";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
};
