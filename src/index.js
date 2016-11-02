import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operator/map';

function isEvent(e) {
  return e && e.preventDefault && e.stopPropagation;
}

export function run(app, render, opt = {}) {
  const { init, view, update, subscriptions } = app;
  const { onUpdate } = opt;
  // Use requestAnimationFrame for better render performance
  const rafRender = vdom => requestAnimationFrame(() => render(vdom));
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
      throw new Error(`Unhandled msg: ${JSON.stringify(msg)}`);
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