module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:jsx-a11y/strict',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'jsx-a11y', '@typescript-eslint'],
    rules: {
        'jsx-a11y/no-static-element-interactions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'jsx-a11y/media-has-caption': 'off',
        'react/display-name': 'off',
        'dot-notation': 'off',
        'arrow-body-style': 'off',
        'import/no-named-default': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.tsx', '.ts'] }],
        camelcase: [2, { properties: 'never' }],
        'react/function-component-definition': 'off',
        'react/prop-types': 'off',
        'no-var': 'error',
        'brace-style': 'error',
        'prefer-template': 'error',
        radix: 'error',
        'space-before-blocks': 'error',
        'no-unused-vars': 'off',
    },
    overrides: [
        {
            files: [
                '*.ts',
                '**/*.test.js',
                '**/*.test.jsx',
                '**/*.test.tsx',
                '**/*.spec.js',
                '**/*.spec.jsx',
                '**/*.spec.tsx',
            ],
            rules: {
                'no-undef': 'off',
            },
            env: {
                jest: true,
            },
        },
    ],
};
