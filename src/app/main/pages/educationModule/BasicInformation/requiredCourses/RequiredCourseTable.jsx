import React, { useState, useEffect } from 'react'
import TablePro from "../../../../components/TablePro";
import FormPro from 'app/main/components/formControls/FormPro';
import { Button, } from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {useSelector , useDispatch} from "react-redux";
import {Card, CardContent, CardHeader ,Grid} from "@material-ui/core"
import DependentTable from './DependentTable';
import AddedCourseList from './AddedCourseList/AddedCoursesList';
import FilterForm from './FilterForm';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import CreateIcon from '@material-ui/icons/Create';
import ModalPro from "../../../../components/ModalPro";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom'
import CircularProgress from "@material-ui/core/CircularProgress";
import FormInput from "../../../../components/formControls/FormInput";

const RequiredCourseTable = ({handleTable=true,...props}) => {
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [selectCurriculumCourse, setSelectCurriculumCourse] = React.useState([])
    const [showDependentTable,setShowDependentTable] = React.useState(false);
    const [reset,setReset] = React.useState(true);
    const [showForm,setShowForm] = useState(false);
    const [showCurriculum,setShowCurriculum] = useState(false);
    const [formValidation, setFormValidation] = React.useState({});
    const [requirement, setRequirement] = useState();
    const [fieldInfo,setFieldInfo] = useState({ requirmentList : [] , companyPartyId : ""});
    const [dependentTableInformation,setDependentTableInformation] = React.useState({});
    const [displayDialog,setDisplayDialog] = React.useState(false);
    const [planningTableContent,setPlanningTableContent] = React.useState([]);
    const dispatch = useDispatch();
    const history = useHistory()
    const {curriculumId,sendtoVerification,tableCurriculumId, formVariables} = props
    const [waiting, set_waiting] = useState(false)
    const [confirmWaiting, set_confirmWaiting] = useState(false)
    const [headerFormValue, setHeaderFormValue] = useState([])
    const moment = require("moment-jalaali");

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const choseFormStructure = [
        { name: "requirement",  label:  "عنوان نیازسنجی", type: 'select', options: fieldInfo.requirmentList , optionLabelField: "title" , optionIdField: "curriculumId" , required: true ,
        filterOptions   : options => options.filter(o=>o.companyPartyId == fieldInfo.companyPartyId)}
    ]

    const tableCols = [
        {name: "category", label: "نوع دوره", type: "select", options: "CourseCategory", style: {minWidth:"60px"}},
        {name: "title", label: "عنوان دوره", type: "text" , style: {minWidth:"80px"}},
        {name: "type", label: "وضعیت دوره", type: "select" , options: "CourseType", style: {minWidth:"60px"}},
        {name: "holdType", label: "نحوه ی برگزاری", type: "select", options: "HoldType", style: {minWidth:"60px"}},
        {name: "fromDate", label: "تاریخ شروع", type: "date" , style: {minWidth:"60px"}},
        {name: "thruDate", label: "تاریخ پایان", type: "date", style: {minWidth:"60px"}},
        {name: "duration", label: "مدت ساعت", type: "number" , style: {minWidth:"60px"}},
        {name: "organizationName", label: "موسسه ارائه دهنده", type: "text" , style: {minWidth:"60px"}},
        {name: "instructor", label: "مدرس دوره", type: "text" , style: {minWidth:"80px"}},
        {name: "cost", label: "هزینه دوره", type: "number" , style: {minWidth:"60px"}},
        {name: "applicationFee", label: "هزینه شرکت در دوره", type: "number", style: {minWidth:"60px"}},
        {name: "status", label: "وضعیت بررسی", type: "text" , style: {minWidth:"120px"}},
    ]

    const topFormStructure = [
        {
            name: "title",
            label: "عنوان برنامه آموزشی ",
        },
        {
            name: "code",
            label: "کد برنامه آموزشی",
        },
        {
            name: "fromDate",
            label: "تاریخ شروع تدوین برنامه اموزشی",
            type: "date"
        },
        {
            name: "emplPositionDescription",
            label: "مسئول تدوین برنامه اموزشی"
        }
    ]

    React.useEffect(()=>{
        if(reset){
            axios.get(`${SERVER_URL}/rest/s1/training/requiredCourseFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
                fieldInfo.requirmentList = res.data.requirmentList
                fieldInfo.companyPartyId = res.data.userCompanyPartyId
                setFieldInfo(Object.assign({},fieldInfo))
                if(requirement?.requirement){
                    axios.get(`${SERVER_URL}/rest/s1/training/filterRequiredCourse?pageSize=100000&partyRelationshipId=${partyRelationshipId}&requirement=${requirement?.requirement ?? ""}&status=PlannedInNeeds&curriculumId=${curriculumId}`, axiosKey).then(filter => {
                        setTableContent(filter.data.filter)
                        setLoading(false)
                        setReset(false)
                    })
                }
                else{
                    if(handleTable){
                        setTableContent([])
                        setLoading(false)
                        setReset(false)
                    }
                    else{
                        axios.get(`${SERVER_URL}/rest/s1/training/filterRequiredCourse?pageSize=100000&partyRelationshipId=${partyRelationshipId}&requirement=${tableCurriculumId ?? ""}&status=PlacedInCurriculum`, axiosKey).then(filter => {
                            setTableContent(filter.data.filter)
                            setLoading(false)
                            setReset(false)
                        })
                    }

                }
                axios.get(`${SERVER_URL}/rest/s1/training/filterRequiredCourse?pageSize=100000&partyRelationshipId=${partyRelationshipId}&requirement=${curriculumId}&status=PlacedInCurriculum`, axiosKey).then(filter => {
                    setPlanningTableContent(filter.data.filter)
                })
            })
        }
    },[reset,partyRelationshipId])

    const handleDependentTable = (rowData) =>{
        setShowDependentTable(true)
        setDependentTableInformation(rowData)
    }

    const handleAdd = () =>{
        if(selectCurriculumCourse.length != 0){setDisplayDialog(true)}
        else{dispatch(setAlertContent(ALERT_TYPES.ERROR, 'دوره ای برای اضافه شدن به برنامه انتخاب نشده است'));}
    }
    
    const handlCloseDialog = () =>{
        setDisplayDialog(false)
        set_confirmWaiting(false)
    }

    const handleConfirm = () =>{
        if(selectCurriculumCourse.length != 0){
            set_confirmWaiting(true)
            axios.post(SERVER_URL + `/rest/s1/training/CurriculumCourse?curriculumId=${curriculumId}` , {postData : selectCurriculumCourse}  , axiosKey)
            .then(newCourse=>{
                // history.push(`/AddedCourseList/${curriculumId}`);
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات افزودن موفقیت آمیز بود.'))
                setReset(true)
                setLoading(true)
                setDisplayDialog(false)
                setSelectCurriculumCourse([])
                setPlanningTableContent(selectCurriculumCourse)
                set_confirmWaiting(false)
            }).catch(()=>{
                setDisplayDialog(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'عملیات افزودن موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'))
                set_confirmWaiting(false)
            })
        }
    }

    const initFilter = () =>{
        setShowForm(true)
        setReset(true)
        setLoading(true)
        setSelectCurriculumCourse([])
    }
    
    const showPlan = () => {
        setShowCurriculum(true)
        // history.push(`/AddedCourseList/${curriculumId}`);
    }

    function editCourseValidation(curriculumCourseId){
        axios
        .get(
          SERVER_URL + "/rest/s1/training/editCourseValidation",
          {cuId:curriculumCourseId},
          axiosKey
        )
        .then((res) => {
            if(res.data.validation==200){
                history.push(`/studyneedAssessment/${curriculumCourseId}`)
            }
            else if(res.data.validation==400){
                dispatch(
                    setAlertContent(
                      ALERT_TYPES.WARNING,
                      "این دوره قابل ویرایش نیست."
                    )
                  ); 
            }
            else{
                dispatch(
                    setAlertContent(
                      ALERT_TYPES.ERROR,
                      "دوره مورد نظر یافت نشد." 
                    )
                  ); 
            }
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
    }

    function submitProcessForm(selected){
        if(selected.length == 0){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "دوره ای برای برنامه آموزشی انتخاب نشده است!"));
        }else{
            
            set_waiting(true)
            sendtoVerification()
        }
    }

    React.useEffect(()=>{
        if(formVariables){
            setHeaderFormValue({
                emplPositionDescription: formVariables?.value.emplPositionDescription,
                title: formVariables?.value.title,
                code: formVariables?.value.code,
                fromDate: moment(formVariables?.value.fromDate).format("jYYYY/jM/jD")
            }) 
        }
    },[formVariables])

    return(
        <Box>
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{ width: "auto" }}>
                    {topFormStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={headerFormValue} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {!showCurriculum && <Card>
                <CardContent>
                    {handleTable ?
                        <FormPro
                            prepend={choseFormStructure}
                            formValues={requirement} setFormValues={setRequirement}
                            formValidation={formValidation}
                            setFormValidation={setFormValidation}
                            submitCallback={initFilter}
                            actionBox={
                                <ActionBox>
                                    <Button type="submit" role="primary" >مشاهده </Button>
                                </ActionBox>
                            }
                        />
                    :""}
                    {(showForm && handleTable) ? 
                        <>
                            <TablePro
                                title="دوره های درخواستی طی نیازسنجی سالانه"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                filter="external"
                                filterForm={<FilterForm tableContent={tableContent} setTableContent={setTableContent} loading={loading} setLoading={setLoading} reset={reset} setReset={setReset}/>}
                                loading={loading}
                                selectable
                                selectedRows={selectCurriculumCourse}
                                setSelectedRows={setSelectCurriculumCourse}
                                multiSelect
                                rowActions={[{
                                    title: "لیست شرکت کنندگان دوره",
                                    icon: VisibilityIcon ,
                                    onClick: (row)=>{
                                        handleDependentTable(row)
                                    }
                                },
                                {
                                    title: "ویرایش دوره",
                                    icon: CreateIcon,
                                    onClick: (row) => {
                                        editCourseValidation(row.curriculumCourseId);
                                    },
                                }
                            ]}
                                actions={[{
                                    title: "افزودن به برنامه",
                                    icon: AddIcon ,
                                    onClick: () => {
                                        handleAdd()
                                    }
                                },{
                                    title: "مشاهده برنامه",
                                    icon: VisibilityIcon ,
                                    onClick: () => {
                                        showPlan()
                                    }
                                }
                            ]}
                            />
                            <ActionBox>
                                <Button type="submit" disabled={waiting} endIcon={waiting ?<CircularProgress size={20}/>:null} role="primary" onClick={()=>{submitProcessForm(planningTableContent)}}>ادامه فرایند</Button>
                            </ActionBox>
                        </>
                    :"" } 
                    {!handleTable ?
                        <TablePro
                            title="دوره های درخواستی طی نیازسنجی سالانه"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                        />
                    :""}
                </CardContent>
                <ModalPro
                    open={showDependentTable}
                    setOpen={setShowDependentTable}
                    content={
                        <Box p={5}>
                            <DependentTable rowData={dependentTableInformation}/>
                        </Box>
                    }
                />
                <Dialog open={displayDialog}
                    onClose={handlCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">با افزودن دوره های زیر به برنامه موافق هستید ؟</DialogTitle>
                    <DialogContent>
                    {selectCurriculumCourse.map((item , index)=>
                        <DialogContentText>
                            {`${index+1} - ${item.title}`}
                        </DialogContentText>
                    )}   
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirm} disabled={confirmWaiting} endIcon={confirmWaiting ?<CircularProgress size={20}/>:null} color="primary">تایید</Button>
                        <Button onClick={handlCloseDialog} color="primary" autoFocus>لغو</Button>
                    </DialogActions>
                </Dialog>
            </Card>}
            {showCurriculum &&
            <AddedCourseList curriculumId={curriculumId} setShowCurriculum={setShowCurriculum} planningTableContent={planningTableContent} setPlanningTableContent={setPlanningTableContent}/>
            }
        </Box>
    )
};

export default RequiredCourseTable;