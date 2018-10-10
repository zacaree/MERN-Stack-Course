// We never want to change/mutate the state, we want to make a copy of it.
// So if we want to take what's already in the state (initialState for example) and add to it, we can use the spread operator.
const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
