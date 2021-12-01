import { getResponse } from './hasura.js';

const inp = document.querySelector('#usernameInp');
inp.addEventListener('input', () => populateTodos(inp.value));

//setTimeout(() => {
//    console.log('mda')
//}, 0);
//for (let i = 0; i < 10000; i++) {
//    console.log(i);
//}
//console.log('lol');

async function populateTodos(username) {
  console.log(username);
  const todos = await getTodos(username);
  for (const container of document.querySelectorAll('.todoContainer')) {
    clearTodoContainer(container);
    fillTodosContainer(todos);
    console.log(todos);
  }
}

function clearTodoContainer(container) {
  container.innerHTML = '';
}

// gets array of todo objects
// like Object {name : 'xxx', text: 'xxx',
// completed: bool, user: { username: 'xxx' }}
// user and username are optional
function fillTodosContainer(todos) {
  for (const container of document.querySelectorAll('.todoContainer')) {
    for (const todo of todos) {
      const todoElem = getTodo(todo);
      container.appendChild(todoElem);
    }
  }
}

const allTasks = `
query AllTasks {
  tasks {
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
  tasks(where: {user: {username: {_eq: $username}}}) {
    id
    name
    text
    completed
  }
}
`;
// returns array of todo objects
// like Object {name : 'xxx', text: 'xxx',
// completed: bool, user: { username: 'xxx' }}
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
  const data = await getResponse(json);
  return data.data.tasks;
}

const template = document.querySelector('#todoTemplate');

function getTodo(todo) {
  const clone = template.content.cloneNode(true);
  for (const titles of clone.querySelectorAll('.taskTitle')) {
    titles.innerText = todo.name;
  }
  for (const titles of clone.querySelectorAll('.taskText')) {
    titles.innerText = todo.text;
  }
  const checkbox = clone.querySelector('#taskCheck');
  checkbox.checked = todo.completed;
  if (todo.hasOwnProperty('user') && todo.user.hasOwnProperty('username')) {
    for (const author of clone.querySelectorAll('.taskUsername')) {
      author.innerText = 'by: ' + todo.user.username;
    }
  }
  return clone;
}
