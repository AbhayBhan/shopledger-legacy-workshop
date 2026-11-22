# Anti-Patterns

Use these checks when changing or reviewing ShopLedger. Fix issues within the ticket’s scope and use the [scale guide](01-future-scale.md) to discuss larger changes.

| Avoid | Use instead |
| --- | --- |
| Trusting client-supplied prices, totals, or payment and stock assumptions | Resolve catalog data and validate the request on the server before changing state. |
| Checking each duplicate cart line independently or holding back the final sellable unit | Check the total quantity per product and permit equality with sellable stock. |
| Using a wholesale hold release to undo a sale | Restore physical stock from saved order item IDs. Preserve wholesale holds and prevent cancellation from applying twice. |
| Adding a raw settlement amount to a numeric balance | Parse and validate the amount as a finite number before doing arithmetic. Verify the balance and settlement record together. |
| Adding another GST or coupon calculation to a route, report, or template | Reuse the business rules in `lib/` and verify displayed figures against the saved order. Treat historical recalculation as a data decision. |
| Filtering or sorting on a display date such as `DD/MM/YYYY` | Compare chronological keys and format dates for display at the boundary. Include month and year crossings in regressions. |
| Inserting customer names or settlement notes into `innerHTML` | Use `textContent` or create DOM nodes and assign their text safely. |
| Writing the JSON database from a route or treating the write as safe across multiple processes | Keep persistence in `lib/store.js`. Discuss transactional storage when coordinated writes become necessary. |
| Using the tracked database as a test fixture, adding a test package, or bundling a broad rewrite with a small fix | Use synthetic fixtures and `node:test`. Keep the patch scoped and ask before adding adjacent roadmap work. |
