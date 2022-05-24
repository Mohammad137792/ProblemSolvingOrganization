import React, { useState, useEffect , createRef} from 'react';
import {Box, Button, CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import ActionBox from "../../../../components/ActionBox";
import FormPro from "../../../../components/formControls/FormPro";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {SERVER_URL} from 'configs';
import { setAlertContent,ALERT_TYPES } from "app/store/actions";




const formDefaultValues = {}

export default function PayrollBaseInfo(props) {
    const {partyRelationshipId,salaryGroup,partyId}=props
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, setFormValidation] = useState({});
    const [employmentCondition, setEmploymentCondition] = useState([]);
    const [serviceCondition, setServiceCondition] = useState([]);
    const [salaryEmploymentStatus, setSalaryEmploymentStatus] = useState([]);
    const [initialForm, setInitialForm] = useState({})
    const sendProfile = useSelector(({ fadak }) => fadak.workEffort);

    const formStructure = [{
        name    : "partyClassificationId",
        label   : "گروه حقوق و دستمزد",
        type    : "select",
        options : "Test1",
        options: salaryGroup,
        optionLabelField: "description",
        optionIdField: "partyClassificationId",
    },{
        name    : "serviceLocationConditionEnumId",
        label   : "وضعیت خدمت",
        type    : "select",
        options: serviceCondition,
        optionLabelField: "description",
        optionIdField: "enumId",
    },{
        name    : "employmentConditionEnumId",
        label   : "وضعیت کارمند",
        type    : "select",
        options: employmentCondition,
        optionLabelField: "description",
        optionIdField: "enumId",
    },{
        name    : "salaryStatusId",
        label   : "وضعیت حقوق و دستمزد",
        type    : "select",
        options : salaryEmploymentStatus,
        optionLabelField: "description",
        optionIdField: "statusId",
    },{
        name    : "baseInsurancenumber",
        label   : "کد بیمه",
        type    : "text",
    }]

    const axiosKey = {
        headers: {
          api_key: localStorage.getItem("api_key"),
        },
      };

    const dispatch = useDispatch();

    function handle_submit() {
        let data = {
            partyClassificationId: formValues.partyClassificationId === undefined ||  formValues.partyClassificationId === null? "": formValues.partyClassificationId,
            partyRelationshipId: sendProfile?.partyRelationshipId ? sendProfile?.partyRelationshipId?.toString():partyRelationshipId,
            baseInsurancenumber:formValues.baseInsurancenumber === undefined ? "": formValues.baseInsurancenumber,
            serviceLocationConditionEnumId:formValues.serviceLocationConditionEnumId === undefined ? "": formValues.serviceLocationConditionEnumId,
            employmentConditionEnumId:formValues.employmentConditionEnumId === undefined ? "": formValues.employmentConditionEnumId,
            salaryStatusId:formValues.salaryStatusId === undefined? "": formValues.salaryStatusId,
            partyId: sendProfile?.partyId ? sendProfile?.partyId?.toString():partyId

        }

        axios.post(SERVER_URL + "/rest/s1/salary/saveBaseSalaryInfo", { data: data }, axiosKey)
            .then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
              

            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });

    }
    function handle_reset() {
        set_formValues(initialForm)
    }

    useEffect(()=>{
     

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EmploymentCondition", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setEmploymentCondition(res.data.result)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=ServiceLocationCondition", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setServiceCondition(res.data.result)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SalaryEmploymentStatus", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setSalaryEmploymentStatus(res.data.status)


        }).catch(err => {
        });

    },[]);

    useEffect(()=>{
        // console.log(partyRelationshipId , "partyRelationshipId...partyRelationshipId")
        // console.log("xxxxx0",sendProfile?.partyRelationshipId?.toString())
        let partyRel = partyRelationshipId ? partyRelationshipId : 
        sendProfile ? sendProfile?.partyRelationshipId?.toString() : null
        
        if(partyRel !== null){
            axios.get((SERVER_URL + "/rest/s1/salary/getBaseSalaryInfo?partyRelationshipId=") + partyRel, {headers: {'api_key': localStorage.getItem('api_key')}
            }).then(res => {
                setInitialForm(res.data.data)
                set_formValues(res.data.data)
            }).catch(err => {
            });
        }

     },[partyRelationshipId, sendProfile]);



    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                             formValidation={formValidation} setFormValidation={setFormValidation}
                             prepend={formStructure}
                             actionBox={<ActionBox>
                                 <Button type="submit" role="primary">ثبت</Button>
                                 <Button type="reset" role="secondary">لغو</Button>
                             </ActionBox>}
                             submitCallback={handle_submit} resetCallback={handle_reset}
                    />
                </CardContent>
            </Card>
        </Box>
    )
}
