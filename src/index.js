import $$observable from 'symbol-observable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

function isEvent(e) {
  return e && e.preventDefault && e.stopPropagation;
}

export function run(program, options = {}) {
  const { init, view, update } = program.main;
  const { onMsg, onModel, onView } = options;
  const msg$ = new Subject();
  let { subscriptions } = program.main;
  let initModel = init;
  let sideEffect;

  if (typeof initModel === 'undefined') {
    throw new Error('Initial model is undefined. Pass null to explicitly set `no value`.');
  }

  if (Array.isArray(initModel) && typeof initModel[1] === 'function') {
    [initModel, sideEffect] = initModel;
  }

  const model$ = msg$
    .startWith(initModel)
    .scan((model, msg) => {
      if (typeof msg !== 'object') {
        throw new Error(`Expected msg to be an object.`);
      }

      onMsg && onMsg(msg);
      let newModel = update(msg, model);

      if (typeof newModel === 'undefined') {
        throw new Error(`Unhandled msg ${msg.constructor.name} ${JSON.stringify(msg)}`);
      }

      if (Array.isArray(newModel) && typeof newModel[1] === 'function') {
        [newModel, sideEffect] = newModel;
      }
      
      return newModel;
    })
    ._do(model => {
      onModel && onModel(model);

      if (subscriptions) {
        subscriptions(dispatch, initModel);
        subscriptions = null;
      }
      
      if (sideEffect) {
        sideEffect(dispatch);
        sideEffect = null;
      }
    });

  let view$ = view(dispatch, model$);
  if (typeof view$ === 'function') {
    view$ = model$.map(view$);
  }

  view$.subscribe(onView);

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
          msg$.next(new msg(...arguments));
        }
      }
    }

    msg$.next(msg);
  }

  return {
    dispatch,
    abort: msg$.complete.bind(msg$)
  };
}


export function caseOf(msg, ...params) {
  for (let i = 0; i < params.length ; i += 2) {
    const Msg = params[i];
    const update = params[i + 1];
    if (msg.constructor === Msg) {
      return update(msg);
    }
  }
}


export function assignArgs(instance, args) {
  // https://davidwalsh.name/javascript-arguments
  const argNames = instance
    .constructor
    .toString()
    .match(/function\s.*?\(([^)]*)\)/)[1]
    .split(',')
    .map(arg => arg.replace(/\/\*.*\*\//, '').trim())
    .filter(arg => arg);

  const argMap = {};
  argNames.forEach((n, i) => argMap[n] = args[i]);
  Object.assign(instance, argMap);
}