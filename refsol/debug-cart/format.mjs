export function money(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const units = Math.floor(abs / 100).toLocaleString('en-US');
  return sign + '$' + units + '.' + String(abs % 100).padStart(2, '0');
}
