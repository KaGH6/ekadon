// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         // domains: ['http://127.0.0.1:8000'],
//         // domains: [
//         //     'ekadon-bucket.s3.ap-northeast-1.amazonaws.com',
//         //     's3.ap-northeast-1.amazonaws.com'
//         // ]
//         domains: ['ekadon-bucket.s3.ap-northeast-1.amazonaws.com'],
//     },
// };

// export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     env: {
//         NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//     },
//     images: {
//         domains: [
//             'ekadon-bucket.s3.ap-northeast-1.amazonaws.com',
//             's3.ap-northeast-1.amazonaws.com',
//             '127.0.0.1',
//         ],
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "ekadon-backet.s3.ap-northeast-1.amazonaws.com",
//                 port: "",
//                 pathname: "/**", // バケットの下すべてを許可
//             },
//         ],
//     },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        // 画像は Xserver 側の API ドメインから配信
        domains: ['api.ekadon.com', '127.0.0.1'], // ローカルで直叩きするなら 127.0.0.1 を残す
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.ekadon.com',
                port: '',
                // 例: https://api.ekadon.com/storage/images/icons/ekadon.png
                pathname: '/storage/**',
            },
        ],
    },
};

export default nextConfig;
