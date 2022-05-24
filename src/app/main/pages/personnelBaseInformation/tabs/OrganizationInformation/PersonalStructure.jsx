import React from 'react';
import FormPro from '../../../..//components/formControls/FormPro';
import ActionBox from "../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import axios from "axios";
import {useSelector} from "react-redux";
import {useDispatch} from 'react-redux'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";

const PersonalStructure = () => {
    const [formValues, setFormValues] = React.useState({});
    const [formValidation, setFormValidation] = React.useState({});
    const [formDefaultValues , setFormDefaultValues]= React.useState({})
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const [reset,setReset] = React.useState(true);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch();
    const formStructure = [{
        name    : "ActivityArea",
        label   : "منطقه فعالیت",
        type    : "select",
        options : "ActivityArea",
        optionIdField   : "partyClassificationId",
        col:    6
    },{
        label:  "حوزه کاری",
        name:   "ExpertiseArea",
        type    : "select",
        options : "ExpertiseArea",
        optionIdField   : "partyClassificationId",
        col:    6
    },{
        label:  "گروه پرسنلی",
        name:   "EmployeeGroups",
        type    : "select",
        options: "EmployeeGroups" ,
        optionIdField   : "partyClassificationId",
        col     : 4
    },{
        label:  "زیر گروه پرسنلی",
        name:   "EmployeeSubGroups",
        type    : "select",
        options: "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.EmployeeGroups),
        col     : 4
    },{
        label:  "مرکز هزینه",
        name:   "CostCenter",
        type    : "select",
        options: "CostCenter",
        optionIdField   : "partyClassificationId",
        col     : 4
    }]
    React.useEffect(()=>{
        if(reset){
            axios.get(SERVER_URL + `/rest/s1/fadak/personalStructureInfo?partyId=${partyId}&partyRelationshipId=${partyRelationshipId}`  , axiosKey)
            .then((res)=>{
                setFormValues(res.data.userPersonalStructure)
                setFormDefaultValues(res.data.userPersonalStructure)
                setReset(false)
            })
        }
    },[reset])
    React.useEffect(()=>{
        if ( !formValues.EmployeeGroups || formValues.EmployeeGroups=="" ){
            const newValue = Object.assign({},formValues,{EmployeeSubGroups : ""}) 
            setFormValues(newValue)
        }
    },[formValues?.EmployeeGroups])  
    const handleSubmit =()=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
        axios.post(SERVER_URL + `/rest/s1/fadak/submitPersonalStructure?partyId=${partyId}&date=${new Date ().getTime()}` , {formData : formValues , storeData : formDefaultValues } , axiosKey)
        .then((res)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد."));
            setReset(true)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "ثبت اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید !"));
        })
           
    }

    return (
        <>
            <FormPro 
                formValues={formValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={handleSubmit}
                append={formStructure}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary">تایید</Button>
                </ActionBox>}
            />
        </>
    );
};

export default PersonalStructure;