# Testing Standards

## Run the suite

Use Node’s built-in `node:test` runner and `node:assert/strict`. Put tests in `test/` with names such as `inventory-orders.test.js`. Use behavior-focused test names that state the expected outcome. The `npm test` script is a placeholder.

```sh
node --test
node --test test/inventory-orders.test.js
```

## Keep tests isolated

- Never read or write the repository’s `data/db.json`. Give each test fresh synthetic data. Exercise `lib/` directly for business rules and stub `lib/store.js` for route tests.
- For persistence tests, point the subject at an isolated temporary file outside the repository and clean it up. For a real HTTP reproduction, run a temporary app copy with synthetic storage and stop it afterward.
- Use explicit inputs and assertions. Avoid dependence on the current clock, external network, shared state, or test order. Check the public result and the relevant state after success and rejection.

## Verify regressions

For a bug fix, write or update a test for the expected behavior and capture it failing against the original code. After fixing the bug, update any characterization test that encoded the old behavior and run the full suite. Use `CURRENT BEHAVIOUR` in a test name when intentionally pinning a known defect before its fix.

Cover the boundaries affected by the ticket. For stock changes, check below, at, and above sellable quantity, including split lines for the same product. For cancellation and khata changes, check physical stock, wholesale holds, and customer balances before and after, then verify a repeated cancellation cannot apply twice. For billing changes, check preview, saved totals, and the printed invoice with representative tax slabs and coupon boundaries. Record the commands and results in the PR.
