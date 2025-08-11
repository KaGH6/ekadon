"use client";

import { useEffect, useRef, useState } from "react";
import Tooltip from "./tooltip";

type Props = {
    /** 画面最上部でも表示しておくか（既定: true） */
    showOnTop?: boolean;
    /** 何pxスクロールしたら表示に切り替えるか（既定: 1） */
    threshold?: number;
    className?: string;
};

export default function PageTop({
    showOnTop = true,
    threshold = 1,
    className = "",
}: Props) {
    const [visible, setVisible] = useState(showOnTop);
    const ticking = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const y = window.scrollY || window.pageYOffset || 0;
                setVisible(showOnTop ? true : y > threshold);
                ticking.current = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // 初回
        return () => window.removeEventListener("scroll", onScroll);
    }, [showOnTop, threshold]);

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" }); // 300ms指定の代替

    return (
        <div
            className={`pagetop ${className}`}
            data-visible={visible}
        >
            <Tooltip content="ページトップへ">
                <button id="js-pagetop" onClick={scrollToTop} type="button">
                    <img src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/pagetop.svg" alt="pagetop" className="pagetop-button" />
                </button>
            </Tooltip>
        </div>
    );
}
