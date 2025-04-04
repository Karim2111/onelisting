/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {hostname: "utfs.io"},
            {hostname: "liam-my.s3.us-east-2.amazonaws.com"},
            {hostname: "onelisting.s3.us-east-1.amazonaws.com"}
        ]
    }
};

export default config;