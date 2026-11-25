import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateInvoice,
  formatAmount,
  getInitials,
} from '../src/lib/invoice.js';

test('calculates line amounts and totals with IVA and discount percentages', () => {
  const invoice = calculateInvoice(
    [
      { quantity: 2, description: 'Lapices', cost: 15 },
      { quantity: 3, description: 'Cuadernos', cost: 20 },
    ],
    { ivaPercent: 18, discountPercent: 10 },
  );

  assert.equal(invoice.items[0].amount, 30);
  assert.equal(invoice.items[1].amount, 60);
  assert.equal(invoice.subtotal, 90);
  assert.equal(invoice.ivaAmount, 16.2);
  assert.equal(invoice.discountAmount, 9);
  assert.equal(invoice.total, 97.2);
});

test('an empty invoice has zero totals', () => {
  const invoice = calculateInvoice([], { ivaPercent: 18, discountPercent: 10 });

  assert.equal(invoice.subtotal, 0);
  assert.equal(invoice.ivaAmount, 0);
  assert.equal(invoice.discountAmount, 0);
  assert.equal(invoice.total, 0);
});

test('accepts values from text inputs and ignores invalid ones', () => {
  const invoice = calculateInvoice(
    [
      { quantity: '2.5', description: 'Papel', cost: '10.40' },
      { quantity: 'abc', description: 'Sin cantidad', cost: '5' },
      { quantity: 1, description: 'Sin costo', cost: '' },
    ],
    { ivaPercent: '21', discountPercent: '' },
  );

  assert.equal(invoice.items[0].amount, 26);
  assert.equal(invoice.items[1].amount, 0);
  assert.equal(invoice.items[2].amount, 0);
  assert.equal(invoice.subtotal, 26);
  assert.equal(invoice.ivaAmount, 5.46);
  assert.equal(invoice.discountAmount, 0);
  assert.equal(invoice.total, 31.46);
});

test('rounds monetary values to two decimals', () => {
  const invoice = calculateInvoice(
    [{ quantity: 3, description: 'Servicio', cost: 10.335 }],
    { ivaPercent: 18, discountPercent: 5 },
  );

  assert.equal(invoice.subtotal, 31.01);
  assert.equal(invoice.ivaAmount, 5.58);
  assert.equal(invoice.discountAmount, 1.55);
  assert.equal(invoice.total, 35.04);
});

test('builds initials from the company name', () => {
  assert.equal(getInitials('Juan Perez SRL'), 'JP');
  assert.equal(getInitials('  ACME  '), 'AC');
  assert.equal(getInitials(''), '?');
});

test('formats amounts with two decimals and a thousands separator', () => {
  assert.equal(formatAmount(1234.5), '$1.234,50');
  assert.equal(formatAmount(0), '$0,00');
});
