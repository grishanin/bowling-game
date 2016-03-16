import expect from 'expect';
import game from '../../js/reducers/game';

describe('reducers', () => {
  describe('game', () => {
    it('should handle NEW_GAME action', () => {
      const action = {
        type: 'NEW_GAME'
      };

      expect(game({}, action)).toEqual({
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 0,
        status: 'new'
      })
    });

    it('should handle ADD_PLAYER action', () => {
      const state = {
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 0,
        status: 'new'
      };

      expect(game(state, {type: 'ADD_PLAYER', name: 'Evgeny'})).toEqual({
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 1,
        status: 'new'
      })
    });

    it('should handle START_GAME action', () => {
      const state = {
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 1,
        status: 'new'
      };

      expect(game(state, {type: 'START_GAME'})).toEqual({
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 1,
        status: 'active'
      });
    });

    it('should handle ROLL action', () => {
      const state = {
        frames: {},
        points: {},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 10,
        playersCount: 1,
        status: 'active'
      };

      expect(game(state, {type: 'ROLL', pins: 3})).toEqual({
        frames: {0: [[3]]},
        points: {0: [3]},
        currentPlayerIndex: 0,
        currentFrameIndex: 0,
        pinsOnStand: 7,
        playersCount: 1,
        status: 'active'
      });
    });
  });
});
