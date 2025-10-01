export function generateRandomNumbers({
  count = 1,
  upTo,
}: GenerateRandomNumbersParams): number[] {
  count ??= 1;
  const numbers = [];
  for (let i = 0; i < count; i++) {
    const number =
      upTo !== undefined ? Math.floor(Math.random() * upTo) + 1 : Math.random();
    numbers.push(number);
  }
  return numbers;
}
type GenerateRandomNumbersParams = {
  count?: number;
  upTo?: number;
};

export function minutesToMs(minutes: number) {
  return minutes * 60000;
}
