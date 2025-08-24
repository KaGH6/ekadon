"use client";

import Image from "next/image";
import Link from "next/link";
import Tooltip from "@/components/tooltip";

interface CreateProps {
    createHref: string;
    createIcon: string;
    tooltip?: string;
}

export default function CreateButton({
    createHref,
    createIcon,
    tooltip = "作成",
}: CreateProps) {
    return (
        <div className="create-button">
            <Tooltip content={tooltip}>
                <Link href={createHref}>
                    <Image src={createIcon} width={20} height={20} alt="作成" />
                </Link>
            </Tooltip>
        </div>
    );

}