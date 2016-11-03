import { bindMsg } from 'elm-architecture';
import { createElement as h } from 'react';

export const main = {
  init: init(),
  update,
  view
};

// MODEL
function init() {
  return {
    name: '',
    password: '',
    passwordAgain: '',
    rememberMe: false
  };
}


// Msg 
function Name(name) {
  this.payload = name;
}

function Password(password) {
  this.payload = password;
}

function PasswordAgain(passwordAgain) {
  this.payload = passwordAgain;
}

function RememberMe(rememberMe) {
  this.payload = rememberMe;
}


// UPDATE
const assign = (model, partial) => Object.assign({}, model, partial);

function update({ constructor, payload }, model) {
  switch (constructor) {
    case Name:
      return assign(model, { name: payload });
    case Password:
      return assign(model, { password: payload });
    case PasswordAgain:
      return assign(model, { passwordAgain: payload });
    case RememberMe:
      return assign(model, { rememberMe: payload });
  }
}


// VIEW
const input = (type, onChange, value, placeholder) =>
  type === 'checkbox'
    ? h('input', { type, checked: value, onChange })
    : h('input', { type, value, onChange, placeholder });

const viewValidation = model =>
  model.password == model.passwordAgain
    ? h('span', { style: { color: 'green' } }, 'OK')
    : h('span', { style: { color: 'red' } }, 'Passwords do not match!');

function view(d) {
  return model => (
    h('div', null,
      input('text', d(Name), model.name, 'Name'),
      h('p', null,
        input('password', d(Password), model.password, 'Password'),
        input('password', d(PasswordAgain), model.passwordAgain, 'Re-enter Password'),
        (model.password || model.passwordAgain) && viewValidation(model)
      ),
      h('label', null,
        input('checkbox', d(RememberMe), model.rememberMe),
        'Remember Me'
      )
    )
  );
}