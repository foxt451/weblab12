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

const ui = new firebaseui.auth.AuthUI(authService);

const uiConfig = {
  // callbacks: {
  //   signInSuccessWithAuthResult(authResult, redirectUrl) {
  //     return true;
  //   },
  // },
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

ui.start('.authContainer', uiConfig);
