import { h } from '../utils/DOMUtils';

const RollsResult = (rolls) => {
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
  const tbodyRows = [];
  const tableContent = [
    h('DIV', {className: 'thead'}, [
      h('DIV', {className: 'row'}, [
        h('DIV', {className: 'cell'}, ['Players']),
        ...Array.apply(null, {length: framesCount}).map((v, i ) => h('DIV', {className: 'cell'}, [i + 1])),
        h('DIV', {className: 'cell cell_total-points'}, ['Points'])
      ]
    )]),
    h('DIV', {className: 'tbody'}, tbodyRows)
  ];

  const table = h('DIV', {className: 'table'}, tableContent);

  Object.keys(players).forEach((player, playerIndex) => {
    const rowCells = [
      h('DIV', {className: 'cell'}, [player])
    ];
    tbodyRows.push(h('DIV', {className: 'row'}, rowCells));

    for (let i = 0; i < framesCount; i++) {
      let frameRolls = '';
      let framePoints = '';
      const playerFrames = frames[playerIndex];
      if (playerFrames) {
        framePoints = points[playerIndex][i];
        frameRolls = playerFrames[i] ? h('DIV', [
          h('DIV', [RollsResult(playerFrames[i])]),
          h('DIV', [framePoints])
        ]) : '';
      }

      rowCells.push(
        h('DIV', {className: 'cell'}, [frameRolls])
      );
    }

    const totalPoints = points[playerIndex] ? points[playerIndex].reduce((a, b) => a + b, 0) : 0;
    rowCells.push(
      h('DIV', {className: 'cell'}, [totalPoints])
    );
  });

  return table;
}

export default GameTable;
