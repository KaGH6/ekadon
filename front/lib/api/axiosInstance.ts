import axios, { AxiosHeaders } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 単一インスタンス
const instance = axios.create({
    baseURL: API_URL,
    // withCredentials: true, // クッキー送信が必要な場合（HttpOnly にするなら必要）
    // withCredentials: false, // 通常は不要
});

// --- リクエストインターセプタ：毎回Authorizationを付与 ---
instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const raw = localStorage.getItem("token") || "";
        const token = raw.replace(/^Bearer\s+/i, ""); // Bearer二重対策

        if (token) {
            // headers が未設定/プレーンオブジェクトでも AxiosHeaders に統一
            let headers: AxiosHeaders;
            if (!config.headers) {
                headers = new AxiosHeaders();
            } else if (config.headers instanceof AxiosHeaders) {
                headers = config.headers;
            } else {
                headers = new AxiosHeaders(config.headers as any);
            }
            headers.set("Authorization", `Bearer ${token}`);
            config.headers = headers;
        }
    }
    return config;
});

// --- 401時のリフレッシュ制御（多重発火ガード付き） ---
let isRefreshing = false;
type Replay = (t: string) => void;
let queue: Replay[] = [];

const waitForNewToken = (original: any) =>
    new Promise((resolve, reject) => {
        queue.push((newToken: string) => {
            try {
                let headers: AxiosHeaders;
                if (!original.headers) {
                    headers = new AxiosHeaders();
                } else if (original.headers instanceof AxiosHeaders) {
                    headers = original.headers;
                } else {
                    headers = new AxiosHeaders(original.headers as any);
                }
                headers.set("Authorization", `Bearer ${newToken}`);
                original.headers = headers;
                instance.request(original).then(resolve).catch(reject);
            } catch (e) {
                reject(e);
            }
        });
    });

const flushQueue = (newToken: string) => {
    queue.forEach((fn) => fn(newToken));
    queue = [];
};

instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config || {};
        const status = error?.response?.status;

        if (status !== 401) return Promise.reject(error);

        // /refresh 自身 or 既にリトライ済みなら終了
        const url = String(original.url || "");
        if (original._retry || url.endsWith("/refresh")) {
            return Promise.reject(error);
        }
        original._retry = true;

        const raw = (typeof window !== "undefined" ? localStorage.getItem("token") : "") || "";
        const oldToken = raw.replace(/^Bearer\s+/i, "");
        if (!oldToken) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                // 認可不要のページに飛ばす
                window.location.href = "/auth/login";
            }
            return Promise.reject(error);
        }

        // すでに他のリクエストがリフレッシュ中なら待つ
        if (isRefreshing) {
            return waitForNewToken(original);
        }

        isRefreshing = true;
        try {
            // 旧トークンでリフレッシュ
            const hdrs = new AxiosHeaders();
            hdrs.set("Authorization", `Bearer ${oldToken}`);

            const { data } = await axios.post(`${API_URL}/refresh`, {}, { headers: hdrs });

            const newToken =
                data?.access_token ?? data?.token ?? data?.authorisation?.token;

            if (!newToken) {
                throw new Error("No token in refresh response");
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("token", String(newToken).replace(/^Bearer\s+/i, ""));
            }

            // 待っていたリクエストを再送
            flushQueue(newToken);

            // 元リクエストを再送
            const newHeaders = new AxiosHeaders(original.headers as any);
            newHeaders.set("Authorization", `Bearer ${newToken}`);
            original.headers = newHeaders;

            return instance.request(original);
        } catch (e) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/auth/login";
            }
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }
);
export default instance;