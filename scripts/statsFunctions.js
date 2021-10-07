import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import {
  getFunctions,
  httpsCallable,
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-functions.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBkYyRxeUtyOODdYKs-q5WbbtM9rsK9dnY',
  authDomain: 'weblab-976b8.firebaseapp.com',
  projectId: 'weblab-976b8',
  storageBucket: 'weblab-976b8.appspot.com',
  messagingSenderId: '238126799846',
  appId: '1:238126799846:web:afa0690cc8fe6b7c80d427',
};

const app = initializeApp(firebaseConfig);
const region = 'us-central1';
const functions = getFunctions(app, region);
const addAnswer = httpsCallable(functions, 'addAnswer');
export function addData(msg) {
  return addAnswer(msg).then((result) => {
    const data = result.data;
    return data;
  });
}

const getAnswers = httpsCallable(functions, 'getAnswers');
export function getData() {
  return getAnswers();
}

const getAn = httpsCallable(functions, 'getAnalysis');
export function getAnalysis() {
  return getAn();
}
