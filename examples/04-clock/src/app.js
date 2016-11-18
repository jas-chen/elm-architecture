import { caseOf, assignArgs } from 'elm-architecture';
import { createElement as h } from 'react';
import { SECOND, Time } from './Time';

export const main = {
  init: init(),
  update,
  subscriptions,
  view
};


// MODEL
function init() {
  return Time.getTime();
}


// MSG
function Tick(time) { assignArgs(this, arguments); }


// UPDATE
function update(msg, model) {
  return caseOf(msg,
    Tick, ({ time }) =>
      time
  );
}


// SUBSCRIPTIONS
function subscriptions(d, model) {
  const intervalId = Time.every(SECOND)(d(Tick));

  return function cancelSubscription() {
    clearInterval(intervalId);
  }
}


// VIEW
function view(d) {
  return model =>
    h('p', null, Time.toLocaleString(model));
}