# Future Scale

ShopLedger currently runs as one Express app with a synchronous JSON store. Keep the existing design while it meets the shop’s needs. Use observed bottlenecks and business needs to decide when to invest in the changes below.

## When to ask the developer

If the current ticket already touches a module or data boundary in this list and the next step would materially help, ask the developer before expanding the ticket. Name the overlap, propose the smallest useful improvement, and explain the extra work and how you would verify it. Ask whether to include it now or track it separately. Continue any in-scope work that can proceed while that decision is pending. Treat roadmap items as proposals.

For example, a second checkout terminal may make concurrent writes relevant. Ask whether the ticket should also cover a transaction spike for stock, orders, and khata, or whether that should be a separate ticket.

## Improvement candidates

| Trigger | Smallest useful next step | How to verify |
| --- | --- | --- |
| Overlapping writers, lost updates, or slow JSON writes | Evaluate transactional storage behind `lib/store.js`. Plan data import, backup, and rollback before switching. | Run simultaneous checkouts for the final unit. Verify that stock, order, and khata changes commit together. |
| Invoice-to-ledger discrepancies or changing tax and coupon rules | Agree on one calculation path and persist the agreed figures for future invoices. Define how existing orders will render. | Compare preview, saved totals, and invoice figures before and after a configuration change. |
| Order history or report latency grows with data size | Measure the slow query or report. Start with chronological date keys and bounded results where the UI can consume them. | Check date boundaries and page ordering, then compare timings with representative synthetic data. |
| Additional operators or exposure beyond a trusted network | Design operator authentication and authorization for customer data, financial writes, and exports. | Verify that authorized operators can complete their tasks and unauthorized requests leave state unchanged. |
