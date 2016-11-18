import { Ok, Err } from './Result';

export function send(Msg, request) {
  return dispatch =>
    request
      .then(value => dispatch(new Msg(new Ok(value))))
      .catch(error => dispatch(new Msg(new Err(error))));
}

export function getJson(url, decode) {
  return fetch(url)
      .then(response => response.json())
      .then(decode)
}