
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../configs";
import { Box, Button, Card, Grid, Dialog } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormPro from 'app/main/components/formControls/FormPro';
import { ALERT_TYPES, openDialog, setAlertContent } from 'app/store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import ActionBox from 'app/main/components/ActionBox';

const DeterminationResponsibleForm = (props) => {
    const { personeFormValues, setPersoneFormValues, companyFormValues, setCompanyFormValues, checkPerson, setCheckPerson, checkCompany, setCheckCompany, myElement } = props
    const [personeFormValidation, setPersoneFormValidation] = useState({});
    const [companyFormValidation, setCompanyFormValidation] = useState({});
    const [personel, setPersonel] = useState([])
    const [unit, setUnit] = useState([])
    const [Position, setEmpPosition] = useState([])
    const [bgColorPerson, setbgColorPerson] = useState("#dddddd")
    const [bgColorCompany, setbgColorCompany] = useState("#dddddd")
    const [btnBg, setBtnBg] = useState("#dddddd")
    const [loading, setLoading] = useState(true)
    const [opendialog, setOpenDialog] = useState(false)



    const dispatch = useDispatch()

    const personelFormStructure = [{
        label: " کد پرسنلی",
        name: "pseudoId",
        type: "select",
        options: personel,
        optionIdField: "pseudoId",
        optionLabelField: "pseudoId",
        disabled: checkPerson == "Y" ? false : true,
        col: 4
    }, {
        label: "نام و نام خانوادگی ",
        name: "fullName",
        type: "text",
        disabled: checkPerson == "Y" ? false : true,
        col: 4
    }, {
        label: "    کد ملی",
        name: "nationalId",
        type: "text",
        disabled: checkPerson == "Y" ? false : true,
        col: 4

    }
    ]


    const companyFormStructure = [
        {

            label: "واحد سازمانی",
            name: "unit",
            type: "select",
            options: unit,
            optionIdField: "partyId",
            optionLabelField: "organizationName",
            disabled: checkCompany == "Y" ? false : true,
            type: "select",
            col: 4,

        },
        {

            label: "پست سازمانی",
            name: "empPosition",
            options: Position,
            optionIdField: "enumId",
            optionLabelField: "description",
            disabled: checkCompany == "Y" ? false : true,
            type: "select",
            col: 4,
            filterOptions: options => companyFormValues["unit"] ? options.filter((item) => companyFormValues["unit"] == item.parentEnumId) : options,
            required: true
        },
        {
            label: " لیست کارمندان",
            name: "personel",
            options: personel,
            optionIdField: "partyId",
            optionLabelField: "fullName",
            disabled: checkCompany == "Y" ? false : true,
            type: "select",
            col: 4,
            filterOptions: options => companyFormValues["empPosition"] ? options.filter((item) =>
                item.emplPositionIds.indexOf(companyFormValues["empPosition"]) >= 0
            ) :
                companyFormValues["unit"] ? options.filter((item) =>
                    companyFormValues["unit"] == item.unitOrganization
                ) :
                    options,

            required: true
        }
    ]
    const handleCheckPerson = () => {
        if (checkPerson == "N") {
            setbgColorPerson("#FFF")
            setbgColorCompany("#dddddd")
            setCheckPerson('Y')
            setCheckCompany('N')
            setCompanyFormValues([])
        }
        else {
            setCheckPerson('N')
            setbgColorPerson("#dddddd")
        }


    }
    const handleCheckCompany = () => {
        if (checkCompany == "N") {
            setbgColorCompany("#FFF")
            setbgColorPerson("#dddddd")
            setCheckCompany('Y')
            setCheckPerson('N')
            setPersoneFormValues([])
        }
        else {
            setCheckCompany('N')
            setbgColorCompany("#dddddd")
        }

    }
    useEffect(() => {
        if (checkPerson === "Y" || checkCompany === "Y") {
            setBtnBg("#24a0ed")
        }
        else {
            setBtnBg("#dddddd")
        }


    }, [checkCompany, checkPerson]);

    let empPosition = companyFormValues?.empPosition



    // useEffect(() => {
    //     if (companyFormValues?.empPosition?.length !== undefined && empPosition!== null) {
    //         axios.post(SERVER_URL + "/rest/s1/training/getPersonalName", { empPosition:empPosition }, {
    //             headers: { 'api_key': localStorage.getItem('api_key') }
    //         }).then(res => {
    //             setOpenDialog(false)
    //             setCompanyFormValues(prevstate => ({ ...prevstate, personel: res.data.result[0]?.fullName }))


    //         }).catch(() => {
    //             dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
    //         });
    //     }
    //     else
    //         setCompanyFormValues(prevstate => ({ ...prevstate, personel: "" }))
    // }, [companyFormValues?.empPosition]);


    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessments", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonel(res.data.contacts.employees.party)
            setUnit(res.data.contacts.units)
            setEmpPosition(res.data.contacts.posts)



        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }, []);



    let data = {
        pseudoId: personeFormValues?.pseudoId,

    }
    useEffect(() => {
        axios.post(SERVER_URL + "/rest/s1/training/getPersonalCode", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setOpenDialog(false)

            if (personeFormValues?.pseudoId === null || personeFormValues?.pseudoId === undefined) {
                setPersoneFormValues(prevstate => ({ ...prevstate, fullName: "" }))
                setPersoneFormValues(prevstate => ({ ...prevstate, nationalId: "" }))
            }
            else {
                setPersoneFormValues(prevstate => ({ ...prevstate, fullName: res.data.result?.firstName + " " + res.data.result?.lastName }))
                setPersoneFormValues(prevstate => ({ ...prevstate, nationalId: res.data.resultNationalCode?.idValue }))
            }

        }).catch(() => {
        });

    }, [personeFormValues?.pseudoId]);
    let personelData = {
        fullName: companyFormValues?.personel

    }


    useEffect(() => {
        if (personeFormValues?.pseudoId?.length !== undefined) {

            setOpenDialog(true)
        }
    }, [personeFormValues.pseudoId]);
    const handle_submit = () => { }
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
                    <Card style={{ padding: 10, borderColor: "black", borderWidth: 1, backgroundColor: bgColorPerson }}>
                        {checkPerson == "N" ?
                            <RadioButtonUncheckedIcon onClick={handleCheckPerson} fontSize="small" />
                            :
                            < RadioButtonCheckedIcon onClick={handleCheckPerson} fontSize="small" />
                        }
                        <FormPro
                            append={personelFormStructure}
                            formValues={personeFormValues}
                            setFormValues={setPersoneFormValues}
                            setFormValidation={setPersoneFormValidation}
                            formValidation={personeFormValidation}

                        />
                    </Card>
                </Box>
                <Box style={{ width: "90%", padding: 10 }}>


                    <Card style={{ padding: 10, borderColor: "black", borderWidth: 1, backgroundColor: bgColorCompany }}>
                        {checkCompany == "N" ?
                            <RadioButtonUncheckedIcon onClick={handleCheckCompany} fontSize="small" />
                            :
                            < RadioButtonCheckedIcon onClick={handleCheckCompany} fontSize="small" />
                        }
                        <FormPro
                            append={companyFormStructure}
                            formValues={companyFormValues}
                            setFormValues={setCompanyFormValues}
                            setFormValidation={setCompanyFormValidation}
                            formValidation={companyFormValidation}
                            actionBox={<ActionBox style={{ display: "none" }}>
                                <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                            </ActionBox>}
                            submitCallback={handle_submit}

                        />
                    </Card>
                </Box>
                <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>
                    <Button type="submit" style={{ width: 120, height: 40, backgroundColor: btnBg, color: "white", marginRight: "86%", marginBottom: "2%" }} onClick={props.saveDetarmination} >
                        تایید
                    </Button>
                </Box>
            </Grid>
            <Dialog open={opendialog} PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: 100,
                    height: 100,
                    borderWidth: 0
                },
            }} >
                <CircularProgress />
            </Dialog>

        </Box>
    )
}


export default DeterminationResponsibleForm;


