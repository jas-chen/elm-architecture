import { caseOf } from 'elm-architecture';
import { createElement as h } from 'react';

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


// Msg 
function MorePlease() { this.args = arguments; }
function FetchSucceed(gifUrl) { this.args = arguments; }
function FetchFail(error) { this.args = arguments; }


// UPDATE
const a = (model, partial) => Object.assign({}, model, partial);

function update(msg, model) {
  return caseOf(msg,
    MorePlease, () =>
      [a(model, { gifUrl: null }), getRandomGif(model.topic)],
    FetchSucceed, gifUrl =>
      a(model, { gifUrl }),
    FetchFail, () =>
      model
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
  return dispatch => {
    fetch(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`)
      .then(response => response.json())
      .then(json => dispatch(new FetchSucceed(json.data.image_url)))
      .catch(error => dispatch(new FetchFail(error)));
  };
}