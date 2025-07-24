"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useState, useEffect } from "react";

interface TooltipProps {
    children: React.ReactNode;
    content: string;
}

function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasTouch =
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                // for IE10
                // @ts-ignore
                navigator.msMaxTouchPoints > 0;
            setIsTouch(hasTouch);
        }
    }, []);
    return isTouch;
}

export default function Tooltip({ children, content }: TooltipProps) {
    const isTouch = useIsTouchDevice();

    // タッチ端末なら、ツールチップラッパーをスキップして子要素だけ返す
    if (isTouch) {
        return <>{children}</>;
    }

    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side="top"
                        align="center"
                        sideOffset={6}
                        style={{
                            position: 'relative',
                            background: '#3d3d3d',
                            color: '#fff',
                            fontSize: '0.83rem',
                            padding: '0.27rem 0.5rem',
                            borderRadius: '0.25rem',
                            zIndex: 9999,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {content}
                        <TooltipPrimitive.Arrow style={{ fill: '#3d3d3d' }} />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
