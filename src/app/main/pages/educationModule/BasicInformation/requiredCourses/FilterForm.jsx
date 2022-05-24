import React, { useState, useEffect } from 'react'
import FormPro from 'app/main/components/formControls/FormPro';
import { Button, } from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";
import { SERVER_URL } from './../../../../../../configs'
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"; 
import CircularProgress from "@material-ui/core/CircularProgress";

const FilterForm = (props) => {
    const {tableContent , setTableContent , loading , setLoading , reset , setReset}=props
    const [filterFormValues, setFilterFormValues] = useState();
    const [fieldList,setFieldList] = useState({organizationUnit : [] , emplPosition : [] , requirmentList : [] , companyPartyId : "" , organization : []});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [emplField ,setEmplField] = useState([]);
    const [waiting, set_waiting] = useState(false)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        { name: "category", label: "نوع دوره", type: "multiselect", options: "CourseCategory", style: {minWidth:"60px"}},
        { name: "title", label: "عنوان دوره", type: "text" , style: {minWidth:"80px"}},
        { name: "type", label: "وضعیت دوره", type: "select" , options: "CourseType", style: {minWidth:"60px"}},
        { name: "holdType", label: "نحوه ی برگزاری", type: "select", options: "HoldType", style: {minWidth:"60px"}},
        { name: "organizationUnit", label: 'واحد سازمانی', type: 'multiselect', options: fieldList.organizationUnit , optionLabelField: "orgName", optionIdField: "orgId" , disabled : filterFormValues?.companyPartyId == fieldList?.companyPartyId ? false : true },
        { name: "emplPositionId",  label:  "سمت سازمانی", type: 'multiselect', options: emplField , optionLabelField: "emplName", optionIdField: "emplId" , disabled : filterFormValues?.companyPartyId == fieldList?.companyPartyId ? false : true },
        { name: "fromDate",  label:  "تاریخ  شروع", type: 'date' },
        { name: "thruDate",  label:  "تاریخ  پایان", type: 'date' },
        { name: "examDate",  label:  "تاریخ آزمون پایانی", type: 'date' },
        { name: "companyPartyId",  label:  "شرکت", type: 'select', options: fieldList.organization , optionLabelField: "organizationName", optionIdField: "partyId" ,
        filterOptions   : options => options.filter(o=>o.companyPartyId=="" || !o.companyPartyId)}
    ]

    useEffect(() => {
        axios.get(`${SERVER_URL}/rest/s1/training/requiredCourseFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
            fieldList.organizationUnit = res.data.orgUnit
            fieldList.emplPosition = res.data.empleInfo
            fieldList.requirmentList = res.data.requirmentList
            fieldList.companyPartyId = res.data.userCompanyPartyId
            fieldList.organization = res.data.organization
            console.log("res.data.userCompanyPartyId" , res.data.userCompanyPartyId);
            setFieldList(Object.assign({},fieldList))
            setFilterFormValues(Object.assign({} , filterFormValues , {companyPartyId : res.data.userCompanyPartyId}))
        })
    }, [partyRelationshipId])
    useEffect(() => {
        let emplList = []
        if(filterFormValues?.organizationUnit){
            JSON.parse(filterFormValues.organizationUnit).map((item , index)=>{
                fieldList.emplPosition.map((empl)=>{
                    if(empl.org == item){
                        emplList.push(empl)
                    }
                    if(index == JSON.parse(filterFormValues.organizationUnit).length-1){
                        setEmplField(emplList)
                    }
                })
            })
        }
    }, [filterFormValues?.organizationUnit])

    useEffect(() => {
        if(filterFormValues?.companyPartyId != fieldList?.companyPartyId){
            setFilterFormValues(Object.assign({} , filterFormValues , {organizationUnit : ""} , {emplPositionId : ""}))
        }
    }, [filterFormValues?.companyPartyId])

    const handler_search = (filterFormValues) => {
        setLoading(true)
        set_waiting(true)
        axios.get(`${SERVER_URL}/rest/s1/training/filterRequiredCourse?pageSize=100000&category=${filterFormValues?.category ? JSON.parse(filterFormValues?.category) : []}&title=${filterFormValues?.title ?? ""}&type=${filterFormValues?.type ?? ""}&holdType=${filterFormValues?.holdType ?? "" }&organizationUnit=${filterFormValues?.organizationUnit ? JSON.parse(filterFormValues?.organizationUnit) : []}&emplPositionId=${filterFormValues?.emplPositionId ? JSON.parse(filterFormValues?.emplPositionId) : []}&fromDate=${filterFormValues?.fromDate ?? ""}&thruDate=${filterFormValues?.thruDate ?? ""}&examDate=${filterFormValues?.examDate ?? ""}&companyPartyId=${filterFormValues?.companyPartyId ?? ""}`, axiosKey).then(filter => {
            console.log("filter" , filter.data.filter);
            setTableContent(filter.data.filter)
            setLoading(false)
            set_waiting(false)
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
                <Button type="submit" role="primary" disabled={waiting} endIcon={waiting ?<CircularProgress size={20}/>:null}>اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    );
};

export default FilterForm;