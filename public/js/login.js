/* eslint-disable */

import axios from 'axios';
import { apiUrl } from './apiUrl';
import { showAlert } from './alert';

export function myFunction() {
  const x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
}

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/login`,
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/home');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
