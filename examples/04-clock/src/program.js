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
  Time.every(SECOND)(d(Tick));
}


// VIEW
function view(d) {
  return model =>
    h('p', null, (new Date(model)).toLocaleString());
}


// Time
const SECOND = 1000;

const Time = {
  every: interval => cb => setInterval(() => cb(getTime()), interval)
}