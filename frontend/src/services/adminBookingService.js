import API from './api';

export async function getAdminBookings() {
  const { data } = await API.get('/bookings/all');
  return data;
}

export async function updateAdminBookingStatus(id, status, expectedStatus) {
  const { data } = await API.put(`/bookings/${id}/status`, {
    status,
    expectedStatus,
  });
  return data;
}
