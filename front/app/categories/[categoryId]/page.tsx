// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import Pagenation from "@/components/pagenation";
// import CreateEdit from "@/components/create-edit-button";
// import { Category } from "@/app/types/category";

// export default function CategoryPage() {
//     const [categories, setCategories] = useState<Category[]>([]);

//     // ページ表示時にLaravel APIからカテゴリ一覧を取得
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const res = await fetch("http://127.0.0.1:8000/api/categories"); // API呼び出し
//                 const data = await res.json(); // レスポンスをJSONで取得
//                 setCategories(data); // stateに保存

//                 // エラーハンドリング
//             } catch (error) {
//                 console.error("カテゴリー取得失敗:", error);
//             }
//         };

//         fetchCategories(); // 関数実行
//     }, []);

//     return (
//         <div className="content_wrap">
//             <div className="list-top">
//                 <Pagenation />
//                 <CreateEdit />
//             </div>

//             {/* カテゴリー一覧 */}
//             <div className="list-content">
//                 {/* .mapで配列の中身を1つずつ表示 */}
//                 {categories.map((category) => (
//                     <button key={category.id} className="category-wrap">
//                         <Image src="/assets/images/icons/category.svg" alt="カテゴリー枠" className="category" width={40} height={40} />
//                         <Image src={category.category_img} alt={category.name} className="category-img" width={80} height={80} />
//                         <div className="category-name-wrap">
//                             <p className="category-name">{category.name}</p>
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// }