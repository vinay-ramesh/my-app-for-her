import https from './../config/init/https';

// RA3-LOGIN-01: Forgot Password
export const getResetPasswordEmail = async (formData) => {
  try {
    let response = await https.post('/login/forgot_password', formData);
    // console.log('response from getResetPasswordEmail', response);
    const result = response?.data;
    return result;
  } catch (err) {
    // console.log('err', err);
    throw err;
  }
};

// RA3-LOGIN-02: Reset Password
export const generateNewPassword = async (formData) => {
  try {
    let response = await https.post('/login/reset_password', formData);
    // console.log('response from generateNewPassword', response);
    const result = response?.data;
    return result;
  } catch (err) {
    // console.log('err', err);
    throw err;
  }
};

// RA3-LOGIN-03: Signin
export const loginForm = async (formData) => {
  try {
    let response = await https.post('login/signin', formData);
    // console.log('response from loginForm', response);
    const result = response?.data;
    return result;
  } catch (err) {
    // console.log('err', err);
    throw err;
  }
};

// RA3-LOGIN-04: Retrieve the available institutions to the logged in user
export const fetchInstitutionList = async (userId, searchText) => {
  try {
    let response = await https.get(`login/${userId}/institutions?search_text=${searchText}`);
    // console.log('response from fetchInstitutionList', response);
    const result = response?.data?.data;
    return result;
  } catch (err) {
    // console.log('err', err);
    throw err;
  }
};

// RA3-LOGIN-05: Login to institution
export const loginToInstitution = async (userId, institutionId) => {
  try {
    let response = await https.post(`login/${userId}/login-to-inst/${institutionId}`);
    // console.log('response from loginToInstitution', response);
    const result = response?.data?.data;
    return result;
  } catch (err) {
    // console.log('err', err);
    throw err;
  }
};
