module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "eslint-plugin-import"],
	settings: {
		react: {
			version: "18.2.0",
		},
		"import/resolver": {
			node: {
				extensions: [".ts", ".tsx", ".json", ".css"], // Include file extension if you want to add files apart from these types of files
			},
		},
	},

	overrides: [],
	rules: {
		"react-refresh/only-export-components": 1,
		"react/react-in-jsx-scope": "off",
		"import/no-unresolved": 0,
	},
	globals: {
		importMeta: "readonly",
	},
};
