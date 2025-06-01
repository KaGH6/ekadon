"use client";

import Image from "next/image";
import Link from "next/link";

interface CreateProps {
    createHref: string;
    createIcon: string;
}

export default function CreateButton({
    createHref,
    createIcon
}: CreateProps) {
    return (
        <div className="create-button">
            <Link href={createHref}>
                <Image src={createIcon} width={20} height={20} alt="作成" />
            </Link>
        </div>
    );

}