"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation"; //categoryIdを取得
import Tooltip from '@/components/tooltip';
// import { useEffect, useState } from "react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const categoryId = params.categoryid; // フォルダ名が [categoryid] の場合

    // 現在のURLに応じて階層を判定（5階層構造）
    let currentLayer = 0;

    if (pathname.includes("/cards")) {
        currentLayer = 3; // カード一覧
    } else if (pathname.includes("categories")) {
        currentLayer = 2; // カテゴリ一覧
    } else if (pathname.startsWith("/decklist")) {
        currentLayer = 4; // デッキ一覧
    } else if (pathname === "/" || pathname === "/menu") {
        currentLayer = 1; // ホーム画面
    }

    // 階層に応じて画像パスを切り替える
    const getLayerImage = (_: number, name: string) =>
        `https://api.ekadon.com/storage/images/icons/${name}.svg`;

    // 現在の階層までを表示
    // layerが ホーム（1）か、今いる階層か、1つ前の階層ならtrueを返す
    const shouldShow = (layer: number) =>
        layer === 1 || layer === currentLayer || layer === currentLayer - 1;

    return (
        <div className="page-nation">
            {shouldShow(1) && (
                <>
                    {/* ホーム */}
                    <Tooltip content="ホーム">
                        <button onClick={() => router.push("/")}>
                            <Image src={getLayerImage(1, "home")} width={40} height={40} alt="home" />
                        </button>
                    </Tooltip>
                </>
            )}

            {shouldShow(2) && (
                <>
                    <Image src="https://api.ekadon.com/storage/images/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* カテゴリー 一覧 */}
                    <Tooltip content="カテゴリー 一覧">
                        <button onClick={() => router.push("/categories")}>
                            <Image src={getLayerImage(2, "card-category")} width={40} height={40} alt="layer-2" />
                        </button>
                    </Tooltip>
                </>
            )}

            {currentLayer === 3 && (
                <>
                    <Image src="https://api.ekadon.com/storage/images/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* カード一覧 */}
                    <Tooltip content="カード一覧">
                        <button onClick={() => router.push(`/categories/${categoryId}/cards`)}>
                            <Image src={getLayerImage(3, "card-pagenate")} width={40} height={40} alt="layer-3" />
                        </button>
                    </Tooltip>
                </>
            )}

            {currentLayer === 4 && (
                <>
                    <Image src="https://api.ekadon.com/storage/images/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* デッキ一覧 */}
                    <Tooltip content="デッキ一覧">
                        <button onClick={() => router.push("/decklist")}>
                            <Image src={getLayerImage(4, "deck-pagenate")} width={40} height={40} alt="デッキ一覧" />
                        </button>
                    </Tooltip>
                </>
            )}
        </div>
    );

}