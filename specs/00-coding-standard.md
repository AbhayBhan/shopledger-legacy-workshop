# Coding Standards

## Match the repository

- Use two-space indentation, single-quoted JavaScript strings, trailing semicolons, and camelCase for functions and variables. Use lowercase module filenames and CommonJS (`require`, `exports`, `module.exports`) on the server.
- Keep the frontend in plain HTML, CSS, and JavaScript under `public/`. Use existing packages and Node.js built-ins. Do not add runtime or development dependencies.
- Make focused changes and follow the conventions of the file you edit. Prefer names that describe the business effect, such as `restock` for returning sold units to physical stock.

## Keep responsibilities clear

- Put HTTP parsing, status codes, and response formatting in `routes/`. Put calculation and state transitions in the relevant `lib/` module. Keep file I/O in `lib/store.js` and shop settings in `config.js`.
- Validate and normalize request values before calculating totals or mutating state. Resolve product prices and tax inputs from the catalog on the server. Treat the browser’s values as input to validate.
- Reuse existing pricing, tax, and coupon helpers. When changing billing, verify cart preview, the saved order, and the printable invoice, since they follow separate paths today. Document intentional changes to rounding or stored figures.
- Keep physical stock, wholesale holds, and sellable stock distinct. Check the combined quantity for each product. Cancellation should restore sold quantities once and reverse any khata debit once.
- Preserve existing API and saved-data compatibility unless the ticket calls for a change. Include rejected requests and repeat attempts when checking state changes. Keep secrets and real customer data out of source and test fixtures.

Use the [testing spec](02-testing.md) for verification and the [scale guide](01-future-scale.md) when a change is close to a larger improvement.
