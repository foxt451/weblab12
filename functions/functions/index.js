const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
require('cors')({ origin: true });

const admin = require('firebase-admin');
admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: '...@gmail.com',
    pass: '...',
  },
});

function validateAnswer(answer, answerStats) {
  console.log(answer);
  if (!answer.hasOwnProperty('mainlang')) {
    return false;
  }
  mainLangs = Object.entries(answer['mainlang']);
  for (mainLang of mainLangs) {
    if (!answerStats.mainlang.hasOwnProperty(mainLang[0])) {
      return false;
    }
  }

  if (!answer.hasOwnProperty('usedlang') || answer.usedlang === null) {
    answer.usedlang = {};
  }
  usedLangs = Object.entries(answer['usedlang']);
  for (usedLang of usedLangs) {
    if (!answerStats.usedlang.hasOwnProperty(usedLang[0])) {
      return false;
    }
  }
  if (!answer.hasOwnProperty('color')) {
    return false;
  }
  const color = Object.keys(answer['color'])[0];
  if (!/^#[0-9a-fA-F]{6}$/i.test(color)) {
    return false;
  }
  if (!answer.hasOwnProperty('firstProg')) {
    return false;
  }
  return true;
}

const answerStats = {
  participants: 0,
  mainlang: {
    Other: 0,
    JavaScript: 0,
    Python: 0,
    Assembly: 0,
    Java: 0,
    'C++': 0,
    'C#': 0,
  },
  usedlang: {
    Assembly: 0,
    Fortran: 0,
    Basic: 0,
    Brainfuck: 0,
    Pascal: 0,
    LISP: 0,
  },
  color: [],
  firstProgCorrectness: 0,
};

exports.addAnswer = functions.https.onCall((data) => {
  if (!validateAnswer(data, answerStats)) {
    throw 'invalid answer';
  }
  return admin
    .firestore()
    .collection('answers')
    .add(data)
    .then((result) => {
      console.log('New Answer written', result.id);
      return result.id;
    });
});

exports.getAnswers = functions.https.onCall(async () => {
  answers = await admin.firestore().collection('answers').get();
  console.log('answers without doc mapping', answers.docs);
  answers = answers.docs.map((doc) => doc.data());
  console.log('answers with doc mapping', answers);
  let correctAnswers = 0;

  const answerStatsCopy = JSON.parse(JSON.stringify(answerStats));
  answers.forEach((answer) => {
    if (!validateAnswer(answer, answerStatsCopy)) {
      console.log('not validated', answer);
      return false;
    }
    answerStatsCopy.participants++;
    mainLangs = Object.entries(answer['mainlang']);
    for (mainLang of mainLangs) {
      answerStatsCopy.mainlang[mainLang[0]]++;
    }
    usedLangs = Object.entries(answer['usedlang']);
    for (usedLang of usedLangs) {
      answerStatsCopy.usedlang[usedLang[0]]++;
    }
    answerStatsCopy.color.push(Object.keys(answer['color'])[0]);
    if (answer['firstProg']['ada'] === true) correctAnswers++;
    return true;
  });
  console.log(answerStatsCopy);
  if (answerStatsCopy.participants !== 0) {
    answerStatsCopy.firstProgCorrectness =
      correctAnswers / answerStatsCopy.participants;
  } else {
    answerStatsCopy.firstProgCorrectness = 0;
  }
  return answerStatsCopy;
});

const mainlangComment = {
  Other:
    'Wow, you are not an ordinary type!' +
    ' Anyway, excuse us for not including an option suitable for you..',
  JavaScript: 'You language is perfect for web development!',
  Python: 'Python is great for data science and analysis!',
  Java: 'Great language that can work on all kinds of machines!',
  'C++': 'A truly powerful language with superior performance!',
  'C#':
    'An elegant language constantly developing itself.' +
    ' Good for all kinds of domains!',
};

const usedlangComment =
  'Congratulations on getting to use at least one of' +
  ' not-so-popular-nowadays languages! Such experience is' +
  ' never going to harm!';
const noUsedlangComment =
  "You didn't you any of the specified languages.. Try" +
  ' them! They all are cool!';
const correctComment =
  'Wow! It is a well-known fact, but anyway, you nailed it!';
const incorrectComment =
  "Hey! You didn't guess, but it's never late to learn: " +
  'the first known programmer was Ada Lovelace.';

exports.getAnalysis = functions.firestore
  .document('answers/{answerId}')
  .onCreate((snap) => {
    if (snap.data().hasOwnProperty('email')) {
      const text = `<h1>Your analysis!</h1>
     <p> <b>Main language: </b>${
       mainlangComment[Object.keys(snap.data().mainlang)[0]]
     } </p>
     <p> <b>Rarely-used languages: </b>${
       Object.keys(snap.data().usedlang).length !== 0
         ? usedlangComment
         : noUsedlangComment
     }
     <p> <b>First programmer: </b>${
       Object.keys(snap.data().firstProg)[0] === 'ada'
         ? correctComment
         : incorrectComment
     }`;
      const mailOptions = {
        from: `...@gmail.com`,
        to: Object.keys(snap.data().email)[0],
        subject: 'Programming experience analysis',
        html: text,
      };
      return transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log('Sent!');
      });
    }
    return 'Not sent!';
  });
