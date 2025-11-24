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
    recommended: [
      {
        rules: {
          'no-process-env/no-process-env': 'error',
        },
      },
    ],
  },
};

export default plugin;
