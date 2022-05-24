

import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import { Box, Button, CardContent, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import axios from "axios";
import { SERVER_URL } from 'configs';

const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red",
        borderWidth: "0px",
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& label span": {
            color: "red"
        }


    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        },
        '& .MuiOutlinedInput-input:focused': {
            borderColor: 'green',
        }
    },

}));




const DetermineTestTimeForm = (props) => {
    const { formValuesDefineTestTime, setFormValuesDefineTestTime, myElement, bcolor, parentCallBack, setBcolor } = props
    const [formValidationDefineTestTime, setFormValidationDefineTestTime] = useState({});
    const [inValid, setInValid] = useState({ fromTime: false, duration: false, floatingTime: false })
    const [formValues, setFormValues] = useState({ statusId: "Y" })
    const [formValidation, setFormValidation] = React.useState({});
    const [todayServer, setTodayServer] = useState("");


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    // const formStructure = [
    //     {
    //         name: "startDate",
    //         label: "تاریخ ارسال فرم آزمون",
    //         type: "date",
    //         col: 6,
    //         withTime:true,
    //         required:true
    //     }, {
    //         name: "thruDate",
    //         label: " مهلت تکمیل آزمون به ساعت",
    //         type: "number",
    //         col: 6,
    //         required:true

    //     }]

    const moment = require('moment-jalaali')
    var today = moment(new Date(new Date().getTime())).format("Y-MM-DD")



    function getNowDateTime() {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                // resolve(res.data.nowDateTime)
                setTodayServer(res.data.nowDateTime)

            }).catch(err => {
                reject(err)
            });
        })



    }

    useEffect(() => {
        getNowDateTime()

    }, [])

    const formStructure = [
        {
            name: "startDate",
            label: "تاریخ ارسال فرم آزمون",
            type: "date",
            col: 6,
            withTime: true,
            required: true,
            minDate: todayServer,
        },
        {
            name: "thruDate",
            label: " مهلت تکمیل آزمون به ساعت",
            type: "component",
            component:
                <Box
                    style={{
                        borderRadius: 5, backgroundColor: "white", borderColor: bcolor, borderWidth: 1, borderStyle: "solid",

                        control: (base, state) => ({
                            ...base,
                            '&:hover': { borderColor: 'red' }, // border style on hover
                            border: '1px solid lightgray', // default border color
                            boxShadow: 'none', // no box-shadow
                        }),
                    }}
                >
                    <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="floatingTime" formValidation={formValidation} label=" مهلت تکمیل آزمون به ساعت"
                        setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} required={true} />
                </Box >
            ,
            col: 6,
            required: true

        }
    ]
    useEffect(() => {
        parentCallBack(formValues)
        setBcolor("white")
    }, [formValues])


    const handle_submit = () => {

    }





    return (

        <Card style={{ padding: "20%" }}>
            <Card style={{ padding: 1, backgroundColor: "#ddd" }}>
                <Card >
                    <CardContent style={{ padding: "10% 5% 10%" }}>
                        <FormPro
                            formValues={formValuesDefineTestTime}
                            setFormValues={setFormValuesDefineTestTime}
                            append={formStructure}
                            formValidation={formValidationDefineTestTime}
                            setFormValidation={setFormValidationDefineTestTime}
                            actionBox={<ActionBox style={{ display: "none" }}>
                                <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                            </ActionBox>}
                            submitCallback={handle_submit}
                        />
                    </CardContent>
                </Card>
            </Card>
        </Card>


    );
};

export default DetermineTestTimeForm;








function DurationField(props) {

    const classes = useStyles();
    const helperTestClasses = helperTextStyles();
    const cx = require("classnames");

    const { formValues, setFormValues, fieldName, formValidation, setFormValidation, inValid, setInValid, label, required, readOnly = false, disabled = false,
        validationCallback = () => { return new Promise((resolve, reject) => { resolve() }) } } = props

    const handleOnChange = (e) => {
        setFormValidation(Object.assign({}, formValidation, { [fieldName]: false }))
        setFormValues(Object.assign({}, formValues, {
            [fieldName]: `${(e?.target?.value[0] && e?.target?.value[0] !== ":") ? e?.target?.value[0] : ""}
                                                                  ${(e?.target?.value[1] && e?.target?.value[1] !== ":") ? (e?.target?.value[1] + ":") : ""}
                                                                  ${(e?.target?.value[3] && e?.target?.value[3] !== ":") ? e?.target?.value[3] : ""}
                                                                  ${(e?.target?.value[4] && e?.target?.value[4] !== ":") ? e?.target?.value[4] : ""}`
        }))
    }

    React.useEffect(() => {
        if (formValues[fieldName] && formValues[fieldName] != "") {
            formValues[fieldName] = formValues[fieldName].replace(/[^:0-9]/gi, "");
            setFormValues(Object.assign({}, formValues))
        }
    }, [formValues[fieldName]])

    const validation = () => {
        if (formValues[fieldName] !== "" && formValues[fieldName]) {
            if (formValues[fieldName].length !== 5) {
                setInValid(Object.assign({}, inValid, { [fieldName]: true }))
            } else {
                var minutes = 0
                var hoursMinutes = ""
                hoursMinutes = formValues[fieldName].split(/[.:]/);
                minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                if (minutes > 59) {
                    setInValid(Object.assign({}, inValid, { [fieldName]: true }))
                }
                if (minutes < 59) {
                    validationCallback().then(() => {
                        setInValid(Object.assign({}, inValid, { [fieldName]: false }))
                    }).catch(() => {
                        setInValid(Object.assign({}, inValid, { [fieldName]: true }))
                    })
                }
            }
        }
        if (formValues[fieldName] === "" || !formValues[fieldName]) {
            setInValid(Object.assign({}, inValid, { [fieldName]: false }))
        }
    }

    return (
        <TextField
            // key={readOnly ? formValues[fieldName] : ""}
            required={required}
            disabled={disabled}
            id="required"
            value={formValues[fieldName]}
            onChange={(e, newData) => handleOnChange(e)}
            placeholder="__:__"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 5 }}
            // error={inValid[fieldName]|| formValidation[fieldName]}
            // helperText={inValid[fieldName] ? "ساعت وارد شده معتبر نمي باشد ." : (formValidation[fieldName] == true) ? "تعیین این فیلد الزامی است!" : ""}
            onBlur={validation}
            label={label}
            className={cx(readOnly && "read-only", (inValid[fieldName] || formValidation[fieldName]) ? classes.root : classes.formControl)}
            FormHelperTextProps={{ classes: helperTestClasses }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <AccessTimeIcon style={{ color: "#979797" }} />
                    </InputAdornment>
                )
            }}
        />

    )
}









