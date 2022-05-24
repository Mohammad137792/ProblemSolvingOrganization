/**
 * @author Ali sarmadi  
 */


import {
    SET_PERMISION, SET_USER
} from '../../actions/fadak';



const inisialState = {
    data: {},

}


const permisionList = (state = inisialState, action) => {
    switch (action.type) {
        case SET_PERMISION:
            
            return Object.assign({}, state, {
                data: action.payload.data,
            })

        default:
            return state;
    }
}




export default  permisionList