import axios from "axios";
import { SERVER_URL } from "./../../../../configs";
export const MY_NOTIFICATION = "MY_NOTIFICATION";
export const DECREASE_NOTIFICATION = "DECREASE_NOTIFICATION";
export const INCREASE_NOTIFICATION = "INCREASE_NOTIFICATION";

export const getAllMyNotifs = (number = 0) => {
  return async (dispatch) => {
    if (number === 0) {
      const axiosKey = {
        headers: {
          api_key: localStorage.getItem("api_key"),
        },
      };
      const data = {
        show: "notViewed",
      };
      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/listOfMyMessages",
          { data: data },
          axiosKey
        )
        .then((res) => {
          dispatch({
            type: MY_NOTIFICATION,
            payload: res.data.numberNotif,
          });
        })
        .catch(() => {});
    } else {
      await dispatch({
        type: MY_NOTIFICATION,
        payload: number,
      });
    }
  };
};
export const decreaseMyNotifs = () => {
  return async (dispatch, getState) => {
    const numberNotifs =
      getState().fadak.myNotifications > 0
        ? (getState().fadak.myNotifications -= 1)
        : getState().fadak.myNotifications;
    await dispatch({
      type: DECREASE_NOTIFICATION,
      payload: numberNotifs,
    });
  };
};
export const increaseMyNotifs = () => {
  return async (dispatch, getState) => {
    const numberNotifs = (getState().fadak.myNotifications += 1);
    await dispatch({
      type: INCREASE_NOTIFICATION,
      payload: numberNotifs,
    });
  };
};
