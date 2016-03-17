import { clone, sum } from '../utils/misc';


function restandPins(fallenPinsCount, isClosingRoll) {
  return (isClosingRoll || fallenPinsCount === 10) ? 10 : 10 - fallenPinsCount
}

function isGameOver({currentFrameIndex, currentPlayerIndex, playersCount}, isClosingRoll) {
  return currentFrameIndex === 9 && isClosingRoll && currentPlayerIndex === playersCount - 1
}

function getPointsUpdate(points, frames, frame, frameIndex, fallenPinsCount) {
  const summedPoints = [];

  const isFirstFrame = frameIndex === 0;
  const rollNumber = frame.length;
  const isFirstRoll = rollNumber === 1;
  const isBonusRoll = rollNumber === 3;

  if (isFirstFrame || isBonusRoll) return summedPoints;

  const isPrevRollStrike = frames[frameIndex - 1].length === 1;
  const isPrevTwoRollsStrike = frameIndex > 1 && isPrevRollStrike && frames[frameIndex - 2].length === 1;

  if (isPrevTwoRollsStrike && isFirstRoll) {
    summedPoints.push(points[frameIndex - 2] + fallenPinsCount)
  }

  const isRollAfterSpareOrStrike = isFirstRoll && points[frameIndex - 1] === 10;
  if (isPrevRollStrike || isRollAfterSpareOrStrike) {
    summedPoints.push(points[frameIndex - 1] + fallenPinsCount)
  }

  return summedPoints;
}

function getUpdatedPoints(points = [], frames, frame, frameIndex, fallenPinsCount) {
  const updatedPoints = getPointsUpdate(...arguments);
  const shouldUpdatePreviousPoints = !!updatedPoints.length;
  const framePoints = frame.reduce(sum, 0);

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

function getUpdatedFrames(playerFrames, playerFrame, currentFrameIndex) {
  if (!playerFrames.length) {
    return [playerFrame];
  }

  return [
    ...playerFrames.slice(0, currentFrameIndex),
    playerFrame
  ]
}

function isClosingFrameRollForPlayer(frameIndex, isAllPinsDown, rollNumber) {
  if (frameIndex < 9) {
    return isAllPinsDown || rollNumber === 2
  }
  return rollNumber === 3 || (rollNumber === 2 && !isAllPinsDown);
};

function addRollToFrame(frame, fallenPinsCount) {
  return frame ? [...frame, fallenPinsCount] : [fallenPinsCount];
}

function makeRoll(state, action) {
  const fallenPinsCount = action.pins;
  const playerFrames = state.frames[state.currentPlayerIndex] || [];
  const currentPlayerFrame = addRollToFrame(playerFrames[state.currentFrameIndex], fallenPinsCount);

  const isClosingRoll = isClosingFrameRollForPlayer(
    state.currentFrameIndex,
    state.pinsOnStand - fallenPinsCount === 0,
    currentPlayerFrame.length
  );

  return {
    frames: {
      ...state.frames,
      [state.currentPlayerIndex]: getUpdatedFrames(
        playerFrames,
        currentPlayerFrame,
        state.currentFrameIndex
      )
    },
    points: {
      ...state.points,
      [state.currentPlayerIndex]: getUpdatedPoints(
        state.points[state.currentPlayerIndex],
        playerFrames,
        currentPlayerFrame,
        state.currentFrameIndex,
        fallenPinsCount
      )
    },
    currentPlayerIndex: isClosingRoll
      ? (state.currentPlayerIndex + 1) % state.playersCount
      : state.currentPlayerIndex,
    currentFrameIndex: isClosingRoll && state.currentPlayerIndex === state.playersCount - 1
      ? state.currentFrameIndex + 1
      : state.currentFrameIndex,
    pinsOnStand: restandPins(fallenPinsCount, isClosingRoll),
    status: isGameOver(state, isClosingRoll) ? 'over' : 'active'
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
        ...makeRoll(state, action)
      };
    default:
      return state;
  }
}
