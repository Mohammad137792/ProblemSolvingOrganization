
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../configs";
import { Box, Button, Card, Grid } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormPro from 'app/main/components/formControls/FormPro';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';

const CancelNeedAssementForm = (props) => {
    const {btnBg, bgColorCancel, setbgColorCancel, bgColorDelay, FormValuesCancle, setFormValuesCancle, checkDelay, setCheckDelay, checkCancle, setCheckCancle, handleCheckCancle, handleCheckDelay, btnDisable } = props
    const [personeFormValidation, setPersoneFormValidation] = useState({});
    const [companyFormValidation, setCompanyFormValidation] = useState({});
    // const [checkDelay, setCheckDelay] = useState("N")
    // const [checkCancle, setCheckCancle] = useState("N")
    const [personel, setPersonel] = useState([])
    const [unit, setUnit] = useState([])
    const [Position, setEmpPosition] = useState([])
    const dispatch = useDispatch()



    const FormStructure = [

        {
            label: " تاریخ شروع",
            name: "fromDate",
            type: "date",
            col: 6,
            disabled: checkDelay == "Y" ? false : true,
            maxDate:FormValuesCancle.thruDate ?? ""


        },
        {

            label: " تاریخ پایان",
            name: "thruDate",
            type: "date",
            col: 6,
            disabled: checkDelay == "Y" ? false : true,
            minDate:FormValuesCancle.fromDate ?? ""



        },
        {
            label: " زمان شروع",
            name: "fromTime",
            type: "time",
            col: 6,
            disabled: checkDelay == "Y" ? false : true,



        },
        {
            label: " زمان پایان",
            name: "truTime",
            type: "time",
            col: 6,
            disabled: checkDelay == "Y" ? false : true,

        },
        // {
        //     label: "توضیحات",
        //     name: "discription",
        //     type: "textarea",
        //     col: 12,
        //     disabled: checkDelay == "Y" ? false : true,

        // },
    ]







    return (
        <Box >
            <Grid
                style={{ width: "100%", padding: 10 }}
                container
                direction="row"
                justify="center"
                alignItems="center"
            >


                <Box style={{ width: "90%", padding: 10 }}>
                    <Card style={{ padding: 10, borderColor: "black", borderWidth: 1, backgroundColor: bgColorCancel }} >
                        <Box style={{ display: "flex", alignItems: "center" }}>
                            {checkCancle == "N" ?
                                <RadioButtonUncheckedIcon onClick={handleCheckCancle} fontSize="small" />
                                :
                                < RadioButtonCheckedIcon onClick={handleCheckCancle} fontSize="small" />
                            }
                            <h1 style={{ marginRight: 10 }}>لغو دوره آموزشی</h1>
                        </Box>
                    </Card>
                </Box>
                <Box style={{ width: "90%", padding: 10 }}>

                    <Card style={{ padding: 10, borderColor: "black", borderWidth: 1, backgroundColor: bgColorDelay }} >
                        <Box style={{ display: "flex", alignItems: "center" }}>


                            {checkDelay == "N" ?
                                <RadioButtonUncheckedIcon onClick={handleCheckDelay} fontSize="small" />
                                :
                                < RadioButtonCheckedIcon onClick={handleCheckDelay} fontSize="small" />
                            }
                            <h1 style={{ marginRight: 10 }}>تعویق دوره آموزشی</h1>
                        </Box>
                        <FormPro
                            append={FormStructure}
                            formValues={FormValuesCancle}
                            setFormValues={setFormValuesCancle}


                        />
                    </Card>
                </Box>
                <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>
                    <Button type="submit" style={{ width: 120, height: 40, backgroundColor: btnBg, color: "white", marginRight: "86%", marginBottom: "2%" }}
                        disabled={btnDisable}
                        onClick={props.saveCancleNeedAssesment} >
                        تایید
                    </Button>
                </Box>
            </Grid>

        </Box>
    )
}


export default CancelNeedAssementForm;


