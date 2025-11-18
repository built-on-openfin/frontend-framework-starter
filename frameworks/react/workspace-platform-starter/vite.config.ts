import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"workspace-platform-starter": path.resolve(__dirname, "./openfin/framework"),
		},
		extensions: [".tsx", ".ts", ".js", ".json"],
	},
	server: {
		port: 8080,
	},
});
