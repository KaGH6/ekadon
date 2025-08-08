// /lib/api/axiosInstance.ts
import axios, {
    AxiosInstance,
    AxiosHeaders,
    InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 余計なインターセプタが付かない“素”クライアント（/refresh専用）
const bare = axios.create();

function toAxiosHeaders(h?: any): AxiosHeaders {
    if (!h) return new AxiosHeaders();
    if (h instanceof AxiosHeaders) return h;
    return new AxiosHeaders(h as any);
}

function attachInterceptors(client: AxiosInstance) {
    // リクエスト: 毎回 Authorization 付与（"Bearer "が保存されてても剥がす）
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

            if (status !== 401) return Promise.reject(error);

            const url = String(original.url || "");
            if (original._retry || url.endsWith("/refresh")) {
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

            if (isRefreshing) {
                return waitForNewToken(original);
            }

            isRefreshing = true;
            try {
                const headers = new AxiosHeaders();
                headers.set("Authorization", `Bearer ${oldToken}`);

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

                flushQueue(newToken);

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

// 念のため「素の axios」にも同じ挙動を付与
attachInterceptors(axios);

export default instance;
