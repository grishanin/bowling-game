export const newGame = () => {
  return {
    type: 'NEW_GAME'
  }
}

export const startGame = () => {
  return {
    type: 'START_GAME'
  }
}

export const addPlayer = (name) => {
  return {
    type: 'ADD_PLAYER',
    name
  }
}

export const roll = (pins) => {
  return {
    type: 'ROLL',
    pins
  }
}
