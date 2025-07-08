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

        utterance.onend = () => {
            speakNext(index + 1);
        };

        synth.speak(utterance);
    };

    speakNext(0);
};
