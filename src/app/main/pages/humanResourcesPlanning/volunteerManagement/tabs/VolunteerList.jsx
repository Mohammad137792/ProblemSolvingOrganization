import { Card, CardContent, CardHeader, Button, Box, Typography, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import FormPro from "../../../../components/formControls/FormPro";
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import {useSelector , useDispatch} from "react-redux";
import {setUser, setUserId} from "../../../../../store/actions/fadak";
import { makeStyles } from "@material-ui/core/styles";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';



const VolunteerList = (props) => {

    const {requistionPersonnel, jobRequistionId, pageStatus, setPageStatus, setJobApplicantId, setCandidates, setUserPartyId} = props

    const [formValues, setFormValues] = React.useState({});
    const [waiting, set_waiting] = useState(false) 
    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(true);

    const [selectedPerson, setSelectedPerson] = useState([])

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [filterFormValues,setFilterFormValues] = useState ({})

    const history = useHistory();

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        type    : "component",
        component : <div/>,
        col     : 2
    },{
        type : "component" ,
        component : 
            <Button onClick={()=>filterTable("all")}>
                <ShowNumber name="allCandidate" label="?????? ????????????????" formValues={formValues} setFormValues={setFormValues} />
            </Button>,
        col     : 2
    },{
        type : "component" ,
        component : 
            <Button onClick={()=>filterTable("invited")}>
                <ShowNumber name="invitedCandidates" label="???????? ?????? ???????? ????????????" formValues={formValues} setFormValues={setFormValues}/>
            </Button>,
        col     : 2
    },{
        type : "component" ,
        component : 
            <Button onClick={()=>filterTable("NewCandidate")}>
                <ShowNumber name="newCandidates" label="???????? ?? ?????????????? ??????????" formValues={formValues} setFormValues={setFormValues}/>
            </Button>,
        col     : 2
    },{
        type : "component" ,
        component : 
            <Button onClick={()=>filterTable("InProgress")}>
                <ShowNumber name="inProgressCandidates" label="???????? ?? ???? ?????? ??????????" formValues={formValues} setFormValues={setFormValues}/>
            </Button>,
        col     : 2
    // },{
    //     name    : "trackingCodeId",
    //     label   : "?????????????? ??????????????",
    //     type    : "number",
    //     col     : 1
    // },{
    //     name    : "trackingCodeId",
    //     label   : "???????????? ??????",
    //     type    : "number",
    //     col     : 1
    // },{
    //     name    : "trackingCodeId",
    //     label   : "?????????????? ??????",
    //     type    : "number",
    //     col     : 1
    },{
        type    : "component",
        component : <div/>,
        col     : 2
    }]

    const tableCols = [
        {     
            name    : "fullName" ,   
            label   : "?????? ?? ?????? ????????????????",
            type    : "text",
        },
        { name : "fromDate", label: "?????????? ????????????", type: "date", style: {minWidth:"120px"} },
        ,{
            name : "knowCompanyEnumId" ,
            label   : "???????? ????????????",
            type    : "select",
            options : fieldsInfo.KnowCompanyType,
            style: {minWidth:"80px"} },
        {     
            name    : "relationshipType" ,   
            label   : "?????? ????????????",
            type    : "select",
            options : [{enumId : "employee" , description : "????????????" },{enumId : "requestioner" , description : "????????????" }],
        },
        {
            name : "getToKnowTypeEnumId" ,
            label   : "???????? ???? ????????",
            type    : "select",
            options : fieldsInfo.GetToKnowType,
            style: {minWidth:"80px"} },
        { name : "invitationDate", label: "?????????? ????????", type: "date", style: {minWidth:"120px"} },
        // { name : "invitationDate1", label: "?????????? ????????????", type: "date", style: {minWidth:"120px"} },
        { 
            name    : "statusId",
            label   : "??????????",
            type    : "select",
            options : fieldsInfo.status,
            optionLabelField :"description",
            optionIdField:"statusId", 
            style: {minWidth:"120px"}
        },
        { name : "tel", label:"???????? ", type: "text" ,  style: {minWidth:"120px"}},
        { name : "email", label:"??????????", type: "text" ,  style: {minWidth:"120px"}},
        { name : "linkdin", label:"?????????? ??????????????", type: "text" ,  style: {minWidth:"240px"}}
    ]

    
    React.useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.post(`${SERVER_URL}/rest/s1/humanres/countTypeOfCandidate` , {jobRequistionId: jobRequistionId , requistionPersonnel : requistionPersonnel} , axiosKey).then((groupsNumber)=>{
            setFormValues(groupsNumber.data?.counter)
            axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=KnowCompanyType,GetToKnowType,UniversityFields`, axiosKey).then((enm)=>{
                axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=QualificationType`, axiosKey).then((qualification)=>{
                    let QualificationTypeArrya = []
                    if(qualification.data?.result.length > 0){
                        qualification.data.result.map((item, index) => {
                            if (item.enumId !== "WorkExperience") {
                                QualificationTypeArrya.push(item)
                            }
                        })
                    }
                    axios.get(`${SERVER_URL}/rest/s1/fadak/entity/StatusItem?statusTypeId=ReCandidate`, axiosKey).then((status)=>{
                        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/PartyClassification?classificationTypeEnumId=Militarystate`, axiosKey).then((militaryStatus)=>{
                            setFieldsInfo({...enm.data?.enums , ...status.data , Militarystate : militaryStatus?.data?.result , QualificationType : QualificationTypeArrya.sort((a, b) => {return b.sequenceNum - a.sequenceNum})})
                        }).catch(()=>{
                            dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
                        })
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
                    })
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
            })
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
        })
    }

    const getTableData = () => {
        const packet = {
            candidateInfo : filterFormValues ,
            jobRequistionId : jobRequistionId ,
            requistionPersonnel : requistionPersonnel
        }
        axios.post(`${SERVER_URL}/rest/s1/humanres/Loadcandidate` , packet , axiosKey).then((table)=>{
            if(table.data?.candidates.length > 0){
                let tableData = []
                table.data.candidates.map((item,index)=>{
                    let rowData ={
                        ...item ,
                        fullName : (item.firstName ?? "") + " " + (item?.lastName ?? "") + " " + (item?.suffix ?? "")
                    }
                    tableData.push(rowData)
                    if(index === table.data.candidates.length-1){
                        setTableContent(tableData)
                        setLoading(false)
                    }
                })
            }else{
                setTableContent([])
                setLoading(false)
            }

        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
        })
    }

    const filterTable = (type) => {
        const packet = {
            candidateInfo : filterFormValues ,
            jobRequistionId : jobRequistionId ,
            requistionPersonnel : requistionPersonnel,
            typeOfCandidate : type
        }
        axios.post(`${SERVER_URL}/rest/s1/humanres/Loadcandidate` , packet, axiosKey).then((table)=>{
            if(table.data?.candidates.length > 0){
                let tableData = []
                table.data.candidates.map((item,index)=>{
                    let rowData ={
                        ...item ,
                        fullName : (item.firstName ?? "") + " " + (item?.lastName ?? "") + " " + (item?.suffix ?? "")
                    }
                    tableData.push(rowData)
                    if(index === table.data.candidates.length-1){
                        setTableContent(tableData)
                        setLoading(false)
                    }
                })
            }else{
                setTableContent([])
                setLoading(false)
            }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
        })
    }

    const observation = () => {
        history.push('/volunteerReview')
    }

    const personnelProfile = (rowData) => {
        // history.push('/personnelBaseInformation')
        setPageStatus("personnelProfile")
        setUserPartyId(rowData.partyId)
        dispatch(setUser(rowData.partyId))
        dispatch(setUserId(rowData.username, rowData.userId, rowData.partyRelationshipId, rowData.accountDisabled))
    }

    const talentProfile = (rowData) => {
        // history.push('/talentProfile')
        setJobApplicantId(rowData?.jobApplicantId)
        setPageStatus("talentProfile")
        dispatch(setUser(rowData.partyId))
        dispatch(setUserId(rowData.username, rowData.userId, rowData.partyRelationshipId, rowData.accountDisabled))
    }

    const reject = () => {
        if(selectedPerson.length !== 0){
            axios.put(`${SERVER_URL}/rest/s1/humanres/rejectApplicant` , {candidates : selectedPerson} , axiosKey).then((table)=>{
                setLoading(true)
                axios.post(`${SERVER_URL}/rest/s1/humanres/countTypeOfCandidate` , {jobRequistionId: jobRequistionId , requistionPersonnel : requistionPersonnel} , axiosKey).then((groupsNumber)=>{
                    setFormValues(Object.assign({},formValues,groupsNumber.data?.counter))
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR , "?????? ???? ?????????? ??????????????"));
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR , "?????? ???? ?????????? ??????????????"));
            })
        }else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR , "???????????? ???????????? ???????? ?????? !"));
        }
    }

    const accept = () => {
        if(selectedPerson.length !== 0){
            if(selectedPerson[0]?.relationshipType === "requestioner" && selectedPerson[0]?.toPartyId !== null && selectedPerson[0]?.toPartyId !== undefined ){
                setPageStatus("createAccount")
                setCandidates(selectedPerson)
            }else{
                axios.put(`${SERVER_URL}/rest/s1/humanres/acceptApplicant` , {candidates : selectedPerson} , axiosKey).then((table)=>{
                    setLoading(true)
                    axios.post(`${SERVER_URL}/rest/s1/humanres/countTypeOfCandidate` , {jobRequistionId: jobRequistionId , requistionPersonnel : requistionPersonnel} , axiosKey).then((groupsNumber)=>{
                        setFormValues(Object.assign({},formValues,groupsNumber.data?.counter))
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR , "?????? ???? ?????????? ??????????????"));
                    })
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR , "?????? ???? ?????????? ??????????????"));
                })
            }
        }else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR , "???????????? ???????????? ???????? ?????? !"));
        }
    }

    return (
        <div>
            <Box mb={2}/>
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
            />
            <TablePro
                title="???????? ????????????????"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                filter="external"
                filterForm={<FilterForm fieldsInfo={fieldsInfo} formValues={filterFormValues} setFormValues={setFilterFormValues} setLoading={setLoading}/>}
                selectable
                singleSelect
                selectedRows={selectedPerson}
                setSelectedRows={setSelectedPerson}
                rowActions={[
                //     {
                //     title: "????????????",
                //     icon: VisibilityIcon,
                //     onClick: (row) => {
                //         observation(row);
                //     },
                // },
                {
                    title: "?????????????? ????????????",
                    icon: AccountBoxIcon,
                    onClick: (row) => {
                        personnelProfile(row);
                    },
                },{
                    title: "?????????????? ??????????????????",
                    icon: AssignmentTurnedInIcon,
                    onClick: (row) => {
                        talentProfile(row);
                    },
                }]}
                actions={[{
                    title: "???? ????????????????",
                    icon: ThumbDownIcon,
                    onClick: ()=> {
                        reject();
                    }
                },{
                    title: "???????? ????????????????",
                    icon: ThumbUpIcon,
                    onClick: ()=> {
                        accept();
                    }
                }]}
            />
        </div>
        
    );
};

export default VolunteerList;


function FilterForm ({...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo} = restProps;

    const [waiting, set_waiting] = useState(false) 

    const gender = useSelector(({fadak}) => fadak.constData.list.Gender);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        type    : "group" ,
        items   : [{
            name    : "firstName",
            label   : "??????",
            type    : "text",
            style   : {width : "50%"}
        },{
            name    : "lastName",
            label   : " ?????? ????????????????",
            type    : "text",
            style   : {width : "50%"}
        }],
        col     : 3
    },{
        name    : "knowCompanyEnumId",
        label   : "???????? ????????????",
        type    : "select",
        options : fieldsInfo.KnowCompanyType,
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 3
    },{
        name    : "relationshipType",
        label   : "?????? ????????????",
        type    : "select",
        options : [{enumId : "employee" , description : "????????????" },{enumId : "requestioner" , description : "????????????" }],
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 3
    },{
        name    : "gender",
        label   : "??????????",
        type    : "select",
        options : gender,
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 3 ,
    },{
        name    : "getToKnowTypeEnumId",
        label   : "???????? ???? ????????",
        type    : "select",
        options : fieldsInfo.GetToKnowType,
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 3 ,
    },{
        name    : "statusId",
        label   : "?????????? ????????????",
        type    : "select",
        options : fieldsInfo.status,
        optionLabelField :"description",
        optionIdField:"statusId",
        col     : 3 ,
    },{
        name    : "partyClassificationId",
        label   : "?????????? ???????? ??????????",
        type    : "select",
        options : fieldsInfo.Militarystate,
        optionLabelField :"description",
        optionIdField:"partyClassificationId",
        col     : 3 ,
    },{
        name    : "maritalStatusEnumId",
        label   : "?????????? ????????",
        type    : "select",
        options: "MaritalStatus" ,
        optionLabelField :"description",
        optionIdField:"statusId",
        col     : 3 ,
    },{
        name    : "qualificationTypeEnumId",
        label   : "????????",
        type    : "select",
        options : fieldsInfo.QualificationType,
        col     : 3 ,
    },{
        name    : "fieldEnumId",
        label   : "???????? ????????????",
        type    : "select",
        options : fieldsInfo.UniversityFields,
        col     : 3 ,
    },{
        name    : "birthFromDate",
        label   : "?????????? ???????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    },{
        name    : "birthThruDate",
        label   : "?????????? ???????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    },{
        name    : "joinFromDate",
        label   : "?????????? ???????????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    },{
        name    : "joinThruDate",
        label   : "?????????? ???????????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    },{
        name    : "fromInvitationDate",
        label   : "?????????? ???????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    },{
        name    : "thruInvitationDate",
        label   : "?????????? ???????? ???? ??????????",
        type    : "date",
        col     : 3 ,
    }]

    const filter = () => {
        setLoading(true)
    }

    const resetCallback = () => {

    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={filter}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >??????????</Button>
                <Button type="reset" role="secondary">??????</Button>
            </ActionBox>}
        />
    )
}

const useStyles = makeStyles({
    root: {
        "& label": {
            width: "100%",
            textAlign: "center",
            // transformOrigin: "center",
            //   "&.Mui-focused": {
            //     transformOrigin: "center"
            //   }
           }
    },
    noBorder: {
        borderTop : "none",
    },
});

function ShowNumber (props) {

    const {name, formValues, setFormValues, label} = props

    const cx = require('classnames');

    const classes = useStyles();
    return(
        <TextField type={"number"} name={name} label={label ?? ""} variant={"outlined"} fullWidth 
            disabled={true}
            value={formValues[name] ?? ""}
            onChange={e => {setFormValues(Object.assign({},formValues,{name : e.target.value}))}}
            className={cx(classes.root, 'read-only')}
            InputProps={{
                classes: {notchedOutline : classes.noBorder}
            }}
        />
    )
}