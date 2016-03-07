const player = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        name: action.name
      };
    default:
      return state;
  }
}

const players = (state = {}, action) => {
  switch (action.type) {
    case 'NEW_GAME':
      return {
      };
    case 'ADD_PLAYER':
      return {
        ...state,
        [action.name]: player(null, action)
      };
    default:
      return state;
  }
}

export default players;
