import { RuleTester } from "@typescript-eslint/rule-tester";
import tsParser from "@typescript-eslint/parser";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import rule from "../src/rules/no-verb-noun-confusion";

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
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-verb-noun-confusion", rule, {
  valid: [
    // Correct verb forms
    {
      name: "set up as verb",
      code: "<button>Set up</button>",
    },
    {
      name: "log in as verb",
      code: "<button>Log in</button>",
    },
    {
      name: "sign up as verb",
      code: "<button>Sign up</button>",
    },
    {
      name: "set up your account",
      code: "<button>Set up your account</button>",
    },
    {
      name: "log in to continue",
      code: "<button>Log in to continue</button>",
    },
    // Allowed noun phrases
    {
      name: "initial setup is allowed",
      code: "<h1>Initial setup</h1>",
    },
    {
      name: "login screen is allowed",
      code: "<h1>Login screen</h1>",
    },
    {
      name: "signup form is allowed",
      code: "<p>Complete the signup form</p>",
    },
    {
      name: "setup wizard is allowed",
      code: "<h1>Setup wizard</h1>",
    },
    // Non-UI copy strings are ignored
    {
      name: "non-UI string literal",
      code: 'const x = "Setup";',
    },
    {
      name: "non-UI attribute",
      code: '<div className="login">Content</div>',
    },
  ],
  invalid: [
    // Single word verbs
    {
      name: "setup as single word button",
      code: "<button>Setup</button>",
      errors: [{ messageId: "noVerbSetup" }],
    },
    {
      name: "login as single word button",
      code: "<button>Login</button>",
      errors: [{ messageId: "noVerbLogin" }],
    },
    {
      name: "signup as single word button",
      code: "<button>Signup</button>",
      errors: [{ messageId: "noVerbSignup" }],
    },
    // Leading verb forms
    {
      name: "setup your account",
      code: "<button>Setup your account</button>",
      errors: [{ messageId: "noVerbSetup" }],
    },
    {
      name: "login to continue",
      code: "<button>Login to continue</button>",
      errors: [{ messageId: "noVerbLogin" }],
    },
    {
      name: "signup now",
      code: "<button>Signup now</button>",
      errors: [{ messageId: "noVerbSignup" }],
    },
    // aria-label attributes
    {
      name: "setup in aria-label",
      code: '<button aria-label="Setup">Icon</button>',
      errors: [{ messageId: "noVerbSetup" }],
    },
    {
      name: "login in aria-label",
      code: '<button aria-label="Login to your account">Icon</button>',
      errors: [{ messageId: "noVerbLogin" }],
    },
    // title attributes
    {
      name: "signup in title",
      code: '<a title="Signup for free">Join</a>',
      errors: [{ messageId: "noVerbSignup" }],
    },
    // placeholder attributes
    {
      name: "login in placeholder",
      code: '<input placeholder="Login here" />',
      errors: [{ messageId: "noVerbLogin" }],
    },
  ],
});
