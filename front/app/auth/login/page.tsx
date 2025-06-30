"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // パスワードの表示/非表示を切り替え
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // ログイン処理
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // フォーム送信時のページリロードを防ぐ

        try {
            // ログインリクエスト送信
            // await を使っているので、APIの返事が返るまで次の処理には進まない
            const res = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password
            });

            // トークンの取得と保存
            // Laravelからの返事（JSON）にあるtokenを取り出す
            const token = res.data.token;
            localStorage.setItem("token", token);

            router.push("/"); // ログイン後、ホーム画面に遷移
        } catch (err: any) {
            setError("ログインに失敗しました");
        }
    };

    return (
        <div id="input" className="sign">
            <div className="sign-wrap-outer">
                <div className="sign-wrap-inner">
                    <h2>ログイン</h2>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <form onSubmit={handleLogin}>
                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/email.svg" className="sign-img" width={20} height={20} alt="メールアドレス" />
                            <input type="email" className="textbox" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>

                        <label className="form-group">
                            <Image src="https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/password.svg" className="sign-img" width={20} height={20} alt="パスワード" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="textbox"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Image
                                src={`https://ekadon-backet.s3.ap-northeast-1.amazonaws.com/icons/${showPassword ? "password-checked" : "password-check"}.svg`} className="pwcheck toggle-password"
                                width={20}
                                height={20}
                                alt="パスワードチェック"
                                onClick={togglePassword}
                                style={{ cursor: "pointer" }}
                            />
                        </label>

                        <button type="submit" className="submit-button">ログイン</button>
                    </form>

                    <a href="#" className="sign-text">パスワードを忘れた方</a>
                    <a href="/auth/signup" className="sign-text">アカウント登録がまだの方</a>
                </div>
            </div>
        </div>
    );
}