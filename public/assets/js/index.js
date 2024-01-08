/* eslint -disable */

import '@babel/polyfill';

import { showAlert } from './alerts.js';

import { login, signUp, logout } from './login.js';

import { changePassword, updateInfo } from './mangeAcc.js';

import {
  addNewItem,
  makeNewOrder,
  deleteProduct,
  deleteOrder,
  editItem,
} from './itemManage.js';

import {
  emptySearch,
  productSearchResult,
  orderSearchResult,
} from './search.js';

import { cartPageRend, createOrderCart } from './cart.js';

function isEmail(input) {
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(input);
}

const loginfunc = document.querySelector('.loginform');
const signUpForm = document.querySelector('.form--signup');
const logOut = document.querySelector('.logoutBtn');
const addNewItemForm = document.querySelector('.form--newItem');
const makeNewOrderForm = document.querySelector('.form--newOrder');
const changePasswordForm = document.querySelector('.changePassword');
const changeInfoForm = document.querySelector('.changeinfo');
const editItemForm = document.querySelector('.form--editItem');
const submitButtonNewProduct = document.getElementById(
  'submit-button-newProduct',
);
const submitButtonMakeOrder = document.getElementById(
  'submit-button-makeOrder',
);
const submitButtonCart = document.getElementById('submit-button-cart');
const cartForm = document.querySelector('.form-cart');
const deleteButton = document.getElementsByClassName('deleteButton');
const confirmationDialog = document.getElementById('confirmationDialog');
const confirmYes = document.querySelector('.confirmYes');
const confirmNo = document.querySelector('.confirmNo');
const searchInput = document.getElementById('search-box');
const priceTotal = document.querySelector('.priceTotal');
const cartBttn = document.getElementsByClassName('cartBttn');
const cartPage = document.getElementById('cartPage');
let serial;
let cart = [];

if (priceTotal) {
  priceTotal.addEventListener('keyup', (e) => {
    e.preventDefault();
    const pricee = document.querySelector('.price-order').placeholder;
    document.querySelector('.price-order').value =
      pricee.split('/')[0] * e.target.value + '/L.E';
  });
}

if (cartBttn) {
  Array.from(cartBttn).forEach((cartButton) => {
    cartButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const productSerial = cartButton.getAttribute('data-serial');
      showAlert('success', 'Product added to cart successfully');
      cart.push(productSerial);
    });
  });
}

if (cartPage) {
  cartPage.addEventListener('click', (e) => {
    e.preventDefault();
    cartPageRend(cart);
  });
}

if (searchInput) {
  searchInput.addEventListener('keyup', (e) => {
    e.preventDefault();
    let url = window.location.href;
    url = url.substring(url.lastIndexOf('/') + 1);
    const inputElement = document.getElementById('search-box').value;
    if (searchInput.value == '') {
      return emptySearch();
    }
    if (url === 'products') {
      return productSearchResult(inputElement);
    }
    if (url === 'orders') {
      return orderSearchResult(inputElement);
    }
  });
}

if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    changePassword(currentPassword, newPassword, confirmPassword);
  });
}

if (loginfunc) {
  loginfunc.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('email').value;
    const inputValue = inputElement.trim();
    const password = document.getElementById('password').value;
    if (inputValue) {
      if (isEmail(inputValue)) {
        const email = inputValue;
        login(email, null, password);
      } else {
        const username = inputValue;
        login(null, username, password);
      }
    }
  });
}
if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const userName = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    signUp(name, userName, email, password, passwordConfirm);
  });
}

if (logOut) {
  logOut.addEventListener('click', logout);
}

if (addNewItemForm) {
  addNewItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    submitButtonNewProduct.disabled = true;
    try {
      await addNewItem(name, price, quantity);
    } catch (err) {
    } finally {
      submitButtonNewProduct.disabled = false;
    }
    // addNewItem(name, price, quantity);
  });
}
if (makeNewOrderForm) {
  makeNewOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = window.location.href;
    const OrderSerial = url.substring(url.lastIndexOf('/') + 1);
    const orderQuantity = document.getElementById('order-quantity').value;
    const toWhom = document.getElementById('order-toWhom').value;
    submitButtonMakeOrder.disabled = true;
    try {
      await makeNewOrder(orderQuantity, toWhom, OrderSerial);
    } catch (err) {
    } finally {
      submitButtonMakeOrder.disabled = false;
    }
    // makeNewOrder(orderQuantity, toWhom, serial);
  });
}
if (cartForm) {
  const productsName = document.querySelectorAll('#cart-product-name');
  const productsQuantitie = document.querySelectorAll('#cart-product-quantity');
  const productsPrice = document.querySelectorAll('#cart-product-price');
  const productsTotal = document.querySelectorAll('.product-total');
  const itemsSerial = document.querySelectorAll('.deleteButton');
  const products = [];

  const updateTotal = () => {
    let overallTotal = 0;
    for (let i = 0; i < productsName.length; i++) {
      let quantity = parseInt(productsQuantitie[i].value, 10);
      if (isNaN(quantity) || quantity < 0) {
        quantity = 0;
      }
      const price = parseFloat(productsPrice[i].value);
      const total = quantity * price;
      overallTotal += total;
      productsTotal[i].textContent = total.toFixed(2);
    }
    const totalElement = document.querySelector('.total');
    if (totalElement) {
      totalElement.textContent = `Total: ${overallTotal.toFixed(2)} L.E `;
    }
  };
  updateTotal();
  Array.from(productsQuantitie).forEach((element) => {
    element.addEventListener('keyup', updateTotal);
  });
  cartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (let i = 0; i < productsName.length; i++) {
      const serial = itemsSerial[i].getAttribute('data-serial');
      const quantity = parseInt(productsQuantitie[i].value, 10);
      const toWhom = document.getElementById('order-toWhom').value;
      const product = { quantity, serial, toWhom };
      products.push(product);
      submitButtonCart.disabled = true;
    }
    try {
      await createOrderCart(products);
    } catch (err) {
    } finally {
      submitButtonCart.disabled = false;
    }
  });
}

if (editItemForm) {
  editItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = window.location.href;
    const itemSerial = url.substring(url.lastIndexOf('/') + 1);
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('item-quantity').value;
    editItem(name, price, quantity, itemSerial);
  });
}

if (changeInfoForm) {
  changeInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-name').value;
    const email = document.getElementById('new-email').value;
    updateInfo(name, email);
  });
}

Array.from(deleteButton).forEach((element) => {
  element.addEventListener('click', (e) => {
    serial = e.currentTarget.getAttribute('data-serial');
    confirmationDialog.classList.remove('hidden');
  });
});

confirmYes.addEventListener('click', (e) => {
  if (serial.split('-')[1] === 'Order') {
    deleteOrder(serial);
    return confirmationDialog.classList.add('hidden');
  }
  deleteProduct(serial);
  confirmationDialog.classList.add('hidden');
});

confirmNo.addEventListener('click', (e) => {
  confirmationDialog.classList.add('hidden');
});
