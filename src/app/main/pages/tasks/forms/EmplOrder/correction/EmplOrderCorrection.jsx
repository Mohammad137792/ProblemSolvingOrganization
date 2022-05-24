import React, {useState} from "react";
import EOCStepper from "./EOCStepper";

export default function EmplOrderCorrection(props) {
    const {formVariables, submitCallback} = props;
    let formDefaultValues = {}
    for (const [key, val] of Object.entries(formVariables)) {
        formDefaultValues[key] = val?.value
    }
    const [formValues, setFormValues] = useState(formDefaultValues);
    const verificationList = formValues.verificationList ?? []
    const personnel = formValues.personnelList ?? []
    const handleSubmit = ()=>{
        submitCallback(formValues)
    }
    return (
        <EOCStepper formValues={formValues} setFormValues={setFormValues}
                    personnel={personnel} personnelOrders={personnel} verificationList={verificationList}
                    finishCallback={handleSubmit}
        />
    )
}
