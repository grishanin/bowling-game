import { h } from '../utils/DOMUtils';

const ActionButtons = ({status, playersCount}) => {
  return h('DIV', {className: 'bowling-game__actions'}, [
    status === 'over' && h('button', {className: 'new-game'}, ['New game']),
    status === 'new' && h('input', {
      type: 'text',
      placeholder: 'Player name...',
      className: 'player-name',
    }),
    status === 'new' && h('button', {className: 'add-player'}, ['Add player']),
    status === 'active' && h('button', {className: 'roll'}, ['Roll']),
    status === 'new' && playersCount > 0
      && h('button', {className: 'start-game default'}, ['Start game'])
  ]);
}

export default ActionButtons;
