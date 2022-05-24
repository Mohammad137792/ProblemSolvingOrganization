import React from 'react'



const FormInputFile = ({...props}) => {
    function addFormInputFile(e){
       props.setValue(e.target.files[0])
        
    }
    return (
        <>
            <label htmlFor="contentId">{`${props.label}`}</label><br />
            <input onChange={addFormInputFile} type="file" disabled={props.disabled ? true : false} id={props.name} name={props.name} filename={""} />
        </>
    )
}

export default FormInputFile

