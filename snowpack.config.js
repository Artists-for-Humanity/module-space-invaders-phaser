// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    root: "./src",
    plugins: [
        /* ... */
    ],
    packageOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        out: "docs",
        metaUrlPath: "snowpack",
    },
    mount: {
        src: {
            url: "/",
            dot: true,
        },
        public: {
            url: "/",
            static: true,
            dot: true,
        },
    },
};