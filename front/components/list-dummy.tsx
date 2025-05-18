"use client";

import Image from "next/image";
import Pagenation from "@/components/pagenation";
import CreateEdit from "@/components/create-edit-button";


export default function ParentList({ children }: { children: React.ReactNode }) {

    return (
        <>
            <section id="list">
                <div className="content_wrap">
                    <div className="list-top">
                        <Pagenation />
                        <CreateEdit />
                    </div>
                    <div className="list-content">
                        {children}
                    </div>
                </div>
            </section>
        </>
    );
}