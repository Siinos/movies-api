export function getRandomIntNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) * min);
}

export function isNumberInRange(number: number, min: number, max: number): boolean {
  return number >= min && number <= max;
}
