import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
	namespace: 'wc-fin',
	sourceMap: false,
	hashFileNames: false,
	outputTargets: [
		reactOutputTarget({
			outDir: 'dist/react',
		}),
		{
			type: 'dist-custom-elements',
			externalRuntime: false,
			dir: 'dist/custom-elements',
		},
		{
			type: 'dist',
			esmLoaderPath: '../dist/loader',
		},
		{
			type: 'docs-readme',
		},
		{
			type: 'www',
			serviceWorker: null,
			dir: 'dist/www',
		},
	],
};
