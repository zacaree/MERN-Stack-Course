import { TEST_DISPATCH } from "../actions/types";

// We never want to change/mutate the state, we want to make a copy of it.
// So if we want to take what's already in the state (initialState for example) and add to it, we can use the spread operator.
const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEST_DISPATCH:
      return {
        // Let's not mutate state, we just want to add to it so use the spread operator.
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}
