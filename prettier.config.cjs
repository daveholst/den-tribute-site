module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 120,
	plugins: [
		'prettier-plugin-svelte',
		require('prettier-plugin-tailwindcss')
	],
	tailwindConfig: 'tailwind.config.cjs',
	pluginSearchDirs: false,
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};
