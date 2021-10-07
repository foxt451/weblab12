import { addData, getAnalysis } from './statsFunctions.js';

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
    if ($_GET.hasOwnProperty('email')) {
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
      });
  },
};

submitForm
  .submitData()
  .then(() => {
    getAnalysis();
    history.go(-1);
  })
  .catch(() => history.go(-1));
