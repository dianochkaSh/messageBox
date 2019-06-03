module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        sourceType: 'module',
        parser: "babel-eslint",
        ecmaVersion: 2017
    },
    env: {
        browser: true,
    },
    plugins: [
        "vue"
    ],
    extends: [
        'plugin:vue/recommended'
    ],
    rules: {
        "vue/this-in-template": 0,
        "vue/require-default-prop": 0,
        "linebreak-style": 0,
        "vue/component-name-in-template-casing": 0,
        "vue/html-self-closing":0
    }
};
