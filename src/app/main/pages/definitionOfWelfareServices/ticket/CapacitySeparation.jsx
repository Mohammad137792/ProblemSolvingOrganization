import React from 'react';
import TablePro from 'app/main/components/TablePro';
import {Button, CardContent , Box, Card, CardHeader ,Collapse} from "@material-ui/core";
import FormPro from './../../../components/formControls/FormPro';
import ActionBox from './../../../components/ActionBox';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../configs";
import axios from "axios";
import {useSelector} from "react-redux";

const CapacitySeparation = (props) => {
    const {welfareId} = props
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const [loading, setLoading] = React.useState(false);
    const [tableContent, setTableContent] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [capacityFormValues,setCapacityFormValues]= React.useState({});
    const [organizationUnit,setOrganizationUnit]=React.useState([])
    const [emplPosition,setEmplPosition]=React.useState([])
    const [staffs,setStaffs]=React.useState([])
    const [optionId,setOptionId]=React.useState({organizationUnit : "" , emplPositionId : "" , roll : "" , partyId : ""})
    const [firstField,setFirstField]=React.useState("")
    const [secondField,setSecondField]=React.useState("")
    const [request,setRequest]= React.useState(false);
    const [editing , setEditing]= React.useState(false);
    const [roll,setRoll]=React.useState([])
    const [companyId,setCompayId]=React.useState()
    const [EntRoleType,setEntRoleType]=React.useState([])
    const [EntOrganization,setEntOrganization]=React.useState([])
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {label:  "نام شرکت", name:   "organizationUnit", type:   "select", options : "OrganizationUnit", optionIdField  : "partyId", optionLabelField  : "organizationName" , },
        {label:  "سهمیه", name:   "emplPositionId", type:   "select", options : "EmplPosition", optionIdField: "emplPositionId",},
        {label:  "واحد سازمانی", name:   "mainPosition", type:   "indicator",  },
        {label:  "پست سازمانی", name:   "roleTypeId", type:   "select", options : EntRoleType , optionIdField  : "roleTypeId" , optionLabelField  : "description"},
        {label:  "نقش", name:   "occupancyRate", type:   "number",},
        {label:  "پرسنل", name:   "roleTypeId", type:   "select", options : EntRoleType , optionIdField  : "roleTypeId" , optionLabelField  : "description"},
    ]
    const formStructure = [{
        label:  "شرکت",
        name:   "companyPartyId",
        type:   "select",
        options : EntOrganization ,
        optionIdField  : "partyId" ,
        optionLabelField  :  "organizationName" ,
        filterOptions   : options => options.filter(o=>!o.companyPartyId),
        col     : 4
    },{
        label:  "سهمیه",
        name:   "portionAmount",
        type:   "number",
        col     : 4
    },{
        label:  "واحد سازمانی",
        name:   "organizationUnit",
        type:   "select",
        options : organizationUnit ,
        optionIdField  : "organizationPartyId",
        optionLabelField  : "organizationName" ,
        disabled : companyId == capacityFormValues.companyPartyId ? false : true ,
        col     : 4
    },{
        label:  "پست سازماتی",
        name:   "emplPositionId",
        type:   "multiselect",
        options : emplPosition ,
        optionIdField  : "emplPositionId",
        optionLabelField  : "description" ,
        disabled : companyId == capacityFormValues.companyPartyId ? false : true ,
        col     : 6
    },{
        label:  "نقش",
        name:   "roll",
        type:   "multiselect",
        options: roll ,
        optionIdField  : "roleTypeId",
        optionLabelField  : "description" ,
        disabled : companyId == capacityFormValues.companyPartyId ? false : true ,
        col     : 6
    },
    // {
    //     label:  "پرسنل",
    //     name:   "partyId",
    //     type:   "multiselect",
    //     options: staffs ,
    //     optionIdField  : "partyId",
    //     optionLabelField  : "fullName" ,
    //     col     : 4
    // }
    ]
    const handleMultiSelect=(data,type)=>{
        let Id=[]
        let newValue1=data.slice(1);
        let newValue2=newValue1.slice(0,-1)
        let newValue3=newValue2.split(",")
        newValue3.map((item , index)=>{
            let newValue4=item.slice(1)
            let newValue5=newValue4.slice(0,-1)
            Id.push(newValue5)
            if(index==newValue3.length-1){
                optionId[type]=Id
                setOptionId(optionId)
            }  
        })
    }
    React.useEffect(()=>{
        if(capacityFormValues?.organizationUnit ){handleMultiSelect(capacityFormValues?.organizationUnit , "organizationUnit")}
        if(capacityFormValues?.emplPositionId ){handleMultiSelect(capacityFormValues?.emplPositionId , "emplPositionId")}
        if(capacityFormValues?.roll ){handleMultiSelect(capacityFormValues?.roll , "roll")}
        if(capacityFormValues?.partyId ){handleMultiSelect(capacityFormValues?.partyId , "partyId")}
    },[capacityFormValues?.organizationUnit , capacityFormValues?.emplPositionId , capacityFormValues?.roll , capacityFormValues?.partyId ])
    React.useEffect(()=>{
        if((capacityFormValues?.organizationUnit && capacityFormValues?.organizationUnit != "") && (!capacityFormValues?.emplPositionId || capacityFormValues?.emplPositionId == "") && (capacityFormValues?.roll == "" || !capacityFormValues?.roll)){setFirstField("organizationUnit")}
        if(firstField=="organizationUnit"){
            if ((capacityFormValues?.emplPositionId && capacityFormValues?.emplPositionId != "") && (capacityFormValues?.roll == "" || !capacityFormValues?.roll)) {setSecondField("emplPosition")}
            if((!capacityFormValues?.emplPositionId || capacityFormValues?.emplPositionId == "") && (capacityFormValues?.roll && capacityFormValues?.roll != "" )){setSecondField("roleType")}
        }
        if((!capacityFormValues?.organizationUnit || capacityFormValues?.organizationUnit == "") && (capacityFormValues?.emplPositionId && capacityFormValues?.emplPositionId != "") && (capacityFormValues?.roll == "" || !capacityFormValues?.roll)){setFirstField("emplPosition")}
        if(firstField=="emplPosition"){
            if ((capacityFormValues?.organizationUnit && capacityFormValues?.organizationUnit != "") && (capacityFormValues?.roll == "" || !capacityFormValues?.roll)) {setSecondField("organizationUnit")}
            if((!capacityFormValues?.organizationUnit || capacityFormValues?.organizationUnit == "") && (capacityFormValues?.roll && capacityFormValues?.roll != "" )){setSecondField("roleType")}
        }
        if((!capacityFormValues?.organizationUnit || capacityFormValues?.organizationUnit == "") && (!capacityFormValues?.emplPositionId || capacityFormValues?.emplPositionId == "") && (capacityFormValues?.roll && capacityFormValues?.roll != "" )){setFirstField("roleType")}
        if(firstField=="roleType"){
            if ((capacityFormValues?.emplPositionId && capacityFormValues?.emplPositionId != "") && (!capacityFormValues?.organizationUnit || capacityFormValues?.organizationUnit == "")) {setSecondField("emplPosition")}
            if((!capacityFormValues?.emplPositionId || capacityFormValues?.emplPositionId == "") && (capacityFormValues?.organizationUnit && capacityFormValues?.organizationUnit != "")){setSecondField("organizationUnit")}
        }
        if (firstField == "organizationUnit" && (!capacityFormValues?.organizationUnit || capacityFormValues?.organizationUnit == "[]")){
            setFirstField("")
            capacityFormValues.organizationUnit = ""
            capacityFormValues.emplPositionId = ""
            capacityFormValues.roll = ""
            setCapacityFormValues(Object.assign({},capacityFormValues))
            setOptionId (Object.assign({},{organizationUnit : "" , emplPositionId : "" , roll : ""}))
        }
        if (firstField == "emplPosition" && (!capacityFormValues?.emplPositionId || capacityFormValues?.emplPositionId == "[]")){
            setFirstField("")
            setFirstField("")
            capacityFormValues.organizationUnit = ""
            capacityFormValues.emplPositionId = ""
            capacityFormValues.roll = ""
            setCapacityFormValues(Object.assign({},capacityFormValues))
            setOptionId (Object.assign({},{organizationUnit : "" , emplPositionId : "" , roll : ""}))
        }
        if (firstField == "roleType" && (!capacityFormValues?.roll || capacityFormValues?.roll == "[]")){
            setFirstField("")
            setFirstField("")
            capacityFormValues.organizationUnit = ""
            capacityFormValues.emplPositionId = ""
            capacityFormValues.roll = ""
            setCapacityFormValues(Object.assign({},capacityFormValues))
            setOptionId (Object.assign({},{organizationUnit : "" , emplPositionId : "" , roll : ""}))
        }
        console.log("firstField" , firstField);
        setTimeout(()=>{
            setRequest(true)
        },50)
    },[capacityFormValues?.organizationUnit , capacityFormValues?.emplPositionId , capacityFormValues?.roll])
    React.useEffect(()=>{
        if(request){
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
                .then(companyId=>{
                    setCompayId(companyId.data.partyId)
                    axios.get(SERVER_URL + `/rest/s1/welfare/CapacitySeparation?companyPartyId=${companyId.data.partyId}&organizationPartyId=${optionId?.organizationUnit}&roleTypeId=${optionId?.roll}&emplPositionId=${optionId?.emplPositionId}&firstField=${firstField}&secondField=${secondField}` , axiosKey)
                        .then((cmpInfo)=>{
                            setOrganizationUnit(cmpInfo?.data?.orgUnitList)
                            setEmplPosition(cmpInfo?.data?.positionList)
                            // setStaffs(cmpInfo?.data?.staffList)
                            setRoll(cmpInfo?.data?.rollList)
                            console.log("cmpInfo" , cmpInfo?.data);
                            console.log("optionId?.organizationUnit" ,optionId?.organizationUnit);
                            setRequest(false)
                        })
                })
        }
    },[request])

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/RoleType" , axiosKey)
            .then(RT=>{
                setEntRoleType(RT.data.result)
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Organization", axiosKey)
                .then(org=>{
                    setEntOrganization(org.data.result)
                })
            })
    },[])
    const  handleCreate =()=>{
        axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
            .then(companyId=>{
                const postData={
                    welfareId : welfareId ,
                    companyPartyId : companyId.data.partyId ,
                }
                axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareCapacity", postData, axiosKey)
                    .then(() => {
                        axios.get(SERVER_URL + "/rest/s1/welfare/entity/WelfareCapacity" , axiosKey )
                            .then((capId)=>{
                                optionId.emplPositionId.map((item)=>{
                                    const itemData={
                                        capacityId : capId.data[capId.data.length-1].capacityId ,
                                        portionAmount : capacityFormValues.portionAmount ,
                                        emplPositionId : item
                                    }
                                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareCapacityItem", itemData, axiosKey)
                                })
                            })
                    })
            })
    }
    const handleEdit =()=>{

    }
    console.log("capacityFormValues" , capacityFormValues );
    return (
        <Card>
            <CardHeader  title={"اطلاعات مرتبط با تفکیک سهمیه"} style={{justifyContent: "center" , textAlign : "center"}}
                    action={
                        <Tooltip title="نمایش جدول تفکیک سهمیه">
                            <ToggleButton
                                value="check"
                                selected={expanded}
                                onChange={() => setExpanded(prevState => !prevState)}
                            >
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    }/>
            {expanded ?  
                <CardContent >
                    <Collapse in={expanded}>
                        <FormPro
                            title="تفکیک سهمیه"
                            prepend={formStructure}
                            formValues={capacityFormValues}
                            setFormValues={setCapacityFormValues}
                            submitCallback={()=>{
                                // successCallback(formValues)
                                if(editing){
                                    handleEdit()
                                }else{
                                    handleCreate()
                                }
                            }}
                            resetCallback={()=>{
                            }}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                        />
                        <TablePro
                            title="جدول تفکیک سهمیه"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            // edit="external"
                            // editForm={<PersonForm/>}
                            // removeCallback={handleRemove}
                            loading={loading}
                        /> 
                    </Collapse>
                </CardContent>
            : "" }
        </Card>
    );
};

export default CapacitySeparation;