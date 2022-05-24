import {
  MY_WORKEFFORT
} from "./../../actions/fadak/workEffort.actions";

const workEffort = (state = {}, action) => {
  switch (action.type) {
    case MY_WORKEFFORT:
      return action.payload;
    default:
      return state;
  }
};
export default workEffort;
