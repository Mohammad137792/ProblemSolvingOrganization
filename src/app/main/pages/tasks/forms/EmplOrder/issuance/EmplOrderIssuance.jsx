import React, {useState} from "react";
import EOIStepper from "./EOIStepper";

export const PREV_ORDER = "_PREV_";
export const PREV_ORDER_TEXT = "حکم قبلی (به زودی)";
export const PROFILE = "_PROF_";
export const PROFILE_TEXT = "پروفایل";

export default function EmplOrderIssuance(props){
    const {submitCallback} = props;
    let moment = require('moment-jalaali')
    const [formValues, setFormValues] = useState({
        checkEnumId: 'GroupCheckIn',
        sendingPathEnumId: 'EOSPTask',
        orderDate: moment().format("Y-MM-DD"),
        agreementDate:  moment().format("Y-MM-DD"),
        newAgreement: 'N',
        organizationUnitId: PROFILE,
        emplPositionId: PROFILE,
        jobId: PROFILE,
        jobGradeId: PROFILE,
        personnelAreaId: PROFILE,
        personnelSubAreaId: PROFILE,
        personnelGroupId: PROFILE,
        personnelSubGroupId: PROFILE,
        payGradeId: PROFILE,
    });
    const [personnel, selectPersonnel] = useState([]);
    const [personnelOrders, selectPersonnelOrders] = useState([]);
    function postProcess() {
        const postData = {
            ...formValues,
            personnelList: personnelOrders,
            'api_key': localStorage.getItem('Authorization')
        }
        submitCallback(postData)
    }
    return (
        <EOIStepper formValues={formValues} setFormValues={setFormValues}
                    personnel={personnel} selectPersonnel={selectPersonnel}
                    personnelOrders={personnelOrders} selectPersonnelOrders={selectPersonnelOrders}
                    finishCallback={postProcess}
        />
    )
}
