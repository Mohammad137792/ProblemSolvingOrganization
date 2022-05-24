import {
    ADD_CONST_DATA,
} from "../../actions/fadak/";

import {
    EMPTY_CONST_DATA,
} from "../../actions/fadak/";



const stateDefault = {
    list: {
        Test1: [
            { enumId: 'opt1', description: 'گزینه یک' },
            { enumId: 'opt2', description: 'گزینه دو' },
            { enumId: 'opt3', description: 'گزینه سه' }
        ],
        Gender: [
            { description: "مذکر", enumId: "Y" },
            { description: "مونث", enumId: "N" }
        ],
        Existence: [
            { description: "دارد", enumId: "exist" },
            { description: "ندارد", enumId: "notExist" }
        ],
        instituteQualification: [
            { description: "تایید صلاحیت", statusId: "Accept" },
            { description: "رد صلاحیت", statusId: "Decline" }
        ],

    }

}

const constData = (state = stateDefault, action) => {

    switch (action.type) {
        case ADD_CONST_DATA:
            return Object.assign({}, state, {
                [action.payload.key]: {
                    ...state[action.payload.key],
                    ...action.payload.val
                }
            });
        case EMPTY_CONST_DATA:

            return stateDefault
        default:
            return state

    }

}








export default constData;