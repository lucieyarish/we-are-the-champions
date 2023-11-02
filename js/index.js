import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
const appSettings = {
  databaseURL:
    'https://endorsement-app-a1eba-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, 'endorsements');

const publishBtn = document.getElementById('publish-btn');
const endorsementMessage = document.getElementById('endorsement-message');
const endorsementList = document.getElementById('endorsement-list');

publishBtn.addEventListener('click', function () {
  let message = endorsementMessage.value;
  clearInput(endorsementMessage);
  push(endorsementListInDB, message);
});

onValue(endorsementListInDB, function (snapshot) {
  let endorsementArr = Object.values(snapshot.val());

  clearEndorsementListEl();

  for (let i = 0; i < endorsementArr.length; i++) {
    let currentEndorsement = endorsementArr[i];
    addMessageToList(currentEndorsement);
  }
});

function clearEndorsementListEl() {
  endorsementList.innerHTML = '';
}

function clearInput(input) {
  input.value = '';
}

function addMessageToList(message) {
  let newEl = document.createElement('li');
  newEl.textContent = message;
  endorsementList.append(newEl);
}
