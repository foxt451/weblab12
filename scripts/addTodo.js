import { activateSpinners, deactivateSpinners } from './spinner.js';
import { getResponse } from './hasura.js';

todo.addTodo.addEventListener('click', addTodo);

async function addTodo() {
  const username = todo.username.value;
  const title = todo.title.value;
  const text = todo.task.value;
  await addTodoWithData(title, text, username);
}

async function addTodoWithData(title, text, username) {
  // try get user with specified username
  activateSpinners();
  const users = await tryGetUserId(username);
  let userId;
  if (users.length > 0) {
    userId = users[0].id;
  } else {
    userId = await addUser(username);
  }
  await addTodoWithId(title, text, userId);
  deactivateSpinners();
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
