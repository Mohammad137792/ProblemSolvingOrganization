import React, { useState, useEffect } from 'react'
//material component
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Box, Card, CardContent } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import { Button, } from "@material-ui/core";
import ActionBox from "../../../../../components/ActionBox";
import AddIcon from "@material-ui/icons/Add";

//fadak component
import TablePro from 'app/main/components/TablePro';
// axios 
import { SERVER_URL } from './../../../../../../../configs'
import axios from 'axios';

import {  useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";

import Instructors from './../Instructors/Instructors'

import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
 
function InstitutionsForm({ data, handler_search, setReset, setLoading, fieldList, setFieldList }) {

    const [formValues, setFormValues] = useState();

    const qualificationStatusId = useSelector(state => state.fadak.constData.list.instituteQualification)

    const [companyField,setCompanyField] = useState(data?.mainOrg)

    const [instituteField,setInstituteField] = useState(fieldList.institute ?? [])

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        { name: "pseudoId", label: 'کد موسسه', type: 'text' },
        { name: "toPartyId", label: 'نام موسسه', type: 'select', options: instituteField , optionLabelField: "organizationName", optionIdField: "partyId" },
        // filterOptions   : options => formValues?.companyPartyId ? options.filter(o=>o.companyPartyId==formValues.companyPartyId) :  options.filter(o=>o.companyPartyId)},
        { name: "propertyType", label: 'نوع مالکیت', type: 'select', options: data?.mainPropertyType },
        { name: "major", label: 'زمینه فعالیت', type: 'text' },
        { name: "course",  label:  "دوره های قابل ارائه",type:   "multiselect", options: fieldList.course , optionLabelField: "title", optionIdField: "courseId"  },
        { name: "licence", label: 'محل اخذ مجوز', type: 'text' },
        { name: "qualificationStatusId", label: ' وضعیت صلاحیت', type: 'select', options: qualificationStatusId, optionLabelField: "description", optionIdField: "statusId" },
        { name: "companyPartyId", label: ' شرکت بررسی کننده', type: 'select', options: companyField , optionLabelField: "organizationName", optionIdField: "partyId" },
        { name: "institueDisabled",  label:  "وضعیت موسسه",type:   "select",options: [{enumId: "N", description: "فعال"},   {enumId: "Y", description: "غیر فعال"}]  },
    ]

    useEffect(() => {
        const institute = formValues?.companyPartyId ? fieldList.institute.filter(o=>o.companyPartyId==formValues.companyPartyId) :  fieldList.institute.filter(o=>o.companyPartyId)
        setInstituteField(institute)
    }, [formValues?.companyPartyId,fieldList.institute])

    useEffect(() => {
        if(!formValues?.toPartyId || formValues?.toPartyId == ""){setCompanyField(data?.mainOrg)}
        else{
            axios.get(`${SERVER_URL}/rest/s1/training/companyOfInstitute?institute=${formValues.toPartyId}` , axiosKey).then(res => {
                setCompanyField(res.data.result)
            })
        }
    }, [formValues?.toPartyId , data])

    const handleReset = () => {
        setLoading(true)
        setReset(true)
    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues} setFormValues={setFormValues}
            submitCallback={() => handler_search(formValues)}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            resetCallback={handleReset}
        />
    )
}

function Institutions() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const [reset,setReset] = useState(true);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [fieldList,setFieldList] = useState({ institute : [] , companyPartyId : "" , course : []});
    const history = useHistory()
    const dispatch = useDispatch()

    const tableCols = [
        { name: "pseudoId", label: 'کد موسسه', type: 'text' },
        { name: "organizationName", label: 'نام موسسه', type: 'text' },
        { name: "propertyTypeEnumId", label: 'نوع مالکیت', type: 'select' , options : "PropertyType" },
        { name: "licence", label: 'محل اخذ مجوز', type: 'text' },
        { name: "orgnizationCourseTitle", label: 'دوره های قابل ارائه', type: 'text' },
        { name: "qualificationStatusId", label: 'بررسی وضعيت صلاحيت', type: 'text' },
    ]

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const getData = () => {
        if(fieldList?.companyPartyId){
            axios.post(`${SERVER_URL}/rest/s1/training/instituteFilter` ,  {formValues : {companyPartyId:fieldList?.companyPartyId , institueDisabled : "N" }} , axiosKey).then(res => {
                const tableData = handler_createTable(res.data?.filter)
                setTableContent(tableData)
                setLoading(false)
                setReset(false)
            })
            axios.get(`${SERVER_URL}/rest/s1/training/mainOrgization`, axiosKey).then(response => {
                setData(prevState => ({ ...prevState, mainOrg: response.data }))
            })
            axios.get(`${SERVER_URL}/rest/s1/training/addInstitutions/searchData`, axiosKey).then(res_get_institutions => {

                const tableData = handler_createTable(res_get_institutions.data?.resultRest)
                setData(prevState => ({ ...prevState, table: tableData }))
            })
        }
    }

    const handleEdit = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Organization?partyId=${newData.partyId}` , axiosKey).then(res => {
                if(res.data.result[0].companyPartyId == fieldList?.companyPartyId){
                    history.push(`/addInstitutions/${newData.partyId}`);
                    resolve()
                }
                else{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "شما امکان ویرایش اطلاعات این موسسه را ندارید !"));
                    resolve()
                }
            })
        })
    }
    const request_dropPostal = (oldData) => {
        console.log("oldData" , oldData);
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=${oldData.ptyRel}` , axiosKey).then(res => {
                if(res.data.result[0].fromPartyId == fieldList?.companyPartyId){
                    if(!res.data.result[0].thruDate || res.data.result[0].thruDate == ""){
                        axios.post(`${SERVER_URL}/rest/s1/training/dropRellOfIns` , {oldData : oldData} , axiosKey).then(res => {
                            getData()
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ردیف مورد نظر با موفقیت حذف شد'))
                        }).catch(err => reject("موسسه ی مورد نظر حذف نشد ، لطفا مجدد تلاش کنید!"))
                    }
                    else{reject("موسسه ی مورد نظر غیر فعال می باشد !")}
                }
                else{
                    reject("شما امکان حذف اطلاعات  موسسه شرکت دیگر را ندارید !")
                }
            })
        })

    }

    useEffect(() => {
        axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmitFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
            fieldList.companyPartyId = res.data.userCompanyPartyId
            fieldList.institute = res.data.institute
            fieldList.course = res.data.course
            setFieldList(Object.assign({},fieldList))
        })
    }, [partyRelationshipId])

    useEffect(() => {
        if(reset){
            getData()
        }
    }, [reset,fieldList?.companyPartyId])


    const handler_createTable = (data) => {
        const list = []
        console.log("datadatadata" , data);
        if (data.length>0) {
            data.map((ele, index) => {
                if(ele?.qualificationStatusId && ele?.qualificationStatusId != ""){
                    let item = {
                        pseudoId: ele?.RellPty?.pseudoId || '',
                        partyId: ele?.institute?.partyId || '',
                        organizationName: ele?.org?.organizationName || '',
                        companyPartyId: ele?.org?.companyPartyId,
                        propertyTypeEnumId: ele?.institute?.propertyType || '',
                        licence: ele?.institute?.licence || '',
                        courseId: ele?.orgnizationCourse?.title || '',
                        orgnizationCourseTitle: ele?.orgnizationCourseTitle || '' ,
                        qualificationStatusId: ele?.qualificationStatusId ,
                        ptyRel: ele?.RellPty?.partyRelationshipId,
                        institueDisabled:ele?.institueDisabled,
                        instituteInfo:ele?.institute,
                        qualificationInfo:ele?.qualificationInfo
                    }
                    list.push(item)
                }
            })
            return list
        }
    }


    const handler_search = (props) => {
        if (props.course){props.courseId = JSON.parse(props.course)} 
        setLoading(true)
        axios.post(`${SERVER_URL}/rest/s1/training/instituteFilter` ,  {formValues : props} , axiosKey).then(res => {
            setTableContent(handler_createTable(res.data.filter))
            setLoading(false)
        })

    }

    const handleAddInstituteToOtherCompany = (row) => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship?relationshipTypeEnumId=PrtInstitute&fromPartyId=${fieldList.companyPartyId}&toPartyId=${row.partyId}&thruDate=${""}`, axiosKey).then(res => {
            if(res.data.result.length > 0 ){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "موسسه مورد نظر در لیست موسسات فعال شرکت موجود است !"));
            }
            else{
                let postData = {
                    fromPartyId : fieldList.companyPartyId ,
                    toPartyId : row.partyId , 
                    relationshipTypeEnumId : "PrtInstitute" ,
                    pseudoId : row.pseudoId ,
                    qualificationInfo : row.qualificationInfo
                }
                axios.post(`${SERVER_URL}/rest/s1/training/addInstituteToOtherCompany` , {postData : postData}  , axiosKey).then(res => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'موسسه مورد نظر با موفقیت به لیست موسسات شرکت اضافه شد'));
                })
            }
        })
    }

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <TablePro

                        title='موسسات تایید صلاحیت شده'
                        columns={tableCols}
                        rows={tableContent}
                        loading={loading}
                        filter="external"
                        edit="callback"
                        delete={"inline"}

                        editCallback={handleEdit}
                        removeCallback={(row) =>request_dropPostal(row)}
                        filterForm={
                            <InstitutionsForm handler_search={handler_search} data={data?.mainOrg} setReset={setReset} setLoading={setLoading}
                            fieldList={fieldList} setFieldList={setFieldList}/>
                        }
                        rowActions={[{
                            title: "افزودن موسسه به شرکت",
                            icon: AddIcon,
                            onClick: (row)=>{
                                handleAddInstituteToOtherCompany(row)
                            },
                            display: (row) => row.companyPartyId !== fieldList.companyPartyId,
                        }]}
                        actions={[{
                            title: "بررسی صلاحیت موسسات",
                            icon: PostAddIcon,
                            onClick: () => {
                                history.push(`/addInstitutions`);
                            }
                        }]}
                    />
                </CardContent>

            </Card>
            <Card>
                <CardContent>
                    <Instructors/>
                </CardContent>
            </Card>

        </Box>

    )

}



export default Institutions