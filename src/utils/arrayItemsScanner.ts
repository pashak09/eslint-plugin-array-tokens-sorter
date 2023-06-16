import { SourceCode } from 'eslint';
import { ArrayExpression } from 'estree';

export type NodeItem = {
  readonly value: string;
  readonly isSpread: boolean;
};

export function arrayItemsScanner(node: ArrayExpression, sourceCode: SourceCode): readonly NodeItem[] {
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
