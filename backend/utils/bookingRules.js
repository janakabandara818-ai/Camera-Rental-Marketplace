class BookingError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function todayInColombo() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const get = (key) => parts.find(part => part.type === key).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function parseDate(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BookingError(400, `${field} must be a date in YYYY-MM-DD format.`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new BookingError(400, `${field} is not a valid date.`);
  }
  return date;
}

function validateRequest(body = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BookingError(400, 'Invalid booking request.');
  const { productId, type, requestId } = body;
  if (typeof productId !== 'string' || !/^[a-f\d]{24}$/i.test(productId)) throw new BookingError(400, 'Invalid product ID.');
  if (!['rent', 'buy'].includes(type)) throw new BookingError(400, 'Type must be rent or buy.');
  if (requestId !== undefined && (typeof requestId !== 'string' || !/^[a-zA-Z0-9_.-]{1,128}$/.test(requestId))) {
    throw new BookingError(400, 'Invalid booking request ID.');
  }
  const result = { productId, type, requestId };
  if (type === 'rent') {
    result.startDate = parseDate(body.startDate, 'Start date');
    result.endDate = parseDate(body.endDate, 'End date');
    if (body.startDate < todayInColombo()) throw new BookingError(400, 'Rental start date cannot be in the past.');
    if (result.endDate <= result.startDate) throw new BookingError(400, 'End date must be after the start date.');
    result.days = (result.endDate - result.startDate) / 86400000;
  }
  return result;
}

function priceFor(product, request) {
  if (product.available !== true) throw new BookingError(409, 'This equipment is unavailable.');
  const allowed = request.type === 'rent' ? ['rent', 'both'] : ['sell', 'both'];
  if (!allowed.includes(product.type)) throw new BookingError(400, 'This equipment does not support the requested transaction type.');
  const price = request.type === 'rent' ? product.rentPrice : product.sellPrice;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) throw new BookingError(400, 'This equipment has no valid price for the requested transaction.');
  const cents = Math.round(price * 100);
  const totalCents = cents * (request.type === 'rent' ? request.days : 1);
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0) throw new BookingError(400, 'Booking total is invalid.');
  return totalCents / 100;
}

function sameRequest(booking, request) {
  return String(booking.product) === request.productId.toLowerCase() && booking.type === request.type &&
    (request.type === 'buy' || (
      new Date(booking.startDate).getTime() === request.startDate.getTime() &&
      new Date(booking.endDate).getTime() === request.endDate.getTime()
    ));
}

function conflictFilter(request) {
  const active = ['pending', 'confirmed'];
  if (request.type === 'buy') {
    return { product: request.productId, $or: [
      { status: { $in: active } },
      { type: 'buy', status: 'completed' },
    ] };
  }
  return { product: request.productId, $or: [
    { type: 'buy', status: { $in: [...active, 'completed'] } },
    { type: 'rent', status: { $in: active }, $or: [
      { startDate: { $lt: request.endDate }, endDate: { $gt: request.startDate } },
      // Old malformed active rentals must be reviewed, not silently ignored.
      { startDate: null }, { endDate: null },
      { $expr: { $gte: ['$startDate', '$endDate'] } },
    ] },
  ] };
}

module.exports = { BookingError, todayInColombo, parseDate, validateRequest, priceFor, sameRequest, conflictFilter };
