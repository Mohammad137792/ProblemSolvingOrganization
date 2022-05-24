/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * You can check the actions and comment in top of each action files to see what all of these codes do!
 */

import {SHOW_ALERT, HIDE_ALERT, SET_ALERT_CONTENT, ALERT_TYPES} from '../../actions/fadak';

const alertInisialState = {
    show: false,
    type: ALERT_TYPES.INFO,
    message: 'Test'
}

export default (state = alertInisialState, action) => {
    switch (action.type) {
        case SHOW_ALERT:
            return Object.assign({}, state, {show: true});
        case HIDE_ALERT:
            return Object.assign({}, state, {show: false});
        case SET_ALERT_CONTENT:
            return Object.assign({}, state, {
                show: true,
                type: action.payload.type,
                message: action.payload.message
            })
        default:
            return state;
    }
}