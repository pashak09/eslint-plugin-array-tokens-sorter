import { Rule, SourceCode } from 'eslint';
import { ExportNamedDeclaration, ExportDefaultDeclaration } from 'estree';

interface Options {
  readonly spreadVariablesFirst: boolean;
}

interface Element {
  readonly value: string;
  readonly isSpread: boolean;
}

function sortArray(elements: Element[], spreadVariablesFirst: boolean): readonly Element[] {
  return elements.sort((a: Element, b: Element): number => {
    if (spreadVariablesFirst) {
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

function validateNode(node: any, arrayNode: any, sourceCode: any, options: Options, context: Rule.RuleContext): void {
  if (arrayNode.type !== 'ArrayExpression') {
    return;
  }

  const elements = arrayNode.elements
    .map((element: any): Element => {
      if (element.type === 'SpreadElement') {
        return {
          value: sourceCode.getText(element.argument),
          isSpread: true,
        };
      }

      return {
        value: sourceCode.getText(element),
        isSpread: false,
      };
    })
    .filter((element: Element): boolean => element.value.trim() !== '');

  const sortedElements = sortArray([...elements], options.spreadVariablesFirst || false);

  if (sortedElements.some((element: Element, index: number): boolean => element !== elements[index])) {
    const newCode = `[${sortedElements
      .map((element: Element): string => (element.isSpread ? `...${element.value}` : element.value))
      .join(', ')}]`;

    context.report({
      node,
      message: 'Array elements are not sorted alphabetically.',
      fix: (fixer: Rule.RuleFixer): Rule.Fix => fixer.replaceText(arrayNode, newCode),
    });
  }
}

function checkArray(node: any, sourceCode: SourceCode, options: Options, context: Rule.RuleContext): void {
  if (node.declaration?.declarations) {
    for (const arrayNode of node.declaration?.declarations ?? node.declaration) {
      validateNode(node, arrayNode.init, sourceCode, options, context);
    }

    return;
  }

  validateNode(node, node.declaration, sourceCode, options, context);
}

const rule: Rule.RuleModule = {
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
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const sourceCode = context.getSourceCode();
    const options = context.options[0] || {};

    return {
      ExportDefaultDeclaration: (node: ExportDefaultDeclaration): void => {
        checkArray(node, sourceCode, options, context);
      },
      ExportNamedDeclaration: (node: ExportNamedDeclaration): void => {
        checkArray(node, sourceCode, options, context);
      },
    };
  },
};

module.exports = { rules: { array: rule } };
