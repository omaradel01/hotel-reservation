/* eslint-disable  */

import { signup, email_validation, username_validation } from './signup';
import { login, myFunction } from './login';
import { showAlert } from './alert';
import { tryNewCaptcha } from './captcha';
import { logout } from './logout';
import { validateDate, dateChecker, ValidateForm } from './search';
import {
  updateCurrentUserData,
  checkPasswords,
  updatePassword
} from './updateCurrentUser';

window.addEventListener('pageshow', function (event) {
  var historyTraversal =
    event.persisted ||
    (typeof window.performance != 'undefined' &&
      window.performance.getEntriesByType('navigation')[0].type === 2);
  if (historyTraversal) {
    // Handle page restore.
    window.location.reload();
  }
});

if (window.location.pathname === '/register') {
  var a = Math.ceil(Math.random() * 9) + '';
  var b = Math.ceil(Math.random() * 9) + '';
  var c = Math.ceil(Math.random() * 9) + '';
  var d = Math.ceil(Math.random() * 9) + '';
  var e = Math.ceil(Math.random() * 9) + '';
  var code = a + b + c + d + e;
  document.getElementById('txtCaptcha').value = code;
  document.getElementById('CaptchaDiv').innerHTML = code;

  document.getElementById('tryNewCaptcha').onclick = tryNewCaptcha;
  document.getElementById('email').oninput = email_validation;
  document.getElementById('username').oninput = username_validation;

  const form = document.querySelector('#registration_form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.CaptchaInput.value !== form.txtCaptcha.value) {
      showAlert('error', 'The CAPTCHA Code Does Not Match.');
      return false;
    }
    await signup(
      form.email.value,
      form.firstName.value,
      form.lastName.value,
      form.username.value
    );
  });
}

if (window.location.pathname === '/login') {
  const form = document.querySelector('#login_form');

  document.getElementById('viewOrHidePass').onclick = myFunction;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await login(form.email.value, form.password.value);
  });
}

if (document.getElementById('signoutForm')) {
  document
    .getElementById('signoutForm')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      await logout();
    });
}

if (window.location.pathname === '/home') {
  document.getElementById('CheckInDate').oninput = validateDate;
  document.getElementById('CheckOutDate').oninput = dateChecker;

  document
    .querySelector('#search')
    .addEventListener('submit', async (event) => {
      if (!ValidateForm()) {
        event.preventDefault();
      }
      sessionStorage.setItem(
        'sessionCity',
        document.getElementById('city').value
      );
      sessionStorage.setItem(
        'sessionCheckInDate',
        document.getElementById('CheckInDate').value
      );
      sessionStorage.setItem(
        'sessionCheckOutDate',
        document.getElementById('CheckOutDate').value
      );
      sessionStorage.setItem(
        'sessionNumberOfRooms',
        document.getElementById('numberOfRooms').value
      );
      sessionStorage.setItem(
        'sessionNumberOfAdults',
        document.getElementById('NoOfAdults').value
      );
      sessionStorage.setItem(
        'sessionNumberOfChildren',
        document.getElementById('NoOfChildren').value
      );
    });
}

if (window.location.pathname === '/me') {
  const changeAccountInfoForm = document.getElementById('changeAccountInfo');
  changeAccountInfoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await updateCurrentUserData(
      changeAccountInfoForm.firstName.value,
      changeAccountInfoForm.lastName.value,
      changeAccountInfoForm.email.value,
      changeAccountInfoForm.username.value
    );
  });

  const updatePasswordForm = document.getElementById('updatePassword');
  document.getElementById('passwordConfirm').oninput = checkPasswords;
  updatePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await updatePassword(
      updatePasswordForm.currentPassword.value,
      updatePasswordForm.password.value,
      updatePasswordForm.passwordConfirm.value
    );
  });
}

if (window.location.pathname.includes('/hotel/')) {
}
