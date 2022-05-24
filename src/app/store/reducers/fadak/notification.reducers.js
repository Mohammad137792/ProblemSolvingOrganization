import {
  DECREASE_NOTIFICATION,
  MY_NOTIFICATION,
  INCREASE_NOTIFICATION,
} from "./../../actions/fadak/notification.actions";

const myNotifications = (state = 0, action) => {
  switch (action.type) {
    case MY_NOTIFICATION:
      return action.payload;
    case DECREASE_NOTIFICATION:
      return action.payload;
    case INCREASE_NOTIFICATION:
      return action.payload;
    default:
      return state;
  }
};
export default myNotifications;
