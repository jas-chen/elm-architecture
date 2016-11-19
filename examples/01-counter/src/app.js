import { createElement as h } from 'react';

export const main = {
  init: init(),
  update,
  view
};


// MODEL
function init() {
  return 0;
}


// MSG
function Increment() {}
function Decrement() {}


// UPDATE
function update(msg, model) {
  switch(msg.constructor) {
    case Increment:
      return model + 1;
    case Decrement:
      return model - 1;
  }
}


// VIEW
function view(d) {
  return model =>
    h('div', null,
      h('button', { onClick: d(Decrement) }, '-'),
      h('div', null, model),
      h('button', { onClick: d(Increment) }, '+')
    );
}
