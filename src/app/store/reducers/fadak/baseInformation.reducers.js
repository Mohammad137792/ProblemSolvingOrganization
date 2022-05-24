/**
 * @author Mostafa Eftekhari
 * You can check the actions and comment in top of each action files to see what all of these codes do!
 */

import {
    SET_USER
} from '../../actions/fadak';
import {
    SET_USERId
} from '../../actions/fadak';

const baseInformationInisialState = {
    user: null,
    username : null,
    userId :  null,
    partyRelationshipId:null
}

const baseInformationInisial = (state = baseInformationInisialState, action) => {
    switch (action.type) {
        case SET_USER:

            return Object.assign({}, state, {
                user: action.payload.user,
            });
            case SET_USERId :
                return Object.assign({} , state , {
                    username:action.payload.username,
                    userId:action.payload.userId,
                    partyRelationshipId: action.payload.partyRelationshipId,
                    accountDisabled: action.payload.accountDisabled,
                    isNewUser: action.payload.isNewUser
                })
        default:
            return state;

    }
}
export default baseInformationInisial