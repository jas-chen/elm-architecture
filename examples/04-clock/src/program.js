import { caseOf, assignArgs } from 'elm-architecture';
import { createElement as h } from 'react';

// Time
const SECOND = 1000;

const Time = {
  getTime: () => (new Date()).getTime(),
  every: interval => cb => setInterval(() => cb(Time.getTime()), interval),
  toLocaleString: time => (new Date(time)).toLocaleString()
};


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