/* eslint -disable */

import { showAlert } from './alerts.js';

import axios from 'axios';

export const addNewItem = async (name, price, quantity) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/inventory/create-new-item',
      data: { name, price, quantity },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Item created successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 429) {
      showAlert('error', err.response.data);
      return window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  }
};
export const makeNewOrder = async (quantity, toWhom, serial) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/orders/create-new-order/${serial}`,
      data: {
        quantity,
        toWhom,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Order Placed successfully');
      window.setTimeout(() => {
        location.assign('/products');
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 405) {
      showAlert('error', err.response.data.message);
      return window.setTimeout(1500);
    }
    if (err.response.status === 429) {
      showAlert('error', err.response.data);
      window.setTimeout(1500);
    }
    console.log(err);
  }
};
export const deleteProduct = async (serial) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/v1/inventory/delete-product/${serial}`,
      data: {
        serial,
      },
    });
    if (res.status === 204) {
      showAlert('success', 'Product Deleted successfully');
      window.setTimeout(() => {
        location.assign('/products');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', err.response.data.message);
    window.setTimeout(1500);
  }
};

export const deleteOrder = async (serial) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/v1/orders/delete-order/${serial}`,
      data: {
        serial,
      },
    });
    if (res.status === 204) {
      showAlert('success', 'Order Deleted successfully');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', err.response.data.message);
    window.setTimeout(1500);
  }
};

export const editItem = async (name, price, quantity, serial) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/inventory/edit-product/${serial}`,
      data: {
        name,
        price,
        quantity,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Item has been edited successfully');
      window.setTimeout(() => {
        location.assign('/products');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Something went wrong');
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  }
};
