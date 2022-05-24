import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import { ALERT_TYPES, setAlertContent, setUser, setUserId } from "../../../../store/actions/fadak";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from 'react-router-dom';
import { get } from 'lodash';


const ExForm = ({ formStructure }) => {
    const [formValues, setFormValues] = useState([])

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}

            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}

        />
    )
}

export default function WorkingFactorsForm() {

    const [formValues, setFormValues] = useState([])
    const [formValues2, setFormValues2] = useState([])
    const [verifList, setVerifList] = useState([])
    const [excProgId, setExcProgId] = useState()
    const [activeExc, setActiveExc] = useState()
    const [excSuggId, setExcSuggId] = useState()
    const handleReset = () => { }
    const handleReset2 = () => { }
    const [tableContent, setTableContent] = useState([])
    const [fieldsData, setFieldsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)
    const handleEdit = () => { }
    const handlerRemove = () => { }
    const [tableContentRegistration, setTableContentRegistration] = useState([])
    const [loadingRegistration, setLoadingRegistration] = useState(true)
    const handleEditRegistration = () => { }
    const handlerRemoveRegistration = () => { }
    const dispatch = useDispatch();


    const handleSubmit = () => {
        axios.post(SERVER_URL + "/rest/s1/exellence/progDeff", { formValues: formValues, verif: verifList }, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }).then(res => {

            setExcProgId(res.data.excProgId)
            setExcSuggId(res.data.excSuggId)
            setFormValues({})

        }).catch(err => {
        })
    }

    const handleSubmit2 = () => {
        let data = { ...formValues2, excProgId: excProgId, excSuggId: excSuggId }
        setVerifList((prevState) => {
            console.log("dkdajvajvkavadv", data)

            let VerifTable = [...prevState]
            let FindVerifTable = VerifTable.find(ele => ele.verificationType === data.verificationType && ele.emplPosition === data.emplPosition)
            setFormValues2({})
            if (!FindVerifTable) {
                return [...VerifTable, data]
            } else {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'ریکورد تکراری است.'));
            }

                return VerifTable
        })

    }

    const formStructure2 = [
        {
            name: "verificationType",
            label: " نوع ساختار تایید ",
            type: "select",
            options: fieldsData?.verificationAccess,
            optionLabelField: "description",
            optionIdField: "enumId",
            required:true,

        },
        {
            name: "emplPosition",
            label: " پست سازمانی",
            type: "select",
            options: fieldsData?.emplPosition,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            required:true,

        },
        {
            name: "verificationAccess",
            label: "انواع دسترسی ها",
            type: "multiselect",
            options: fieldsData?.verificationAction,
            optionLabelField: "description",
            optionIdField: "enumId",
            required:true,

        },
        {
            name: "sequence",
            label: "ترتیب ارسال جهت تایید",
            type: "number",
        }
    ]

    const tableCols = [
        {
            name: "sequence",
            label: "ترتیب ارسال جهت تایید",
            type: "number"
        },
        {
            name: "verificationType",
            label: " نوع ساختار تایید ",
            type: "select",
            options: fieldsData?.verificationAccess,
            optionLabelField: "description",
            optionIdField: "enumId",
        },
        {
            name: "emplPosition",
            label: " پست سازمانی",
            type: "select",
            options: fieldsData?.emplPosition,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
        },
        {
            name: "verificationAccess",
            label: "انواع دسترسی ها",
            type: "multiselect",
            options: fieldsData?.verificationAction,
            optionLabelField: "description",
            optionIdField: "enumId",
        },




    ]

    const tableColsRegistration = [
        {
            name: "excProgCode",
            label: " کد برنامه",
            type: "text",
        },
        {
            name: "title",
            label: " عنوان برنامه ",
            type: "text",
        },
        {
            // name: "objectivesEnumId",
            // label: "هدف برنامه",
            // type: "multiselect",
            // options: tableContent?.programObjectives,
            // optionLabelField: "description",
            // optionIdField: "enumId",

            name: "objectivesEnumId",
            label: "هدف برنامه",
            type: "multiselect",
            options: fieldsData?.programObjectives,
            optionLabelField: "description",
            optionIdField: "enumId",
        },
        {
            // name: "companyPartyId",
            // label: " شرکت ",
            // type: "select",
            // options: tableContent?.company,
            // optionLabelField: "organizationName",
            // optionIdField: "partyId",

            name: "companyPartyId",
            label: " شرکت ",
            type: "select",
            options: fieldsData?.company,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
        },
        {
            name: "participantQueId",
            label: " فرم ارزیابی مخاطب (ویژه مربی) ",
            type: "select",
            options: fieldsData?.participantQue,
            optionLabelField: "title",
            optionIdField: "questionnaireId",


        },
        {
            name: "progQueId",
            label: " فرم ارزیابی برنامه توسط مخاطب ",
            type: "select",
            options: fieldsData?.progQue,
            optionLabelField: "title",
            optionIdField: "questionnaireId",

        },
        {
            name: "progResponsibleQueAppId",
            label: " فرم ارزیابی برنامه توسط مسئول ",
            type: "select",
            options: fieldsData?.progResponsibleQueApp,
            optionLabelField: "title",
            optionIdField: "questionnaireId",

        },
        {
            label: "قابلیت ثبت نام",
            name: "enrollmentAbility",
            type: "switch",
        },
        {

            name: "familyMemberEnumId",
            label: " نحوه ثبت نام ",
            type: "multiselect",
            options: fieldsData?.enrollmentType,
            optionLabelField: "description",
            optionIdField: "enumId",

            // name: "objectivesEnumId",
            // label: "هدف برنامه",
            // type: "multiselect",
            // options: fieldsData?.programObjectives,
            // optionLabelField: "description",
            // optionIdField: "enumId",
            // name: "familyMemberEnumId",
            // label: " نحوه ثبت نام ",
            // type: "multiselect",
            // options: fieldsData?.enrollmentType,
            // optionLabelField: "description",
            // optionIdField: "enumId",
        }, 
        {
            label: "توضیحات",
            name: "description",
            type: "text",
            // col: 12
        }
    ]

    const formStructure = [
        {
            name: "excProgCode",
            label: "کد برنامه",
            type: "text",
            required:true,
            
        },
        {
            name: "title",
            label: "عنوان برنامه ",
            type: "text",
            required:true,
            
        },
        {
            name: "objectivesEnumId",
            label: "هدف برنامه",
            type: "multiselect",
            options: fieldsData?.programObjectives,
            optionLabelField: "description",
            optionIdField: "enumId",
            required:true,

        },
        {
            name: "companyPartyId",
            label: " شرکت ",
            type: "select",
            options: fieldsData?.company,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            required:true,

        },
        {
            name: "participantQueId",
            label: " فرم ارزیابی مخاطب (ویژه مربی) ",
            type: "select",
            options: fieldsData?.participantQue,
            optionLabelField: "title",
            optionIdField: "questionnaireId",
            required:true,

        },
        {
            name: "progQueId",
            label: " فرم ارزیابی برنامه توسط مخاطب ",
            type: "select",
            options: fieldsData?.progQue,
            optionLabelField: "title",
            optionIdField: "questionnaireId",
            required:true,

        },
        {
            name: "progResponsibleQueAppId",
            label: " فرم ارزیابی برنامه توسط مسئول ",
            type: "select",
            options: fieldsData?.progResponsibleQueApp,
            optionLabelField: "title",
            optionIdField: "questionnaireId",
            required:true,

        },
        {
            label: "قابلیت ثبت نام",
            name: "enrollmentAbility",
            type: "switch",
            required:true,

        },
        {
            name: "familyMemberEnumId",
            label: " نحوه ثبت نام ",
            type: "multiselect",
            options: fieldsData?.enrollmentType,
            optionLabelField: "description",
            optionIdField: "enumId",
            required:true,

        }


        , {
            label: "توضیحات",
            name: "description",
            type: "textarea",
            col: 12
        }
    ]


    React.useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/exellence/progDef", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            console.log("res", res)
            console.log("res.data.excellenceProgramDefinition", res.data.excellenceProgramDefinition)
            console.log("res.data", res.data)
            setFieldsData(res.data)
            setTableContent(res.data.excellenceProgramDefinition)
            setLoadingRegistration(false)
            
            getVerifList()

        }).catch(err => {
            console.log('get org error..', err);
        });
    }, []);

    React.useEffect(() => {
        setTableContentRegistration(verifList)
    }, [verifList]);

    const getVerifList = () => {
        if (excProgId) {
            setLoading2(true)
            axios.get(SERVER_URL + "/rest/s1/exellence/progDefManager?excProgId=" + excProgId + "&excSuggId=" + excSuggId, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(res2 => {
                console.log("res2", res2)
                // setFieldsData(res.data)
                setVerifList(res2.data.verificationLevel)
                setLoading2(false)
            }).catch(err => {
                console.log('get org error..', err);
            });
        }

    }

    return (
        <FusePageSimple
        header={<Box>
            <CardHeader title={'تعريف برنامه تعالی'} />
        </Box>}
                    content={
                <Box p={2}>
                    <Card>
                        <CardContent>
                            {console.log("fieldsData :: ", fieldsData)}
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                actionBox=
                                {<ActionBox>
                                    {/* <Button type="submit" role="primary">افزودن</Button> */}
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>}
                            />

                            <Box m={2} />

                            <Box p={2}>
                                <Card>
                                    <CardContent>
                                        <Box m={2} />
                                        <FormPro
                                            prepend={formStructure2}
                                            formValues={formValues2}
                                            setFormValues={setFormValues2}
                                            actionBox=
                                            {<ActionBox>
                                                <Button type="submit" role="primary">افزودن</Button>
                                                <Button type="reset" role="secondary">لغو</Button>
                                            </ActionBox>}
                                            submitCallback={handleSubmit2}
                                            resetCallback={handleReset2}
                                        />

                                        <TablePro
                                            title="تایید مدیران ارشد"
                                            columns={tableCols}
                                            rows={tableContentRegistration}
                                            setRows={setTableContentRegistration}
                                            loading={loading2}
                                            edit="callback"
                                            editCallback={handleEditRegistration}
                                            delete="inline"
                                            removeCallback={handlerRemoveRegistration}
                                        />

                                    </CardContent>

                                </Card>
                                
                                <Box m={2} />

                                    <ActionBox>
                                        <Button type="submit" onClick={handleSubmit} role="primary">افزودن</Button>
                                        <Button type="reset" role="secondary">لغو</Button>
                                    </ActionBox>
                                    </Box>
                                    <TablePro

                                        title="برنامه ها"
                                        columns={tableColsRegistration}
                                        rows={tableContent}
                                        setRows={setTableContent}
                                        loading={loadingRegistration}
                                        edit="callback"
                                        editCallback={handleEdit}
                                        delete="inline"
                                        removeCallback={handlerRemove}

                                    />
                                </CardContent>

                            </Card>
                    <Box m={2} />
                </Box>
            }
        />
    )
}