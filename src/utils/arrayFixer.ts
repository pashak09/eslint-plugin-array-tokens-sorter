import { Rule } from 'eslint';
import { ArrayExpression } from 'estree';

import { NodeItem } from './arrayItemsScanner';

export function arrayFixer(
  sortedElements: readonly NodeItem[],
  message: string,
  node: ArrayExpression,
  context: Rule.RuleContext,
): void {
  const newCode = `[${sortedElements
    .map((element: NodeItem): string => (element.isSpread ? `...${element.value}` : element.value))
    .join(', ')}]`;

  context.report({
    node,
    message,
    fix: (fixer: Rule.RuleFixer): Rule.Fix => fixer.replaceText(node, newCode),
  });
}
