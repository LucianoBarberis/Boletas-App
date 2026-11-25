export const CURRENCY_SYMBOL = '$';

const amountFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: 'always',
});

export function round2(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toNumber(value) {
  const parsed =
    typeof value === 'number'
      ? value
      : Number.parseFloat(String(value ?? '').replace(',', '.'));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function toPercent(value) {
  return Math.min(toNumber(value), 100);
}

export function calculateInvoice(items = [], options = {}) {
  const lineItems = (Array.isArray(items) ? items : []).map((item) => {
    const quantity = toNumber(item?.quantity);
    const cost = toNumber(item?.cost);

    return {
      ...item,
      quantity,
      cost,
      amount: round2(quantity * cost),
    };
  });

  const subtotal = round2(
    lineItems.reduce((sum, item) => sum + item.amount, 0),
  );
  const ivaPercent = toPercent(options?.ivaPercent);
  const discountPercent = toPercent(options?.discountPercent);
  const ivaAmount = round2(subtotal * (ivaPercent / 100));
  const discountAmount = round2(subtotal * (discountPercent / 100));
  const total = round2(subtotal + ivaAmount - discountAmount);

  return {
    items: lineItems,
    subtotal,
    ivaPercent,
    ivaAmount,
    discountPercent,
    discountAmount,
    total,
  };
}

export function getInitials(name) {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function formatAmount(value) {
  return `${CURRENCY_SYMBOL}${amountFormatter.format(round2(value))}`;
}

export function formatDate(value) {
  if (typeof value !== 'string') return '';

  const [year, month, day] = value.split('-');

  return year && month && day ? `${day}/${month}/${year}` : value;
}
