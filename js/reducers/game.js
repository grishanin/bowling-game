import { clone, sum } from '../utils/misc';


function addRollToFrame(frame, fallenPinsCount) {
  return frame ? [...frame, fallenPinsCount] : [fallenPinsCount];
}


function getPlayerPoints(points = [], playerFrames, frame, frameIndex, fallenPinsCount) {
  const isNotFirstFrame = frameIndex > 0;
  const rollNumber = frame.length;
  const isBonusRoll = rollNumber === 3;

  const updatedPoints = [];
  if (isNotFirstFrame && !isBonusRoll) {

    const isPrevTwoRollsStrike = frameIndex > 1
      && playerFrames[frameIndex - 1].length === 1
      && playerFrames[frameIndex - 2].length === 1;

    if (isPrevTwoRollsStrike && (frameIndex < 9 || rollNumber === 1)) {
      updatedPoints.push(points[frameIndex - 2] + fallenPinsCount)
    }

    const isRollAfterSpareOrStrike = points[frameIndex - 1] === 10 && rollNumber === 1;
    const isPrevRollStrike = playerFrames[frameIndex - 1].length === 1;
    if (isRollAfterSpareOrStrike || isPrevRollStrike) {
      updatedPoints.push(points[frameIndex - 1] + fallenPinsCount)
    }
  }

  const framePoints = frame.reduce(sum, 0);
  const shouldUpdatePreviousPoints = updatedPoints && updatedPoints.length;
  if (shouldUpdatePreviousPoints) {
    return [
      ...points.slice(0, frameIndex - updatedPoints.length),
      ...updatedPoints,
      framePoints
    ]
  }

  return [
    ...points.slice(0, frameIndex),
    framePoints
  ]
}


function isLastRollInFrameForPlayer(frameIndex, isAllPinsDown, rollNumber) {
  if (frameIndex < 9) {
    return isAllPinsDown || rollNumber === 2
  }
  return rollNumber === 3 || (rollNumber === 2 && !isAllPinsDown);
};


function restandPins(fallenPinsCount, isLastRoll) {
  return (isLastRoll || fallenPinsCount === 10) ? 10 : 10 - fallenPinsCount
}


function isGameOver(frameIndex, playerIndex, playersCount, isLastRoll) {
  return isLastRoll && frameIndex === 9 && playerIndex === playersCount - 1
}


function doRoll(state, action) {
  const playerFrames = state.frames[state.currentPlayerIndex] || [];
  const fallenPinsCount = action.pins;
  const currentFrame = addRollToFrame(playerFrames[state.currentFrameIndex], fallenPinsCount);

  const isLastRoll = isLastRollInFrameForPlayer(
    state.currentFrameIndex,
    state.pinsOnStand - fallenPinsCount === 0,
    currentFrame.length
  );

  return {
    frames: {
      ...state.frames,
      [state.currentPlayerIndex]: [
        ...playerFrames.slice(0, state.currentFrameIndex),
        currentFrame
      ]
    },
    points: {
      ...state.points,
      [state.currentPlayerIndex]: getPlayerPoints(
        state.points[state.currentPlayerIndex],
        playerFrames,
        currentFrame,
        state.currentFrameIndex,
        fallenPinsCount
      )
    },
    currentPlayerIndex: isLastRoll
      ? (state.currentPlayerIndex + 1) % state.playersCount
      : state.currentPlayerIndex,
    currentFrameIndex: isLastRoll && state.currentPlayerIndex === state.playersCount - 1
      ? state.currentFrameIndex + 1
      : state.currentFrameIndex,
    pinsOnStand: restandPins(fallenPinsCount, isLastRoll),
    status: isGameOver(state.currentFrameIndex, state.currentPlayerIndex, state.playersCount, isLastRoll)
      ? 'over'
      : 'active'
  };
}


const initialGameState = {
  frames: {},
  points: {},
  currentPlayerIndex: 0,
  currentFrameIndex: 0,
  pinsOnStand: 10,
  playersCount: 0,
  status: 'new'
};

export default function game(state = {}, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return clone(initialGameState);
    case 'ADD_PLAYER':
      return {
        ...state,
        playersCount: ++state.playersCount
      }
    case 'START_GAME':
      return {
        ...state,
        status: 'active'
      }
    case 'ROLL':
      return {
        ...state,
        ...doRoll(state, action)
      };
    default:
      return state;
  }
}
