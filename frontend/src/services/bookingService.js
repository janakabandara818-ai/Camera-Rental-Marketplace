import API from './api';

export const createBooking = async (bookingData) => {
  const { data } = await API.post('/bookings', bookingData);
  return data;
};

export const getUserBookings = async () => {
  const { data } = await API.get('/bookings/my');
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await API.put(`/bookings/cancel/${id}`);
  return data;
};