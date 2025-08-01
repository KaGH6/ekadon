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


/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        domains: [
            'ekadon-bucket.s3.ap-northeast-1.amazonaws.com',
            's3.ap-northeast-1.amazonaws.com',
            '127.0.0.1',
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ekadon-backet.s3.ap-northeast-1.amazonaws.com",
                port: "",
                pathname: "/**", // バケットの下すべてを許可
            },
        ],
    },
};

export default nextConfig;
