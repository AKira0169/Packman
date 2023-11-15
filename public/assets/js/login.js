/* eslint -disable */

import { showAlert } from './alerts';

import axios from 'axios';

export const login = async (email, username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: { email, username, password },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged In successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 401) {
      showAlert('error', err.response.data.message);
      return window.setTimeout(1500);
    }
    if (err.response.status === 429) {
      showAlert('error', err.response.data);
      window.setTimeout(2500);
    }
  }
};

export const signUp = async (
  name,
  username,
  email,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: { name, username, email, password, passwordConfirm },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Signed Up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response.data.error.code === 11000) {
      if (err.response.data.error.keyValue.email) {
        showAlert(
          'error',
          `Email Already Exists: ${err.response.data.error.keyValue.email}`,
        );
        return window.setTimeout(1500);
      }
      if (err.response.data.error.keyValue.username) {
        showAlert(
          'error',
          `Username Already Exists: ${err.response.data.error.keyValue.username}`,
        );
        return window.setTimeout(1500);
      }
    }
    if (err.response.data.error.errors.passwordConfirm) {
      showAlert(
        'error',
        err.response.data.error.errors.passwordConfirm.message,
      );
      return window.setTimeout(1500);
    }
    console.log(err);
    showAlert('error', 'Something went wrong Please try again');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    alert(err);
  }
};
