import { run } from 'elm-architecture';
import ReactDom from 'react-dom';
import * as program from './program';

const mountNode = document.getElementById('root');
const render = vdom => ReactDom.render(vdom, mountNode);

run(program, {
  onMsg: console.info,
  onModel: console.log,
  onView: render
});