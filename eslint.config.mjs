// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt();
// Your custom configs here

module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  rules: {
    // Disables eslint throwing an error on script setup vue files
    "import/first": "off",
  },
};
