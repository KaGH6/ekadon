// /lib/api/axiosInstance.ts
import axios, {
    AxiosInstance,
    AxiosHeaders,
    InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// リフレッシュ専用（インターセプタ無し）
const bare = axios.create();

function toAxiosHeaders(h?: any): AxiosHeaders {
    if (!h) return new AxiosHeaders();
    if (h instanceof AxiosHeaders) return h;
    return new AxiosHeaders(h as any);
}

function attachInterceptors(client: AxiosInstance) {
    // 毎回 Authorization を付与（"Bearer "付きで保存されていても剥がす）
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const raw = localStorage.getItem("token") || "";
            const token = raw.replace(/^Bearer\s+/i, "");
            if (token) {
                const headers = toAxiosHeaders(config.headers);
                headers.set("Authorization", `Bearer ${token}`);
                config.headers = headers;
            }
        }
        return config;
    });

    // 多重401の待ち合わせ
    let isRefreshing = false;
    type Replay = (t: string) => void;
    let queue: Replay[] = [];

    const waitForNewToken = (original: InternalAxiosRequestConfig) =>
        new Promise((resolve, reject) => {
            queue.push((newToken: string) => {
                try {
                    const headers = toAxiosHeaders(original.headers);
                    headers.set("Authorization", `Bearer ${newToken}`);
                    original.headers = headers;
                    client.request(original).then(resolve).catch(reject);
                } catch (e) {
                    reject(e);
                }
            });
        });

    const flushQueue = (newToken: string) => {
        queue.forEach((fn) => fn(newToken));
        queue = [];
    };

    client.interceptors.response.use(
        (res) => res,
        async (error) => {
            const original = (error?.config || {}) as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };
            const status = error?.response?.status;

            // 401以外 or /refresh 自身 or 既に再試行済み → そのまま
            const url = String(original.url || "");
            if (status !== 401 || original._retry || url.endsWith("/refresh")) {
                return Promise.reject(error);
            }
            original._retry = true;

            const raw =
                (typeof window !== "undefined" ? localStorage.getItem("token") : "") ||
                "";
            const oldToken = raw.replace(/^Bearer\s+/i, "");
            if (!oldToken) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    window.location.href = "/auth/login";
                }
                return Promise.reject(error);
            }

            // 既にリフレッシュ中なら待つ
            if (isRefreshing) {
                return waitForNewToken(original);
            }

            isRefreshing = true;
            try {
                const headers = new AxiosHeaders();
                headers.set("Authorization", `Bearer ${oldToken}`);

                // 旧トークンでリフレッシュ
                const { data } = await bare.post(
                    `${API_URL}/refresh`,
                    {},
                    { headers }
                );

                const newToken =
                    data?.access_token ?? data?.token ?? data?.authorisation?.token;

                if (!newToken) throw new Error("No token in refresh response");

                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        "token",
                        String(newToken).replace(/^Bearer\s+/i, "")
                    );
                }

                // 待機中のリクエストを解放
                flushQueue(newToken);

                // 元リクエスト再送
                const h2 = toAxiosHeaders(original.headers);
                h2.set("Authorization", `Bearer ${newToken}`);
                original.headers = h2;

                return client.request(original);
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
}

// 自前インスタンス
const instance = axios.create({ baseURL: API_URL });
attachInterceptors(instance);

// 念のため素の axios にも同じ挙動を付与（直importしても守る）
attachInterceptors(axios);

export default instance;






// import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const bare = axios.create(); // ← refresh専用(インターセプタ無し)

// // 毎回 Authorization を付与
// export const api = axios.create({ baseURL: API_URL });
// api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     const raw = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
//     const token = raw.replace(/^Bearer\s+/i, "");
//     if (token) {
//         const h = config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers as any);
//         h.set("Authorization", `Bearer ${token}`);
//         config.headers = h;
//     }
//     return config;
// });

// let refreshing = false;
// let waiters: Array<(t: string) => void> = [];
// const wait = (orig: any) => new Promise((res, rej) => {
//     waiters.push((t) => {
//         const h = orig.headers instanceof AxiosHeaders ? orig.headers : new AxiosHeaders(orig.headers as any);
//         h.set("Authorization", `Bearer ${t}`);
//         orig.headers = h;
//         api.request(orig).then(res).catch(rej);
//     });
// });
// const flush = (t: string) => { waiters.forEach(fn => fn(t)); waiters = []; };

// api.interceptors.response.use(r => r, async (err) => {
//     const orig = (err.config || {}) as InternalAxiosRequestConfig & { _retry?: boolean };
//     if (err.response?.status !== 401 || orig._retry || String(orig.url || "").endsWith("/refresh")) {
//         return Promise.reject(err);
//     }
//     orig._retry = true;

//     const raw = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
//     const oldToken = raw.replace(/^Bearer\s+/i, "");
//     if (!oldToken) {
//         if (typeof window !== "undefined") { localStorage.removeItem("token"); location.href = "/auth/login"; }
//         return Promise.reject(err);
//     }
//     if (refreshing) return wait(orig);

//     refreshing = true;
//     try {
//         const hdr = new AxiosHeaders({ Authorization: `Bearer ${oldToken}` }); // ← 必ず付ける
//         const { data } = await bare.post(`${API_URL}/refresh`, {}, { headers: hdr });
//         const newToken = data?.access_token ?? data?.token ?? data?.authorisation?.token;
//         if (!newToken) throw new Error("no token from refresh");
//         if (typeof window !== "undefined") localStorage.setItem("token", String(newToken).replace(/^Bearer\s+/i, ""));
//         flush(newToken);
//         const h2 = orig.headers instanceof AxiosHeaders ? orig.headers : new AxiosHeaders(orig.headers as any);
//         h2.set("Authorization", `Bearer ${newToken}`);
//         orig.headers = h2;
//         return api.request(orig);
//     } catch (e) {
//         if (typeof window !== "undefined") { localStorage.removeItem("token"); location.href = "/auth/login"; }
//         return Promise.reject(e);
//     } finally { refreshing = false; }
// });

// export default api;






// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const instance = axios.create({
//     baseURL: API_URL,
//     withCredentials: true, // クッキー送信が必要な場合（HttpOnly にするなら必要）
//     // withCredentials: false, // 通常は不要
// });

// // トークンを毎回自動付与
// instance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // 401エラー時に自動でリフレッシュ処理
// instance.interceptors.response.use(
//     res => res,
//     async err => {
//         const originalRequest = err.config;
//         console.log('401エラーが発生しました:', err);

//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             console.log('401エラーが発生しました:', err);

//             try {
//                 const refreshResponse = await axios.post(
//                     `${API_URL}/refresh`,
//                     {},
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`,
//                         },
//                     }
//                 );
//                 console.log('リフレッシュトークン成功:', refreshResponse);
//                 const newAccessToken = refreshResponse.data.access_token;
//                 console.log('新しいアクセストークン:', newAccessToken);

//                 // トークン保存（必要に応じて zustand/context にも反映）
//                 localStorage.setItem('token', newAccessToken);

//                 // ヘッダーを新しいトークンに更新して再実行
//                 instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 console.log('終わり', originalRequest);

//                 return instance(originalRequest);
//             } catch (refreshError) {
//                 console.error('リフレッシュトークン失敗:', refreshError);
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(err);
//     }
// );

// export default instance;
