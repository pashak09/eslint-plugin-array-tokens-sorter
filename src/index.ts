import { Rule, SourceCode } from 'eslint';
import { ArrayExpression, Comment } from 'estree';

interface Options {
  readonly spreadVariablesFirst: boolean;
}

interface NodeItem {
  readonly value: string;
  readonly isSpread: boolean;
}

const RULE_INDICATOR = 'eslint: enable-alphabetical-order-array';

function sortArrayItems(elements: NodeItem[], spreadVariablesFirst: boolean): readonly NodeItem[] {
  return elements.sort((a: NodeItem, b: NodeItem): number => {
    if (spreadVariablesFirst === true) {
      if (a.isSpread && !b.isSpread) {
        return -1;
      }

      if (!a.isSpread && b.isSpread) {
        return 1;
      }
    }

    return a.value.localeCompare(b.value);
  });
}

function prepareArrayItems(node: ArrayExpression, sourceCode: SourceCode): readonly NodeItem[] {
  const elements: NodeItem[] = new Array(node.elements.length);
  let cursor = 0;

  for (const element of node.elements) {
    if (element === null) {
      continue;
    }

    if (element.type === 'SpreadElement') {
      elements[cursor] = {
        value: sourceCode.getText(element.argument),
        isSpread: true,
      };
    } else {
      elements[cursor] = {
        value: sourceCode.getText(element),
        isSpread: false,
      };
    }

    cursor++;
  }

  return elements;
}

function checkNode(node: ArrayExpression, sourceCode: SourceCode, options: Options, context: Rule.RuleContext): void {
  const elements = prepareArrayItems(node, sourceCode);
  const sortedElements = sortArrayItems([...elements], options.spreadVariablesFirst || false);

  if (sortedElements.some((element: NodeItem, index: number): boolean => element !== elements[index])) {
    const newCode = `[${sortedElements
      .map((element: NodeItem): string => (element.isSpread ? `...${element.value}` : element.value))
      .join(', ')}]`;

    context.report({
      node,
      message: 'Array elements are not sorted alphabetically.',
      fix: (fixer: Rule.RuleFixer): Rule.Fix => fixer.replaceText(node, newCode),
    });
  }
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
    const options = context.options[0] || {};
    const lineMapper = new Set<number>();

    return {
      Program(): void {
        const comments = sourceCode.getAllComments();

        comments.forEach((comment: Comment): void => {
          if (comment.value.trim() === RULE_INDICATOR) {
            const linePosition = comment.loc?.start;

            if (linePosition === undefined) {
              return;
            }

            //added a current line for the case [B, A, B, C] // enable-alphabetical-order-array
            lineMapper.add(linePosition.line);
            lineMapper.add(linePosition.line + 1);
          }
        });
      },
      ArrayExpression(node: ArrayExpression): void {
        const position = node.loc?.start;

        if (position === undefined || lineMapper.has(position.line) === false) {
          return;
        }

        checkNode(node, sourceCode, options, context);
      },
    };
  },
};

module.exports = { rules: { array } };
