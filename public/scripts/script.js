function getInputValue() {
  let input = document.getElementById('input').value;
  window.location.href = `/new/${input}`;
}
