import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node  // Node.jsのグローバル変数を追加（processを含む）
      } 
    }
  },
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { 
      "react-hooks": reactHooksPlugin 
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];