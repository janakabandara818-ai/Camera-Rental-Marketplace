export function localToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const get = (type) =>
    parts.find((part) => part.type === type).value;

  return `${get('year')}-${get('month')}-${get('day')}`;
}

function parseDate(value) {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return NaN;
  }

  const timestamp = Date.parse(`${value}T00:00:00Z`);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== value
  ) {
    return NaN;
  }

  return timestamp;
}

export function rentalDays(start, end) {
  const first = parseDate(start);
  const last = parseDate(end);

  if (!Number.isFinite(first) || !Number.isFinite(last)) {
    throw new Error('Select valid start and return dates.');
  }

  if (start < localToday()) {
    throw new Error('Rental start date cannot be in the past.');
  }

  if (last <= first) {
    throw new Error('Return date must be after the start date.');
  }

  return (last - first) / 86400000;
}

export function buildCartEntry(product, type, options = {}) {
  if (
    !product ||
    !/^[a-f\d]{24}$/i.test(product._id || '')
  ) {
    throw new Error(
      'Open this item from the equipment catalog before adding it.'
    );
  }

  if (!['rent', 'buy'].includes(type)) {
    throw new Error('Invalid order type.');
  }

  if (product.available === false) {
    throw new Error('This equipment is currently unavailable.');
  }

  const allowedTypes =
    type === 'rent' ? ['rent', 'both'] : ['sell', 'both'];

  if (!allowedTypes.includes(product.type)) {
    throw new Error(
      `This equipment is not offered for ${
        type === 'rent' ? 'rental' : 'purchase'
      }.`
    );
  }

  const price = Number(
    type === 'rent' ? product.rentPrice : product.sellPrice
  );

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('This equipment has no valid price.');
  }

  const days =
    type === 'rent'
      ? rentalDays(options.startDate, options.endDate)
      : 1;

  const totalPrice = Math.round(price * days * 100) / 100;

  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new Error('This equipment has an invalid total price.');
  }

  return {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `cart-${Date.now()}-${Math.random()}`,
    productId: product._id,
    name: product.name,
    image: product.image || '',
    type,
    startDate: type === 'rent' ? options.startDate : undefined,
    endDate: type === 'rent' ? options.endDate : undefined,
    rentalDays: type === 'rent' ? days : undefined,
    unitPrice: price,
    totalPrice,
  };
}

export function sameCartLine(first, second) {
  return (
    first.productId === second.productId &&
    first.type === second.type &&
    first.startDate === second.startDate &&
    first.endDate === second.endDate
  );
}