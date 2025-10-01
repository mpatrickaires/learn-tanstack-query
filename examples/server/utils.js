export function sleep(amountInSeconds) {
  return new Promise(r => setTimeout(r, amountInSeconds * 1000));
}

export function arrayWithNumbers(amount, startWith = 1) {
  startWith = Number(startWith);
  return [...Array(amount)].map((_, i) => i + startWith);
}
