/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ['http://127.0.0.1:8000'],
        domains: [
            'ekadon-bucket.s3.ap-northeast-1.amazonaws.com'
        ]
    },
};

export default nextConfig;
