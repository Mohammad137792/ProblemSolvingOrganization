
import {
    SET_SELECTED_PART
} from '../../actions/fadak';

const initialState = {
    data : {}
 }

 const formComplexParty = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_PART :
            
            return Object.assign({}, state, {
                data: action.payload.addedData
            })

        default:
            return state;
    }
}
export default  formComplexParty