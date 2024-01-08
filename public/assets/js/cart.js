/* eslint -disable */

import { showAlert } from './alerts.js';

import axios from 'axios';

export const cartPageRend = async (cart) => {
  try {
    const queryString = `?cart=${JSON.stringify(cart)}`;
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/cart${queryString}`,
      data: {
        cart,
      },
    });
    const newHTML = res.data;
    // Create a new HTML document
    const parser = new DOMParser();
    const newDocument = parser.parseFromString(newHTML, 'text/html');

    // Replace the current document with the new one
    document.open();
    document.write(newDocument.documentElement.innerHTML);
    document.close();
  } catch (err) {
    console.log(err);
  }
};

export const createOrderCart = async (product) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/orders/create-new-order-cart',
      data: { product },
    });
    if (res.status === 201) {
      showAlert('success', 'Orders Placed successfully');
      window.setTimeout(() => {
        location.assign('/products');
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 405) {
      showAlert('error', err.response.data.message);
      window.setTimeout(1500);
    }
    console.log(err);
  }
};
