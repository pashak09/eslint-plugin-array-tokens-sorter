import { NodeItem } from './arrayItemsScanner';

export function arrayItemsSorter(elements: NodeItem[], spreadVariablesFirst: boolean): readonly NodeItem[] {
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
