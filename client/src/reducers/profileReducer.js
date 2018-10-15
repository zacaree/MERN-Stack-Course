import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
  profile: null,
  profiles: null,
  loading: false
}

export default function (state = initialState, action) {
  // This'll switch depending on the action that is dispatched
  switch (action.type) {
    // All PROFILE_LOADING does is set loading to true.
    case PROFILE_LOADING:
      return {
        ...state, // return the current state
        loading: true
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      }
    default:
      return state;
  }
}