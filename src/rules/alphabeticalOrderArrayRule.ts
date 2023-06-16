import { Rule } from 'eslint';
import { ArrayExpression } from 'estree';

import { Options } from '../index';
import { arrayFixer } from '../utils/arrayFixer';
import { arrayItemsScanner, NodeItem } from '../utils/arrayItemsScanner';
import { arrayItemsSorter } from '../utils/arrayItemsSorter';

export function alphabeticalOrderErrorsFixer(
  elements: readonly NodeItem[],
  sortedElements: readonly NodeItem[],
  node: ArrayExpression,
  context: Rule.RuleContext,
): boolean {
  if (sortedElements.some((element: NodeItem, index: number): boolean => element !== elements[index])) {
    arrayFixer(sortedElements, 'Array elements are not sorted alphabetically.', node, context);

    return true;
  }

  return false;
}

export function alphabeticalOrderArrayRule(node: ArrayExpression, context: Rule.RuleContext, options: Options): void {
  const elements = arrayItemsScanner(node, context.getSourceCode());
  const sortedElements = arrayItemsSorter([...elements], options.spreadVariablesFirst || false);

  alphabeticalOrderErrorsFixer(elements, sortedElements, node, context);
}
