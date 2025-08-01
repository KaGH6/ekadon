// // components/deck-item.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { FC } from "react";
// import { DeckData } from "@/types/deck";

// type Props = {
//     deck: DeckData;
//     onClick: () => void;
//     onContextMenu: () => void;
// };

// const DeckItem: FC<Props> = ({ deck, onClick, onContextMenu }) => (
//     <div className="deck-card" onClick={onClick} onContextMenu={onContextMenu}>
//         <Image
//             src={deck.image_url ?? "/assets/img/default-deck.svg"}
//             width={80}
//             height={80}
//             alt={deck.name}
//         />
//         <p>{deck.name}</p>
//     </div>
// );

// export default DeckItem;
