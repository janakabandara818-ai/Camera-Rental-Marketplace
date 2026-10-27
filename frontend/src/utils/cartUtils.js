export function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);
}

export function rentalDays(start, end) {
  const parse = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const stamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 10) === value
      ? stamp : NaN;
  };
  const first = parse(start);
  const last = parse(end);
  if (!Number.isFinite(first) || !Number.isFinite(last)) throw new Error('Select valid start and end dates.');
  if (start < localToday()) throw new Error('Rental start date cannot be in the past.');
  if (last <= first) throw new Error('End date must be after the start date.');
  return (last - first) / 86400000;
}

export function buildCartEntry(product, type, options = {}) {
  if (!product || !/^[a-f\d]{24}$/i.test(product._id || '')) {
    throw new Error('Open this item from the equipment catalog before adding it.');
  }
  if (!['rent', 'buy'].includes(type)) throw new Error('Invalid order type.');
  if (product.available === false) throw new Error('This equipment is currently unavailable.');
  const allowed = type === 'rent' ? ['rent', 'both'] : ['sell', 'both'];
  if (!allowed.includes(product.type)) throw new Error(`This equipment is not offered for ${type === 'rent' ? 'rental' : 'purchase'}.`);
  const price = Number(type === 'rent' ? product.rentPrice : product.sellPrice);
  if (!Number.isFinite(price) || price <= 0) throw new Error('This equipment has no valid price.');
  const days = type === 'rent' ? rentalDays(options.startDate, options.endDate) : 1;
  return {
    id: globalThis.crypto?.randomUUID?.() || `cart-${Date.now()}-${Math.random()}`,
    productId: product._id,
    name: product.name,
    image: product.image || '',
    type,
    startDate: type === 'rent' ? options.startDate : undefined,
    endDate: type === 'rent' ? options.endDate : undefined,
    rentalDays: type === 'rent' ? days : undefined,
    unitPrice: price,
    totalPrice: Math.round(price * days * 100) / 100,
  };
}

export function sameCartLine(a, b) {
  return a.productId === b.productId && a.type === b.type &&
    a.startDate === b.startDate && a.endDate === b.endDate;
}
