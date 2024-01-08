import axios from 'axios';
import { deleteProduct, deleteOrder } from './itemManage.js';

export const emptySearch = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/products',
    });
    location.reload(true);
  } catch (err) {}
};

export const orderSearchResult = async (input) => {
  try {
    const pagination = document.querySelector('.pagination');
    pagination.style.display = 'none';
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/search',
      data: { input },
    });
    if (res.data.orders.length < 1) {
      const tableBody = document.querySelector('.table');
      tableBody.innerHTML = '<p class="text-center">Sorry no results</p>';
      return;
    }
    const deleteButton = document.getElementsByClassName('deleteButton');
    const confirmYes = document.querySelector('.confirmYes');
    const confirmNo = document.querySelector('.confirmNo');
    const tableBody = document.querySelector('.table');
    let serial;
    tableBody.innerHTML = '';
    const user = res.data.user;
    const coulm = document.createElement('thead');
    coulm.innerHTML = `
      <tr>
      <th>Num</th>
      <th>Name of client</th>
      <th>Product</th>
      <th>Sold By</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>History</th>
      <th>Total</th>
      <th>Actions</th></tr>`;
    Array.from(res.data.orders).forEach((order, index) => {
      const row = document.createElement('tbody');
      row.classList;
      row.innerHTML = `
          <th scope='row'>${index + 1}</th>
            <td>${order.toWhom}</td>
            <td>${order.name}</td>
            <td>${order.createdBy}</td>
            <td>${order.quantity}</td>
            <td>${order.price}</td>
            <td>${order.createdAt}</td>
            <td>${order.price * order.quantity} L.E</td>
            <td>
              ${
                user.role === 'admin'
                  ? `<button class='bttn button deleteButton deleteButton' type='button' data-serial='${order.serial}'>❌</button>`
                  : ''
              }
            </td>
          `;
      tableBody.appendChild(coulm);
      tableBody.appendChild(row);
      Array.from(deleteButton).forEach((element) => {
        element.addEventListener('click', (e) => {
          serial = e.currentTarget.getAttribute('data-serial');
          confirmationDialog.classList.remove('hidden');
        });
        confirmYes.addEventListener('click', (e) => {
          deleteOrder(serial);
          confirmationDialog.classList.add('hidden');
        });

        confirmNo.addEventListener('click', (e) => {
          confirmationDialog.classList.add('hidden');
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const productSearchResult = async (input) => {
  try {
    const pagination = document.querySelector('.pagination');
    pagination.style.display = 'none';
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/search',
      data: { input },
    });
    if (res.data.products.length < 1) {
      const tableBody = document.querySelector('.table');
      tableBody.innerHTML = '<p class="text-center">Sorry no results</p>';
      return;
    }
    const deleteButton = document.getElementsByClassName('deleteButton');
    const confirmYes = document.querySelector('.confirmYes');
    const confirmNo = document.querySelector('.confirmNo');
    const tableBody = document.querySelector('.table');
    let serial;
    tableBody.innerHTML = '';
    const user = res.data.user;
    const coulm = document.createElement('thead');
    coulm.innerHTML = `
      <tr>
      <th>Num</th>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Added at</th>
      <th>Avaliable</th>
      <th>Actions</th></tr>`;

    Array.from(res.data.products).forEach((product, index) => {
      const row = document.createElement('tbody');
      row.classList;
      row.innerHTML = `
        <th scope='row'>${index + 1}</th>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>${product.price}</td>
          <td>${product.addedAt}</td>
          <td>${
            product.status === 'In Stock'
              ? '<div class="inStock">In stock</div>'
              : '<div class="outofStock">Out of stock</div>'
          }</td>
          <td>
            <a class='button bttn actions button' href='/make-order/${
              product.serial
            }'>➕</a>
            <a class='button bttn actions button' href='#'>🛒</a>
            ${
              user.role === 'admin'
                ? `<a class='button bttn actions button' href='/edit-item/${product.serial}'>✏️</a>`
                : ''
            }
            ${
              user.role === 'admin'
                ? `<button class='bttn actions button deleteButton deleteButton' type='button' data-serial='${product.serial}'>❌</button>`
                : ''
            }
          </td>
        `;
      tableBody.appendChild(coulm);
      tableBody.appendChild(row);
      Array.from(deleteButton).forEach((element) => {
        element.addEventListener('click', (e) => {
          serial = e.currentTarget.getAttribute('data-serial');
          confirmationDialog.classList.remove('hidden');
        });
        confirmYes.addEventListener('click', (e) => {
          deleteProduct(serial);
          confirmationDialog.classList.add('hidden');
        });

        confirmNo.addEventListener('click', (e) => {
          confirmationDialog.classList.add('hidden');
        });
      });
    });
  } catch (err) {
    console.log('error', err);
  }
};
