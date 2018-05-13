// Export Constants
export const TOGGLE_ADD_POST = 'TOGGLE_ADD_POST';
export const TOGGLE_ADD_GAME = 'TOGGLE_ADD_GAME';
export const TOGGLE_ADD_TEAM = 'TOGGLE_ADD_TEAM';
export const SET_USER = 'SET_USER';

// Export Actions
export function toggleAddPost() {
  return {
    type: TOGGLE_ADD_POST,
  };
}

export function toggleAddGame() {
  return {
    type: TOGGLE_ADD_GAME,
  };
}

export function toggleAddTeam() {
  return {
    type: TOGGLE_ADD_TEAM,
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user,
  };
}
