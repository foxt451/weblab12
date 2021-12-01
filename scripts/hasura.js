const endpoint = 'https://singular-cheetah-74.hasura.app/v1/graphql';
const headers = {
  'content-type': 'application/json',
  'x-hasura-role': 'user',
};

export async function getResponse(body) {
  const request = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };
  const response = await fetch(endpoint, request);
  return response.json();
}
