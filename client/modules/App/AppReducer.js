// Import Actions
import { TOGGLE_ADD_POST, TOGGLE_ADD_GAME, SET_USER, TOGGLE_ADD_TEAM } from './AppActions';
import initialState from './util/app.state.initial.js';

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ADD_POST:
      return {
        ...state,
        showAddPost: !state.showAddPost,
      };
    case TOGGLE_ADD_GAME:
      return {
        ...state,
        showAddGame: !state.showAddGame,
      };
    case TOGGLE_ADD_TEAM:
      return {
        ...state,
        showAddTeam: !state.showAddTeam,
      };
    case SET_USER:
      return {
        ...state,
        user: { ...action.user },
      };

    default:
      return state;
  }
};

/* Selectors */

// Get showAddPost
export const getShowAddPost = state => state.app.showAddPost;

// Get showAddPost
export const getShowAddGame = state => state.app.showAddGame;

// Get showAddPost
export const getShowAddTeam = state => state.app.showAddTeam;

// Get user
export const getUser = state => state.app.user;

// Export Reducer
export default AppReducer;
