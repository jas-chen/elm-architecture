import $$observable from 'symbol-observable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

function isEvent(e) {
  return e && e.preventDefault && e.stopPropagation;
}

const hasRaf = typeof window !== 'undefined' && window.requestAnimationFrame;

export function run(program, render, opt = {}) {
  const { init, view, update, subscriptions } = program.main;
  const { onUpdate } = opt;
  const msg$ = new Subject();
  let initModel = init, sideEffect;

  // Use requestAnimationFrame for better render performance
  const rafRender = hasRaf
    ? vdom => requestAnimationFrame(() => render(vdom))
    : render;

  const platform = {
    cmd: msg$.next.bind(msg$),
    subscribe: msg$.subscribe.bind(msg$),
    complete: msg$.complete.bind(msg$),
    [$$observable]() {
      return platform;
    }
  };

  // alias
  platform.sub = platform.subscribe;

  if (typeof initModel === 'undefined') {
    throw new Error('Initial model is undefined. Pass null to explicitly set `no value`.');
  }

  if (Array.isArray(initModel) && typeof initModel[1] === 'function') {
    [initModel, sideEffect] = initModel;
  }

  const model$ = msg$
    .startWith(initModel)
    .scan((model, msg) => {
      let newModel = update(msg, model);

      if (typeof newModel === 'undefined') {
        throw new Error(`Unhandled msg ${msg.constructor.name} ${JSON.stringify(msg)}`);
      }

      if (Array.isArray(newModel) && typeof newModel[1] === 'function') {
        [newModel, sideEffect] = newModel;
      }

      onUpdate && onUpdate(msg, model, newModel);
      return newModel;
    })
    ._do(() => {
      sideEffect && sideEffect(platform);
      sideEffect = null;
    })
    .share();

  let view$ = view(dispatch, model$);
  if (typeof view$ === 'function') {
    view$ = model$.map(view$);
  }

  view$.subscribe(rafRender);

  subscriptions && subscriptions(platform, initModel);

  function dispatch(msg, ...args) {
    if (typeof msg === 'function') {
      return function eventHandler(e) {
        if (isEvent(e)) {
          const { type, target } = e;
          if (type === 'change' && target.tagName === 'INPUT' && (target.type === 'radio' || target.type === 'checkbox')) {
            msg$.next(new msg(...args, target.checked));
          } else {
            msg$.next(new msg(...args, target.value));
          }
        } else {
          msg$.next(new msg(...args));
        }
      }
    }

    msg$.next(msg);
  }

  return {
    platform,
    model$
  };
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