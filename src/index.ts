import type { TSESLint } from "@typescript-eslint/utils";
import noVerbNounConfusion from "./rules/no-verb-noun-confusion";

const plugin = {
  meta: {
    name: "eslint-plugin-verb-nouns",
    version: "1.0.0",
  },
  rules: {
    "no-verb-noun-confusion": noVerbNounConfusion,
  },
  configs: {
    // Flat config (ESLint 9+/10)
    recommended: [
      {
        plugins: {
          "verb-nouns": null as unknown as TSESLint.FlatConfig.Plugin,
        },
        rules: {
          "verb-nouns/no-verb-noun-confusion": "error",
        },
      },
    ],
    // eslintrc config (ESLint 8)
    legacy: {
      plugins: ["verb-nouns"],
      rules: {
        "verb-nouns/no-verb-noun-confusion": "error",
      },
    },
  },
} as unknown as TSESLint.FlatConfig.Plugin & TSESLint.Linter.Plugin;

// Fix self reference in recommended config
if (Array.isArray(plugin.configs?.recommended)) {
  const [recommended] = plugin.configs.recommended;
  if (recommended && recommended.plugins) {
    (recommended.plugins as Record<string, unknown>)["verb-nouns"] = plugin;
  }
}

export default plugin;
