# Repository Guidelines

## Contributor Specs

Developers and AI agents should read these specs before changing the app and use them when reviewing changes.

- [Coding standards](specs/00-coding-standard.md) for module boundaries and business rules.
- [Future scale](specs/01-future-scale.md) for when to discuss nearby improvements with the developer.
- [Testing](specs/02-testing.md) for isolated fixtures, regression tests, and verification.
- [Anti-patterns](specs/03-anti-patterns.md) for mistakes to catch before opening a PR.

## Stack and Module Map

ShopLedger uses Node.js with CommonJS, Express, and `body-parser` on the server, plain HTML/CSS/JavaScript in the browser, and a JSON file for persistence.

- `server.js` serves `public/`, mounts the `/api` routers, and handles printable invoices.
- `routes/` contains the `products`, `orders`, `customers`, and `reports` HTTP handlers.
- `lib/` contains order, inventory, and khata logic (`orders.js`, `inventory.js`, `ledger.js`), billing rules (`pricing.js`, `coupons.js`, `tax.js`), invoices and reports (`invoice.js`, `reports.js`), and date and storage helpers (`dates.js`, `store.js`). Keep reusable business logic here.
- `config.js` holds shop settings and business defaults. `data/db.json` is the tracked database.

## Build, Test, and Development Commands

- `npm install` installs the dependencies declared in `package.json`.
- `npm start` runs `node server.js`. Open `http://localhost:3000`, or use `PORT=3001 npm start` to select another port.
- `node --test` runs the suite in `test/`. The `npm test` script is still a placeholder.
- `node --check routes/orders.js` checks syntax without starting the app. Run it for each changed JavaScript file. The app has no build step.

## Coding Style and Naming

Match the surrounding code. Use two-space indentation, single-quoted JavaScript strings, trailing semicolons, camelCase identifiers, and lowercase module filenames. Do not add runtime or development dependencies.

## Testing Guidelines

**Tests must never read from or write to `data/db.json`.** Use synthetic in-memory fixtures, stub the store for route tests, and use a temporary file outside the repository for tests that need disk persistence.

Verify the affected business flow and run the full suite. Keep customer data and credentials out of commits.

## Commits and Pull Requests

Follow the history’s short, lowercase, descriptive subjects, such as `invoice page for accountant`. In a pull request, explain the behavior change, record what you verified, and link the related issue when there is one. Include screenshots for UI or invoice layout changes and call out any intentional changes to the JSON data format.
