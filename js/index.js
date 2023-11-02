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
const messageFrom = document.getElementById('endorsement-from');
const messageTo = document.getElementById('endorsement-to');
const endorsementList = document.getElementById('endorsement-list');

publishBtn.addEventListener('click', function () {
  let message = {
    message: endorsementMessage.value,
    from: messageFrom.value,
    to: messageTo.value,
    likes: generateRandomAmountOfLikes(),
    liked: false,
  };
  clearInputs(endorsementMessage, messageFrom, messageTo);
  push(endorsementListInDB, message);
});

onValue(endorsementListInDB, function (snapshot) {
  let endorsementArr = Object.values(snapshot.val());
  endorsementArr.reverse();

  clearEndorsementListEl();

  for (let i = 0; i < endorsementArr.length; i++) {
    let currentEndorsement = endorsementArr[i];
    addMessageToList(currentEndorsement);
  }
});

function clearEndorsementListEl() {
  endorsementList.innerHTML = '';
}

function clearInputs(msg, msgTo, msgFrom) {
  msg.value = '';
  msgTo.value = '';
  msgFrom.value = '';
}

function addMessageToList(endorsement) {
  let newEl = document.createElement('li');
  let msgTo = `<p class="bold-msg">To ${endorsement.to}</p>`;
  let msgFromAndLikes = `
    <p class="bold-msg">From ${endorsement.from}
      <span class="indent-right">${endorsement.likes} 
        <span id="heart" class="heart-emoji">💛</span>
      </span>
    </p>
  `;
  let message = `<p>${endorsement.message}</p>`;

  newEl.innerHTML = msgTo + message + msgFromAndLikes;
  endorsementList.append(newEl);
}

function generateRandomAmountOfLikes() {
  return Math.floor(Math.random() * 99);
}
