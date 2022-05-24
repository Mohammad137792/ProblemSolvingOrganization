import * as Actions from '../actions';

const initialState = {
    from: null,
    role: [],//guest
    data: {
        'dataLoaded': false,
        'displayName': 'مهمان',
        'photoURL'   : 'assets/images/avatars/sample_avatar.png',
        'email'      : '',
        'partyRelationshipId': '',
        shortcuts    : []
    }
};

const user = function (state = initialState, action) {
 
    switch ( action.type )
    {
       
        case Actions.SET_USER_DATA:
           
        {
            return {
                from: action.payload.from ?? initialState.from,
                role: action.payload.role ?? [],
                data: {...initialState.data, ...action.payload.data}

            };
        }
        case Actions.REMOVE_USER_DATA:
        {
            return {
                ...initialState
            };
        }
        case Actions.USER_LOGGED_OUT:
        {
            return initialState;
        }
        default:
        {
            return state
        }
    }
};

export default user;
