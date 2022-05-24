import React, { useState, useEffect } from 'react'
import AddIcon from "@material-ui/icons/Add";
import TablePro from 'app/main/components/TablePro';
import { SERVER_URL } from './../../../../../../../configs'
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import FilterInstructor from './FilterInstructor';
import { useDispatch, useSelector } from "react-redux";
import {setUser, setUserId} from "../../../../../../store/actions/fadak";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";


const Instructors = () => {
    const [loading, setLoading] = useState(true);
    const [tableContent, setTableContent] = useState([]);
    const [fieldList,setFieldList] = useState({status : [] , institute : [] , companyPartyId : ""});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [reset,setReset] = useState(false);
    const [instructorList,setInstructorList] = useState([]);
    const history = useHistory()
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        { name: "pseudoId", label: 'کد مدرس', type: 'text' },
        { name: "fullName", label: 'نام و نام خانوادگی', type: 'text' },
        { name: "idValue", label: 'کدملی', type: 'number' },
        { name: "fieldEnumId", label: 'رشته تحصیلی', type: 'select', options: "UniversityFields" },
        { name: "qualificationTypeEnumId", label: 'میزان تحصیلات', type: 'select', options: "QualificationType" },
        { name: "title", label: "دوره های قابل ارائه" , type : "text" } ,
        { name: "institute", label: 'موسسه آموزشی' , type: 'select' , options: fieldList.institute , optionLabelField: "organizationName", optionIdField: "partyId" },
        { name: "contactNumber", label: 'شماره تماس', type: 'text' },
        { name: "qualificationStatusId", label: ' وضعیت صلاحیت', type: 'select', options: fieldList.status , optionLabelField: "description", optionIdField: "statusId" , style: {minWidth:"200px"} ,
        filterOptions   : options => options.filter(o=>o.statusTypeId=="InstructorQualification")} ,
    ]

    useEffect(() => {
        axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmitFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
            fieldList.status = res.data.status
            fieldList.institute = res.data.institute
            fieldList.companyPartyId = res.data.userCompanyPartyId
            setFieldList(Object.assign({},fieldList))
            axios.get(`${SERVER_URL}/rest/s1/training/instructorQualificationTable?pageSize=1000000`, axiosKey).then(List => {
                axios.get(`${SERVER_URL}/rest/s1/training/filterInstructorQualificationTable?&companyPartyId=${res.data.userCompanyPartyId}`, axiosKey).then(filter => {
                    let companyInstructor =[]
                    if(filter.data.filter.length>0){
                        filter.data.filter.map((item , index)=>{
                            const ind = List.data.info.findIndex(i=> i.fromPartyId == item && i.qualificationStatusId != "")
                            if( ind > -1 ){
                                companyInstructor.push( List.data.info[ind])
                            }
                            if(filter.data.filter.length-1 == index ){
                                setTableContent(companyInstructor)
                                setLoading(false)
                                setReset(false)
                            }
                        })
                    }
                    else{
                        setTableContent([])
                        setLoading(false)
                        setReset(false)
                    }
                })
                setInstructorList(List.data.info)
            })
        })
    }, [partyRelationshipId,reset])

    const handleEdit = (row) =>{
        if(row.companyPartyId == fieldList.companyPartyId){
            dispatch(setUser(row.fromPartyId))
            dispatch(setUserId(row.username, row.userId, row.partyRelationshipId, row.accountDisabled))
            history.push(`/personnelBaseInformation`);
        }
        else {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'شما امکان ویرایش اطلاعات این مدرس را ندارید !'));
        }
    }

    const handleAddInstructorToOtherCompany = (row) =>{
        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship?relationshipTypeEnumId=prtInstructor&fromPartyId=${row.fromPartyId}&toPartyId=${fieldList.companyPartyId}`, axiosKey).then(res => {
            if(res.data.result.length > 0){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "مدرس مورد نظر در لیست مدرسین شرکت موجود است !"));
            }
            else{
                let postData = {
                    fromPartyId : row.fromPartyId ,
                    toPartyId : fieldList.companyPartyId ,
                    relationshipTypeEnumId : "prtInstructor" ,
                    fromDate : new Date().getTime() ,
                    statusId : "ActiveRel"
                }
                axios.post(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship` , {data : postData} , axiosKey).then(res => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'مدرس مورد نظر با موفقیت به لیست مدرسین شرکت اضافه شد'));
                })
            }
        })
    }

    return (
        <TablePro
            title='مدرسین تایید صلاحیت شده'
            columns={tableCols}
            rows={tableContent}
            loading={loading}
            edit="callback"
            editCallback={handleEdit}
            filter="external"
            filterForm={
                <FilterInstructor tableContent={tableContent} setTableContent={setTableContent} loading={loading} setLoading={setLoading} reset={reset} setReset={setReset}
                instructorList={instructorList} setInstructorList={setInstructorList}/>
            }
            rowActions={[{

                    title: "افزودن مدرس به شرکت",
                    icon: AddIcon,
                    onClick: (row)=>{
                        handleAddInstructorToOtherCompany(row)
                    }
                }]}
            actions={[{
                title: "افزودن مدرس",
                icon: AddIcon ,
                onClick: () => {
                    // history.push(`/personnel/register/instructor`);
                    history.push({
                        pathname: "/personnel/register",
                        state: {from: "instructors"}
                    });
                }
            }]}
        />
    );
};

export default Instructors;
