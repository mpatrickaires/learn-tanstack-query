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

export function secondsToMs(seconds: number) {
  return seconds * 1000;
}

export function msToSeconds(ms: number) {
  return ms / 1000;
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR');
}

export function getTime() {
  return formatTime(new Date());
}

export function getDateAtSecondsAgo(seconds: number) {
  const msAgo = secondsToMs(seconds);
  const now = Date.now();
  return new Date(now - msAgo);
}

export function arrayWithNumbers(amount: number, startWith: number = 1) {
  startWith = Number(startWith);
  return [...Array(amount)].map((_, i) => i + startWith);
}
