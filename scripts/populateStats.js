import { getData } from './statsFunctions.js';
import { activateSpinners, deactivateSpinners } from './spinner.js';

// test data
//const statsData = {
//  participants: 35,
//  mainlang: {
//    Other: 2,
//    JavaScript: 8,
//    Python: 4,
//    Java: 2,
//    'C++': 10,
//    'C#': 7,
//  },
//  usedlang: {
//    Assembly: 15,
//    Fortran: 0,
//    Basic: 8,
//    Brainfuck: 1,
//    Pascal: 21,
//    LISP: 1,
//  },
//  color: '#eeff34',
//  firstProgCorrectness: 0.68,
//};

activateSpinners();

getData().then((result) => {
  initData(result.data);
  deactivateSpinners();
});

function initData(data) {
  function sortByValues(obj) {
    const entries = Object.entries(obj);
    entries.sort((a, b) => b[1] - a[1]);

    return [entries.map((value) => value[0]), entries.map((value) => value[1])];
  }
  if (data.color.length >= 2) {
    data.color = data.color.reduce((a, b) => $.xcolor.average(a, b).getHex());
  }

  for (const el of document.getElementsByClassName('participantsCount')) {
    el.value = data.participants;
  }
  console.log(data);

  const mainlangEntries = sortByValues(data.mainlang);
  const mainLangData = {
    labels: mainlangEntries[0],
    datasets: [
      {
        backgroundColor: [
          'rgb(155, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(155, 199, 132)',
          'rgb(54, 62, 35)',
          'rgb(235, 155, 186)',
          'rgb(35, 155, 186)',
        ],
        data: mainlangEntries[1],
      },
    ],
  };

  const mainLangConfig = {
    type: 'pie',
    data: mainLangData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Main language',
        },
      },
    },
  };

  for (const el of document.getElementsByClassName('mainLangStats')) {
    new Chart(el, mainLangConfig);
  }

  // init usedLang chart
  const usedlangEntries = sortByValues(data.usedlang);
  const usedLangData = {
    labels: usedlangEntries[0],
    datasets: [
      {
        backgroundColor: [
          'rgb(155, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(155, 199, 132)',
          'rgb(54, 62, 35)',
          'rgb(235, 155, 186)',
          'rgb(35, 155, 186)',
        ],
        data: usedlangEntries[1],
      },
    ],
  };

  const usedLangConfig = {
    type: 'bar',
    data: usedLangData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Rare languages by times used',
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  };

  for (const el of document.getElementsByClassName('usedLangStats')) {
    new Chart(el, usedLangConfig);
  }

  for (const el of document.getElementsByClassName('favColorStats')) {
    el.value = data.color;
  }

  for (const el of document.getElementsByClassName('correctFirstProg')) {
    el.value = data.firstProgCorrectness;
  }
}
