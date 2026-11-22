var assert = require('node:assert/strict');
var test = require('node:test');
var inventory = require('../lib/inventory');
var ledger = require('../lib/ledger');
var orders = require('../lib/orders');

test('sellable stock excludes reserved units and bottoms out at zero', function () {
  assert.equal(inventory.getSellableStock({ stock: 6, reserved: 2 }), 4);
  assert.equal(inventory.getSellableStock({ stock: 1, reserved: 2 }), 0);
});

test('a sale below sellable stock deducts physical stock and leaves holds intact', function () {
  var product = { id: 1, name: 'Rice', stock: 6, reserved: 2 };
  var items = [{ id: 1, qty: 3 }];

  assert.deepEqual(inventory.check([product], items), { ok: true });
  inventory.reserve([product], items);

  assert.equal(product.stock, 3);
  assert.equal(product.reserved, 2);
  assert.equal(inventory.getSellableStock(product), 1);
});

test('a sale can use the last sellable unit without consuming reserved stock', function () {
  var product = { id: 1, name: 'Rice', stock: 3, reserved: 2 };
  var items = [{ id: 1, qty: 1 }];

  assert.equal(inventory.getSellableStock(product), 1);
  assert.deepEqual(inventory.check([product], items), { ok: true });
  inventory.reserve([product], items);

  assert.equal(product.stock, 2);
  assert.equal(product.reserved, 2);
  assert.equal(inventory.getSellableStock(product), 0);
});

test('a sale can use the full sellable quantity across multiple units', function () {
  var product = { id: 1, name: 'Rice', stock: 3, reserved: 0 };

  assert.deepEqual(inventory.check([product], [{ id: 1, qty: 3 }]), { ok: true });
});

test('an order cannot use the last sellable unit twice on separate lines', function () {
  var product = { id: 1, name: 'Rice', stock: 3, reserved: 2 };
  var items = [{ id: 1, qty: 1 }, { id: 1, qty: 1 }];

  assert.deepEqual(inventory.check([product], items), {
    ok: false,
    msg: 'Rice is out of stock (1 sellable available)'
  });
});

test('releasing a wholesale hold by productId reduces reserved units', function () {
  var product = { id: 1, name: 'Rice', stock: 6, reserved: 2 };

  inventory.release([product], [{ productId: 1, qty: 1 }]);

  assert.equal(product.stock, 6);
  assert.equal(product.reserved, 1);
  assert.equal(inventory.getSellableStock(product), 5);
});

test('cancelling a saved khata order restores stock and reverses the debit once', function () {
  var product = { id: 1, name: 'Rice', stock: 6, reserved: 2 };
  var customer = { id: 1, openingBalance: 80, totalBilled: 50, totalSettled: 30, balance: 100 };
  var db = { products: [product], customers: [customer], orders: [], nextOrderId: 1001 };
  var items = [{ id: 1, qty: 2 }];
  var total = 100;

  assert.equal(ledger.chargeOrderToKhata(db, customer.id, total).ok, true);
  inventory.reserve(db.products, items);
  var order = orders.add(db, { items: items, customerId: customer.id, paymentMode: 'khata', total: total });
  assert.equal(product.stock, 4);
  assert.equal(inventory.getSellableStock(product), 2);
  assert.equal(customer.balance, 200);

  var result = orders.cancel(db, order.id, 'Customer cancelled');

  assert.equal(result.ok, true);
  assert.equal(order.status, 'cancelled');
  assert.equal(order.cancelReason, 'Customer cancelled');
  assert.equal(product.stock, 6);
  assert.equal(product.reserved, 2);
  assert.equal(inventory.getSellableStock(product), 4);
  assert.equal(customer.balance, 100);

  assert.equal(orders.cancel(db, order.id).ok, false);
  assert.equal(product.stock, 6);
  assert.equal(customer.balance, 100);
});
