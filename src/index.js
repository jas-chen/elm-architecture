import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operator/map';

function isEvent(e) {
  return e && e.preventDefault && e.stopPropagation;
}

const hasRaf = typeof window !== 'undefined' && window.requestAnimationFrame;
const hasCraf = hasRaf && window.cancelAnimationFrame;

export function run(program, render, opt = {}) {
  const { init, view, update, subscriptions } = program.main;
  const { onUpdate } = opt;
  // Use requestAnimationFrame for better render performance
  let rafVal;
  const rafRender = hasRaf
    ? vdom => {
      hasCraf && rafVal && window.cancelAnimationFrame(rafVal);
      rafVal = requestAnimationFrame(() => render(vdom))
    }
    : render;

  const model$ = new Subject();
  let model = init, initSideEffect, view$;

  if (Array.isArray(model) && typeof model[1] === 'function') {
    initSideEffect = model[1];
    model = model[0];
  }

  if (typeof model === 'undefined') {
    throw new Error('Initial model is undefined. Pass null to explicitly set `no value`.');
  }

  view$ = view(dispatch, model$);
  if (typeof view$ === 'function') {
    view$ = map.call(model$, view$);
  }

  view$.subscribe(rafRender);
  model$.next(model);

  initSideEffect && initSideEffect(dispatch);
  initSideEffect = null;

  subscriptions && subscriptions(dispatch, model);

  function dispatch(msg, ...args) {
    if (typeof msg === 'function') {
      return function eventHandler(e) {
        if (isEvent(e)) {
          const { type, target } = e;
          if (type === 'change' && target.tagName === 'INPUT' && (target.type === 'radio' || target.type === 'checkbox')) {
            dispatch(new msg(...args, target.checked));
          } else {
            dispatch(new msg(...args, target.value));
          }
        } else {
          dispatch(new msg(...args));
        }
      }
    }

    if (typeof msg !== 'object') {
      throw new Error(`Expected msg to be an object: ${JSON.stringify(msg)}`);
    }

    let newModel = update(msg, model), sideEffect;
    if (typeof newModel === 'undefined') {
      throw new Error(`Unhandled msg ${msg.constructor.name} ${JSON.stringify(msg)}`);
    }

    if (Array.isArray(newModel) && typeof newModel[1] === 'function') {
      sideEffect = newModel[1];
      newModel = newModel[0];
    }

    onUpdate && onUpdate(msg, model, newModel);

    if (newModel !== model) {
      model = newModel;
      model$.next(model);
    }

    sideEffect && sideEffect(dispatch);
  }
}


export function caseOf(msg, ...params) {
  for (let i = 0; i < params.length ; i += 2) {
    const Msg = params[i];
    const update = params[i + 1];
    if (msg.constructor === Msg) {
      return update(...msg.args);
    }
  }
}

// https://davidwalsh.name/javascript-arguments
function getArgsNames(func) {
  // First match everything inside the function argument parens.
  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
 
  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function(arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function(arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}

export function logMsg(msg, log) {
  const payload = {};
  getArgsNames(msg.constructor).forEach((n, i) => payload[n] = msg.args[i]);
  if (!log) console.log(msg.constructor.name, payload);
  else if (typeof log === 'function') log(msg.constructor.name, payload);
  else if (typeof log === 'string') console[log](msg.constructor.name, payload);
}