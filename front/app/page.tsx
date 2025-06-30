"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';
import Pagenation from "@/components/pagenation";
import CreateButton from "@/components/create-button";
import Deck from "@/components/deck";

export default function CategoryPage() {

    const [selectedCards, setSelectedCards] = useState<any[]>([]);

    //  特定のカードだけ削除
    const handleRemoveCard = (indexToRemove: number) => {
        setSelectedCards(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    return (
        <>
            {/* <Deck selectedCards={selectedCards} onRemoveCard={handleRemoveCard} /> */}
            <Deck />
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateButton
                            createHref="/categories/create"
                            createIcon="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/create-category.svg"
                        />
                    </div>
                    <div className="home-list">
                        <Link href={`/categories`} className="home-content">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/checklist.svg" alt="チェックリスト" className="home-list-img" width={70} height={70} />
                            <h3>チェックリスト</h3>
                        </Link>
                        <Link href={`/categories`} className="home-content">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/card-category.svg" alt="カテゴリー" className="home-list-img" width={70} height={70} />
                            <h3>カテゴリー</h3>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}