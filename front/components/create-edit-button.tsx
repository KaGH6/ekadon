"use client";

import Image from "next/image";
import Link from "next/link";

interface CreateEditProps {
    createHref: string;
    editHref: string;
    createIcon: string;
    editIcon: string;
}

export default function CreateEdit({
    createHref,
    editHref,
    createIcon,
    editIcon
}: CreateEditProps) {
    return (
        <div className="create-edit-button">
            <Link href={createHref}>
                <Image src={createIcon} width={20} height={20} alt="作成" />
            </Link>
            <Link href={editHref}>
                <Image src={editIcon} width={20} height={20} alt="編集" />
            </Link>
        </div>
    );

}