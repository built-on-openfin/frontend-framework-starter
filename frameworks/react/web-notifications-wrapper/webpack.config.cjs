const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	entry: "./src/NotificationsProvider.tsx",
	output: {
		filename: "index.esm.js",
		path: path.resolve(__dirname, "dist"),
		library: { type: "module" },
		clean: true,
	},
	experiments: {
		outputModule: true,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	devtool: "source-map",
	externals: {
		react: "react",
		"react-dom": "react-dom",
		stream: "stream",
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	},
	mode: "production",
};
