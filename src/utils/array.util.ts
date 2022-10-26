export function isArrayContainAtLeastOneValueOfCompareArray(array: Array<any>, compareArray: Array<any>): boolean {
  for (const value of array) {
    if (compareArray.includes(value)) return true;
  }
  return false;
}

export function countNumberOfMatchingValuesBetweenArrays(array: Array<any>, compareArray: Array<any>): number {
  return array.filter((value) => compareArray.includes(value)).length;
}
