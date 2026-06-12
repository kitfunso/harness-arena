export function mdTable(rows) {
  if (!rows.length) return '';
  const cols = [];
  for (const r of rows) for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
  const cell = (r, k) => (k in r ? String(r[k]) : '');
  const widths = cols.map(c => Math.max(3, c.length, ...rows.map(r => cell(r, c).length)));
  const line = vals => '| ' + vals.map((v, i) => v.padEnd(widths[i])).join(' | ') + ' |';
  return [
    line(cols),
    line(widths.map(w => '-'.repeat(w))),
    ...rows.map(r => line(cols.map(c => cell(r, c)))),
  ].join('\n');
}
