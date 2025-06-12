"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation"; //categoryIdを取得
// import { useEffect, useState } from "react";

export default function Pagenation() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const categoryId = params.categoryid; // フォルダ名が [categoryid] の場合

    // 現在のURLに応じて階層を判定（5階層構造）
    let currentLayer = 0;

    if (pathname.includes("/cards")) {
        currentLayer = 3;
    } else if (pathname.includes("categories")) {
        currentLayer = 2;
    } else if (
        pathname.startsWith("/checklists/") &&
        (pathname.includes("/edit") || pathname.includes("/create") || pathname.match(/^\/checklists\/\d+$/))
    ) {
        currentLayer = 5; // チェックリスト詳細や編集・作成
    } else if (pathname.startsWith("/checklists")) {
        currentLayer = 4; // チェックリスト一覧
    } else if (pathname === "/" || pathname === "/menu") {
        currentLayer = 1; // ホーム画面
    }

    // 階層に応じて画像パスを切り替える
    const getLayerImage = (_: number, name: string) =>
        `https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/${name}.svg`;

    // 現在の階層までを表示
    // layerが ホーム（1）か、今いる階層か、1つ前の階層ならtrueを返す
    const shouldShow = (layer: number) =>
        layer === 1 || layer === currentLayer || layer === currentLayer - 1;

    return (
        <div className="page-nation">
            {shouldShow(1) && (
                <>
                    {/* ホーム */}
                    <button onClick={() => router.push("/")}>
                        <Image src={getLayerImage(1, "home")} width={40} height={40} alt="home" />
                    </button>
                </>
            )}

            {shouldShow(2) && (
                <>
                    <Image src="https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* カテゴリ一覧 */}
                    <button onClick={() => router.push("/categories")}>
                        <Image src={getLayerImage(2, "card-category")} width={40} height={40} alt="layer-2" />
                    </button>
                </>
            )}

            {shouldShow(3) && (
                <>
                    <Image src="https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* カード一覧 */}
                    <button onClick={() => router.push(`/categories/${categoryId}/cards`)}>
                        <Image src={getLayerImage(3, "card-pagenate")} width={40} height={40} alt="layer-3" />
                    </button>
                </>
            )}

            {shouldShow(4) && (
                <>
                    {/* チェックリスト一覧 */}
                    <button onClick={() => router.push("/checklists")}>
                        <Image src={getLayerImage(4, "checklist")} width={40} height={40} alt="チェックリスト一覧" />
                    </button>
                </>
            )}

            {shouldShow(5) && (
                <>
                    <Image src="https://ekadon-bucket.s3.ap-northeast-1.amazonaws.com/icons/nation-next.svg" className="nation-next" width={40} height={40} alt="next-pagenate" />

                    {/* チェックリスト詳細・作成・編集 */}
                    <button onClick={() => router.push("/checklists/1")}>
                        <Image src={getLayerImage(5, "checklist-detail")} width={40} height={40} alt="チェックリスト詳細" />
                    </button>
                </>
            )}
        </div>
    );

}