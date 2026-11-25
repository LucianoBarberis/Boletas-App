import test from 'node:test';
import assert from 'node:assert/strict';

import { loadCompany, saveCompany } from '../src/lib/storage.js';

function installStorage() {
  const store = new Map();

  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };

  return store;
}

test('loads the company data saved on a previous visit', () => {
  installStorage();

  const saved = {
    companyName: 'ACME',
    phone: '809-555-1234',
    email: 'hola@acme.test',
    address: 'Calle Principal 1',
    city: 'Santo Domingo',
    logo: '',
  };

  assert.equal(saveCompany(saved), true);
  assert.deepEqual(loadCompany(), saved);
});

test('returns an empty company when nothing has been saved', () => {
  installStorage();

  const company = loadCompany();

  assert.equal(company.companyName, '');
  assert.equal(company.logo, '');
});

test('returns an empty company when the stored value is corrupt', () => {
  const store = installStorage();
  store.set('boletasapp:company:v1', '{invalid json');

  assert.equal(loadCompany().companyName, '');
});
