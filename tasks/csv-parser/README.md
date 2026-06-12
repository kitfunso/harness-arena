# Task: CSV Parser

Implement `parseCSV(text)` in `impl.mjs` (the only file you may edit).

## Spec
- Input: a CSV string. Output: array of rows, each row an array of string fields.
- Fields are separated by commas. Rows by `\n` or `\r\n`.
- A field may be quoted with double quotes. Inside a quoted field: commas and newlines are literal, and `""` is an escaped literal quote.
- Empty fields are empty strings. A trailing newline at the end of input does NOT produce an extra empty row.

## Examples
```js
parseCSV('a,b,c')            // [['a','b','c']]
parseCSV('a,"b,1",c\nd,e,f') // [['a','b,1','c'],['d','e','f']]
parseCSV('x,"he said ""hi""",y') // [['x','he said "hi"','y']]
```

There is a hidden test suite with additional edge cases. Done when all hidden tests pass.
