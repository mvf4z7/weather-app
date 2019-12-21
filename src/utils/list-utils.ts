export function findMostCommonElement(array: string[]): string | null {
  let mostFrequent: string | null = null;
  let counts: { [key: string]: number } = {};

  array.forEach(str => {
    const currentCount = counts[str];
    const newCount = currentCount === undefined ? 0 : currentCount + 1;
    counts[str] = newCount;

    if (mostFrequent === null) {
      mostFrequent = str;
    }

    if (mostFrequent === str) {
      return;
    }

    if (newCount > counts[mostFrequent]) {
      mostFrequent = str;
    }
  });

  return mostFrequent;
}
