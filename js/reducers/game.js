import clone from '../utils/clone';

const checkIfLastPlayerRollInFrame = (frameIndex, framePoints, rollsCount) => {
  if (frameIndex != 9) {
    return framePoints === 10 || rollsCount === 2
  }

  return rollsCount ===3 || (rollsCount === 2 && framePoints < 10);
};

const initialGameState = {
  frames: {},
  points: {},
  playersCount: 0,
  currentPlayerIndex: 0,
  currentFrameIndex: 0,
  status: 'new',
};

export default function game(state = {}, action) {
  if (action.type === 'NEW_GAME') {
    return clone(initialGameState);
  } else if (action.type === 'ADD_PLAYER') {
    return {
      ...state,
      playersCount: ++state.playersCount
    }
  } else if (action.type === 'START_GAME') {
    return {
      ...state,
      status: 'active'
    }
  } else if (action.type !== 'ROLL') {
    return state;
  }

  const {currentFrameIndex, currentPlayerIndex, playersCount} = state;
  const currentPlayerFrames = state.frames[currentPlayerIndex] || [];
  const currentPlayerPoints = state.points[currentPlayerIndex] || [];

  const currentFrameRolls = currentPlayerFrames[currentFrameIndex]
    ? [...currentPlayerFrames[currentFrameIndex], action.pins]
    : [action.pins];

  const currentFramePoints = currentFrameRolls.reduce((a, b) => a + b, 0);

  const updatedFramesPoints = [];
  if (currentFrameIndex > 0 && currentFrameRolls.length !== 3) {
    if (currentFrameIndex > 1 && (currentFrameIndex < 9 || currentFrameRolls.length !== 2) && currentPlayerFrames[currentFrameIndex - 1].length === 1 && currentPlayerFrames[currentFrameIndex - 2].length === 1) {
      updatedFramesPoints.push(currentPlayerPoints[currentFrameIndex - 2] + action.pins)
    }

    if (currentPlayerPoints[currentFrameIndex - 1] === 10 && currentFrameRolls.length === 1 || currentPlayerFrames[currentFrameIndex - 1].length === 1) {
      updatedFramesPoints.push(currentPlayerPoints[currentFrameIndex - 1] + action.pins)
    }

  }

  const isLastPlayerRollInFrame = checkIfLastPlayerRollInFrame(currentFrameIndex, currentFramePoints, currentFrameRolls.length);
  const gameIsOver =  isLastPlayerRollInFrame && currentFrameIndex === 9 && currentPlayerIndex === playersCount - 1

  return {
    frames: {
      ...state.frames,
      [currentPlayerIndex]: [
        ...currentPlayerFrames.slice(0, currentFrameIndex),
        currentFrameRolls
      ]
    },
    points: {
      ...state.points,
      [currentPlayerIndex]: [
        ...currentPlayerPoints.slice(0, currentFrameIndex - updatedFramesPoints.length),
        ...updatedFramesPoints,
        currentFramePoints
      ]
    },
    currentPlayerIndex: isLastPlayerRollInFrame
      ? (currentPlayerIndex + 1) % playersCount
      : currentPlayerIndex,
    currentFrameIndex: isLastPlayerRollInFrame && currentPlayerIndex === playersCount - 1
      ? currentFrameIndex + 1
      : currentFrameIndex,
    status: gameIsOver ? 'over' : 'active',
    playersCount: state.playersCount,
  };
}
