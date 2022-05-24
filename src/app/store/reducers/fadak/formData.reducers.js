/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * You can check the actions and comment in top of each action files to see what all of these codes do!
 */

import {
    ADD_FORM_DATA,
} from "../../actions/fadak/";

const formData = (state = {}, action) => {
    if(action.type !== ADD_FORM_DATA)
        return state;
    return Object.assign({}, state, action.payload);
}

export default formData;