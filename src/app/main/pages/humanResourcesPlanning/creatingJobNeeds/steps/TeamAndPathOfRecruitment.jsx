import FormPro from "../../../../components/formControls/FormPro";
import TablePro from 'app/main/components/TablePro';
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import axios from 'axios';
import useListState from "../../../../reducers/listState";
import TransferList from "../../../../components/TransferList";
import checkPermis from "app/main/components/CheckPermision";
import UserCompany from "../../../../components/formControls/UserCompany";



const TeamAndPathOfRecruitment = (props) => {

    const {managementMode = false, confirmation = false, formValues, setFormValues, submitCallback = () => { }, submitRef} = props

    const [formValidation, setFormValidation] = React.useState({});

    const [tableContent,setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const [expertsList,setExpertsList] = useState([]);
    const [expertsListLoading, setExpertsListLoading] = useState(true);

    const personnel = useListState("username")
    const audience = useListState("username")

    const [fieldInfo , setFieldInfo] = useState({});

    const [initialize, setInitialize] = useState(false);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        audience.set(formValues.personnel)
        setExpertsList(formValues.personnel)
        setExpertsListLoading(false)
        setInitialize(true)
    },[])

    React.useEffect(()=>{
        if(initialize){
            getData()
            setInitialize(false)
        }
    },[initialize])

    const filter_audience = (parties) => {
        if (audience.list) {
          return parties.filter(
            (i) => audience.list.findIndex((j) => j.username === i.username) < 0
          );
        } else {
          return parties;
        }
    };

    const getData = () => {
        axios.post(`${SERVER_URL}/rest/s1/fadak/searchUsers` , {data : {}} , axiosKey).then((person)=>{
            console.log("person" , person.data);
            fieldInfo.personnel = person.data.result.filter((i)=>i.username && i.username !== "")
            axios.get(`${SERVER_URL}/rest/s1/fadak/party/subOrganization`, axiosKey).then((org)=>{
                fieldInfo.org = org.data?.organizationUnit
                axios.get(`${SERVER_URL}/rest/s1/fadak/emplPosition`, axiosKey).then((pos)=>{
                    fieldInfo.positions = pos.data?.position
                    axios.get(`${SERVER_URL}/rest/s1/humanres/recruitmentforPosition?requiredEmplPositionId=${formValues?.requiredEmplPositionId}`, axiosKey).then((res)=>{
                        fieldInfo.RecruitmentList = res.data?.Recruitments
                        setFieldInfo(Object.assign({},fieldInfo))
                        console.log("audience.list" , audience.list);
                        personnel.set(filter_audience(person.data.result.filter((i)=>i.username && i.username !== "")))
                    })
                })
            })
        })
    }

    const expertsTableCols = [
        { name : "unitOrganization", label: " واحد سازمانی", type: "text", style: {minWidth:"120px"} },
        { name : "emplPosition", label: " پست سازمانی", type: "text", style: {minWidth:"120px"} },
        { name : "role", label: " نقش سازمانی", type: "text", style: {minWidth:"120px"} },
        { name : "fullName", label: " نام و نام خانوادگی", type: "text", style: {minWidth:"120px"} },
    ]

    const formStructure=[{
            name    : "unit",
            label   : "واحد سازمانی",
            type    : "select",
            options : fieldInfo.org ,
            optionLabelField :"organizationName",
            optionIdField:"partyId",
            col     : 4 ,
            display : (!managementMode && !confirmation)
        },{
            name    : "manegerEmplePositionId",
            label   : "پست سازمانی",
            type    : "select",
            options : fieldInfo.positions,
            optionLabelField :"description",
            optionIdField:"emplPositionId",
            filterOptions: (options) =>
            (formValues?.unit  && formValues?.unit != "") 
             ? options.filter(
                    (o) =>  o?.organizationPartyId == formValues?.unit )
              : options,
            required : (!managementMode && !confirmation) == true ? true : false,
            col     : 4 ,
            display : (!managementMode && !confirmation)
        },{
            name    : "manegerPartyRelationShipId",
            label   : "نام و نام خانوادگی",
            type    : "select",
            options : fieldInfo.personnel ,
            optionLabelField :"fullName",
            optionIdField:"partyRelationshipId",
            filterOptions: (options) =>
            (formValues?.unit  && formValues?.unit != "" && (!formValues?.manegerEmplePositionId  || formValues?.manegerEmplePositionId == "")) 
              ? options.filter((o) =>  o?.unitOrganizationId == formValues?.unit )
              : (formValues?.manegerEmplePositionId  && formValues?.manegerEmplePositionId != "" && (!formValues?.unit  || formValues?.unit == "")) 
             ? options.filter(
                    (o) =>  o?.emplPositionId == formValues?.manegerEmplePositionId )
              : (formValues?.manegerEmplePositionId  && formValues?.manegerEmplePositionId != "" && formValues?.unit  && formValues?.unit  !== "")
              ? options.filter(
                (o) =>  o?.emplPositionId == formValues?.manegerEmplePositionId && o?.unitOrganizationId == formValues?.unit   )
              : options,
            required : (!managementMode && !confirmation) == true ? true : false,
            col     : 4 ,
            display : (!managementMode && !confirmation)
        },{
            type    : "component",
            component : <TransferComponent audience={audience} personnel={personnel}/>,
            col     : 12 ,
            display : !confirmation
        },{
            type    : "component",
            component : <ExpertsList expertsTableCols={expertsTableCols} expertsList={expertsList} setExpertsList={setExpertsList} expertsListLoading={expertsListLoading}/>,
            col     : 12 ,
            display : confirmation
        }
        // ,{
        //     name    : "recruitmentRouteId",
        //     label   : "مسیر جذب",
        //     type    : "select",
        //     options : fieldInfo.RecruitmentList ,
        //     optionLabelField :"routeTitle",
        //     optionIdField:"recruitmentRouteId",
        //     required : managementMode ? false : true ,
        //     col     : 4 ,
        //     display : !managementMode
        // },{
        //     type    : "component",
        //     component : <PhaseList fieldInfo={fieldInfo} tableContent={tableContent} setTableContent={setTableContent} loading={loading}/>,
        //     col     : 12 ,
        //     display : (formValues?.recruitmentRouteId && formValues?.recruitmentRouteId != "" && !managementMode) == true ? true : false
        // }
    ]

    React.useEffect(()=>{
        if(formValues?.recruitmentRouteId && formValues?.recruitmentRouteId != ""){
            setLoading(true)
            axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=recruitmentRoute`, axiosKey).then((phares)=>{
                fieldInfo.phase = phares.data.result.filter((o) => o["parentEnumId"] == "" || !o["parentEnumId"])
                axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=RecruitmentRoute`, axiosKey).then((levres)=>{
                    fieldInfo.level = levres.data.result
                    setFieldInfo(Object.assign({},fieldInfo))
                    axios.get(`${SERVER_URL}/rest/s1/humanres/RouteLevel?recruitmentRouteId=${formValues?.recruitmentRouteId}`, axiosKey).then((res)=>{
                        setTableContent(res.data.routeLevelList)
                        setLoading(false)
                    })
                })
            })
        }
        
    },[formValues?.recruitmentRouteId])

    React.useEffect(()=>{
        if (audience?.list && audience?.list !== null){
            formValues.personnel = audience?.list
            setFormValues(Object.assign({},formValues , {personnel : audience?.list}))
        }
    },[audience?.list])

    return (
        <div>
            <Box mb={2}/>
            {(!managementMode && !confirmation) ? 
                <CardHeader title="مدیر متقاضی جذب نیرو" />
            :""}
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={submitCallback}
                actionBox={
                    <ActionBox>
                        <Button
                            ref={submitRef}
                            type="submit"
                            role="primary"
                            style={{ display: "none" }}
                        />
                    </ActionBox> 
                }
            />
        </div>
    );
};

export default TeamAndPathOfRecruitment;

function TransferComponent (props) {

    const {audience, personnel} = props

    const [filterFormValues,setFilterFormValues] = useState ({})
    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [resetData,setResetData] = useState(false)

    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const filter_audience = (parties) => {
        if (audience.list) {
          return parties.filter(
            (i) => audience.list.findIndex((j) => j.username === i.username) < 0
          );
        } else {
          return parties;
        }
    };

    const display_org_info = (item) => {
        let info = [];
        if (item.emplPosition) info.push(item.emplPosition);
        if (item.unitOrganization) info.push(item.unitOrganization);
        if (item.organizationName) info.push(item.organizationName);
        return info.join("، ") || "─";
      };

    const display_name = (item) => `${item?.fullName != "" ? item?.fullName : "-"} `;

    const handle_add_participant = (parties) => new Promise((resolve, reject) => { 
        resolve(parties)
     })

    const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
        resolve(parties)
    })

    useEffect(()=>{
        axios.get(`${SERVER_URL}/rest/s1/humanres/companyInfo` , axiosKey).then((info)=>{
            setFieldsInfo(info.data)
        }).catch(()=>{
                
        })
    },[])

    useEffect(()=>{
        if(resetData){
            axios.post(`${SERVER_URL}/rest/s1/fadak/searchUsers` , {data : filterFormValues} , axiosKey).then((person)=>{
                personnel.set(filter_audience(person.data.result.filter((i)=>i.username && i.username !== "")))
                setResetData(false)
            })
        }
    },[resetData])
    return (
        <div>
            <Box mb={2}/>
            <CardHeader title="تعیین کارشناس جذب"/>
            <TransferList
                rightTitle="لیست پرسنل"
                rightContext={personnel}
                rightItemLabelPrimary={display_name}
                rightItemLabelSecondary={display_org_info}
                leftTitle="لیست کارشناسان جذب"
                leftContext={audience}
                leftItemLabelPrimary={display_name}
                leftItemLabelSecondary={display_org_info}
                onMoveLeft={checkPermis("humanResourcesPlanning/creatingJobNeeds/teamAndPathOfRecruitment/addPerson", datas) ? handle_add_participant : ""}
                onMoveRight={checkPermis("humanResourcesPlanning/creatingJobNeeds/teamAndPathOfRecruitment/deletePerson", datas) ? handle_delete_participant : ""}
                rightFilterForm={
                    <FilterForm formValues={filterFormValues} setFormValues={setFilterFormValues} fieldsInfo={fieldsInfo} setResetData={setResetData}/>
                }
            />
        </div>
    )
}

function ExpertsList (props) {

    const {expertsTableCols, expertsList, setExpertsList, expertsListLoading} = props
console.log("expertsTableCols" , expertsTableCols);
    return (
        <div>
            <Box mb={2}/>
            <TablePro
                title="لیست کارشناسان جذب"
                columns={expertsTableCols}
                rows={expertsList}
                setRows={setExpertsList}
                loading={expertsListLoading}
                fixedLayout
            />
        </div>
    )
}

function PhaseList (props) {

    const {fieldInfo, tableContent, setTableContent, loading} = props

    const datas = useSelector(({ fadak }) => fadak);

    const tableCols = [
        { name : "parentRouteLevelId", label: "فاز مسیر", type    : "select", options : fieldInfo.phase, optionLabelField :"description", optionIdField:"enumId" , style: {minWidth:"80px"} },
        { name : "routeLevelEnumId", label: "مرحله فاز", type : "select", options : fieldInfo.level, optionLabelField :"description", optionIdField:"enumId" , style: {minWidth:"120px"} },
        { name : "levelSequence", label: "ترتیب انجام مرحله", type: "number" , style: {minWidth:"80px"} },
        { name : "description", label: " توضیحات", type: "text", style: {minWidth:"120px"} },
        { name : "levelNeeded", label: "مرحله ضروری", type: "indicator" , style: {minWidth:"80px"} },
        { name : "levelResponsibleTypeEnum", label: "مسئول مرحله", type    : "text" , style: {minWidth:"120px"} },
        { name : "tools", label: "ابزار مرحله", type: "text", style: {minWidth:"120px"} },
    ]

    const handleRemove = () => {

    }

    return (
        <div>
            <Box mb={2}/>
            <TablePro
                title="لیست فاز ها و مراحل مسیر جذب"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                removeCondition={(row) =>
                    checkPermis("humanResourcesPlanning/creatingJobNeeds/teamAndPathOfRecruitment/disable", datas) 
                }
                removeCallback={handleRemove}
                loading={loading}
            />
        </div>
    )
}

function FilterForm (props) {

    const {formValues, setFormValues, handleClose, setResetData, fieldsInfo} = props

    const [filterFields,setFilterFields] = useState({});

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const filterStructure = [{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "multiselect",
        options : fieldsInfo.organizationUnit ,
        optionLabelField :"organizationName",
        optionIdField:"partyId",
        col     : 3,
    },{
        name    : "position",
        label   : "پست سازمانی",
        type    : "multiselect",
        options : fieldsInfo.emplPosition ,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        filterOptions: (options) =>
          (formValues["organizationUnit"] && eval(formValues["organizationUnit"]).length > 0 )
          ? options.filter(
            (item) => eval(formValues["organizationUnit"]).indexOf(item.organizationPartyId) >= 0
          ):options,
        col     : 3,
    },{
        type : "component" ,
        component :  <div/>,
        col : 3
    },{
        type : "component" ,
        component :  
            <div>
                <Button
                    style={{
                    width: "70px",
                    color: "secondary",
                    }}
                    variant="outlined"
                    onClick={()=> resetCallback()}
                >
                    {" "}لغو{" "}
                </Button>
                <Button
                    style={{
                    width: 120,
                    color: "white",
                    backgroundColor: "#039be5",
                    marginRight: "8px",
                    }}
                    variant="outlined"
                    onClick={()=>handle_filter()}
                >
                    جستجو
                </Button>
            </div>,
        col : 3
    }]

    useEffect(() => {
        if (formValues.position && formValues.position != "[]" && fieldsInfo?.emplPosition){
            let selectedPositionsInfo = fieldsInfo?.emplPosition.filter((item) => eval(formValues["position"]).indexOf(item?.emplPositionId) >= 0)
            let unit = selectedPositionsInfo.map(a => a?.organizationPartyId);
            filterFields.positions = Array.from(new Set(unit))
            setFilterFields(Object.assign({},filterFields))
        }
        else {
            filterFields.positions = []
            setFilterFields(Object.assign({},filterFields))
        }
    }, [formValues?.position,fieldsInfo?.emplPosition])

    
    const handle_filter = () => {
        setResetData(true)
        handleClose()
    }

    const resetCallback = () => {
        setResetData(true)
        setFormValues({})
        handleClose()

    }

    return (

        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={filterStructure}
        />

    );
}