module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    quotes: ['error', 'single'],
    'react-native/no-inline-styles': 'off',
    'no-trailing-spaces': 'off',
    curly: 'off',
    'comma-dangle': 'off',
    'prettier/prettier': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': false,
      'argsIgnorePattern': '^_',
    }],
  },
};
