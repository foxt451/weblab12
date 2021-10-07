export function activateSpinners() {
  for (const el of document.getElementsByClassName('loaderdependent')) {
    el.classList.remove('loaderdependentactive');
    el.classList.add('loaderdependentinactive');
  }
  for (const el of document.getElementsByClassName('loader')) {
    el.classList.remove('loaderinactive');
    el.classList.add('loaderactive');
  }
}

export function deactivateSpinners() {
  for (const el of document.getElementsByClassName('loader')) {
    el.classList.remove('loaderactive');
    el.classList.add('loaderinactive');
  }
  for (const el of document.getElementsByClassName('loaderdependent')) {
    el.classList.remove('loaderdependentinactive');
    el.classList.add('loaderdependentactive');
  }
}
