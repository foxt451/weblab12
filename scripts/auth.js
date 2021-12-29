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
      document.querySelector('.statusInp').value = '';
    })
    .catch((err) => {
      alert(`Error happened: ${err}`);
    });
});

document.querySelector('.statusUpdBtn').addEventListener('click', () => {
  const user = authService.currentUser;
  if (user) {
    const db = firebase.firestore();
    db.collection('statuses')
      .doc(user.uid)
      .set({
        status: document.querySelector('.statusInp').value,
      })
      .then(() => {
        alert('Updated successfully!');
      })
      .catch((err) => {
        alert(`Error happened: ${err}`);
      });
  }
});

function showForLoggedOut() {
  document.querySelector('.userinfo').classList.add('collapsed');
  document.querySelector('.logoutBtn').classList.add('collapsed');
}

function showForLoggenIn() {
  document.querySelector('.userinfo').classList.remove('collapsed');
  document.querySelector('.logoutBtn').classList.remove('collapsed');
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
    db.collection('statuses')
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          document.querySelector('.statusInp').value = doc.data().status;
        } else {
          document.querySelector('.statusInp').value = '';
        }
      })
      .catch((err) => {
        alert(`Error happened: ${err}`);
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
