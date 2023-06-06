/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // {
            //     protocol: "https",
            //     hostname: "picsum.photos",
            //     pathname: "/id/237/536/354",
            // }, 
            {
                protocol: "https",
                hostname: "**",
            }
        ]
    },

    redirects: async () => [
        {
            source: "/",
            destination: "/dashboard",
            permanent: true,
        },
    ],
}

module.exports = nextConfig
