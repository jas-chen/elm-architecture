import { caseOf } from 'elm-architecture';
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
function Increment() { this.args = arguments; }
function Decrement() { this.args = arguments; }


// UPDATE
function update(msg, model) {
  return caseOf(msg,
    Increment, () =>
      model + 1,
    Decrement, () =>
      model - 1
  );
}


// VIEW
function view(d) {
  return model =>
    h('p', null,
      `Clicked: ${model} times`,
      h('button', { onClick: d(Increment) }, '+'),
      h('button', { onClick: d(Decrement) }, '-')
    );
}
