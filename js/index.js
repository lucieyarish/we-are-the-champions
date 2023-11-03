import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
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
  let endorsementObj = snapshot.val();
  endorsementArr.reverse();

  clearEndorsementListEl();

  for (let key in endorsementObj) {
    let endorsement = endorsementObj[key];
    addMessageToList(endorsement, key);
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

function addMessageToList(endorsement, key) {
  let newEl = document.createElement('li');
  let msgTo = `<p class="bold-msg">To ${endorsement.to}</p>`;
  let likeClicked = endorsement.liked;
  let heartLiked = '💛';
  let heartUnliked = '🖤';
  let msgFromAndLikes = `
    <p class="bold-msg">From ${endorsement.from}
      <span class="indent-right">${endorsement.likes} 
          <span class="btn-like" id="like-click">${
            likeClicked ? heartLiked : heartUnliked
          }</span>
      </span>
    </p>
  `;
  let message = `<p>${endorsement.message}</p>`;

  newEl.innerHTML = msgTo + message + msgFromAndLikes;

  toggleLikes(newEl, endorsement, key);

  endorsementList.append(newEl);
}

function generateRandomAmountOfLikes() {
  return Math.floor(Math.random() * 99);
}

function toggleLikes(element, endorsement, key) {
  element.addEventListener('click', function () {
    let exactLocationOfItemInDB = ref(database, `endorsements/${key}`);
    endorsement.liked = !endorsement.liked;

    if (endorsement.liked) {
      endorsement.likes += 1;
    } else {
      endorsement.likes -= 1;
    }

    set(exactLocationOfItemInDB, endorsement);
  });
}
