import { activateSpinners, deactivateSpinners } from './spinner.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBkYyRxeUtyOODdYKs-q5WbbtM9rsK9dnY',
  authDomain: 'weblab-976b8.firebaseapp.com',
  databaseURL: 'https://weblab-976b8-default-rtdb.firebaseio.com',
  projectId: 'weblab-976b8',
  storageBucket: 'weblab-976b8.appspot.com',
  messagingSenderId: '238126799846',
  appId: '1:238126799846:web:afa0690cc8fe6b7c80d427',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const authService = firebase.auth();

document.querySelector('.logoutBtn').addEventListener('click', () => {
  authService
    .signOut()
    .then(() => {
      hideInfo();
      document.querySelector('.statusInp').value = '';
    })
    .catch((err) => {
      showInfo(`Error happened: ${err}`);
    });
});

window.onoffline = checkforOnline;
window.ononline = checkforOnline;

function checkforOnline() {
  console.log(window.navigator.onLine);
  if (window.navigator.onLine) {
    console.log('online');
    hideInfo();
  } else {
    console.log('offline');
    showInfo('Your network is currently disabled!');
  }
}

const updateSuccessMsgTimeout = 3000;
document.querySelector('.statusUpdBtn').addEventListener('click', () => {
  const user = authService.currentUser;
  if (user) {
    const db = firebase.firestore();
    activateSpinners();
    checkforOnline();
    db.collection('statuses')
      .doc(user.uid)
      .set({
        status: document.querySelector('.statusInp').value,
      })
      .then(() => {
        deactivateSpinners();
        showInfo('Updated successfully!');
        setTimeout(hideInfo, updateSuccessMsgTimeout);
      })
      .catch((err) => {
        deactivateSpinners();
        showInfo(`Error happened: ${err}`);
      });
  }
});

const opclose = document.querySelector('.opclose');
opclose.addEventListener('click', hideInfo);

function showForLoggedOut() {
  document.querySelector('.userinfo').classList.add('collapsed');
  document.querySelector('.logoutBtn').classList.add('collapsed');
}

function showForLoggenIn() {
  document.querySelector('.userinfo').classList.remove('collapsed');
  document.querySelector('.logoutBtn').classList.remove('collapsed');
}

function showInfo(msg) {
  const opmsg = document.querySelector('.opmsg');
  opmsg.innerText = msg;
  const opinfo = document.querySelector('.opinfo');
  opinfo.classList.remove('collapsed');
}

function hideInfo() {
  document.querySelector('.opinfo').classList.add('collapsed');
}

const ui = new firebaseui.auth.AuthUI(authService);

authService.onAuthStateChanged((user) => {
  if (user) {
    // try get related status
    //const token = user.getIdToken(true);
    showForLoggenIn();
    const uid = user.uid;
    document.querySelector('.username').innerText = user.displayName;
    const db = firebase.firestore();
    activateSpinners();
    db.collection('statuses')
      .doc(uid)
      .get()
      .then((doc) => {
        deactivateSpinners();
        hideInfo();
        if (doc.exists) {
          document.querySelector('.statusInp').value = doc.data().status;
        } else {
          document.querySelector('.statusInp').value = '';
        }
      })
      .catch((err) => {
        deactivateSpinners();
        showInfo(`Error happened: ${err}`);
      });
  } else {
    showForLoggedOut();

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult() {
          return false;
        },
      },
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
      ],
    };

    ui.start('.authContainer', uiConfig);
  }
});
