module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	extends: [
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	plugins: ['import', '@typescript-eslint'],
	ignorePatterns: ['public/**/*'],
	rules: {
		'react/no-children-prop': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'no-extra-semi': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
	},
}
