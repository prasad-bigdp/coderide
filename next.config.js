/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true, // Disable SWC minification to avoid binary issues
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ["images.unsplash.com"],
	},

}

module.exports = nextConfig;