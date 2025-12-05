import type { TSESTree, TSESLint } from "@typescript-eslint/utils";

type MessageIds = "noVerbSetup" | "noVerbLogin" | "noVerbSignup";

function isLikelyUiCopy(node: TSESTree.Node): boolean {
  // Heuristic: JSX text / attributes that are often shown to users.
  if (node.type === "JSXText") return true;

  if (
    node.type === "Literal" &&
    typeof node.value === "string" &&
    node.parent &&
    node.parent.type === "JSXAttribute"
  ) {
    const attrName =
      node.parent.name.type === "JSXIdentifier" ? node.parent.name.name : "";
    return ["aria-label", "title", "placeholder"].includes(attrName);
  }

  return false;
}

function isAllowedNounPhrase(text: string): boolean {
  // Allow some noun-y phrases, tweak as needed
  const allowed = [
    "setup wizard",
    "initial setup",
    "system setup",
    "database setup",
    "login screen",
    "login form",
    "login page",
    "signup form",
    "signup page",
  ];
  const lower = text.toLowerCase();
  return allowed.some((phrase) => lower.includes(phrase));
}

const rule: TSESLint.RuleModule<MessageIds, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        'Discourage using "setup" / "login" / "signup" as verbs in UI copy; prefer "set up" / "log in" / "sign up".',
    },
    schema: [],
    messages: {
      noVerbSetup:
        'Prefer "set up" as a verb. Reserve "setup" for nouns/adjectives (e.g. "Initial setup").',
      noVerbLogin:
        'Prefer "log in" as a verb. Reserve "login" for nouns/adjectives (e.g. "Login screen").',
      noVerbSignup:
        'Prefer "sign up" as a verb. Reserve "signup" for nouns/adjectives (e.g. "Signup form").',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkText(raw: string, node: TSESTree.Node) {
      const text = raw.trim();
      if (!text) return;

      // Ignore clearly noun-y phrases
      if (isAllowedNounPhrase(text)) return;

      // Very opinionated heuristics that work well for buttons:
      // - A single word "Setup" / "Login" / "Signup" almost always means a verb ⇒ flag
      // - Leading "Setup" / "Login" / "Signup" followed by a verb-ish word ⇒ flag

      // Single-word label
      if (/^setup$/i.test(text)) {
        context.report({ node, messageId: "noVerbSetup" });
        return;
      }
      if (/^login$/i.test(text)) {
        context.report({ node, messageId: "noVerbLogin" });
        return;
      }
      if (/^signup$/i.test(text)) {
        context.report({ node, messageId: "noVerbSignup" });
        return;
      }

      // "Setup your account", "Login to continue", "Signup now", etc.
      if (/^setup\b/i.test(text)) {
        context.report({ node, messageId: "noVerbSetup" });
        return;
      }
      if (/^login\b/i.test(text)) {
        context.report({ node, messageId: "noVerbLogin" });
        return;
      }
      if (/^signup\b/i.test(text)) {
        context.report({ node, messageId: "noVerbSignup" });
        return;
      }
    }

    return {
      JSXText(node) {
        if (!isLikelyUiCopy(node)) return;
        checkText(node.value, node);
      },
      Literal(node) {
        if (!isLikelyUiCopy(node)) return;
        if (typeof node.value !== "string") return;
        checkText(node.value, node);
      },
    };
  },
};

export default rule;
