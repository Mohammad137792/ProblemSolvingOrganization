import React, { useState,useEffect } from 'react';
import TablePro from "../../components/TablePro";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";

const Achievement=({workEffortId,setChangeInTabs,audience})=>{
    const [loading, setLoading] = useState(true);
    const [Empolyee,SetEmpolyess]=useState([])
    const [bool,Setbool]=useState(false)
    const [parent,Setparent]=useState([]);
    const [table,Settable]=useState([]);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "workEffortName",
            label   : "عنوان دستاورد",
            type    : "text",
            col     : 3,
            required: true ,
            validator: values=>{
              return new Promise(resolve => {
                  if(values.workEffortName.replace(/ /g, '') == ""){
                      resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                  }else{
                      resolve({error: false, helper: ""})
                  }
              })
            }
        },{
            name    : "toWorkEffortId",
            label   : "اقدام مرتبط",
            type    : "select",
            options : parent,
            optionLabelField :"workEffortName",
            optionIdField:"workEffortId",
            col: 3,
            required:true
        },{
            label: "مسئول",
            name: "partyId",
            type: "select",
            options: Empolyee,
            optionLabelField: "fullName",
            optionIdField: "partyId",
            col: 3,
            required:true
        },{
            name    : "actualStartDate",
            label   : "تاریخ ثبت",
            type    : "date",
            col: 3,
        },{
            name    : "description",
            label   : "توضیحات",
            type    : "textarea",
            col     : 12
        }
    ]

    const tableCols= [
        { name: "workEffortName", label:"عنوان دستاورد", type: "text", },
        { name: "toWorkEffortId", label: "فعالیت مرتبط",type : "select",options : parent,optionLabelField :"workEffortName",optionIdField:"workEffortId"},
        { name: "partyId",label: "مسئول", type: "select",options: Empolyee,optionLabelField: "fullName",optionIdField: "partyId",},
        { name: "actualStartDate", label:  "تاریخ ثبت", type: "date" },
        { name: "description", label: "توضیحات", type: "text" },
    ]

    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            let send={
                "data":{
                "workEffortId":oldData.workEffortId,
                },
                "typeData":[{
                    "type":"Party",
                    "json":{
                        "fromDate":oldData.fromDateParty,
                        "workEffortId":oldData.workEffortId,
                        "partyId":oldData.partyId,
                        "roleTypeId":oldData.roleTypeId
                    }
                },{
                    "type":"Assoc",
                    "json":{
                        "workEffortId":oldData.workEffortId,
                        "fromDate":oldData.fromDateAssoc,
                        "toWorkEffortId":oldData.toWorkEffortId,
                        "workEffortAssocTypeEnumId":"WeatRelatesTo"
                    }
                }],
               
            }
            axios.post(SERVER_URL + "/rest/s1/workEffort/deleteWorkEffort",send, {
                headers: {'api_key': localStorage.getItem('api_key')},
            })
            .then((res) => {
                Setbool(!bool)
                resolve()
                setChangeInTabs(true)
            }).catch(() => {
                reject();
            });
        })
    }

    function GetData () {
        axios.get(SERVER_URL + "/rest/s1/workEffort/workeffort", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                workeffortTypeEnumId: "WetAchievement",
                rootWorkEffortId:workEffortId,
                typeData:"AssocAndParty"
            }
        }).then((res) => {
            Settable(res.data.result)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    function Employee () {
        axios.get(SERVER_URL +`/rest/s1/workEffort/entity/WorkeffortPartyView?workEffortId=${workEffortId}`, axiosKey)
        .then(response => {
            SetEmpolyess(response.data.WorkeffortParty)
        })
    }

    function Higheraction(){
        axios.get(SERVER_URL + "/rest/s1/workEffort/workeffort", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                workeffortTypeEnumId: "WetTask",
                rootWorkEffortId:workEffortId,
            }
        })
        .then((res) => {
            Setparent(res.data.resultWorkEffort)
        }); 
    }

    useEffect(() => {
        Higheraction()
    }, [])

    
    useEffect(() => {
        Employee() 
    }, [workEffortId,audience?.list])

    useEffect(() => {
        GetData()
    }, [bool])

    function Form ({formStructure, editing=false, setChangeInTabs, ...restProps}) {

        const {formValues, setFormValues, handleClose, setLoading} = restProps;

        const [formValidation, setFormValidation] = useState({});     
        const [waiting, set_waiting] = useState(false)         

        const handleSubmit = (assignedPersonsInfo) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            let send={
                "data":{
                "workEffortName":formValues.workEffortName,
                "workEffortTypeEnumId":"WetAchievement",
                "actualStartDate":formValues.actualStartDate,
                "rootWorkEffortId":workEffortId,
                "description":formValues.description,
                },
                "typeData":[{
                    "type":"Party",
                    "json":{
                        "partyId":assignedPersonsInfo.partyId,
                        "roleTypeId":assignedPersonsInfo.roleTypeId ,
                        "partyRelationshipId":assignedPersonsInfo.partyRelationshipId
                    }
                },{
                    "type":"Assoc",
                    "json":{
                        "workEffortId" : workEffortId ,
                        "toWorkEffortId": formValues.toWorkEffortId ? [formValues.toWorkEffortId] : [],
                        "workEffortAssocTypeEnumId":"WeatRelatesTo",
                        "fromDate" :  new Date()
                    }
                }],
            }
            axios.post(SERVER_URL +"/rest/s1/workEffort/modifyWorkEffort",send,axiosKey)
            .then((res) => {
                Setbool(!bool)
                resetCallback()
                setChangeInTabs(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                set_waiting(false)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }

        const handleEdit = (assignedPersonsInfo) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            let send={
                "data":{
                "workEffortId":formValues.workEffortId,
                "workEffortName":formValues.workEffortName,
                "actualStartDate":formValues.actualStartDate,
                "description":formValues.description,
                },
                "typeData":[{
                    "type":"Party",
                    "json":{
                        "fromDate":formValues.fromDateParty,
                        "workEffortId":formValues.workEffortId,
                        "partyId":assignedPersonsInfo.partyId,
                        "roleTypeId":assignedPersonsInfo.roleTypeId
                    }
                },{
                    "type":"Assoc",
                    "json":{
                        "workEffortId":formValues.workEffortId,
                        "fromDate":formValues.fromDateAssoc,
                        "toWorkEffortId":[formValues.toWorkEffortId],
                        "workEffortAssocTypeEnumId":"WeatRelatesTo"
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
        }

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
                            title="دستاوردها"    
                            columns={tableCols}
                            rows={table}
                            setRows={Settable}
                            loading={loading}
                            add="external"
                            addForm={<Form formStructure={formStructure} setChangeInTabs={setChangeInTabs} />}
                            edit="external"
                            editForm={<Form formStructure={formStructure} editing={true} setChangeInTabs={setChangeInTabs}  />}
                            removeCallback={handleRemove}
                            fixedLayout
                        />
                    </CardContent>
                </Card>
            </CardContent> 
        </Card>
    )
}
export default Achievement
