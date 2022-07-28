/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  window.location.pathname === '/login'
    ? document
        .querySelector('body > div > div > div > div')
        .insertAdjacentHTML('afterbegin', markup)
    : document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
