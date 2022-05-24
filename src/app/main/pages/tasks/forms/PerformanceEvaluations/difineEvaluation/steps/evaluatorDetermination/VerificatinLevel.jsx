import React, { useState, useEffect,useRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Collapse, Tooltip } from "@material-ui/core";
import ActionBox from 'app/main/components/ActionBox';
import TablePro from 'app/main/components/TablePro';
import { useDispatch } from "react-redux";
import { SERVER_URL } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import { setAlertContent, ALERT_TYPES } from 'app/store/actions';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { ToggleButton } from '@material-ui/lab';
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FusePageSimple } from '@fuse';


const VerificatinLevel = (props) => {

    const { verificationTableContent, setVerificationTableContent, verificationTitle } = props
    const [initData, setInitData] = useState([]);
    const [formValuesVerif, setFormValuesVerif] = useState({});
    const dispatch = useDispatch();
    const [loading,setLoding]=useState(true)
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const [typeAccess, settypeAccess] = useState([]);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const verificationTableCols = [
        {
            name: "sequence",
            label: " ترتیب انجام ",
            type: "text",
            style: { minWidth: "130px" },
        },
        // {
        //     name: "pseudoId",
        //     label: "کد پرسنلی",
        //     type: "text",
        //     style: { minWidth: "130px" },
        // },
        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: initData.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            style: { minWidth: "130px" },

        },
        {
            name: "typeAccess",
            label: "انواع دسترسی",
            type: "multiselect",
            options: typeAccess,
            optionLabelField: "description",
            optionIdField: "enumId",
            style: { minWidth: "150px" },

        },
        // {
        //     name: "modify",
        //     label: "امکان رد برای اصلاح",
        //     type: "indicator",
        //     style: { minWidth: "130px" },
            
        // },
        // {
        //     name: "reject",
        //     label: "امکان رد",
        //     type: "indicator",
        //     style: { minWidth: "130px" },
        // },
    ];



    useEffect(() => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=ResultEvaluationObj", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

            settypeAccess(res.data.result)
        }).catch(err => {
        });

    }, [])


    useEffect(() => {
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(response => {


            // axios
            //     .get(
            //         SERVER_URL + "/rest/s1/training/getNeedsAssessments",
            //         axiosKey
            //     )
            //     .then((res) => {

            //         const orgMap = {
            //             positions: res.data.contacts.posts.filter(post => res.data.contacts.units.filter(item => item.parentOrg === response.data.result[0].companyPartyId).find(unit => (unit.partyId === post.parentEnumId))),
            //             units: res.data.contacts.units.filter(item => item.parentOrg === response.data.result[0].companyPartyId),

            //         };
            //         setInitData(orgMap);
            //     })
            //     .catch(() => {
            //     });




                axios
                .get(
                    SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
                    axiosKey
                )
                .then((res) => {
                    const orgMap = {
                        units: res.data.data.units,
                        subOrgans: res.data.data.companies.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                        positions: res.data.data.emplPositions.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                        employees: res.data.data.persons.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                    };
                    setInitData(orgMap);
                    setLoding(false)

                })
                .catch(() => { });
        }).catch(err => { });
    }, []);




    const handleRemove = (row) => {

        return new Promise((resolve, reject) => {
            const listTableContent = [...verificationTableContent];
            let fList = listTableContent.findIndex(ele => ele.emplPositionId === row.emplPositionId)
            let reduser = listTableContent.splice(fList, 1)
            setVerificationTableContent(listTableContent)


        })

    }

    useEffect(() => {
        scrollToRef()
    }, [])

    return (
       
            <Card ref={myRef}>
                <CardContent>
                    <TablePro
                        title={verificationTitle}
                        columns={verificationTableCols}
                        rows={verificationTableContent}
                        setRows={setVerificationTableContent}
                        loading={loading}
                        add="external"
                        addForm={<Form formValues={formValuesVerif} setFormValues={setFormValuesVerif} initData={initData} verificationTableContent={verificationTableContent} setVerificationTableContent={setVerificationTableContent} typeAccess={typeAccess} />}
                        edit="external"
                        editForm={<Form formValues={formValuesVerif} setFormValues={setFormValuesVerif} editing={true} initData={initData} verificationTableContent={verificationTableContent} setVerificationTableContent={setVerificationTableContent} typeAccess={typeAccess} />}
                        removeCallback={handleRemove}
                    />
                </CardContent>
            </Card>
      
        
    );
};

export default VerificatinLevel;






function Form({ editing = false, ...restProps }) {

    const { formValues, setFormValues, handleClose, initData, verificationTableContent, setVerificationTableContent, typeAccess } = restProps;
    const [formValidationVerif, setFormValidationVerif] = useState({});
    const dispatch = useDispatch();

    const formStructure = [
        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: initData.positions,
            optionLabelField: "description",
            required: true,
            optionIdField: "emplPositionId",
            col: 3,
        },
        {
            name: "sequence",
            label: "ترتیب ارسال جهت تایید",
            required: true,
            type: "number",
            col: 3,
        },
        {
            name: "typeAccess",
            label: "انواع دسترسی",
            type: "multiselect",
            options: typeAccess,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
        },
        // {
        //     name: "modify",
        //     label: "امکان رد برای اصلاح",
        //     type: "indicator",
        //     col: 3,
        // },

        // {
        //     name: "reject",
        //     label: "امکان رد",
        //     type: "indicator",
        //     col: 3,
        // },
    ]

    useEffect(() => {
        let filterList = []
        if (editing) {
            filterList = verificationTableContent.filter(el => el.emplPositionId !== formValues.emplPositionId)
            setVerificationTableContent(filterList)
        }

    }, [formValues])

    const submitVerificationLevel = () => {
        if (!editing) {

            if (formValues?.typeAccess?.includes("Modify"))
                formValues.modify = "Y"
            if (formValues?.typeAccess?.includes("Reject"))
                formValues.reject = "Y"

            let array = []
            array.push(formValues)

            if (verificationTableContent?.findIndex(i => i?.sequence === formValues?.sequence) > -1 && verificationTableContent?.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "شماره ترتیب و پست انتخاب شده تکراری است!"));
            else if (verificationTableContent?.findIndex(i => i?.sequence === formValues?.sequence) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "شماره ترتیب انتخاب شده تکراری است!"));

            else if (verificationTableContent?.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "   پست انتخاب شده تکراری است!"));



            else if (verificationTableContent?.findIndex(i => i?.sequence === formValues?.sequence) <= -1 && verificationTableContent?.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) <= -1) {

                setVerificationTableContent(prevState => { return [...prevState, ...array] })
                setFormValues([])
            }

        }
        if (editing) {

            if (formValues?.typeAccess?.includes("Modify"))
                formValues.modify = "Y"
            if (formValues?.typeAccess?.includes("Reject"))
                formValues.reject = "Y"

            let array = []
            array.push(formValues)

            if (verificationTableContent.findIndex(i => i?.sequence === formValues?.sequence) > -1 && verificationTableContent.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "شماره ترتیب و پست انتخاب شده تکراری است!"));
            if (verificationTableContent.findIndex(i => i?.sequence === formValues?.sequence) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "شماره ترتیب انتخاب شده تکراری است!"));

            if (verificationTableContent.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) > -1)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "   پست انتخاب شده تکراری است!"));

            else if (verificationTableContent.findIndex(i => i?.sequence === formValues?.sequence) <= -1 && verificationTableContent.findIndex(i => i?.emplPositionId === formValues?.emplPositionId) <= -1) {

                setVerificationTableContent(prevState => { return [...prevState, ...array] })
                setFormValues({})
                handleClose()

            }


        }

    }

    const handleReset = () => {
        setFormValues({})
        handleClose()
        if(editing)
        {
            let array = []
            array.push(formValues)
            setVerificationTableContent(prevState => { return [...prevState, ...array] })


        }
    }

    return (


        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidationVerif}
            setFormValidation={setFormValidationVerif}
            append={formStructure}
            submitCallback={() => {

                submitVerificationLevel()


            }}

            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"

                >{editing ? "ویرایش" : "افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}

        />
    )
}