import React, {useEffect, useState} from "react";
import TablePro from "../../../components/TablePro";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import FormPro from "../../../components/formControls/FormPro";
import {makeStyles} from "@material-ui/core/styles";

function ExternalForm({...restProps}) {
    const dispatch = useDispatch();
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [{
        name    : "termTypeEnumId",
        label   : "نوع ماده",
        type    : "display",
        options : "TermType",
        col     : 5
    },{
        name    : "termText",
        label   : "متن",
        type    : "textarea",
        col     : 12
    }]
    const handleSubmit = ()=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        console.log('table edited to:',formValues)
        axios.put(SERVER_URL + "/rest/s1/fadak/entity/AgreementTerm", {data : formValues },{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then( () => {
            successCallback(formValues)
        }).catch(()=>{
            failedCallback()
        });
    }
    const handleReset = ()=>{
        handleClose()
    }
    return(
        <FormPro formValues={formValues} setFormValues={setFormValues}
                 formValidation={formValidation} setFormValidation={setFormValidation}
                 prepend={formStructure}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">ویرایش</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
                 submitCallback={handleSubmit} resetCallback={handleReset}
        />
    )
}

// const useStyles = makeStyles((theme) => ({
//     table: {
//         tableLayout: "fixed"
//     },
// }));

export default function EOCTabTerm({agreementId}) {
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    // const classes = useStyles()
    const tableCols = [
        {name: "termTypeEnumId", label: "عنوان ماده", type: "select", options: "TermType"},
        {name: "termText", label: "متن", type: "text", style: {width:"500px"}},
    ]
    useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/AgreementTerm?agreementId=${agreementId}`,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then( res => {
            setLoading(false)
            setTableContent(res.data.result.sort((a,b)=>a.termNumber-b.termNumber))
        }).catch(()=>{
            setLoading(false)
        });
    },[agreementId])

    return(
        <TablePro
            // className={classes.table}
            rowNumberWidth="40px"
            fixedLayout={true}
            title="لیست ماده های قرارداد"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            loading={loading}
            edit="external"
            editForm={<ExternalForm/>}
        />
    )
}
