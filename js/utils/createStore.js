const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);

    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }

    console.log(action, state);
  }

  const subscribe = (listener) => {
    var isSubscribed = true
    listeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false;

      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  dispatch({type: 'INIT'});

  return {
    getState,
    dispatch,
    subscribe
  };
}

export default createStore;
