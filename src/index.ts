import type { TSESLint } from '@typescript-eslint/utils';
import noProcessEnv from './rules/no-process-env';

const plugin = {
  meta: {
    name: 'eslint-plugin-no-process-env',
    version: '0.1.0',
  },
  rules: {
    'no-process-env': noProcessEnv,
  },
  configs: {
    // Flat config (ESLint 9+/10)
    recommended: [
      {
        plugins: {
          'no-process-env': null as unknown as TSESLint.FlatConfig.Plugin,
        },
        rules: {
          'no-process-env/no-process-env': 'error',
        },
      },
    ],
    // eslintrc config (ESLint 8)
    legacy: {
      plugins: ['no-process-env'],
      rules: {
        'no-process-env/no-process-env': 'error',
      },
    },
  },
} as unknown as TSESLint.FlatConfig.Plugin & TSESLint.Linter.Plugin;

// Fix self reference in recommended config
if (Array.isArray(plugin.configs?.recommended)) {
  const [recommended] = plugin.configs.recommended;
  if (recommended && recommended.plugins) {
    (recommended.plugins as Record<string, unknown>)['no-process-env'] = plugin;
  }
}

export default plugin;
