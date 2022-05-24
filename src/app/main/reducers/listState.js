import {useReducer} from "react";

export default function useListState(pk="id", initialState=null) {
    const [state, dispatch] = useReducer(reducer, initialState);

    function reducer(state, action) {
        const payloadIsArray = typeof action.payload==="object" && typeof action.payload?.length!=="undefined"
        switch (action.type) {
            case "set":
                if(typeof action.payload==="function"){
                    return action.payload(state)
                } else {
                    return action.payload
                }
            case "add":
                if(payloadIsArray) {
                    let buffer = Object.assign([],state)
                    for(let i in action.payload){
                        buffer = add_an_item(buffer, action.payload[i])
                    }
                    return buffer
                } else {
                    return add_an_item(state, action.payload)
                }
                // if(payloadIsArray) {
                //     return [...state, ...action.payload]
                // } else {
                //     return [...state, action.payload]
                // }
            case "remove":
                if(payloadIsArray) {
                    let buffer = Object.assign([],state)
                    for(let i in action.payload){
                        buffer = remove_an_item(buffer, action.payload[i])
                    }
                    return buffer
                } else {
                    return remove_an_item(state, action.payload)
                }
            case "update":
                let buffer = Object.assign([],state)
                const index = buffer.findIndex(i=>i[pk]===action.payload[pk])
                buffer[index] = Object.assign({},buffer[index],action.payload)
                return buffer
            case "empty":
                return []
            default:
                return state
        }
    }

    function add_an_item(state, item) {
        let buffer = Object.assign([],state)
        const index = state.findIndex(i=>i[pk]===item[pk])
        if(index>=0)
            buffer[index] = Object.assign({},buffer[index],item)
        else
            buffer.push(item)
        return buffer
    }

    function remove_an_item(state, item) {
        let buffer = Object.assign([],state)
        const value = typeof item==="object" ? item[pk] : item
        const index = state.findIndex(i=>i[pk]===value)
        if(index>=0)
            buffer.splice(index,1)
        return buffer
    }

    return {
        pk: pk,
        get list() { return state },
        get length() { return state?.length || 0 },
        set:    (newList) => dispatch({type: "set", payload: newList}),
        empty:  () => dispatch({type: "empty"}),
        add:    (newItem) => dispatch({type: "add", payload: newItem}),
        update: (item) => dispatch({type: "update", payload: item}),
        remove: (item) => dispatch({type: "remove", payload: item}),
    }
}
