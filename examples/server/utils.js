export function sleep(amountInSeconds) {
  return new Promise(r => setTimeout(r, amountInSeconds * 1000));
}

export function arrayWithNumbers(amount, startWith = 1) {
  startWith = Number(startWith);
  return [...Array(amount)].map((_, i) => i + startWith);
}

export async function buildPaginatedResult(page, amount = 5) {
  page = Number(page);

  await sleep(1);

  let startWith = 0;
  switch (page) {
    // First page start with 1
    case 1:
      startWith = 1;
      break;
    // Second page start with 6: 5 + 1
    case 2:
      startWith = amount + 1;
      break;
    /**
     * Other pages start with a multiplier
     * (5 * (3 - 1)) + 1 = (5 * 2) + 1 = 10 + 1 = 11
     * (5 * (4 - 1)) + 1 = (5 * 3) + 1 = 15 + 1 = 16
     */
    default:
      startWith = amount * (page - 1) + 1;
      break;
  }

  return arrayWithNumbers(amount, startWith).map(n => `Item ${n}`);
}

export function getTime() {
  return new Date().toLocaleTimeString('pt-BR');
}
