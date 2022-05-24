import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import { useHistory ,useLocation} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent, submitPost ,getWorkEffotr} from "../../../store/actions/fadak";
import TransferList from "../../components/TransferList";
import FilterGoalContact from "./FilterGoalContact"
import useListState from "../../reducers/listState";
import Goalstab from './Goalstab'
import CircularProgress from "@material-ui/core/CircularProgress";

const GoalsCourse=({Id,data})=>{
  const [createGoal,setCreateGoal] = useState(false);
  const [workEffortId,setWorkEffortId] = useState('');
  const [formValidation, setFormValidation] = useState({});
  const [formValues, setFormValues] = useState([]);
  const [filterFormValues, setFilterFormValues] = useState([]);
  const [userInfo,setUserInfo] = useState({}); 
  const [fieldInfo,setFieldInfo] = useState({status : [] , workEffortCategory : [] , positionsInfo : [] , unitInfo : [] });
  const workEffortSend = useSelector(({ fadak }) => fadak.workEffort);
  const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
  const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
  const [submitClicked, setSubmitClicked] = useState(0);
  const [cancelClicked, setCancelClicked] = useState(0);
  const [allData,setAllData] = useState([]);
  const personnel = useListState("partyId")
  const audience = useListState("partyId")
  const [changeInTabs,setChangeInTabs] = useState(false);
  const [employeeList,setEmployeeList] = useState();
  const [waiting, set_waiting] = useState(false)

  const goalSubmitRef = createRef(0);
  const goalCancelRef = createRef(0);
  const dispatch = useDispatch();
  let history = useHistory();

  const axiosKey = {
    headers: {
        'api_key': localStorage.getItem('api_key')
    }
  }

  const defineGoal=[
      {
          name    : "universalId",
          label   : "کد هدف",
          type    : "text",
          col     : 3,
          required: true ,
          validator: values=>{
            return new Promise(resolve => {
                if(values.universalId.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
          }
      }, 
      {
          name    : "workEffortName",
          label   : "عنوان هدف",
          type    : "text",
          col     : 3 ,
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
          name    : "category",
          label   : "دسته بندی",
          type    : "multiselect",
          options : fieldInfo.workEffortCategory ,
          optionLabelField :"description",
          optionIdField:"workEffortCategoryId",
          col     : 3,
      },{
          name    : "priority",
          label   : "وزن هدف",
          type    : "number",
          col     : 3,
      },
      {
          name    : "statusId",
          label   : "وضعیت",
          type    : "select",
          options : fieldInfo.status ,
          optionLabelField :"description",
          optionIdField:"statusId",
          col     : 3,
      },
      {
          name    : "percentComplete",
          label   : "درصدپیشرفت",
          type    : "number",
          col     : 3,
      },{
          name    : "actualStartDate",
          label   : "تاریخ ثبت هدف",
          type    : "date",
          disabled: true ,
          col     : 3,

      },{
          name    : "actualCompletionDate",
          label   : "سررسید هدف",
          type    : "date",
          col     : 3,

      },{
          name    : "description",
          label   : "توضیحات",
          type    : "textarea",
          col     : 12

      },
  ]
  
  function handleSubmit (assignedPersonsInfo) {
    dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
    set_waiting(true)
    const send = {
      "data" : {...formValues , workEffortTypeEnumId : "WetGoal" , ownerPartyId : partyIdLogin , ownerPartyRelationshipId : partyRelationshipId},
      "typeData":[
        {
          "type": "Appl",
          "json": { "workEffortCategoryId" : (formValues.category ? JSON.parse(formValues.category) : []) }
        },
        {
          "type":"Party",
          "json":{
            "partyId":assignedPersonsInfo.partyId ,
            "roleTypeId":assignedPersonsInfo.roleTypeId ,
            "partyRelationshipId" : assignedPersonsInfo.partyRelationshipId
          }
        }
      ]
    }
    axios.post(SERVER_URL +"/rest/s1/workEffort/modifyWorkEffort",send,axiosKey)
    .then((res) => {
      setWorkEffortId(res.data.resultId.workEffortId)
      setCreateGoal(true)
      load_personnel()
      load_audience()
      set_waiting(false)
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
    }).catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
    });
  }

  const getFieldsInfo = () => {
      axios.get(SERVER_URL + `/rest/s1/workEffort/defineGoalFields?partyRelationshipId=${partyRelationshipId}`, axiosKey)
      .then((res) => {
        setFieldInfo(Object.assign({},res.data.result))
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
      });
  }

  const getEmployeeInfo = () => {
    axios.get(SERVER_URL + `/rest/s1/workEffort/userInfo?partyRelationshipId=${partyRelationshipId}`, axiosKey)
    .then((res) => {
        setUserInfo(res.data.result)
        axios.get(SERVER_URL + `/rest/s1/workEffort/employeeInfo`, axiosKey)
        .then((res) => {
          setEmployeeList(res.data.result.filter((item) => item.roleTypeId != ""))
        })
    })
  }

  const filter_audience = (parties) => {
    if(audience.list.length != 0) {
      if(userInfo?.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo?.hasOwnerPartyId &&  userInfo?.hasOwnerPartyId == "_NA_"){
        return parties.filter(i => i?.roleTypeId  && i?.roleTypeId !== "" && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0)
      }
      if(userInfo?.roleOfUser?.roleTypeId == "OrgRManager" ){
        return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId && (i?.roleTypeId === "OrgRManager" || i?.roleTypeId === "Employee" ) && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0)
      }
      if(userInfo?.roleOfUser?.roleTypeId == "Employee" ){
        return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId &&  i?.roleTypeId === "Employee" && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0)
      }
      if(userInfo?.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo?.hasOwnerPartyId &&  userInfo?.hasOwnerPartyId != "_NA_"){
        return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0)
      }
      if(userInfo?.roleOfUser?.roleTypeId == "OrgRManager" ){
        return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId && (i?.roleTypeId === "OrgRManager" || i?.roleTypeId === "Employee" ) && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0)
      }
      if(userInfo?.roleOfUser?.roleTypeId == "Employee" ){
        return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId &&  i?.roleTypeId === "Employee" && audience.list.findIndex(j => j?.partyId === i?.partyId) < 0 )
      }
    }else{
        if(userInfo?.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo?.hasOwnerPartyId &&  userInfo?.hasOwnerPartyId == "_NA_"){
          return parties.filter(i => i?.roleTypeId  && i?.roleTypeId !== "" )
        }
        if(userInfo?.roleOfUser?.roleTypeId == "OrgRManager" ){
          return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId && (i?.roleTypeId === "OrgRManager" || i?.roleTypeId === "Employee" ))
        }
        if(userInfo?.roleOfUser?.roleTypeId == "Employee" ){
          return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId &&  i?.roleTypeId === "Employee" )
        }
        if(userInfo?.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo?.hasOwnerPartyId &&  userInfo?.hasOwnerPartyId != "_NA_"){
          return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId )
        }
        if(userInfo?.roleOfUser?.roleTypeId == "OrgRManager"){
          return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId && (i?.roleTypeId === "OrgRManager" || i?.roleTypeId === "Employee" ))
        }
        if(userInfo?.roleOfUser?.roleTypeId == "Employee" ){
          return parties.filter(i => i?.companyPartyId == userInfo?.orgOfUser?.toPartyId &&  i?.roleTypeId === "Employee" )
        }
    }
  }

  const load_personnel = () => {
    let list = []
    if(employeeList.length != 0){
      employeeList.map((e,i)=>{
        e = {...e , checked: false}
        list.push(e)
        if(i == employeeList.length-1){
          personnel.set(filter_audience(list))
          setAllData(filter_audience(list))
        }
      })
    }
    else{
      personnel.set(filter_audience(list))
      setAllData(filter_audience(list))
    }
  }

  const load_audience = (rowData) => {
      if(workEffortId && employeeList){
          axios.get(SERVER_URL + `/rest/s1/workEffort/goalContactInfo?workEffortId=${workEffortId}`, axiosKey)
          .then((res) => {
              let tableData = []
              if(res.data.result.length != 0){
                  res.data.result.map((item , index)=>{                  
                      const ind = employeeList.findIndex(i=> i.partyRelationshipId == item.partyRelationshipId )
                      tableData.push({...employeeList[ind], disabled : item.disabled , fromDate : item.fromDate , workEffortId : item.workEffortId , checked : false})
                      if ( index == res.data.result.length-1){
                          audience.set(tableData)
                      }
                  })
              }
              else {
                  audience.set([])
              }
          })
      }
      else{
          audience.set([])
      }
  }

  function getAssignedPersonsInfo () {
    let assignedPersonsInfo = {partyId : [] , roleTypeId : [] , partyRelationshipId : []}
    if(audience.list.length != 0){
      let partyIdList = []
      audience.list.map((e,i)=>{
        partyIdList.push(e.partyId) 
        if ( i == audience.list.length-1){
          axios
          .get(SERVER_URL + `/rest/s1/workEffort/entity/emplPartyRoleType?partyId=${partyIdList}`, axiosKey)
          .then((res) => {
            if(res.data.roleTypeId.length != 0){
              res.data.roleTypeId.map((item , index)=>{
                assignedPersonsInfo.partyId.push(item.partyId)
                assignedPersonsInfo.roleTypeId.push(item.roleTypeId)
                assignedPersonsInfo.partyRelationshipId.push(item.partyRelationshipId)
                if (index == res.data.roleTypeId.length-1){
                  createGoal ? 
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
      })
    }
    else{
      dispatch(setAlertContent(ALERT_TYPES.ERROR,"برای ثبت هدف، مخاطبی انتخاب نشده است"));
    }
  }

  useEffect(() => {
    if(partyRelationshipId){
      getFieldsInfo()
      getEmployeeInfo()
    }
  }, [partyRelationshipId])
  
  useEffect(() => {
    if(employeeList) {
      load_personnel()
    }
  }, [audience?.list])  

  useEffect(() => {
    if(employeeList) {
      load_audience()
    }
  }, [workEffortId,employeeList])  

  useEffect(() => {
    if(!workEffortSend.workEffortId && employeeList){
      let moment = require('moment-jalaali')
      const formDefaultValues = {
          actualStartDate: moment().format("Y-MM-DD") ,
      }
      setFormValues(formDefaultValues)
    }
    if(workEffortSend.workEffortId && employeeList ){
      let editData ={...workEffortSend , category : JSON.stringify(workEffortSend.category) }
      setWorkEffortId(workEffortSend.workEffortId)
      setCreateGoal(true)
      setFormValues(editData)
    }
  }, [workEffortSend,employeeList])

  function trigerHiddenSubmitBtn() {
    setSubmitClicked(submitClicked + 1);
  }

  function trigerHiddenCancelBtn() {
    setCancelClicked(cancelClicked + 1);
  }

  React.useEffect(() => {
    if (goalCancelRef.current && submitClicked > 0) {
      goalSubmitRef.current.click();
    }
  }, [submitClicked]);

  React.useEffect(() => {
    if (goalCancelRef.current &&  cancelClicked > 0) {
      goalCancelRef.current.click();
    }
  }, [cancelClicked]);

  const handleEdit = (assignedPersonsInfo) => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
    set_waiting(true)
    const send = {
      "data" : {...formValues , workEffortTypeEnumId : "WetGoal" , ownerPartyId : partyIdLogin , ownerPartyRelationshipId : partyRelationshipId , workEffortId : workEffortId},
      "typeData":[
        {
          "type": "Appl",
          "json": { "workEffortCategoryId" : formValues.category ? JSON.parse(formValues.category) : [] }
        }
      ]
    }
    axios.put(SERVER_URL +"/rest/s1/workEffort/updateWorkEffort",send,axiosKey)
    .then((res) => {
      resetCallback()
      set_waiting(false)
      dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
    }).catch(() => {
      dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
    });
  }

  const resetCallback = () => {
    if(!workEffortId || workEffortId == ""){
      load_personnel()
      load_audience()
    }
    setFormValues({})
    setWorkEffortId()
    setCreateGoal(false)
    dispatch(getWorkEffotr([]))
  }

  
  const handle_add_participant = (parties) => new Promise((resolve, reject) => {
      if(!createGoal){resolve(parties)}
      if(createGoal){
        axios.post(SERVER_URL + `/rest/s1/workEffort/addGoalContact?fromDate=${new Date().getTime()}&workEffortId=${workEffortId}`, {addList : parties},axiosKey)
        .then((res) => {
            // resolve(parties)
            load_audience()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در افزودن مخاطب !'));
        });
      }
    
  })

  const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
      if(!createGoal){resolve(parties)}
      if(createGoal){
        axios.post(SERVER_URL +"/rest/s1/workEffort/dropGoalContact", {dropList : parties.filter(i => i.disabled == false) },axiosKey)
        .then((res) => {
            load_audience()

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در حذف مخاطب !'));
        });
      }
  })

  const display_name = (item) => `${item.fullName}`

  const display_org_info = (item) => {
      let info = []
      if(item?.partyRelationshipId) info.push(item?.mainPositionName)
      if(item?.partyRelationshipId) info.push(item?.mainUnitName)
      if(item?.partyRelationshipId) info.push(item?.companyName)
      return info.join("، ") || "─"
  }

  useEffect(() => {
     
    if (history.action === 'PUSH') {
      // setFormValues(workEffortSend)
    }

    if (history.action === 'POP') {
      dispatch(getWorkEffotr([]))
   
    }

  }, [ ])

  useEffect(() => {
    return history.listen((location) => {
        if(location.pathname)

        dispatch(getWorkEffotr([]))
        console.log("ffffff",location.pathname)

    })
  },[history])

  React.useEffect(() => {
    if (changeInTabs) {
      load_audience()
      setChangeInTabs(false)
    }
  }, [changeInTabs]);

  return(
    <Card>
      <CardContent>
        <Card>

          <CardContent>
            <CardHeader title="تعریف هدف"/>
              <FormPro
                formValues = {formValues}
                setFormValues = {setFormValues}
                append={defineGoal}
                formValidation = {formValidation}
                setFormValidation = {setFormValidation}
                submitCallback = {getAssignedPersonsInfo}
                resetCallback={resetCallback}
                actionBox={<ActionBox>
                  <Button
                    ref={goalSubmitRef}
                    type="submit"
                    role="primary"
                    style={{ display: "none" }}
                  />
                  <Button
                  ref={goalCancelRef}
                  type="reset"
                  role="secondary"
                  style={{ display: "none" }} 
                  />
                </ActionBox>}
              />
          </CardContent>
        </Card>
        <Box m={2}/>
        <Card>
          <CardContent>
            <CardHeader title="تخصیص هدف"/>
            <TransferList
                rightTitle="لیست پرسنل"
                rightContext={personnel}
                rightItemLabelPrimary={display_name}
                rightItemLabelSecondary={display_org_info}
                leftTitle="لیست مخاطبان"
                leftContext={audience}
                leftItemLabelPrimary={display_name}
                leftItemLabelSecondary={display_org_info}
                onMoveLeft={handle_add_participant}
                onMoveRight={handle_delete_participant}
                rightFilterForm={
                    <FilterGoalContact tableContent={allData} setTableContent={personnel} formValues={filterFormValues} setFormValues={setFilterFormValues} />
                }
            />
          </CardContent>
        </Card>  
        <Box m={2}/>
        <div
            style={{display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            style={{
              width: "70px",
              color: "secondary",
            }}
            variant="outlined"
            type="reset"
            role="secondary"
            onClick={trigerHiddenCancelBtn}
          >
            {" "}لغو{" "}
          </Button>
          <Button
            style={{
              width: 140,
              color: "white",
              backgroundColor: "#039be5",
              marginRight: "8px",
            }}
            variant="outlined"
            type="submit"
            role="primary"
            onClick={trigerHiddenSubmitBtn}
            disabled={waiting}
            endIcon={waiting?<CircularProgress size={20}/>:null}
          >
            {" "}{createGoal ? "ویرایش هدف" : "افزودن هدف"}{" "}
          </Button>
        </div>
          <Box m={2}/>
          {createGoal ? 
            <Goalstab 
              content={workEffortId}
              setChangeInTabs={setChangeInTabs}
              audience={audience}
            />: ''
          }
      </CardContent>
    </Card>
  )
}
export default GoalsCourse;
