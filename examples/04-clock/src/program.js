import { createElement as h } from 'react';

export const main = {
  init: init(),
  update,
  subscriptions,
  view
};

// MODEL
function init() {
  return (new Date()).getTime();
}


// MSG
function Tick(time) {
  this.payload = time;
}


// UPDATE
function update({ constructor, payload }, model) {
  switch (constructor) {
    case Tick:
      return payload;
  }
}


// SUBSCRIPTIONS
function subscriptions(dispatch, model) {
  setInterval(
    () => dispatch(new Tick((new Date()).getTime())),
    1000
  );
}


// VIEW
function view(d) {
  return model =>
    h('p', null, (new Date(model)).toLocaleString());
}
