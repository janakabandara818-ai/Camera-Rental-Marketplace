import API from './api';

export const getProducts = async () => {
  const { data } = await API.get('/products');
  return data;
};

export const getProduct = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await API.post('/products', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await API.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};