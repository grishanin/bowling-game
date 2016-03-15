import createStore from './utils/createStore';
//import testSuite from './testSuite';
import bowlingApp from './reducers';
import { newGame, startGame, addPlayer, roll } from './actions';
import { h, createElement } from './utils/DOMUtils';
import { randomNumber } from './utils/misc';
import GameTable from './components/GameTable';
import ActionButtons from './components/ActionButtons';

require('../css/style.less');

const app = (state) => {
  return h('DIV', {className: 'bowling-game'}, [
    h('DIV', {className: 'bowling-game__header'}, [
      h('H3', [
        'Bowling Game'
      ])
    ]),
    h('DIV', {className: 'bowling-game__content'}, [
      GameTable(state),
      ActionButtons(state.game)
    ])
  ]
);
}

const store = createStore(bowlingApp);

const render = () => {
  const state = store.getState();
  const container = document.getElementById('root');
  container.innerHTML = '';
  container.appendChild(
    createElement(
      app(state)
    )
  );
}

store.subscribe(render);
store.dispatch(newGame());

const getRandomRoll = (max) => Math.floor(Math.random() * (max + 1));

// DOM events
document.addEventListener('click', e => {
  if (e.target.matches('.new-game')) {
    store.dispatch(newGame());
  } else if (e.target.matches('.add-player')) {
    const input = document.querySelector('.player-name');
    if (input.value.length) {
      store.dispatch(addPlayer(input.value));
      input.value = '';
    }
  } else if (e.target.matches('.start-game')) {
    store.dispatch(startGame());
  } else if (e.target.matches('.roll')) {
    const pins = randomNumber(0, store.getState().game.pinsOnStand);
    store.dispatch(roll(pins));
  }
});

//testSuite(store.dispatch, store.getState);
