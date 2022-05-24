import React, { useState, useEffect } from 'react'
//tabs components
import BranchAddressList from './tabs/BranchAddressList'
import Info from './tabs/Institutions_Info'
import AssessmentTab from './tabs/AssessmentTab'



// material ui components
import { Button, Card, CardContent, Paper, Tabs, Tab, Typography, Grid } from '@material-ui/core';

// main components
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import TabPane from "../../../../../../components/TabPane";

// fuse components
import { FusePageSimple } from '@fuse';

// axois and axois confg

import axios from 'axios';
import { SERVER_URL } from '../../../../../../../../configs'


// redcer and redux

import { useDispatch , useSelector} from "react-redux";

import { ALERT_TYPES, setAlertContent } from "../../../../../../../store/actions/fadak";
import { useHistory, useParams } from 'react-router-dom';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';


const InstitueForm = (props) => {

    const { access, orgPartyId, setOrgPartyId, setCurrentData, courseIdPk, setCourseIdPk, setPtyRel, currentData, edit, setEdit } = props
    const [formValuesIns, setFormValuesIns] = useState()
    const [formValidation, setFormValidation] =React.useState({});
    const [value_test, setValue_test] = useState("")
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [fieldList,setFieldList] = useState({course : [] , companyPartyId : ""});
    const dispatch = useDispatch()


    const formInstitutions = [
        { name: "pseudoId", label: "کد موسسه", type: "text", required: true ,         
        validator: values=>{
            return new Promise(resolve => {
                if(values.pseudoId.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }},
        { name: "organizationName", label: " نام موسسه / مرکز آموزشی", type: "text", required: true,
        validator: values=>{
            return new Promise(resolve => {
                if(values.organizationName.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }},
        { name: "courseId", label: "دوره های قابل ارائه ", type: "multiselect", options: fieldList.course , optionLabelField: "title", optionIdField: "courseId", required: true, 
        filterOptions   : options => options.filter(o=>o.companyPartyId==fieldList.companyPartyId),
        validator: values=>{
            return new Promise(resolve => {
                if(values.courseId == "[]"){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
          }},
        { type: "component", component: (<div style={{ color: 'red' }} >{access ? '' : 'شما اجازه ثبت یا تغییر در این صفحه را ندارید'}</div>), col: 12 },
    ]

    const request_storInstitutions = () => {
        const data = {
            orgniaztion_obj: {
                organizationName: formValuesIns.organizationName,
                pseudoId: formValuesIns.pseudoId,
                partyRelationshipId: currentData?.resultRest4Pty?.RellPty?.partyRelationshipId ?? null,
                partyId: orgPartyId ?? null,
            },
            courseId: formValuesIns.courseId,
            courseIdPk: courseIdPk ?? null ,
            button_status: edit ? "edit" : "add"
        }

        const config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/training/addInstitutions`,
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
            data: data
        };
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'درحال ارسال اطلاعات'))
        axios(config).then(Response => {
            let pty = Response?.data?.resultResponse?.result_org?.partyId
            setPtyRel(Response?.data?.resultResponse?.ptyRel4Ins?.partyRelationshipId)
            setOrgPartyId(pty)
            setCourseIdPk(formValuesIns.courseId)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد '))
            setEdit(true)
        }).catch(err => dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات , کد سازمانی وارد شده تکراری میباشد')))

    }

    const stringify = () => {
        const list = []
        currentData?.resultRest4Pty?.partyCourse && currentData.resultRest4Pty.partyCourse.map(item => {
            const courseId = item.courseId
            list.push(courseId)
        })
        return list;
    }

    useEffect(() => {
        const arr = JSON.stringify([...stringify()]);  // '["a","b","c"]'
        const data = {
            "pseudoId": currentData?.resultRest4Pty?.RellPty?.pseudoId,
            "organizationName": currentData?.resultRest4Pty?.org?.organizationName,
            "courseId": `${arr}`
        }
        setFormValuesIns(Object.assign({}, { ...data }))
        setCourseIdPk(`${arr}`)
    }, [currentData])

    // useEffect(() => {
    //     const arr = JSON.stringify([...stringify()]);  // '["a","b","c"]'
    //     formValuesIns?.["courseId"] && setCourseIdPk(`${arr}`)
    // }, [formValuesIns?.["courseId"]])

    const getCourseFiledOptions = () => {
        axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmitFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
            }).then(res => {
            fieldList.course = res.data.course
            fieldList.companyPartyId =  res.data.userCompanyPartyId
            setFieldList(Object.assign({},fieldList))
        })
    }

    useEffect(() => {
        getCourseFiledOptions()
    }, [partyRelationshipId])

    return (
        <>
            < FormPro
                style={{ marginTop: 5 }}
                formValues={formValuesIns}
                setFormValues={setFormValuesIns}
                formValidation = {formValidation}
                setFormValidation = {setFormValidation}
                append={formInstitutions}
                setValue_test={setValue_test}
                value_test={value_test}
                actionBox={
                    access && <ActionBox>
                        <Button type="submit" role="primary">{edit ? "ویرایش" : "ثبت و افزودن موارد تکمیلی"}</Button>
                    </ActionBox>}
                submitCallback={request_storInstitutions}
            />
        </>
    )
}

function AddInstitutions() {
    const [orgPartyId, setOrgPartyId] = useState()
    const [value, setValue] = useState(0)
    const [currentData, setCurrentData] = useState()
    const [courseIdPk, setCourseIdPk] = useState()
    const [ptyRel, setPtyRel] = useState(false)
    const [access, setAccess] = useState(true)
    const [edit,setEdit] = useState(false)


    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const handleChange = (event, newValue) => {
        if (orgPartyId) {
            setValue(newValue)
        } else {
            setValue(newValue)

            // dispatch(setAlertContent(ALERT_TYPES.ERROR," اطلاعات موسسات را وارد کنید"))
        }
    }

    useEffect(() => {
        change()
    }, [])


    const getOrgData = () => {
        if (orgPartyId) {
            axios.get(`${SERVER_URL}/rest/s1/training/addInstitutions?partyId=${orgPartyId}`, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                }
            }).then(res_get_institutions => {
                setCurrentData(res_get_institutions.data)
            })
        }
    }
    useEffect(() => {
        if (orgPartyId) {
            axios.get(`${SERVER_URL}/rest/s1/training/accessInstitutions?partyId=${orgPartyId}`, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                }
            }).then(response_acc => setAccess(response_acc?.data?.resultResponse))

            getOrgData()

        }

    }, [orgPartyId])








    const change = () => {
        if (params.index) {
            setOrgPartyId(parseInt(params.index))
            setEdit(true)
        }
    }



    /*  ---------------
    ----------------  post request for add Institiu    --------------------------------------- */

    const handleGoBack = () => {

        history.push(`/InstitutionsAndlecturers`);

    }


    return (
        <FusePageSimple
            header={
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10">تعریف موسسات</Typography>
                    <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={handleGoBack}
                            startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button> 
                </div>
            }




            content={
                <>


                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <InstitueForm access={access} currentData={currentData} setCurrentData={setCurrentData} setPtyRel={setPtyRel} setOrgPartyId={setOrgPartyId}
                                     orgPartyId={orgPartyId} courseIdPk={courseIdPk} setCourseIdPk={setCourseIdPk} edit={edit} setEdit={setEdit} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


                    {edit ? 
                        <>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                            >
                                <Tab label=" اطلاعات تکمیلی" />
                                <Tab label=" اطلاعات ادرس (به زودی)" />
                                <Tab label=" معیار ارزیابی (به زودی)" />
                            </Tabs>
                            <TabPane value={value} index={0}>
                                <Info orgPartyId={orgPartyId} currentData={currentData} access={access} getOrgData={getOrgData}
                                    ALERT_TYPES={ALERT_TYPES} dispatch={dispatch} setAlertContent={setAlertContent} setCurrentData={setCurrentData} />
                            </TabPane>
                            <TabPane value={value} index={1}>
                                <BranchAddressList
                                    access={access}
                                    orgPartyId={orgPartyId}
                                    ALERT_TYPES={ALERT_TYPES} dispatch={dispatch} setAlertContent={setAlertContent} />
                            </TabPane>
                            <TabPane value={value} index={2}>
                                <AssessmentTab
                                    orgPartyId={orgPartyId}
                                    access={access}
                                    ptyRel={ptyRel}
                                    currentData = {currentData}
                                />
                            </TabPane>
                        </>
                    :""}
                </>
            }
        />

    )
}

export default AddInstitutions;
