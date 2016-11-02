export function isRfid(rfid){
  return typeof(rfid) === "string" && /^\d{8,10}$/.test(rfid);
}
export function showToast(body){
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar(body);
}