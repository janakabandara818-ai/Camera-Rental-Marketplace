import API from './api';

export const registerUser = async (name, email, password) => {
  try {
    const { data } = await API.post('/auth/register', { name, email, password });
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await API.post('/auth/login', { email, password });
    return data;
  } catch (error) {
    throw error;
  }
};