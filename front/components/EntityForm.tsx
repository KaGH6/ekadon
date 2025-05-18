"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

// EntityForm コンポーネントに渡す引数
type EntityFormProps = {
    title: string;
    imagePreview: string;
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    inputValue: string;
    onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    buttonText: string;
    onSubmit: () => void;
    showCategorySelector?: boolean;
    onCategoryClick?: () => void;
};

export default function EntityForm({
    // 再利用できるフォームコンポーネント
    // オブジェクトの分割代入（ex: props.title ではなく title として直接使えるようになる）
    title,
    imagePreview,
    onImageChange,
    inputValue,
    onInputChange,
    placeholder,
    buttonText,
    onSubmit,
    showCategorySelector = false,
    onCategoryClick,
}: EntityFormProps) {
    return (
        <form className="create-card" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <h3 className="mb05">{title}</h3>
            <label className="card-wrap">
                <Image src={imagePreview} className="card" alt="preview" width={100} height={100} />
                <input type="file" id="img-file" className="select-img" multiple accept="image/*"
                    style={{ display: "none" }} onChange={onImageChange} />
                <Image src="../assets/images/icons/select-img.svg" alt="" className="select-img" />
                <p className="select-img-text bold">画像を選択</p>
                <textarea className="put-name" maxLength={12} placeholder={placeholder}
                    required value={inputValue} onChange={onInputChange}></textarea>
            </label>
            {showCategorySelector && onCategoryClick && (
                <>
                    <h3 className="mt3 mb05">2. カテゴリー選択</h3>
                    <label className="select-category">
                        <Image src="../assets/images/icons/search-category.svg" alt="search-category" className="search-category" width={30} height={30} />
                    </label>
                </>
            )}
            <button type="submit" className="submit-button mb5">{buttonText}</button>
        </form>
    );
}

