export const ADD_CONST_DATA = 'ADD_CONST_DATA';
export const EMPTY_CONST_DATA = 'EMPTY_CONST_DATA';


export const addConstData = (key, val) => ({
    type: ADD_CONST_DATA,
    payload: { key, val }
})


export const emptyConstData = () => ({
    type: EMPTY_CONST_DATA,
    payload: {}
})