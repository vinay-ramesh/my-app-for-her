import Axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

// Getting base URL from ENV
const BASE_URL = process.env.VITE_BASE_URL;

// The below line is to make sure that you can use two interceptors in the same project
// Without this the API base URL will be taken only from one of the interceptors
const axios = Axios.create();

// Map to store ongoing requests with their abort controllers
const pendingRequests = new Map();

// Helper function to generate unique request key
const getRequestKey = (config) => {
  return `${config.method}:${config.url}`;
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    const token = secureLocalStorage.getItem('token');

    // Generate the unique request key (e.g., 'get:/api/data')
    const requestKey = getRequestKey(config);

    // If the same request is already pending, abort it
    if (pendingRequests.has(requestKey)) {
      const previousController = pendingRequests.get(requestKey);
      previousController.abort();
    }

    // Create a new AbortController for the current request
    const controller = new AbortController();
    config.signal = controller.signal; // Assign the signal to the request

    // Store the controller for this request
    pendingRequests.set(requestKey, controller);

    // Add Authorization header if token is present
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.baseURL = BASE_URL;
    return config;
  },
  function (error) {
    // Do something with request error
    console.log('error', error?.message);
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Generate the request key and remove it from the pending requests
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);

    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  function (error) {
    // If the error was due to a request cancellation, remove it from the map
    if (error.config) {
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }

    // If the error is an abort error, handle it gracefully
    if (error.name === 'AbortError') {
      console.log('Request aborted:', error.message);
      return; // Do not reject or throw an error
    }
    console.log('Request aborted:', error.message);
    // Handle other types of errors (e.g., non-2xx status codes)
    if (error.response?.data) {
      console.log('error', error?.response?.data?.message);
    }

    return Promise.reject(error);
  },
);

// Create the https object for HTTP methods
const https = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

export default https;
