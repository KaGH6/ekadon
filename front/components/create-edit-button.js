"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function CreateEdit() {

    return (
        <div className="create-edit-button">
            <button>
                <Image src="/assets/img/icons/create-card.svg" width={20} height={20} alt="aa" />
            </button>
            <button>
                <Image src="/assets/img/icons/edit-card.svg" width={20} height={20} alt="aa" />
            </button>
        </div>
    );

}