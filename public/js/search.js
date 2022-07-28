/* eslint-disable */

import { showAlert } from './alert';

export function validateDate() {
  const checkInDate = document.getElementById('CheckInDate').value;
  if (new Date() > new Date(checkInDate)) {
    document.getElementById('DateValidator').innerHTML =
      '&#x26A0;Invalid check in date!';
  } else {
    document.getElementById('DateValidator').innerHTML = '';
  }
}

export function dateChecker() {
  const checkInDate = document.getElementById('CheckInDate').value;
  const checkOutDate = document.getElementById('CheckOutDate').value;
  if (
    checkInDate === '' ||
    checkInDate === null ||
    document.getElementById('DateValidator').innerHTML.length !== 0
  ) {
    document.getElementById('CheckOutDate').value = '';
    showAlert('error', 'Please select a valid check in date!');
  } else if (new Date(checkOutDate) < new Date(checkInDate)) {
    document.getElementById('DateChecker').innerHTML =
      '&#x26A0;check out date must be at least the same as check in date';
  } else {
    document.getElementById('DateChecker').innerHTML = '';
  }
}

export function ValidateForm() {
  if (
    document.getElementById('DateChecker').innerHTML !== '' ||
    document.getElementById('DateValidator').innerHTML !== ''
  ) {
    showAlert('error', 'Please check your data');
    return false;
  }
  return true;
}
