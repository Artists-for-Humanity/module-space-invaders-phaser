module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
    },
    rules: {
        semi: 2,
        indent: ["error", 4]
    }
};
