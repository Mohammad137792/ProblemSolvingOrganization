/**
 * @author Farbod Shams <farbodshams.2000@gmail.com>
 * The usage of this function is to add data of all input fields in all types to a determined data pool in
 * a correct way. params and the way this is used is described below
 * @type {{CHECKBOX: string, PICKER: string, MULTI_SELECT: string, FILE: string, AUTO_COMPLETE: string}}
 * @param adder: it's a setState function which changes the form-data pool state. After passing this arg to
 *               function, it returns another function with params below.
 * @param type (optional): which can be one of @types above INPUT_TYPES holds these types in a json. If you
 *                          don't pass this arg to function, it'll be considered a text field or a select field.
 * @param name (optional): It's required just for PICHER type. in other cases this arg is ignored.
 */

export const INPUT_TYPES = {
    CHECKBOX: "CHECKBOX",
    MULTI_SELECT: "MULTI_SELECT",
    PICKER: "PICKER",
    FILE: "FILE",
    AUTO_COMPLETE: "AUTO_COMPLETE"
}

export const setFormDataHelper = adder => (type = null, collection = null) => (event, newVal) => {
    let {id, value, name} = event.target;


    switch (type) {
        case INPUT_TYPES.CHECKBOX:
            return adder(previousState => ({...previousState, [event.target.name]: event.target.checked}));
        case INPUT_TYPES.PICKER:
            return adder(previousState => ({...previousState, [name]: event.toDate()}))
            // return adder(previousState => ({...previousState, [id ?? name]: value}))
        case INPUT_TYPES.FILE:
            name = event.target.id;
            value = event.target.files[0];
            // return ;
            break;
            // return adder(previousState => ({...previousState, [event.target.id]: event.target.files[0]}));
        case INPUT_TYPES.AUTO_COMPLETE:
            return adder(previousState => ({...previousState, [name]: newVal}));
        default:
            // const {id, value, name} = event.target;
        // return adder(previousState => {
        //     let newCollection;
        //     if(previousState[collection]){
        //         newCollection = Object.assign(previousState[collection], {[name]: value})
        //     }
        //     else{
        //         newCollection = Object.assign({}, {[name]: value})
        //     }
        //     return Object.assign({}, previousState, {[collection]: newCollection});
        // })

            // return adder(previousState => ({...previousState, }))
    }
    return adder(previousState => {
        let newCollection;
        // value = value.replace("ي" , "ی")
        // value = value.replace("ك" ,"ک")
        // value = value.trim()
        console.log("acvavc" , value)

        if(previousState[collection]){
            newCollection = Object.assign(previousState[collection], {[name]: value})
        }
        else{
            newCollection = Object.assign({}, {[name]: value})
        }
        return Object.assign({}, previousState, {[collection]: newCollection});
    })
}
