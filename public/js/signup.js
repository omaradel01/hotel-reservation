/* eslint-disable  */

import axios from 'axios';
import { apiUrl } from './apiUrl';
import { showAlert } from './alert';

//------------------------------------EMAIL VALIDATION-------------------------------------
export function email_validation() {
  var input = document.getElementById('email');
  if (emails.split(',').includes(input.value)) {
    document.getElementById('demo2').innerHTML =
      '&#x26A0;This email is taken, please try another one.';
    document.getElementById('submit').setAttribute('disabled', '');
  } else {
    document.getElementById('demo2').innerHTML = '';
    document.getElementById('submit').removeAttribute('disabled');
  }
}
//-----------------------------------------------------------------------------------------

//-----------------------------------USERNAME VALIDATION-----------------------------------
export function username_validation() {
  var input = document.getElementById('username');

  if (usernames.split(',').includes(input.value)) {
    document.getElementById('demo').innerHTML =
      '&#x26A0;This username is taken, please try another one.';
    document.getElementById('submit').setAttribute('disabled', '');
  } else {
    document.getElementById('demo').innerHTML = '';
    document.getElementById('submit').removeAttribute('disabled');
  }
}

//------------------------------------------SIGNUP-----------------------------------------
export const signup = async (email, firstName, lastName, username) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${apiUrl}/users/signup`,
      data: {
        email,
        firstName,
        lastName,
        username
      }
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Account is created successfully!\nAn email is sent to you with your password!'
      );
      window.setTimeout(() => {
        location.assign('/login');
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
//-----------------------------------------------------------------------------------------
