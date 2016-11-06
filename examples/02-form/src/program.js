import { caseOf } from 'elm-architecture';
import { createElement as h } from 'react';
const { assign } = Object;

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
  assign(this, { name });
}

function Password(password) {
  assign(this, { password });
}

function PasswordAgain(passwordAgain) {
  assign(this, { passwordAgain });
}

function RememberMe(rememberMe) {
  assign(this, { rememberMe });
}


// UPDATE
const a = (model, partial) => assign({}, model, partial);

function update(msg, model) {
  return caseOf(msg,
    Name, ({ name }) =>
      a(model, { name }),

    Password, ({ password }) =>
      a(model, { password }),

    PasswordAgain, ({ passwordAgain }) =>
      a(model, { passwordAgain }),

    RememberMe, ({ rememberMe }) =>
      a(model, { rememberMe }) 
  );
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