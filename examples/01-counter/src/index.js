import { run } from 'elm-architecture';
import ReactDom from 'react-dom';
import * as app from './app';

const mountNode = document.getElementById('root');
const render = vdom => ReactDom.render(vdom, mountNode);

run(app, {
  onMsg: msg => console.info(msg),
  onModel: model => console.log(model),
  onView: render
});