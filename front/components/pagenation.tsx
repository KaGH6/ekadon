"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Pagenation() {

    return (
        <div className="page-nation">
            <button>
                <Image src="../assets/img/icons/home.svg" width={30} height={30} alt="aa" />
            </button>
            <Image src="../assets/img/icons/nation-next.svg" className="nation-next" width={30} height={30} alt="aa" />
            <button>
                <Image src="../assets/img/icons/card-category.svg" width={30} height={30} alt="aa" />
            </button>
            <Image src="../assets/img/icons/nation-next.svg" className="nation-next" width={30} height={30} alt="aa" />
            <button>
                <Image src="../assets/img/icons/card.svg" width={30} height={30} alt="aa" />
            </button>
        </div>
    );

}