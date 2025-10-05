"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axiosInstance";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const togglePassword = () => setShowPassword((v) => !v);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`/login`, { email, password });

            // 返却のどれでも拾えるように
            const token =
                res.data?.access_token ??
                res.data?.token ??
                res.data?.authorisation?.token;

            if (!token) {
                console.log("login response:", res.data);
                setError("ログインに失敗しました（トークンが取得できませんでした）");
                return;
            }

            // 保存は生JWT（先頭の"Bearer "は削除）
            const clean = String(token).replace(/^Bearer\s+/i, "");
            localStorage.setItem("token", clean);

            // 画面遷移
            // router.push("/categories/19/cards");
            router.push("/");
        } catch (err) {
            setError("ログインに失敗しました");
        }
    };

    return (
        <div id="input" className="sign">
            <div className="sign-wrap-outer">
                <div className="sign-wrap-inner">
                    <div className="log-top">
                        <Image
                            src="https://api.ekadon.com/storage/images/icons/ekadon.png"
                            alt="えかどん"
                            width={100}
                            height={100}
                            className="log-logo"
                        />
                        <h2>ログイン</h2>
                    </div>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <form onSubmit={handleLogin}>
                        <label className="form-group">
                            <Image
                                src="https://api.ekadon.com/storage/images/icons/email.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="メールアドレス"
                            />
                            <input
                                type="email"
                                className="textbox"
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="form-group">
                            <Image
                                src="https://api.ekadon.com/storage/images/icons/password.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="パスワード"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="textbox"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Image
                                src={`https://api.ekadon.com/storage/images/icons/${showPassword ? "password-checked" : "password-check"
                                    }.svg`}
                                className="pwcheck toggle-password"
                                width={20}
                                height={20}
                                alt="パスワードチェック"
                                onClick={togglePassword}
                                style={{ cursor: "pointer" }}
                            />
                        </label>

                        <button type="submit" className="submit-button">
                            ログイン
                        </button>
                    </form>

                    <a href="/auth/signup" className="sign-text">
                        アカウント登録がまだの方
                    </a>
                </div>
            </div>
        </div>
    );
}
