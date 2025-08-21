export function sleep(amountInSeconds) {
  return new Promise(r => setTimeout(r, amountInSeconds * 1000));
}
