import expect from 'expect';
import game from '../../js/reducers/game';
import { clone, sum } from '../../js/utils/misc';

describe('reducers', () => {
  describe('game', () => {
    describe('actions', () => {
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

    describe('points', () => {
      it('shoud be 67 points total when the first frame is spare and the rest frames 3', () => {
        let state = {
          frames: {},
          points: {},
          currentPlayerIndex: 0,
          currentFrameIndex: 0,
          pinsOnStand: 10,
          playersCount: 1,
          status: 'active'
        };

        state = game(state, {type: 'ROLL', pins: 8});
        state = game(state, {type: 'ROLL', pins: 2});
        for (var i = 0; i < 18; i++) {
          state = game(state, {type: 'ROLL', pins: 3});
        }

        expect(state.points[0].reduce(sum, 0)).toEqual(67);
      });

      it('shoud be 96 points total when the first two frames are spare and the rest frames 4', () => {
        let state = {
          frames: {},
          points: {},
          currentPlayerIndex: 0,
          currentFrameIndex: 0,
          pinsOnStand: 10,
          playersCount: 1,
          status: 'active'
        };

        state = game(state, {type: 'ROLL', pins: 8});
        state = game(state, {type: 'ROLL', pins: 2});
        state = game(state, {type: 'ROLL', pins: 8});
        state = game(state, {type: 'ROLL', pins: 2});
        for (var i = 0; i < 16; i++) {
          state = game(state, {type: 'ROLL', pins: 4});
        }

        expect(state.points[0].reduce(sum, 0)).toEqual(96);
      });

      it('shoud be 90 points total when the first frame is strike and the rest frames 4', () => {
        let state = {
          frames: {},
          points: {},
          currentPlayerIndex: 0,
          currentFrameIndex: 0,
          pinsOnStand: 10,
          playersCount: 1,
          status: 'active'
        };

        state = game(state, {type: 'ROLL', pins: 10});
        for (var i = 0; i < 18; i++) {
          state = game(state, {type: 'ROLL', pins: 4});
        }

        expect(state.points[0].reduce(sum, 0)).toEqual(90);
      });

      it('shoud be 68 points total when the first two frames are strikes and the rest frames 2', () => {
        let state = {
          frames: {},
          points: {},
          currentPlayerIndex: 0,
          currentFrameIndex: 0,
          pinsOnStand: 10,
          playersCount: 1,
          status: 'active'
        };

        state = game(state, {type: 'ROLL', pins: 10});
        state = game(state, {type: 'ROLL', pins: 10});
        for (var i = 0; i < 16; i++) {
          state = game(state, {type: 'ROLL', pins: 2});
        }

        expect(state.points[0].reduce(sum, 0)).toEqual(68);
      });

      it('shoud be 300 points total when game is perfect', () => {
        let state = {
          frames: {},
          points: {},
          currentPlayerIndex: 0,
          currentFrameIndex: 0,
          pinsOnStand: 10,
          playersCount: 1,
          status: 'active'
        };

        for (var i = 0; i < 12; i++) {
          state = game(state, {type: 'ROLL', pins: 10});
        }

        expect(state.points[0].reduce(sum, 0)).toEqual(300);
      });
    })
  });
});
