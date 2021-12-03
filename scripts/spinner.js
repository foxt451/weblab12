export function activateSpinners(classnames = '') {
  for (const el of document.getElementsByClassName(
    'loaderdependent ' + classnames
  )) {
    el.classList.remove('loaderdependentactive');
    el.classList.add('loaderdependentinactive');
  }
  for (const el of document.getElementsByClassName(
    'loaderdependent-reverse ' + classnames
  )) {
    el.classList.remove('loaderdependent-reverse-active');
    el.classList.add('loaderdependent-reverse-inactive');
  }
  for (const el of document.getElementsByClassName('loader ' + classnames)) {
    el.classList.remove('loaderinactive');
    el.classList.add('loaderactive');
  }
}

export function deactivateSpinners(classnames = '') {
  for (const el of document.getElementsByClassName('loader ' + classnames)) {
    el.classList.remove('loaderactive');
    el.classList.add('loaderinactive');
  }
  for (const el of document.getElementsByClassName(
    'loaderdependent ' + classnames
  )) {
    el.classList.remove('loaderdependentinactive');
    el.classList.add('loaderdependentactive');
  }
  for (const el of document.getElementsByClassName(
    'loaderdependent-reverse ' + classnames
  )) {
    el.classList.remove('loaderdependent-reverse-inactive');
    el.classList.add('loaderdependent-reverse-active');
  }
}
