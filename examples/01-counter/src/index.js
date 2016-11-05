import { run, logMsg } from 'elm-architecture';
import ReactDom from 'react-dom';
import * as program from './program';

function reactDomRender(mountNode) {
  return vdom => ReactDom.render(vdom, mountNode);
}

function log(msg, oldModel, newModel) {
  logMsg(msg, 'info');
  console.log(oldModel);
  console.log(newModel);
}

const root = document.getElementById('root');

const opts = {
  onUpdate: log
};

run(program, reactDomRender(root), opts);