import API from '../api';

// Login function
export const loginUser = async (email, password) => {
  try {
    const res = await API.post('/users/login', { email, password });
    return res.data;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw err;
  }
};

// Register function
export const registerUser = async (name, email, password) => {
  try {
    const res = await API.post('/users/register', { name, email, password });
    return res.data;
  } catch (err) {
    console.error("Register failed:", err.response?.data || err.message);
    throw err;
  }
};
