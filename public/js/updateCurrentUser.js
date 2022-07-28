/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';
import { apiUrl } from './apiUrl';

export function checkPasswords() {
  if (
    document.getElementById('password').value !==
    document.getElementById('passwordConfirm').value
  ) {
    document.getElementById('passwordConfirmErrorMessage').innerHTML =
      '&#x26A0;passwords are not the same';
    document.getElementById('submit').setAttribute('disabled', '');
  } else {
    document.getElementById('passwordConfirmErrorMessage').innerHTML = '';
    document.getElementById('submit').removeAttribute('disabled');
  }
}

export const updateCurrentUserData = async (
  firstName,
  lastName,
  email,
  username
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/users/updateMe`,
      data: {
        email,
        firstName,
        lastName,
        username
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'your account info has been updated successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${apiUrl}/users/updateMyPassword`,
      data: {
        currentPassword,
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'your password has been changed successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
