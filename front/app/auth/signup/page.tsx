"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "@/lib/api/axiosInstance";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (password !== passwordConfirm) {
            setErrors(["パスワードが一致しません"]);
            return;
        }
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            setErrors(["正しいメールアドレス形式を入力してください"]);
            return;
        }

        try {
            // ユーザー作成
            await axios.post(`/signup`, {
                name: username,
                email,
                password,
                password_confirmation: passwordConfirm,
            });

            // 直後にログイン
            const res = await axios.post(`/login`, { email, password });

            const token =
                res.data?.access_token ??
                res.data?.token ??
                res.data?.authorisation?.token;

            if (!token) {
                console.log("signup->login response:", res.data);
                setErrors(["登録後のログインに失敗しました（トークン未取得）"]);
                return;
            }

            const clean = String(token).replace(/^Bearer\s+/i, "");
            localStorage.setItem("token", clean);

            router.push("/");
        } catch (err: any) {
            const responseErrors = err?.response?.data?.errors;
            if (responseErrors) {
                const messages = Object.values(responseErrors).flat() as string[];
                setErrors(messages);
            } else {
                setErrors(["登録に失敗しました"]);
            }
        }
    };

    return (
        <div id="input" className="sign">
            <div className="sign-wrap-outer">
                <div className="sign-wrap-inner">
                    <div className="sign-top">
                        <Image
                            src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/ekadon.png"
                            alt="えかどん"
                            width={100}
                            height={100}
                            className="sign-logo"
                        />
                        <h2>新規登録</h2>
                    </div>

                    {errors.length > 0 && (
                        <ul style={{ color: "red", paddingLeft: "20px" }}>
                            {errors.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))}
                        </ul>
                    )}

                    <form onSubmit={handleSignup}>
                        <label className="form-group">
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/username.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="ユーザー名"
                            />
                            <input
                                type="text"
                                id="username"
                                className="textbox"
                                placeholder="ユーザー名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </label>

                        <label className="form-group">
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/email.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="メールアドレス"
                            />
                            <input
                                type="email"
                                pattern="[^@]+@[^@]+\.[a-zA-Z]{2,}"
                                id="email"
                                className="textbox"
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label className="form-group">
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="パスワード"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="textbox"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Image
                                src={
                                    showPassword
                                        ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-checked.svg"
                                        : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-check.svg"
                                }
                                className="pwcheck toggle-password"
                                data-target="password"
                                width={20}
                                height={20}
                                alt="パスワードチェック"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </label>

                        <label className="form-group">
                            <Image
                                src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password.svg"
                                className="sign-img"
                                width={20}
                                height={20}
                                alt="パスワード ( 確認 )"
                            />
                            <input
                                type={showPasswordConfirm ? "text" : "password"}
                                id="password_confirm"
                                className="textbox"
                                placeholder="パスワード ( 確認 )"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                            <Image
                                src={
                                    showPasswordConfirm
                                        ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-checked.svg"
                                        : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-check.svg"
                                }
                                className="pwcheck toggle-password"
                                data-target="password_confirm"
                                width={20}
                                height={20}
                                alt="パスワードチェック"
                                onClick={() =>
                                    setShowPasswordConfirm(!showPasswordConfirm)
                                }
                            />
                        </label>

                        <button type="submit" className="submit-button">
                            アカウント登録
                        </button>
                    </form>

                    <a href="/auth/login" className="sign-text">
                        アカウントを既にお持ちの方
                    </a>
                </div>
            </div>
        </div>
    );
}
