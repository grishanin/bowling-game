import assert from './utils/assert';
import { addPlayer,newGame, roll } from './actions';

function testSuite(dispatch, getState) {
  dispatch(newGame());
  dispatch(addPlayer('Evgeny'));
  dispatch(roll(10));
  dispatch(roll(10));
  dispatch(roll(10));

  assert(
    getState().game.points[0][1] === 20,
    'frame 2 points should be equal 20'
  );

  dispatch(newGame());
  dispatch(addPlayer('Florian'));
  for (var i = 0; i < 12; i++) {
    dispatch(roll(10))
  }

  assert(
    getState().game.points[0].reduce((prev, next) => prev + next, 0),
    'total game points should be equal 300'
  );
}

export default testSuite;
