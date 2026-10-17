/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Several product illustrations in /public/images/products are SVG.
    // next/image refuses to optimise SVG unless this is switched on, because
    // an SVG can carry script. Every SVG here is a first-party file committed
    // to this repo - there is no user upload path - and the CSP below strips
    // scripting and sandboxes the response, so serving them is safe.
    // If you ever accept SVG uploads from visitors, turn this back off.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },
};

export default nextConfig;
