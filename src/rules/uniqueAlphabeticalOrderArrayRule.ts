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
  const uniqueItems: NodeItem[] = new Array(sortedElements.length);
  let cursor = 0;
  let hasUniqueItems = true;

  for (const element of sortedElements) {
    if (uniqueItemSet.has(element.value) === false) {
      uniqueItems[cursor] = element;
      cursor++;
      uniqueItemSet.add(element.value);

      continue;
    }

    hasUniqueItems = false;
  }

  if (hasUniqueItems !== false) {
    return;
  }

  arrayFixer(uniqueItems, 'Array elements are not uniqueness.', node, context);
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
