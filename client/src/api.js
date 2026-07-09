import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_ENDPOINT, // env से backend URL
  withCredentials: true // cookies भी भेजेगा अगर backend सेट है
});

export default API;
