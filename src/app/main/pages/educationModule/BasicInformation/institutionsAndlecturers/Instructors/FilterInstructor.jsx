import React, { useState, useEffect } from 'react'
import FormPro from 'app/main/components/formControls/FormPro';
import { Button, } from "@material-ui/core";
import ActionBox from "../../../../../components/ActionBox";
import { SERVER_URL } from './../../../../../../../configs'
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"; 

const FilterInstructor = (props) => {
    const {tableContent , setTableContent , loading , setLoading , reset , setReset , instructorList , setInstructorList}=props
    const [filterFormValues, setFilterFormValues] = useState();
    const [fieldList,setFieldList] = useState({institute : [] , status : [] , course : [] , organization : []});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        { name: "fieldEnumId", label: 'رشته تحصیلی', type: 'multiselect', options: "UniversityFields" },
        { name: "qualificationTypeEnumId", label: 'میزان تحصیلات', type: 'multiselect', options: "QualificationType" },
        {
            type    : "group",
            items   : [{
                name    : "firstName",
                label   : "نام مدرس" ,
                type    : "text",
                col     : 2
            },{
                name    : "lastName",
                label   : "نام خانوادگی مدرس" ,
                type    : "text",
                col     : 2
            },{
                name    : "suffix",
                label   : "پسوند مدرس" ,
                type    : "text",
                col     : 2
            }],
            col     : 6
        },
        { name: "pseudoId", label: 'کد مدرس', type: 'number' },
        { name: "courseId", label: 'دوره های قابل ارائه', type: 'multiselect', options: fieldList.course , optionLabelField: "title", optionIdField: "courseId"},
        { name: "qualificationStatusId", label: ' وضعیت صلاحیت', type: 'select', options: fieldList.status , optionLabelField: "description", optionIdField: "statusId" ,
        filterOptions   : options => options.filter(o=>o.statusTypeId=="InstructorQualification")},
        { name: "institute", label: 'موسسه ی آموزشی', type: 'multiselect', options: fieldList.institute , optionLabelField: "organizationName", optionIdField: "partyId" },
        { name: "companyPartyId",  label:  "شرکت بررسی کننده", type: 'multiselect', options: fieldList.organization, optionLabelField: "organizationName", optionIdField: "partyId" ,
        filterOptions   : options => options.filter(o=>o.companyPartyId=="" || !o.companyPartyId)}
    ]

    useEffect(() => {
        axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmitFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
            fieldList.status = res.data.status
            fieldList.institute = res.data.institute
            fieldList.course = res.data.course
            fieldList.organization = res.data.organization
            setFieldList(Object.assign({},fieldList))
        })
    }, [partyRelationshipId])

    const handler_search = (filterFormValues) => {
        setLoading(true)
        let filterData =[]
        axios.get(`${SERVER_URL}/rest/s1/training/filterInstructorQualificationTable?fieldEnumId=${filterFormValues?.fieldEnumId ? JSON.parse(filterFormValues.fieldEnumId) : []}&qualificationTypeEnumId=${filterFormValues?.qualificationTypeEnumId ? JSON.parse(filterFormValues.qualificationTypeEnumId) : []}&courseId=${filterFormValues?.courseId ? JSON.parse(filterFormValues.courseId) : []}&companyPartyId=${filterFormValues?.companyPartyId ? JSON.parse(filterFormValues.companyPartyId) : []}&pseudoId=${filterFormValues?.pseudoId ?? ""}&qualificationStatusId=${filterFormValues?.qualificationStatusId ?? ""}&institute=${filterFormValues?.institute ? JSON.parse(filterFormValues.institute) : []}&firstName=${filterFormValues?.firstName ?? ""}&lastName=${filterFormValues?.lastName ?? ""}&suffix=${filterFormValues?.suffix ?? ""}`, axiosKey).then(filter => {
            if(filter.data.filter.length>0){
                filter.data.filter.map((item , index)=>{
                    const ind = instructorList.findIndex(i=> i.fromPartyId == item && i.qualificationStatusId != "")
                    if( ind > -1 ){
                        filterData.push(instructorList[ind])
                    }
                    if(filter.data.filter.length-1 == index ){
                        setTableContent(filterData)
                        setLoading(false)
                    }
                })
            }
            else{
                setTableContent([])
                setLoading(false)
            }
        })
    }
    console.log("tableContent" , tableContent);
    return (
        <FormPro
            prepend={formStructure}
            formValues={filterFormValues} setFormValues={setFilterFormValues}
            submitCallback={() => handler_search(filterFormValues)}
            resetCallback={()=>{
                setReset(true)
                setLoading(true)
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    );
};

export default FilterInstructor;