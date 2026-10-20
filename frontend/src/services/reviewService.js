import API from './api';

export const getReviews = async (productId) => {
  const { data } = await API.get(`/reviews/${productId}`);
  return data;
};

export const addReview = async (productId, rating, comment) => {
  const { data } = await API.post(`/reviews/${productId}`, { rating, comment });
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await API.delete(`/reviews/${id}`);
  return data;
};