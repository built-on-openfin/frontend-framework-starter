import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: {
		main: "./src/main.tsx",
		"iframe-broker": "./src/iframe-broker.ts",
	},
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
							configFile: path.resolve(__dirname, "tsconfig.app.json"),
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
	plugins: [
		new HtmlWebpackPlugin({
			chunks: ["main"],
			template: "./index.webpack.html",
			filename: "index.html",
		}),
		new HtmlWebpackPlugin({
			chunks: ["iframe-broker"],
			template: "./iframe-broker.webpack.html",
			filename: "iframe-broker.html",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "node_modules/@openfin/core-web/out/shared-worker.js"),
					to: "assets",
				},
				{
					from: path.resolve(__dirname, "public"),
					to: "",
				},
			],
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
		}),
	],
	devtool: "source-map",
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		port: 3000,
		hot: true,
		open: true,
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
};
