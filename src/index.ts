import { Rule } from 'eslint';
import { ArrayExpression, Comment } from 'estree';

import { Rules } from './enums/Rules';
import { arrayTokesRules } from './rules';

export type Options = {
  readonly spreadVariablesFirst: boolean;
};

function hasESLintRule(value: string): value is Rules {
  return value === Rules.UNIQUE_ALPHABETICAL_ORDER || value === Rules.ALPHABETICAL_ORDER;
}

const array: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce alphabetically sorted arrays',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          spreadVariablesFirst: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const sourceCode = context.getSourceCode();
    const options: Options = context.options[0] || {};
    const lineMapper = new Map<number, Rules>();

    return {
      Program(): void {
        const comments = sourceCode.getAllComments();

        comments.forEach((comment: Comment): void => {
          const line = comment.value.trim();

          if (!hasESLintRule(line)) {
            return;
          }

          const linePosition = comment.loc?.start;

          if (linePosition === undefined) {
            return;
          }

          //added a current line for the case [B, A, B, C] // enable-alphabetical-order-array
          lineMapper.set(linePosition.line, line);
          lineMapper.set(linePosition.line + 1, line);
        });
      },
      ArrayExpression(node: ArrayExpression): void {
        const position = node.loc?.start;

        if (position === undefined) {
          return;
        }

        const esRule = lineMapper.get(position.line);

        if (esRule === undefined) {
          return;
        }

        arrayTokesRules(node, context, esRule, options);
      },
    };
  },
};

module.exports = { rules: { array } };
