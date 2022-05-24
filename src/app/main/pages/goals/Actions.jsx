import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import TablePro from "../../components/TablePro";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../configs";
import { values } from 'lodash';
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";


const Actions=({workEffortId,setChangeInTabs,audience})=>{
 
    const [rowWorkEffortId,setRowWorkEffortId]=useState()
    const [employee,setEmployee]=useState([])
    const [bool,Setbool]=useState(false)
    const [loading, setLoading] = useState(true);
    const [table,Settable]=useState([]);
    const [parent,Setparent]=useState([]);
    const [statusIds,setStatusIds]=useState([]);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    const formStructure=[
        {
            name    : "workEffortName",
            label   : "عنوان اقدام",
            type    : "text",
            col     : 3,
            required: true,
        },{
            name    : "parentWorkEffortId",
            label   : "اقدام بالاتر",
            type    : "select",
            options : parent,
            optionLabelField :"workEffortName",
            optionIdField:"workEffortId",
            col     : 3,
        },{
            label: "مسئول",
            name: "partyId",
            type: "select",
            options: employee,
            optionLabelField: "fullName",
            optionIdField: "partyId",
            col     : 3,
            required: true,
        },{
            name    : "actualStartDate",
            label   : "تاریخ شروع",
            type    : "date",
            col     : 3,
        },{
            name    : "actualCompletionDate",
            label   : "تاریخ پایان",
            type    : "date",
            col     : 3,
        },{
            name    : "statusId",
            label   : "وضعیت",
            type    : "select",
            options : statusIds,
            optionLabelField :"description",
            optionIdField:"statusId",
            col     : 3,
        },{
            name    : "percentComplete",
            label   : "میزان پیشرفت",
            type    : "number",
            col     : 3,
        },{
            name    : "priority",
            label   : "ضریب اهمیت",
            type    : "number",
            col     : 3,
        },{
            name    : "description",
            label   : "توضیحات",
            type    : "textarea",
            col     : 12
        },
    ]

    const tableCols = [
        { name: "workEffortName", label:"عنوان اقدام", type: "text" },
        { name: "parentWorkEffortId", label: "اقدام بالاتر", type:"select",  options: parent, optionLabelField: "workEffortName", optionIdField:"workEffortId"},
        { name: "partyId",label: "مسئول", type: "select",options: employee,optionLabelField: "fullName",optionIdField: "partyId"},
        { name: "actualStartDate", label: "تاریخ شروع", type: "date" },
        { name: "actualCompletionDate", label: "تاریخ پایان", type: "date" },
        { name: "statusId", label: "وضعیت", type:"select" , options : statusIds , optionLabelField :"description" ,  optionIdField:"statusId" },
        { name: "percentComplete", label: "میزان پیشرفت", type: "text" },
        { name: "priority", label:"ضریب اهمیت", type: "text" },
        { name: "description", label:"توضیحات", type: "text"},
    ]

    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            let send={
                "typeData":[{
                    "type":"Party",
                    "json":{
                        "fromDate":oldData.fromDate,
                        // "workEffortId":oldData.workEffortId,
                        "partyId":oldData.partyId,
                        "roleTypeId":oldData.roleTypeId
                    }
                }],
                "data":{
                    "workEffortId":oldData.workEffortId
                },
               
            }
            axios.post(SERVER_URL +`/rest/s1/workEffort/deleteWorkEffort` ,send,axiosKey)
            .then((res) => {
                Setbool(!bool)
                resolve()
                setChangeInTabs(true)
            }).catch(() => {
                reject();
            });
        })
    }

    function GetStatusId () { 
        axios.get( SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=WorkEffort" , axiosKey)
        .then((res) => {
            setStatusIds(res.data.status)
        })
        .catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }    

    function Higheraction () {
        axios.get(SERVER_URL + `/rest/s1/workEffort/parentWorkeffortField?workeffortTypeEnumId=WetTask&rootWorkEffortId=${workEffortId}&workEffortId=${rowWorkEffortId ?? ""}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        })
        .then((res) => {
            Setparent(res.data.result)
        });
    }

    function Employee () {
        axios.get(SERVER_URL + `/rest/s1/workEffort/entity/WorkeffortPartyView?workEffortId=${workEffortId}`  , axiosKey)
        .then(response => {
            setEmployee(response.data.WorkeffortParty)
        })
    }

    function GetData () {
        axios.get(SERVER_URL + "/rest/s1/workEffort/workeffort", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                workeffortTypeEnumId: "WetTask",
                rootWorkEffortId:workEffortId,
                typeData:"party"
            }
        })
        .then((res) => {
            Settable(res.data.result)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    useEffect(() => {
        Employee() 
    }, [workEffortId,audience?.list])

    useEffect(() => {
     GetStatusId();
    }, [])

    useEffect(() => {
        GetData()
        Higheraction();
    }, [bool])

    function Form ({formStructure, editing=false,setChangeInTabs, ...restProps}) {

        const {formValues, setFormValues, handleClose, setLoadin, rowWorkEffortId, setRowWorkEffortId} = restProps;

        const [formValidation, setFormValidation] = useState({});  
        const [waiting, set_waiting] = useState(false)         

        const handleSubmit = (assignedPersonsInfo) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            return new Promise((resolve, reject) => {
                    let send={
                        "data":{
                        "workEffortName":formValues.workEffortName,
                        "workEffortTypeEnumId":"WetTask",
                        "priority":formValues.priority,
                        "actualStartDate":formValues.actualStartDate,
                        "rootWorkEffortId":workEffortId,
                        "parentWorkEffortId":formValues.parentWorkEffortId?formValues.parentWorkEffortId:'',
                        "percentComplete":formValues.percentComplete,
                        "actualCompletionDate":formValues.actualCompletionDate,
                        "statusId":formValues.statusId,
                        "description":formValues.description,
                        },
                        "typeData":[{
                            "type":"Party",
                            "json":{
                                "partyId":assignedPersonsInfo.partyId ,
                                "roleTypeId":assignedPersonsInfo.roleTypeId ,
                                "partyRelationshipId" : assignedPersonsInfo.partyRelationshipId
                            }
                        }]
                    }
                axios.post(SERVER_URL +"/rest/s1/workEffort/modifyWorkEffort",send,axiosKey)
                .then((res) => {
                    Higheraction();
                    Setbool(!bool)
                    resetCallback()
                    setChangeInTabs(true)
                    set_waiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                });
                    
            })
        }

        const handleEdit = (assignedPersonsInfo) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            let send={
                "data":{
                "workEffortId":formValues.workEffortId,
                "workEffortName":formValues.workEffortName,
                "priority":formValues.priority,
                "actualStartDate":formValues.actualStartDate,
                "parentWorkEffortId":formValues.parentWorkEffortId,
                "percentComplete":formValues.percentComplete,
                "actualCompletionDate":formValues.actualCompletionDate,
                "statusId":formValues.statusId,
                "description":formValues.description,
                },
                "typeData":[{
                    "type":"Party",
                    "json":{
                        "partyId":assignedPersonsInfo.partyId,
                        "roleTypeId":assignedPersonsInfo.roleTypeId,
                        "fromDate":formValues.fromDate
                    }
                }]
            }
            axios.put(SERVER_URL +"/rest/s1/workEffort/updateWorkEffort",send,axiosKey)
            .then((res) => {
                Setbool(!bool)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                resetCallback()
                setChangeInTabs(true)
                set_waiting(false)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            });
        }

        function getAssignedPersonsInfo () {
            let assignedPersonsInfo = {partyId : [] , roleTypeId : [] , partyRelationshipId : [] }
            axios
            .get(SERVER_URL + `/rest/s1/workEffort/entity/emplPartyRoleType?partyId=${JSON.parse(formValues.partyId)}`, axiosKey)
            .then((res) => {
                if(res.data.roleTypeId.length != 0){
                    res.data.roleTypeId.map((item , index)=>{
                    assignedPersonsInfo.partyId.push(item.partyId)
                    assignedPersonsInfo.roleTypeId.push(item.roleTypeId)
                    assignedPersonsInfo.partyRelationshipId.push(item.partyRelationshipId)
                    if (index == res.data.roleTypeId.length-1){
                        editing ? 
                        handleEdit(assignedPersonsInfo)
                        :
                        handleSubmit(assignedPersonsInfo)}
                    })
                }
            })
            .catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }

        const resetCallback = () => {
            setFormValues({})
            handleClose()
            setRowWorkEffortId()
        }

        useEffect(() => {
            if(formValues?.workEffortId && !rowWorkEffortId){
                setRowWorkEffortId(formValues?.workEffortId)
            }
        }, [formValues?.workEffortId])

        return(
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={getAssignedPersonsInfo}
                resetCallback={resetCallback}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary" 
                                    disabled={waiting}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}
                    >{editing?"ویرایش":"افزودن"}</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
            />
        )
    }

    return(
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <TablePro
                            title="اقدامات"
                            columns={tableCols}
                            rows={table}
                            setRows={Settable}
                            loading={loading}
                            add="external"
                            addForm={<Form formStructure={formStructure} rowWorkEffortId={rowWorkEffortId} setRowWorkEffortId={setRowWorkEffortId} setChangeInTabs={setChangeInTabs}/>}
                            edit="external"
                            editForm={<Form formStructure={formStructure} editing={true}  rowWorkEffortId={rowWorkEffortId} setRowWorkEffortId={setRowWorkEffortId} setChangeInTabs={setChangeInTabs}/>}
                            removeCallback={handleRemove}
                        />
                    </CardContent>
                 </Card>
            </CardContent> 
        </Card>
   
    )
}
export default Actions
