


export const SET_SELECTED_PART = 'SET_SELECTED_PART';

export const getData = (oldData , addedData) => ({
    type: SET_SELECTED_PART ,
    payload: {oldData , addedData}
})
