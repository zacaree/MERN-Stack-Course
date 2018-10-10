import { TEST_DISPATCH } from "./types";

// Register User
export const registerUser = userData => {
  // If we want to dispatch something to our reducer we can simply return an object which must at least contain a type.
  // In this case the type and payload will both be dispatched to the reducer.
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};
