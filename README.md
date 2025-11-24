# eslint-plugin-no-process-env

Disallow direct `process.env` access in application code and enforce a centralized environment configuration pattern.

## Why would I want this?

Every use of `process.env` in application code is a dependency on your external environment, and those dependencies are often unsatisfied at runtime, lack validation, and have inconsistent fallbacks.

It's generally a good practice to centralize env var access into a single configuration file which makes them explicit and self-documenting, and creates an opportunity to validate, coerce types, and set default values where appropriate.

This rule won't help your app crash less, but it _will_ help it crash earlier and more loudly!

## Install

```sh
npm i -D eslint eslint-plugin-no-process-env
```

Requires Node 18+ and ESLint 9+ (flat config).

## Usage (flat config)

```ts
// eslint.config.mjs
import noProcessEnv from 'eslint-plugin-no-process-env';

export default [
  {
    plugins: { 'no-process-env': noProcessEnv },
    rules: {
      'no-process-env/no-process-env': 'error',
    },
  },
];
```

## The `env.ts` pattern

Creating a boundary around your environment configuration is a good practice. Using a validation library like Zod makes it even easier to enforce consistent types and fallbacks.

1. Create an `env.ts` at the root of your app:

```ts
// env.ts
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DEBUG_LOGGING_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val !== 'false'),
});

export const ENV = schema.parse(process.env);
```

2. Import from `env.ts` elsewhere:

```ts
// db/client.ts
import { ENV } from './env';

const client = new Client({
  connectionString: ENV.DATABASE_URL,
});
```

3. `process.env` is allowed only inside `env.ts` / `env.js`; everywhere else the rule will error.

## What the rule catches

- `process.env.FOO`
- `const { env } = process;`
- Bracket access: `process['env']`

It ignores:

- Any code inside `env.ts` or `env.js`.
- Shadowed `process` identifiers (e.g., `function process() {}`).

## Options

None. The rule is purposefully minimal.

## Contributing / Development

- `npm run lint` — lint sources and tests  
- `npm run test` — run rule tests (Vitest + ESLint RuleTester)  
- `npm run build` — bundle to `dist/` via TSUP (ESM + d.ts)  

The `prepare` script builds automatically on install from git, which matches npm’s publishing flow.

## License

MIT
