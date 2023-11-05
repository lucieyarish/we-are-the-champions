import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  get,
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
  let endorsementObj = snapshot.val();
  let endorsementKeys = Object.keys(endorsementObj);

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
  let likeClicked = endorsement.liked;
  let heartLiked = '💛';
  let heartUnliked = '🖤';

  const html = `
  <li id="${key}">
    <p class="bold-msg">To ${endorsement.to}</p>
    <p>${endorsement.message}</p>
    <p class="bold-msg row-parent">From ${endorsement.from}
      <span class="indent-right">${endorsement.likes} 
        <button class="btn-like" data-id="${key}">
          ${likeClicked ? heartLiked : heartUnliked}
        </button>
      </span>
    </p>
  </li>
`;

  endorsementList.innerHTML += html;
}

function generateRandomAmountOfLikes() {
  return Math.floor(Math.random() * 99);
}

document.addEventListener('click', function (event) {
  if (event.target.dataset.id) {
    const exactLocationOfItemInDB = ref(
      database,
      `endorsements/${event.target.dataset.id}`
    );

    get(exactLocationOfItemInDB)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const endorsement = snapshot.val();
          toggleLike(exactLocationOfItemInDB, endorsement);
        } else {
          console.log("Data doesn't exist.");
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
});

function toggleLike(exactLocationOfItemInDB, endorsement) {
  endorsement.liked = !endorsement.liked;

  if (endorsement.liked) {
    endorsement.likes += 1;
  } else {
    endorsement.likes -= 1;
  }

  set(exactLocationOfItemInDB, endorsement);
}
