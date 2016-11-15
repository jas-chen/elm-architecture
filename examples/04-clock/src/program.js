import { caseOf, assignArgs } from 'elm-architecture';
import { createElement as h } from 'react';
const { assign } = Object;

function getTime() {
  return (new Date()).getTime();
}

export const main = {
  init: init(),
  update,
  subscriptions,
  view
};


// MODEL
function init() {
  return getTime();
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
    h('p', null, (new Date(model)).toLocaleString());
}


// Time
const SECOND = 1000;

const Time = {
  every: interval => cb => setInterval(() => { cb(getTime()); console.log(5566); }, interval)
}