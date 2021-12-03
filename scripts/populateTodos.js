import { activateSpinners, deactivateSpinners } from './spinner.js';
import { getResponse } from './hasura.js';

const allTasks = `
query AllTasks {
  tasks(order_by: {completed: asc, user: {username: asc}}) {
    id
    name
    text
    user {
      username
    }
    completed
  }
}
`;

const todosByUsername = `
query TasksForUsername($username: String!) {
  tasks(where: {user: {username: {_eq: $username}}},
order_by: {completed: asc, user: {username: asc}}) {
    id
    name
    text
    completed
  }
}
`;

const updateCompletedMutation = `
mutation Complete($completed: Boolean!, $id: Int!) {
  update_tasks_by_pk(pk_columns: {id: $id}, _set: {completed: $completed}) {
    id
  }
}
`;

const template = document.querySelector('#todoTemplate');

const inp = document.querySelector('#usernameInp');
// last username entered
// one username might be entered later than the other one
// but results for it come earlier
// so when the results for the other one come too
// it will replace the relevant results, even though they are for
// the more early entered username
let lastUsername = inp.value;
populateTodos(inp.value);
function onButClick() {
  lastUsername = inp.value;
  populateTodos(inp.value);
}
for (const but of document.querySelectorAll('.tasksSearchButton')) {
  but.addEventListener('click', onButClick);
}

document.addEventListener('addedTask', (e) => {
  if (e.detail.username === inp.value || !inp.value) {
    lastUsername = inp.value;
    populateTodos(inp.value);
  }
});

async function populateTodos(username) {
  for (const container of document.querySelectorAll('.todoContainer')) {
    clearTodoContainer(container);
  }
  activateSpinners('todosPlace');
  const todos = await getTodos(username);
  if (username === lastUsername) {
    for (const container of document.querySelectorAll('.todoContainer')) {
      clearTodoContainer(container);
      fillTodosContainer(todos, container);
    }
  }
  deactivateSpinners('todosPlace');
}

function clearTodoContainer(container) {
  container.innerHTML = '';
}

// gets array of todo objects
// like Object {name : 'xxx', text: 'xxx',
// completed: bool, user: { username: 'xxx' }, , id: x}
// user and username are optional
function fillTodosContainer(todos, container) {
  for (const todo of todos) {
    const todoElem = getTodo(todo);
    container.appendChild(todoElem);
  }
}

// returns array of todo objects
// like Object {name : 'xxx', text: 'xxx',
// completed: bool, user: { username: 'xxx' }, id: x}
async function getTodos(username) {
  const json = username
    ? {
        operationName: 'TasksForUsername',
        query: todosByUsername,
        variables: { username },
      }
    : {
        operationName: 'AllTasks',
        query: allTasks,
      };
  try {
    const data = await getResponse(json);
    return data.data.tasks;
  } catch (e) {
    alert(e[0].message);
    return [];
  }
}

function getTodo(todo) {
  const clone = template.content.cloneNode(true);
  for (const titles of clone.querySelectorAll('.taskTitle')) {
    titles.innerText = todo.name;
  }
  for (const titles of clone.querySelectorAll('.taskText')) {
    titles.innerText = todo.text;
  }
  const checkbox = clone.querySelector('.taskCheck');
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () =>
    onCheckboxChange(todo.id, checkbox.checked)
  );
  if (todo.hasOwnProperty('user') && todo.user.hasOwnProperty('username')) {
    for (const author of clone.querySelectorAll('.taskUsername')) {
      author.innerText = 'by: ' + todo.user.username;
    }
  }
  return clone;
}

function onCheckboxChange(todoId, isChecked) {
  console.log(todoId, isChecked);
  const json = {
    operationName: 'Complete',
    query: updateCompletedMutation,
    variables: { completed: isChecked, id: todoId },
  };
  getResponse(json);
}
