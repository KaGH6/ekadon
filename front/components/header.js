"use client";

import Image from "next/image";
import { useState } from "react";
// import "../../assets/css/sp.css";

export default function Header({ selectedCards }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="header__inner">
                <button>
                    <Image src="/assets/img/icons/back.svg" alt="" class="header-back" width={30} height={30} />
                </button>
                <h3 class="header-title">タイトル</h3>
                <button onClick={toggleMenu} className={`drawer__button ${menuOpen ? "active" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`drawer__nav ${menuOpen ? "active" : ""}`}>
                    <div className="drawer__nav__inner">
                        <ul className="drawer__nav__menu">
                            <li className="drawer__nav__item">
                                <a className="drawer__nav__link" href="#">リンク</a>
                            </li>
                            <li className="drawer__nav__item">
                                <a className="drawer__nav__link" href="#">リンク</a>
                            </li>
                            <li className="drawer__nav__item">
                                <a className="drawer__nav__link" href="#">リンク</a>
                            </li>
                            <li className="drawer__nav__item">
                                <a className="drawer__nav__link" href="#">リンク</a>
                            </li>
                            <li className="drawer__nav__item">
                                <a className="drawer__nav__link" href="#">リンク</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}