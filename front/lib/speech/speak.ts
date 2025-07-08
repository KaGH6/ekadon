
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
        utterance.rate = 0.85;  // 少しゆっくり（0.85倍速）
        utterance.pitch = 1.1;  // 少し高めの声

        utterance.onend = () => {
            speakNext(index + 1); // 次のテキストへ
        };

        synth.speak(utterance);
    };

    speakNext(0);
};
