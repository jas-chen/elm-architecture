import { caseOf, assignArgs } from 'elm-architecture';
import { createElement as h } from 'react';
import * as Http from './Http';
import { Ok, Err } from './Result';

export const main = {
  init: init('cats'),
  update,
  view
};

// MODEL
function init(topic) {
  const initModel = {
    topic,
    gifUrl: null
  };

  return [initModel, getRandomGif(topic)];
}


// MSG 
function MorePlease() {}

function NewGif(result) { assignArgs(this, arguments); }


// UPDATE
const a = (model, partial) => Object.assign({}, model, partial);

function update(msg, model) {
  return caseOf(msg,
    MorePlease, () =>
      [model, getRandomGif(model.topic)],

    NewGif, ({ result }) => caseOf(result,
      Ok, ({ value: gifUrl }) =>
        a(model, { gifUrl }),
      Err, ({ error }) =>
        model
    )      
  );
}


// VIEW
function view(d) {
  return model => (
    h('div', null,
      h('h1', null, model.topic),
      h('button', { onClick: d(MorePlease) }, 'More Please!'),
      h('br', null),
      model.gifUrl && h('img', { src: model.gifUrl })
    )
  );
}


// HTTP
function getRandomGif(topic) {
  const url = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`;
  return Http.send(NewGif, Http.getJson(url, decodeGifUrl));
}

function decodeGifUrl(json) {
  return json.data.image_url;
}