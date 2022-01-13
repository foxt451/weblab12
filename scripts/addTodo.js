import { activateSpinners, deactivateSpinners } from './spinner.js';
import { getResponse } from './hasura.js';

todo.addTodo.addEventListener('click', () => {
  addTodo().catch((err) => showInfo(`Error ocurred: ${err}`));
});

window.onoffline = checkforOnline;
window.ononline = checkforOnline;

function checkforOnline() {
  console.log(window.navigator.onLine);
  if (window.navigator.onLine) {
    console.log('online');
    hideInfo();
  } else {
    console.log('offline');
    showInfo('Your network is currently disabled!');
  }
}

function showInfo(msg) {
  const opmsg = document.querySelector('.opmsg');
  opmsg.innerText = msg;
  const opinfo = document.querySelector('.opinfo');
  opinfo.classList.remove('collapsed');
}

function hideInfo() {
  document.querySelector('.opinfo').classList.add('collapsed');
}

const opclose = document.querySelector('.opclose');
opclose.addEventListener('click', hideInfo);

async function addTodo() {
  const username = todo.username.value;
  const title = todo.title.value;
  const text = todo.task.value;
  await addTodoWithData(title, text, username);
}

async function addTodoWithData(title, text, username) {
  // try get user with specified username
  activateSpinners('addingForm');
  try {
    const users = await tryGetUserId(username);
    let userId;
    if (users.length > 0) {
      userId = users[0].id;
    } else {
      userId = await addUser(username);
    }
    await addTodoWithId(title, text, userId);
    const addedTaskEvent = new CustomEvent('addedTask', {
      detail: { username },
    });
    document.dispatchEvent(addedTaskEvent);
  } catch (e) {
    if (window.navigator.onLine) showInfo(`Error ocurred: ${e[0].message}`);
  } finally {
    deactivateSpinners('addingForm');
  }
}

const addTaskMutation = `
mutation AddTask($name: String!, $text: String=null, $user_id: Int!) {
  insert_tasks_one(object: {name: $name, text: $text, user_id: $user_id}) {
    id
  }
}
`;
async function addTodoWithId(name, text, user_id) {
  const json = {
    operationName: 'AddTask',
    query: addTaskMutation,
    variables: { name, text, user_id },
  };

  const data = await getResponse(json);
  return data.data.insert_tasks_one.id; // new id
}

const addUserMutation = `
mutation AddUser($username: String!) {
  insert_users_one(object: {username: $username}) {
    id
  }
}
`;
async function addUser(username) {
  const json = {
    operationName: 'AddUser',
    query: addUserMutation,
    variables: { username },
  };
  const data = await getResponse(json);
  return data.data.insert_users_one.id; // new id
}

const getUserQuery = `
query GetUser($username: String!) {
  users(where: {username: {_eq: $username}}) {
    id
  }
}
`;
async function tryGetUserId(username) {
  const json = {
    operationName: 'GetUser',
    query: getUserQuery,
    variables: { username },
  };
  const data = await getResponse(json);
  return data.data.users;
}
