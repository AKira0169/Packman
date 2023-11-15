import { showAlert } from './alerts';

import axios from 'axios';

export const changePassword = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  if (password !== passwordConfirm) {
    showAlert('error', 'Passwords doesnt match');
    return window.setTimeout(1500);
  }
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/changePassword',
      data: { passwordCurrent, password, passwordConfirm },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully');
      window.setTimeout(() => {
        location.assign('/test');
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

export const updateInfo = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/v1/users/update-info',
      data: {
        name,
        email,
      },
    });
    console.log(res);
    if (res.status === 200) {
      showAlert('success', 'Data changed successfully');
      window.setTimeout(() => {
        location.assign('/test');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};
