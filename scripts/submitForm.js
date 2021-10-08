import { addData, getAnalysis } from './statsFunctions.js';
import { activateSpinners, deactivateSpinners } from './spinner.js';

const submitForm = {
  getFormData() {
    const parts = window.location.search.substr(1).split('&');
    const $_GET = {};
    for (let i = 0; i < parts.length; i++) {
      const temp = parts[i].split('=');
      if (!(decodeURIComponent(temp[0]) in $_GET)) {
        $_GET[decodeURIComponent(temp[0])] = {};
      }
      const value = decodeURIComponent(temp[1]);
      $_GET[decodeURIComponent(temp[0])][value] = true;
    }
    const data = {
      mainlang: $_GET['mainlang'],
      usedlang: $_GET['usedlang'],
      color: $_GET['color'],
      firstProg: $_GET['firstProg'],
    };
    function isEmptyOrSpaces(str) {
      return str === null || str.match(/^\s*$/) !== null;
    }
    if (
      $_GET.hasOwnProperty('email') &&
      !isEmptyOrSpaces(Object.keys($_GET['email'])[0])
    ) {
      data.email = $_GET['email'];
    }
    return data;
  },
  submitData() {
    return addData(this.getFormData())
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};

document.getElementById('correctResponse').style.visibility = 'hidden';
document.getElementById('incorrectResponse').style.visibility = 'hidden';

activateSpinners();
submitForm
  .submitData()
  .then(() => {
    console.log(1);
    deactivateSpinners();
    getAnalysis();
    document.getElementById('correctResponse').style.visibility = 'visible';
    document.getElementById('incorrectResponse').style.visibility = 'hidden';
  })
  .catch(() => {
    console.log(1);
    deactivateSpinners();
    document.getElementById('incorrectResponse').style.visibility = 'visible';
    document.getElementById('correctResponse').style.visibility = 'hidden';
  });
