export function isArrayContainAtLeastOneValueOfCompareArray<T>(array: T[], compareArray: T[]): boolean {
  for (const value of array) {
    if (compareArray.includes(value)) return true;
  }
  return false;
}

export function countNumberOfMatchingValuesBetweenArrays<T>(array: T[], compareArray: T[]): number {
  return array.filter((value) => compareArray.includes(value)).length;
}
