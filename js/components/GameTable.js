import { h } from '../utils/DOMUtils';

const RollResult = (rolls) => {
  var result = '';
  rolls.forEach((r, i) => {
    if (r === 10) {
      result += ` X`;
    } else if (i === 1 && rolls[0] + rolls[i] === 10) {
      result += ` /`;
    } else {
      result += ` ${r}`;
    }
  });

  return result;
}

const GameTable = ({ players, game: { frames, points } }) => {
  const framesCount = 10;
  const rows = [
    h('DIV', {className: 'thead'}, [
      h('DIV', {className: 'row'}, [
        h('DIV', {className: 'cell'}, ['Players']),
        ...Array.apply(null, {length: framesCount}).map((v, i ) => h('DIV', {className: 'cell'}, [i + 1])),
        h('DIV', {className: 'cell cell_total-points'}, ['Points'])
      ]
    )
  ])
];

const table = h('DIV', {className: 'table'}, rows);

Object.keys(players).forEach((player, playerIndex) => {
  const rollsCells = [
    h('DIV', {className: 'cell'}, [player])
  ];

  rows.push(...[
    h('DIV', {className: 'tbody'}, [
      h('DIV', {className: 'row'}, rollsCells)
    ])
  ]);

  for (let i = 0; i < framesCount; i++) {
    let frameRolls = '';
    let framePoints = '';
    const playerFrames = frames[playerIndex];

    if (playerFrames) {
      framePoints = points[playerIndex][i];
      frameRolls = playerFrames[i] ? h('DIV', [
        h('DIV', [RollResult(playerFrames[i])]),
        h('DIV', [framePoints])
      ]) : '';
    }

    rollsCells.push(
      h('DIV', {className: 'cell'}, [frameRolls])
    );
  }

  const totalPoints = points[playerIndex] ? points[playerIndex].reduce((a, b) => a + b, 0) : 0;
  rollsCells.push(
    h('DIV', {className: 'cell'}, [totalPoints])
  );
})

return table;
}

export default GameTable;
