import React, { useEffect, useState } from 'react';
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import axios from "axios";
import { SERVER_URL } from '../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import { Button, } from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";


function OperationalPlanningForm({ actionObject, dataOption, getTableData, setActionObject , formStructure, ...resProps }) {

    const {formValues, setFormValues} = resProps
    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 
  
    const dispatch = useDispatch();

    /* funcations form */
    const handleSubmit = () => {

        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)

        let config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: { ...formValues , workEffortTypeEnumId : "WetProject"}

        }

        axios(config).then(response => {
            getTableData()
            setActionObject({ ...formValues, "workEffortId": response.data.data.workEffortId })
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            set_waiting(false)
        }).catch(err => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
         })



    }

    const handleEdit = () =>{

        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)

        let config = {
            method: 'put',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: { ...formValues , workEffortTypeEnumId : "WetProject", workEffortId : actionObject?.workEffortId }

        }
        // console.log("alisarmadi config"  , config)

        axios(config).then(response => {
            getTableData()
            handleReset()
            setFormValues({})
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
        }).catch(err => { 
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        })


    }

    const handleReset = () => {
        setActionObject(null)
    }

    useEffect(() => {
        if (actionObject) {
            setFormValues({ ...actionObject })
        }
    }, [actionObject])

    return (
        <FormPro
            append={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={actionObject  ? handleEdit : handleSubmit}
            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                        disabled={waiting}
                        endIcon={waiting?<CircularProgress size={20}/>:null}
                    >
                    {actionObject ? "ویرایش" : "افزودن"}
                </Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )

}

export default OperationalPlanningForm