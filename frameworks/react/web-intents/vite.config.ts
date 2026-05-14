import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: "node_modules/@openfin/core-web/out/shared-worker.js",
					dest: "assets",
				},
			],
		}),
	],
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				"iframe-broker": "./iframe-broker.html",
			},
		},
	},
	server: {
		port: 3000,
	},
});
