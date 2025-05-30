import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from 'path';
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	root: __dirname,
	plugins: [
		react(),
		viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, "./openfin/common"),
                    dest: "./"
                }
            ]
        })
	],
	resolve: {
		alias: {
			'workspace-platform-starter': path.resolve(__dirname, './openfin/framework')
		}
	},
	server: {
        port: 8080
    },
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true
		},
		// lib: {
		// 	entry: "src/index.ts",
		// 	name: "openfin-modules",
		// 	fileName: "index",
		// 	formats: ["es"]
		// },
		rollupOptions: {
			external: ["fin", "react", "react-dom", "react/jsx-runtime"],
			input: {
				// Provider React app
				main: path.resolve(__dirname, "src/main.tsx"),

				// Modules
				interop: path.resolve(__dirname, "./openfin/modules/init-options/interop/index.ts"),
				example: path.resolve(__dirname, "./openfin/modules/auth/example/index.ts"),
				"local-storage": path.resolve(__dirname, "./openfin/modules/endpoint/local-storage/index.ts"),
				channel: path.resolve(__dirname, "./openfin/modules/endpoint/channel/index.ts"),
				"inline-apps": path.resolve(__dirname, "./openfin/modules/endpoint/inline-apps/index.ts"),
				"launch-app": path.resolve(__dirname, "./openfin/modules/init-options/launch-app/index.ts"),
				console: path.resolve(__dirname, "./openfin/modules/log/console/index.ts"),
				opacity: path.resolve(__dirname, "./openfin/modules/actions/opacity/index.ts"),
				"example-connection-validation": path.resolve(
					__dirname,
					"./openfin/modules/endpoint/example-connection-validation/index.ts"
				),
				"analytics-console": path.resolve(__dirname, "./openfin/modules/analytics/console/index.ts"),
				developer: path.resolve(__dirname, "./openfin/modules/composite/developer/index.ts"),
				apps: path.resolve(__dirname, "./openfin/modules/integrations/apps/index.ts"),
				workspaces: path.resolve(__dirname, "./openfin/modules/integrations/workspaces/index.ts"),
				pages: path.resolve(__dirname, "./openfin/modules/integrations/pages/index.ts"),
				about: path.resolve(__dirname, "./openfin/modules/composite/about/index.ts"),
				"composite-pages": path.resolve(__dirname, "./openfin/modules/composite/pages/index.ts"),
				windows: path.resolve(__dirname, "./openfin/modules/composite/windows/index.ts"),
				"example-context-processor": path.resolve(
					__dirname,
					"./openfin/modules/endpoint/example-context-processor/index.ts"
				),
				"fdc3-mapper": path.resolve(__dirname, "./openfin/framework/fdc3/index.ts"),
				"custom-menu": path.resolve(__dirname, "./openfin/modules/actions/custom-menu/index.ts"),
				"openid-connect": path.resolve(__dirname, "./openfin/modules/auth/openid-connect/index.ts"),
				"favorite-local-storage": path.resolve(
					__dirname,
					"./openfin/modules/endpoint/favorite-local-storage/index.ts"
				),
				"favorites-menu": path.resolve(__dirname, "./openfin/modules/actions/favorites-menu/index.ts"),
				"include-in-snapshot": path.resolve(
					__dirname,
					"./openfin/modules/composite/include-in-snapshot/index.ts"
				),
				"example-notification-service": path.resolve(
					__dirname,
					"./openfin/modules/lifecycle/example-notification-service/index.ts"
				),
				"example-notification-source": path.resolve(
					__dirname,
					"./openfin/modules/endpoint/example-notification-source/index.ts"
				),
				"application-url-and-access-validator": path.resolve(
					__dirname,
					"./openfin/modules/platform-override/application-url-and-access-validator/index.ts"
				),
				"launch-workspace": path.resolve(
					__dirname,
					"./openfin/modules/init-options/launch-workspace/index.ts"
				),
				"default-workspace": path.resolve(
					__dirname,
					"./openfin/modules/composite/default-workspace/index.ts"
				),
				"view-position": path.resolve(__dirname, "./openfin/modules/content-creation/view-position/index.ts"),
				"window-platform": path.resolve(__dirname, "./openfin/modules/actions/window-platform/index.ts"),
				"share-pages": path.resolve(__dirname, "./openfin/modules/share/pages/index.ts"),
				"share-workspaces": path.resolve(__dirname, "./openfin/modules/share/workspaces/index.ts"),
				"wps-interop-override": path.resolve(
					__dirname,
					"./openfin/modules/interop-override/wps-interop-override/index.ts"
				),
				"openfin-cloud-interop": path.resolve(
					__dirname,
					"./openfin/modules/interop-override/openfin-cloud-interop/index.ts"
				),
				"wps-platform-override": path.resolve(
					__dirname,
					"./openfin/modules/platform-override/wps-platform-override/index.ts"
				),
				"snap-window-selection-override": path.resolve(
					__dirname,
					"./openfin/modules/platform-override/snap-window-selection-override/index.ts"
				),
				"get-user-decision-for-beforeunload": path.resolve(
					__dirname,
					"./openfin/modules/platform-override/get-user-decision-for-beforeunload/index.ts"
				)
			},
			output: {
				format: "es",
				dir: path.resolve(__dirname, "dist"),
				sourcemap: false,
				manualChunks: undefined,
				// preserveModules: true,
				preserveModulesRoot: "openfin/modules",
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name === "main") {
						return "[name].bundle.js"
					}
					return `js/modules/[name].bundle.js`;
				}
			}
		}
	}
});
