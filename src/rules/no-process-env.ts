import type { Scope } from '@typescript-eslint/scope-manager';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

type PropertyNode =
  | TSESTree.MemberExpression['property']
  | TSESTree.Property['key'];

const getPropertyName = (node: PropertyNode): string | null => {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'PrivateIdentifier') return node.name;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  return null;
};

const getScope = (context: TSESLint.RuleContext<'noProcessEnv', []>): Scope | null =>
  (context as TSESLint.RuleContext<'noProcessEnv', []> & { getScope?: () => Scope }).getScope?.() ??
  null;

const isProcessShadowed = (scope: Scope | null): boolean => {
  let current = scope;
  while (current) {
    if (current.set && current.set.has('process')) {
      return true;
    }
    current = current.upper;
  }
  return false;
};

const rule: TSESLint.RuleModule<'noProcessEnv', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow direct usage of process.env. Use the closest env.ts file instead.',
    },
    messages: {
      noProcessEnv:
        'Direct access to process.env is not allowed. Import from the closest env.ts file instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = typeof context.getFilename === 'function' ? context.getFilename() : undefined;

    // Allow env.ts files to use process.env
    if (filename && (filename.endsWith('env.ts') || filename.endsWith('env.js'))) {
      return {};
    }

    return {
      MemberExpression(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'process' &&
          getPropertyName(node.property) === 'env' &&
          !isProcessShadowed(getScope(context))
        ) {
          context.report({
            node,
            messageId: 'noProcessEnv',
          });
        }
      },
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'Identifier' &&
          node.init.name === 'process' &&
          node.id.type === 'ObjectPattern' &&
          !isProcessShadowed(getScope(context))
        ) {
          for (const property of node.id.properties) {
            if (property.type === 'Property') {
              const name = getPropertyName(property.key);
              if (name === 'env') {
                context.report({
                  node: property.key,
                  messageId: 'noProcessEnv',
                });
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
