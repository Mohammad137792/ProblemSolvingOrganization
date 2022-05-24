/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * You can check the actions and comment in top of each action files to see what all of these codes do!
 */

import {
    FETCH_STARTED,
    FETCH_SUCCEED,
    FETCH_FAILED,
} from "../../actions/fadak/";

const formsInitState = {
    isFetching: {},
    fetchStatus: 0,
    response: "",
};

const formState = (state = formsInitState, action) => {
    switch (action.type) {
        case FETCH_STARTED:
            return Object.assign({}, state, {isFetching: {...state.isFetching, [action.payload.id]: true}})
        case FETCH_FAILED:
            return Object.assign({}, state, {
                isFetching: {...state.isFetching, [action.payload.id]: false},
                fetchStatus: "Error",
                response: action.payload
            });
        case FETCH_SUCCEED:
            return Object.assign({}, state, {
                isFetching: {...state.isFetching, [action.payload.id]: false},
                fetchStatus: "OK",
                response: action.payload
            });
        default:
            return state;
    }
}

export default formState;