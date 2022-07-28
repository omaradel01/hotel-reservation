/* eslint-disable  */

export function tryNewCaptcha() {
  var a = Math.ceil(Math.random() * 9) + '';
  var b = Math.ceil(Math.random() * 9) + '';
  var c = Math.ceil(Math.random() * 9) + '';
  var d = Math.ceil(Math.random() * 9) + '';
  var e = Math.ceil(Math.random() * 9) + '';
  var code = a + b + c + d + e;
  document.getElementById('txtCaptcha').value = code;
  document.getElementById('CaptchaDiv').innerHTML = code;
}
