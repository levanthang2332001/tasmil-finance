// Layout utilities
import { BentoItem } from "@/types/community";

export function getItemHeight(item: BentoItem): number {
  let base = 80;
  base += Math.min(item.description.length, 400) * 0.18;
  if (item.hasImage && item.imageUrl) base += 160;
  return base;
}

export function distributeItemsIntoColumns(
  items: BentoItem[],
): [BentoItem[], BentoItem[]] {
  const left: BentoItem[] = [];
  const right: BentoItem[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const item of items) {
    const height = getItemHeight(item);
    if (leftHeight <= rightHeight) {
      left.push(item);
      leftHeight += height;
    } else {
      right.push(item);
      rightHeight += height;
    }
  }

  return [left, right];
}
