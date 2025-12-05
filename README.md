# eslint-plugin-verb-nouns

Catch incorrect use of noun forms like "setup", "login", "signup" when verb forms ("set up", "log in", "sign up") are needed.

## Why would I want this?

Words like "setup", "login", and "signup" are nouns or adjectives. When used as verbs, they should be written as two words: "set up", "log in", and "sign up".

- **Noun/Adjective**: "The login screen", "Initial setup", "Signup form"
- **Verb**: "Log in to your account", "Set up your profile", "Sign up for free"

This rule uses heuristics to catch the most common mistakes in UI copy (buttons, labels, placeholders) while allowing legitimate noun usage.

## Is this really necessary?

I get it. This is pedantic, and it usually results in one-character changes. But nonetheless, it's a mistake so common that even LLMs mess it up all the time. Once you see it, you'll never unsee it.

## Install

```sh
npm i -D eslint eslint-plugin-verb-nouns
yarn add -D eslint eslint-plugin-verb-nouns
pnpm add -D eslint eslint-plugin-verb-nouns
bun add -d eslint eslint-plugin-verb-nouns
```

Tested with ESLint 8.57+, 9.x, and 10 alpha.

## Usage (flat config, ESLint 9+/10)

```ts
// eslint.config.mjs
import verbNouns from "eslint-plugin-verb-nouns";

export default [
  {
    plugins: { "verb-nouns": verbNouns },
    rules: {
      "verb-nouns/no-verb-noun-confusion": "error",
    },
  },
];
```

## Usage (eslintrc, ESLint 8)

```js
// .eslintrc.cjs
module.exports = {
  plugins: ["verb-nouns"],
  rules: {
    "verb-nouns/no-verb-noun-confusion": "error",
  },
  extends: ["plugin:verb-nouns/legacy"],
};
```

## What the rule catches

The `no-verb-noun-confusion` rule flags likely verb usage of:

- **"Setup"** → should be "Set up"
- **"Login"** → should be "Log in"
- **"Signup"** → should be "Sign up"

### Examples

```jsx
// ❌ Bad - these are verbs, should be two words
<button>Setup</button>
<button>Login</button>
<button>Signup</button>
<button>Setup your account</button>
<button>Login to continue</button>
<button aria-label="Signup now">Join</button>

// ✅ Good - proper verb forms
<button>Set up</button>
<button>Log in</button>
<button>Sign up</button>
<button>Set up your account</button>
<button>Log in to continue</button>
<button aria-label="Sign up now">Join</button>

// ✅ Good - noun/adjective usage (allowed)
<h1>Initial setup</h1>
<h1>Login screen</h1>
<p>Complete the signup form</p>
```

### Heuristics

The rule only checks:

- JSX text content
- String literals in `aria-label`, `title`, and `placeholder` attributes

It allows known noun phrases like "initial setup", "login screen", "signup form", etc.

## Options

None. The rule is purposefully minimal.

## Contributing / Development

- `npm run lint` — lint sources and tests
- `npm run test` — run rule tests (Vitest + ESLint RuleTester)
- `npm run build` — bundle to `dist/` via TSUP (ESM + d.ts)

## License

MIT
