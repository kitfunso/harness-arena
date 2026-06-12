# Task: Markdown Table Renderer

Implement `mdTable(rows)` in `impl.mjs` (the only file you may edit).

## Spec
- Input: array of plain objects. Output: a GitHub-flavored markdown table string.
- Columns: the union of all keys, in first-seen order (scanning rows in order, keys in object order).
- Missing values render as empty string. Non-string values via `String(value)`.
- Every cell is left-aligned and padded with spaces so all rows of a column share the same width. Column width = max length of the header and every value in that column (minimum 3).
- Format per row: `| cell | cell |` (single space inside each pipe). Separator row uses dashes filling the full column width.
- Rows joined with `\n`, no trailing newline. Empty input array -> empty string.

## Example
```js
mdTable([{ name: 'ada', age: 36 }, { name: 'bo' }])
```
returns:
```
| name | age |
| ---- | --- |
| ada  | 36  |
| bo   |     |
```

There is a hidden test suite with additional edge cases. Done when all hidden tests pass.
