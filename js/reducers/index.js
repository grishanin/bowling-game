import game from './game';
import players from './players';
import combineReducers from '../utils/combineReducers';

const bowlingApp = combineReducers({game, players});

export default bowlingApp;
