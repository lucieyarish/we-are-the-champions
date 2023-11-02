const publishBtn = document.getElementById('publish-btn');
const endorsementMessage = document.getElementById('endorsement-message');
const endorsementList = document.getElementById('endorsement-list');

publishBtn.addEventListener('click', function () {
  let message = endorsementMessage.value;
  clearInput(endorsementMessage);
  addMessageToList(message);
});

function clearInput(input) {
  input.value = '';
}

function addMessageToList(message) {
  let newEl = document.createElement('li');
  newEl.textContent = message;
  endorsementList.append(newEl);
}
