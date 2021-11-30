const template = document.querySelector('#todoTemplate');
const clone = template.content.cloneNode(true);
fillTodo(clone, 'hello', 'world');

for (const container of document.querySelectorAll('.todoContainer')) {
  container.appendChild(clone);
}

function fillTodo(todo, title, text) {
  for (const titles of clone.querySelectorAll('.taskTitle')) {
    titles.innerText = title;
  }
  for (const titles of clone.querySelectorAll('.taskText')) {
    titles.innerText = text;
  }
}
