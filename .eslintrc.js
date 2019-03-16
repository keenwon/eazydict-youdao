"use strict"

/**
 * elint-preset-kw
 *
 * npm：https://www.npmjs.com/package/elint-preset-kw
 * github：https://github.com/keenwon/elint-preset-kw
 *
 * 此文件自动生成，禁止修改！
 * 此文件自动生成，禁止修改！
 * 此文件自动生成，禁止修改！
 */

module.exports = {
  extends: ["standard", "standard-react"],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    mocha: true,
    jest: true
  },
  rules: {
    // 强制使用有效的 JSDoc 注释
    // https://eslint.org/docs/rules/valid-jsdoc
    "valid-jsdoc": 2,

    // specify the maximum length of a line in your program
    // https://eslint.org/docs/rules/max-len
    "max-len": [
      "error",
      100,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ]
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      rules: {
        /**
         * 基于 plugin:@typescript-eslint/recommended 改写，同时尽量和 standard 保持一致
         */
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/ban-types": "error",
        camelcase: "off",
        "@typescript-eslint/camelcase": ["error", {properties: "never"}],
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-member-accessibility": "error",
        indent: "off",
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/interface-name-prefix": "error",
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/no-angle-bracket-type-assertion": "error",
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-object-literal-type-assertion": "error",
        "@typescript-eslint/no-parameter-properties": "error",
        "@typescript-eslint/no-triple-slash-reference": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", {vars: "all", args: "none", ignoreRestSiblings: true}],
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-interface": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/type-annotation-spacing": "error"
      }
    }
  ]
}
