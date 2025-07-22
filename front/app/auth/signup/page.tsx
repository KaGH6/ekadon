"use client";

import Image from "next/image";
import { useState } from "react";
// import axios from "axios";
import axios from "@/lib/api/axiosInstance";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    // 入力用state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    //  パスワード表示状態
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // エラーメッセージ
    const [errors, setErrors] = useState<string[]>([]);

    // 登録処理
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // パスワード一致チェック（フロント側）
        if (password !== passwordConfirm) {
            setErrors(["パスワードが一致しません"]);
            return;
        }

        try {
            // サインアップ、LaravelにPOST
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
                name: username,
                email,
                password,
                password_confirmation: passwordConfirm,
            });

            // ログインAPI呼び出し
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                { email, password },
                { withCredentials: true }
            );

            // トークン保存
            const token = res.data.token;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // ホーム画面へ遷移
            router.push("/auth/login");
        } catch (err: any) {
            const responseErrors = err.response?.data?.errors;

            if (responseErrors) {
                // Laravelのerrorsを配列に変換してstateに格納
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
                    <h2>新規登録</h2>

                    {/* エラー表示 */}
                    {errors.length > 0 && (
                        <ul style={{ color: "red", paddingLeft: "20px" }}>
                            {errors.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))}
                        </ul>
                    )}

                    <form onSubmit={handleSignup}>
                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/username.svg" className="sign-img" width={20} height={20} alt="ユーザー名" />
                            <input type="text" id="username" className="textbox" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </label>

                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/email.svg" className="sign-img" width={20} height={20} alt="メールアドレス" />
                            <input type="email" id="email" className="textbox" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>
                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password.svg" className="sign-img" width={20} height={20} alt="パスワード" />
                            <input type={showPassword ? "text" : "password"} id="password" className="textbox" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Image src={
                                showPassword
                                    ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-checked.svg"
                                    : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-check.svg"
                            }
                                className="pwcheck toggle-password"
                                data-target="password" width={20} height={20} alt="パスワードチェック" onClick={() => setShowPassword(!showPassword)} />
                        </label>
                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password.svg" className="sign-img" width={20} height={20} alt="パスワード ( 確認 )" />
                            <input type={showPasswordConfirm ? "text" : "password"} id="password_confirm" className="textbox" placeholder="パスワード ( 確認 )" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
                            <Image src={
                                showPasswordConfirm
                                    ? "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-checked.svg"
                                    : "https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password-check.svg"
                            }
                                className="pwcheck toggle-password"
                                data-target="password_confirm" width={20} height={20} alt="パスワードチェック" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} />
                        </label>

                        <button type="submit" className="submit-button">アカウント登録</button>
                    </form>

                    <a href="/auth/login" className="sign-text">アカウントを既にお持ちの方</a>
                </div>
            </div>
        </div>
    );
}