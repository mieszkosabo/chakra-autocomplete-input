module.exports = {
	stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@chakra-ui/storybook-addon",
	],
	features: {
		emotionAlias: false,
		interactionsDebugger: true,
	},
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-webpack5",
	},
};
