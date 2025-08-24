// "use client";

// import Image from "next/image";

// export default function Create() {

//     return (
//         <>
//             <div id="create">
//                 <section id="input">
//                     <div className="content_wrap">
//                         <form action="" className="create-card">
//                             <h3 className="mb05">1. カード作成</h3>
//                             <label className="card-wrap">
//                                 <Image src="../assets/images/card.svg" className="card" alt="" />
//                                 <input type="file" id="img-file" className="select-img" multiple accept="image/*"
//                                     style={{ display: "none" }} />
//                                 <Image src="../assets/images/icons/select-img.svg" alt="" className="select-img" />
//                                 <p className="select-img-text bold">画像を選択</p>
//                                 <textarea className="put-name" maxLength={12} placeholder="カード名を入力（12文字まで）"
//                                     required></textarea>
//                             </label>
//                             <h3 className="mt3 mb05">2. カテゴリー選択</h3>
//                             <label className="select-category">
//                                 <Image src="../assets/images/icons/search-category.svg" alt="" className="search-category" />
//                             </label>

//                             <button type="submit" className="submit-button mb5">完成</button>
//                         </form>

//                     </div>
//                 </section>
//             </div>
//         </>
//     );
// }