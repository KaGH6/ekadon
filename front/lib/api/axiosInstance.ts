import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // クッキー送信が必要な場合（HttpOnly にするなら必要）
});

// トークンを毎回自動付与
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 401エラー時に自動でリフレッシュ処理
instance.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    `${API_URL}/refresh`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const newAccessToken = refreshResponse.data.access_token;

                // トークン保存（必要に応じて zustand/context にも反映）
                localStorage.setItem('token', newAccessToken);

                // ヘッダーを新しいトークンに更新して再実行
                instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return instance(originalRequest);
            } catch (refreshError) {
                console.error('リフレッシュトークン失敗:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default instance;
