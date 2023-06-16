import { Rule } from 'eslint';
import { ArrayExpression } from 'estree';

import { Options } from '../index';
import { arrayFixer } from '../utils/arrayFixer';
import { arrayItemsScanner, NodeItem } from '../utils/arrayItemsScanner';
import { arrayItemsSorter } from '../utils/arrayItemsSorter';

import { alphabeticalOrderErrorsFixer } from './alphabeticalOrderArrayRule';

export function uniqueAlphabeticalOrderArrayCheckerFixer(
  sortedElements: readonly NodeItem[],
  node: ArrayExpression,
  context: Rule.RuleContext,
): void {
  const uniqueItemSet = new Set<string>();
  const uniqueItems: NodeItem[] = [];

  for (const element of sortedElements) {
    if (uniqueItemSet.has(element.value) === false) {
      uniqueItems.push(element);
      uniqueItemSet.add(element.value);
    }
  }

  if (uniqueItems.length === sortedElements.length) {
    return;
  }

  arrayFixer(uniqueItems, 'Array elements are not unique.', node, context);
}

export function uniqueAlphabeticalOrderArrayRule(
  node: ArrayExpression,
  context: Rule.RuleContext,
  options: Options,
): void {
  const elements = arrayItemsScanner(node, context.getSourceCode());
  const sortedElements = arrayItemsSorter([...elements], options.spreadVariablesFirst || false);

  //has no alphabetical errors, validate uniqueness
  if (alphabeticalOrderErrorsFixer(elements, sortedElements, node, context) === false) {
    uniqueAlphabeticalOrderArrayCheckerFixer(sortedElements, node, context);
  }
}
