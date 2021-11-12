const path = require("path")
const isProduction = process.env.NODE_ENV === "production"

const Dotenv = require('dotenv-webpack');

/** @type {import("webpack").Configuration} */
const config = {
    mode: isProduction ? "production" : "development",
    entry: {
        main: "./src/index.tsx",
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, "public", "assets"),
        filename: "[name].js",
        publicPath: "/assets/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { compilerOptions: { module: "esnext", moduleResolution: "node" } },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ],
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    plugins: [
        new Dotenv()
    ],
    devtool: "source-map",
    devServer: {
        publicPath: "/assets/",
        contentBase: "public",
    },
}

module.exports = config