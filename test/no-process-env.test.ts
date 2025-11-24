import { RuleTester } from '@typescript-eslint/rule-tester';
import tsParser from '@typescript-eslint/parser';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import rule from '../src/rules/no-process-env';

const VitestRuleTester = RuleTester as unknown as typeof RuleTester & {
  afterAll: typeof afterAll;
  afterEach: typeof afterEach;
  beforeAll: typeof beforeAll;
  beforeEach: typeof beforeEach;
  describe: typeof describe;
  it: typeof it;
  expect: typeof expect;
};

VitestRuleTester.afterAll = afterAll;
VitestRuleTester.afterEach = afterEach;
VitestRuleTester.beforeAll = beforeAll;
VitestRuleTester.beforeEach = beforeEach;
VitestRuleTester.describe = describe;
VitestRuleTester.it = it;
VitestRuleTester.expect = expect;

const ruleTester = new VitestRuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-process-env', rule, {
  valid: [
    {
      name: 'allowed inside env.ts',
      filename: '/app/env.ts',
      code: 'const { env } = process; console.log(env.FOO);',
    },
    {
      name: 'shadowed process identifier',
      code: 'function process() { return { env: {} }; } const { env } = process();',
    },
    {
      name: 'non-env member',
      code: 'process.version;',
    },
  ],
  invalid: [
    {
      name: 'direct member access',
      code: 'console.log(process.env.API_KEY);',
      errors: [{ messageId: 'noProcessEnv' }],
    },
    {
      name: 'bracket access',
      code: 'const foo = process["env"].FOO;',
      errors: [{ messageId: 'noProcessEnv' }],
    },
    {
      name: 'destructuring env from process',
      code: 'const { env } = process;',
      errors: [{ messageId: 'noProcessEnv' }],
    },
  ],
});
