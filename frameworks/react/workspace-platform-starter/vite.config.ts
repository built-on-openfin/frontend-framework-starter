import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entryDefinitions = [
	{ entry: './openfin/modules/auth/example/index.ts', outputPathRelative: 'js/modules/auth', outputFilenameKey: 'example' },
	{ entry: './openfin/modules/endpoint/local-storage/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'local-storage' },
	{ entry: './openfin/modules/endpoint/channel/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'channel' },
	{ entry: './openfin/modules/endpoint/inline-apps/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'inline-apps' },
	{ entry: './openfin/modules/init-options/interop/index.ts', outputPathRelative: 'js/modules/init-options', outputFilenameKey: 'interop' },
	{ entry: './openfin/modules/init-options/launch-app/index.ts', outputPathRelative: 'js/modules/init-options', outputFilenameKey: 'launch-app' },
	{ entry: './openfin/modules/log/console/index.ts', outputPathRelative: 'js/modules/log', outputFilenameKey: 'console' },
	{ entry: './openfin/modules/actions/opacity/index.ts', outputPathRelative: 'js/modules/actions', outputFilenameKey: 'opacity' },
	{ entry: './openfin/modules/endpoint/example-connection-validation/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'example.connection.validation' },
	{ entry: './openfin/modules/analytics/console/index.ts', outputPathRelative: 'js/modules/analytics', outputFilenameKey: 'console' },
	{ entry: './openfin/modules/composite/developer/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'developer' },
	{ entry: './openfin/modules/integrations/apps/index.ts', outputPathRelative: 'js/modules/integrations', outputFilenameKey: 'apps' },
	{ entry: './openfin/modules/integrations/workspaces/index.ts', outputPathRelative: 'js/modules/integrations', outputFilenameKey: 'workspaces' },
	{ entry: './openfin/modules/integrations/pages/index.ts', outputPathRelative: 'js/modules/integrations', outputFilenameKey: 'pages' },
	{ entry: './openfin/modules/composite/about/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'about' },
	{ entry: './openfin/modules/composite/pages/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'pages' },
	{ entry: './openfin/modules/composite/windows/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'windows' },
	{ entry: './openfin/modules/endpoint/example-context-processor/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'example.context.processor' },
	{ entry: './openfin/modules/actions/custom-menu/index.ts', outputPathRelative: 'js/modules/actions', outputFilenameKey: 'custom-menu' },
	{ entry: './openfin/modules/auth/openid-connect/index.ts', outputPathRelative: 'js/modules/auth', outputFilenameKey: 'openid-connect' },
	{ entry: './openfin/modules/endpoint/favorite-local-storage/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'favorite-local-storage' },
	{ entry: './openfin/modules/actions/favorites-menu/index.ts', outputPathRelative: 'js/modules/actions', outputFilenameKey: 'favorites-menu' },
	{ entry: './openfin/modules/composite/include-in-snapshot/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'include-in-snapshot' },
	{ entry: './openfin/modules/lifecycle/example-notification-service/index.ts', outputPathRelative: 'js/modules/lifecycle', outputFilenameKey: 'example-notification-service' },
	{ entry: './openfin/modules/endpoint/example-notification-source/index.ts', outputPathRelative: 'js/modules/endpoint', outputFilenameKey: 'example-notification-source' },
	{ entry: './openfin/modules/platform-override/application-url-and-access-validator/index.ts', outputPathRelative: 'js/modules/platform-override', outputFilenameKey: 'application-url-and-access-validator' },
	{ entry: './openfin/modules/init-options/launch-workspace/index.ts', outputPathRelative: 'js/modules/init-options', outputFilenameKey: 'launch-workspace' },
	{ entry: './openfin/modules/composite/default-workspace/index.ts', outputPathRelative: 'js/modules/composite', outputFilenameKey: 'default-workspace' },
	{ entry: './openfin/modules/content-creation/view-position/index.ts', outputPathRelative: 'js/modules/content-creation', outputFilenameKey: 'view-position' },
	{ entry: './openfin/modules/actions/window-platform/index.ts', outputPathRelative: 'js/modules/actions', outputFilenameKey: 'window-platform' },
	{ entry: './openfin/modules/share/pages/index.ts', outputPathRelative: 'js/modules/share', outputFilenameKey: 'pages' },
	{ entry: './openfin/modules/share/workspaces/index.ts', outputPathRelative: 'js/modules/share', outputFilenameKey: 'workspaces' },
	{ entry: './openfin/modules/interop-override/wps-interop-override/index.ts', outputPathRelative: 'js/modules/interop-override', outputFilenameKey: 'wps-interop-override' },
	{ entry: './openfin/modules/platform-override/wps-platform-override/index.ts', outputPathRelative: 'js/modules/platform-override', outputFilenameKey: 'wps-platform-override' },
];

const rollupInput = entryDefinitions.reduce((acc, item) => {
	const name = path.join(item.outputPathRelative, item.outputFilenameKey).replace(/\\/g, '/');
	acc[name] = item.entry;
	return acc;
}, {} as Record<string, string>);

rollupInput['root_html'] = path.resolve(__dirname, 'index.html');

export default defineConfig({
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
		},
		extensions: ['.tsx', '.ts', '.js', '.json'],
	},
	server: {
		port: 8080
	},
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		sourcemap: false,
		rollupOptions: {
			treeshake: false,
			input: rollupInput,
			external: ['fin'],
			output: {
				format: 'es',
				entryFileNames: '[name].bundle.js',
			},
		},
	},
});
