import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";


import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';

const PrimeryReview = (props) => {
    const { handleSubmitReject,handleSubmitModify,formValuesPrimery, setFormValuesPrimery,handleAccept} = props;


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValidation, setFormValidation] = useState([]);
    const [rejectionReason, setRejectionReason] = useState([]);
    const dispatch = useDispatch()
    const myElement = React.createRef(0);
    const myElement1 = React.createRef(0);




    const formStructure = [{
        label: "تاریخ بررسی",
        name: "reviewDate",
        type: "date",
        col: 6
    },{
        label: "  دلایل رد ",
        name: "rejectionReasonEnumID",
        type: "multiselect",
        col: 6,
        options:rejectionReason,
        optionLabelField: "description",
        optionIdField: "enumId",
        required:"true"

    },
    {
        label: "  توضیحات ",
        name: "discription",
        type: "textarea",
        col: 6
    }, 
 formValuesPrimery?.rejectionReasonEnumID?.includes("other") ? {
        label: "سایر دلایل",
        name: "other",
        type: "textarea",
        col: 6
    } : {
        name: "empty",
        label: "",
        type: "text",
        disabled: true,
        // visibility: "hidden"
        style: { visibility: "hidden" }
        // component: <Box style={{ borderWidth: 0, width: 0, height: 0 }} />

    },


    ]


    const tableCols = [
        { name: "unit", label: " شماره دفعات اعتراض", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: "   تاریخ اعترض", type: "text", style: { minWidth: "130px" } }
    ]





    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)

        }).catch(err => {
        });

     
    }

    useEffect(() => {
        getEnum();

    }, []);


  

const handle_submit=()=>{}


const SubmitReject=()=>{
    myElement.current.click();
    handleSubmitReject()
}
const handleAcceptClick=()=>{

    handleAccept()
}

    return (
        <Box>
            
                <Card >
                    <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                        <Card>
                            <CardContent>
                                <FormPro
                                    append={formStructure}
                                    formValues={formValuesPrimery}
                                    setFormValues={setFormValuesPrimery}
                                    setFormValidation={setFormValidation}
                                    formValidation={formValidation} 
                                    actionBox={<ActionBox style={{ display: "none" }}>
                                    <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                                    {/* <Button type="reset" role="secondary">لغو</Button> */}
                                </ActionBox>}
                                submitCallback={handle_submit}    
                                />
                            </CardContent>
                            <ActionBox>
                                    <Button type="button" onClick={handleSubmitModify} role="primary" style={{backgroundColor:"green"}}>ارجاع جهت تکمیل</Button>
                                    <Button type="submit" onClick={SubmitReject} role="secondary">رد</Button>
                                    <Button type="button"  onClick={handleAcceptClick} role="primary"> تایید</Button>

                                </ActionBox>
                        </Card>
                    </Card>
                    <Card >
          

                </Card>





            </Card>
        </Box>
    )
}


export default PrimeryReview;












