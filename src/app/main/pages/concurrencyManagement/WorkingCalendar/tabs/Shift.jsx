import React, { useEffect, useState, createRef } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Typography, TextField, Grid, Divider, InputAdornment  } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import {useSelector , useDispatch} from "react-redux";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";


const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red",
        borderWidth: "1px",
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& label span": {
            color: "red"
        }

    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        },
    }
}));

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        width: "100%",
        "& label span": {
            color: "red"
        }

    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
});

export default function Shift() {

    const [formValues, setFormValues] = useState({statusId : "Y"})
    const [formValidation, setFormValidation] = React.useState({});

    const [showInlineTable , setShowInlineTable] = useState({})

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [tableContentDetails, setTableContentDetails] = useState([])
    const [loadingDetails, setLoadingDetails] = useState(false)

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [editingShift,setEditingShift] = useState(false)

    const [editing, setEditing] = useState(false)

    const [showForm, setShowForm] = useState(false)
    
    const [detailFormValues, setDetailFormValues] = useState({})

    const [displayDialog, setDisplayDialog] = useState(false)

    const [deletedData, setDeletedData] = useState ({})

    const [rowData, setRowData] = useState({})

    const [shiftId, setShiftId] = useState("")

    const [clicked, setClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);

    const [waiting, set_waiting] = useState(false) 

    const submitRef = createRef(0);
    const cancelRef = createRef(0);

    const dispatch = useDispatch();

    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    // functions and form structure of main part in shift page

    const formStructure = [{
        name: "code",
        label: "کد شیفت ",
        type: "text",
        validator: values => {
            const ind = tableContent.findIndex(i=>i.code===values.code && i?.shiftWorkId !== values?.shiftWorkId)
            return new Promise((resolve, reject) => {
                if(ind>-1){
                    resolve({error: true, helper: "کد وارد شده تکراری می باشد !"})
                }
                else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : true,
        col : 2
    },{
        name: "title",
        label: "عنوان شیفت",
        type: "text",
        required : true,
        col : 3
    },{
        name: "statusId",
        label: "وضعیت",
        type: "indicator",
        col : 1
    },{
        name: "colorEnumId",
        label: "  رنگ شیفت",
        type: "select",
        options: fieldsInfo?.color ,
        optionLabelField :"description",
        optionIdField:"enumId",
        col : 2
    },{
        name: "typeEnumId",
        label: " نوع شیفت",
        type: "select",
        options: fieldsInfo?.shiftType ,
        optionLabelField :"description",
        optionIdField:"enumId",
        required : true,
        readOnly : editingShift ,
        col : 2
    },{
        name: "shiftDuration",
        label: "طول شیفت ",
        type: "text",
        display:formValues?.typeEnumId == "SWTWorkDay" ? true : false  ,
        readOnly : true ,
        col : 2
    }]

    const tableCols = [{
        name: "code",
        label: "کد شیفت",
        type: "text",
    },{
        name: "title",
        label: " عنوان شیفت",
        type: "text",
    },{
        name: "statusId",
        label: "فعال ",
        type: "indicator",
    },{
        name: "typeEnumId",
        label: " نوع شیفت",
        type: "select",
        options: fieldsInfo?.shiftType ,
        optionLabelField :"description",
        optionIdField:"enumId",
    }]

    React.useEffect(()=>{
        getInitialData()
    },[])

    React.useEffect(()=>{
        if(loading){
            getTableContent()
        }
    },[loading])

    React.useEffect(()=>{
        if(loadingDetails && shiftId !== null && shiftId !== undefined){
            getDetailTableContent()
        }
    },[loadingDetails,shiftId])

    const getInitialData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/ShiftFieldsData`, axiosKey).then((info)=>{
            setFieldsInfo(info.data?.listsData)
            axios.get(`${SERVER_URL}/rest/s1/functionalManagement/shift`, axiosKey).then((table)=>{
                setTableContent(table.data?.list)
                setLoading(false)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            })
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const getTableContent = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/shift`, axiosKey).then((table)=>{
            setTableContent(table.data?.list)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const getDetailTableContent = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/ShiftFactor?shiftWorkId=${shiftId}`, axiosKey).then((table)=>{
            if(table.data?.list.length > 0){
                let tableData = []
                table.data.list.map((item,index)=>{
                    let eachRowData = {
                        ...item,
                        fromTime : item?.fromTime?.slice(0, -3) ,
                        floatingTime : convertNumberToTime(item?.floating),
                        duration : convertNumberToTime(item?.durationTime),
                        thruTime : calculateThruTime(item?.fromTime?.slice(0, -3),convertNumberToTime(item?.durationTime))
                    }
                    tableData.push(eachRowData)
                    if(index == table.data?.list.length-1){
                        setTableContentDetails(tableData)
                        setLoadingDetails(false)
                    }
                })
            }
            if(table.data?.list.length == 0){
                setTableContentDetails([])
                setLoadingDetails(false)
            }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleSubmit = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/shift` , {data : {...formValues , statusId : (formValues?.statusId == "Y") ? "SWSActive" : "SWSNotActive" } , shiftDetail : tableContentDetails} , axiosKey).then((response)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            setLoading(true)
            handleReset()
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
     }

    const handleEdit = (rowData) => {
        setFormValues(rowData) 
        setEditingShift(true)
        setShiftId(rowData?.shiftWorkId)
        setLoadingDetails(true)
    }

    const handlePutRequest = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/shift` , {data : {...formValues , statusId : (formValues?.statusId == "Y") ? "SWSActive" : "SWSNotActive"} } , axiosKey).then((response)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            setLoading(true)
            handleReset()
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const handlerRemove = (rowData) => { 
        axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/shift?shiftWorkId=${rowData?.shiftWorkId}` , axiosKey).then((response)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ردیف مورد نظر با موفقیت حذف شد.'));
            setLoading(true)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در عملیات حذف!'));
        })
    }

    const handleReset = () => {
        setFormValues({statusId : "Y"})
        setEditing(false)
        setEditingShift(false)
        setShowForm(false)
        setShiftId("")
        setShowInlineTable(false)
        set_waiting(false)
        setRowData({})
        setDeletedData({})
        setDisplayDialog(false)
        setDetailFormValues({})
        setFormValidation({})
        setTableContentDetails([])
     }

     React.useEffect(()=>{
        if(formValues?.code && formValues?.code != ""){
            formValues.code = formValues?.code.replace(/[^A-Za-z0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.code])

    useEffect(() =>{
        if(formValues.typeEnumId && formValues.typeEnumId == "SWTWorkDay"){
            setShowInlineTable(true)
        }
        if(!formValues.typeEnumId || formValues.typeEnumId !== "SWTWorkDay"){
            setShowInlineTable(false)
        }
    } ,[formValues?.typeEnumId])

    /* ################################################## table Details ############################################### */

    const tableColsDetails = [{
            name: "workedFactorTypeId",
            label: "عامل کاری",
            type: "select",
            options: fieldsInfo?.workFactorDetail ,
            optionLabelField :"title",
            optionIdField:"workedFactorTypeId",
        },{
            name: "fromTime",
            label: "از ساعت",
            type: "text",
        },{
            name: "duration",
            label: "مدت شیفت",
            type: "text",
        },{
            name: "thruTime",
            label: " تا ساعت ",
            type: "text",
        },{
            name: "floatingTime",
            label: "میزان شناوری",
            type: "text",

        },


    ]

    const handleEditDetails = (rowData) => {
        setRowData(rowData)
        setEditing(true)
        setShowForm(true)
        setDetailFormValues(Object.assign({},rowData))
     }

    const handlerRemoveDetails = (rowData) => { 
        return new Promise((resolve, reject) => {
            if(editingShift){
                axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/ShiftFactor?shiftWorkedFactorId=${rowData?.shiftWorkedFactorId}` , axiosKey).then((response)=>{
                    resolve()
                }).catch(()=>{
                    reject()
                })
            }
            else {
                // const index = tableContentDetails.indexOf(rowData);
                // if (index > -1) {
                //     tableContentDetails.splice(index, 1);
                //     setTableContentDetails(Object.assign([],tableContentDetails))
                // }
                resolve()
            }
        })
    }

    /* ################################################## dialog window and ref button configs  ############################################### */

    const handleOpenDialog = (rowData) => {
        setDisplayDialog(true)
        setDeletedData(rowData)
    }

    const handleCloseDialog = () => {
        setDisplayDialog(false)
        handlerRemove(deletedData)
    }

    React.useEffect(() => {
        if (cancelRef.current && cancelClicked > 0) {
          cancelRef.current.click();
        }
    }, [cancelClicked]);

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
            submitRef.current.click();
        }
    }, [clicked]);

    function trigerHiddenSubmitBtn() {
        setClicked(clicked + 1);
    }
    
    function trigerHiddenCancelBtn() {
        setCancelClicked(cancelClicked + 1);
    }

    // calculation functions 
    
    const convertNumberToTime = (number) => {
        let hours = Math.floor(number/60) 
        let minutes = number - ( 60 * hours )
        let ShowHours = hours>9 ? `${hours}` : `0${hours}`
        let showMinutes = minutes>9 ? `${minutes}` : `0${minutes}`
        return (`${ShowHours}:${showMinutes}`)
    }

    const calculateThruTime = (fromTime,duration) => {
        var fromTimeHour = 0
        var fromTimeMinutes = 0
        var durationHour = 0
        var durationMinutes = 0
        if(fromTime && fromTime !== ""){
            var hoursMinutes = fromTime.split(/[.:]/);
            fromTimeHour = parseInt(hoursMinutes[0], 10);
            fromTimeMinutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        }
        if(duration && duration !== ""){
            var hoursMinutes = duration.split(/[.:]/);
            durationHour = parseInt(hoursMinutes[0], 10);
            durationMinutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        }
        var totalMinutes = durationMinutes + fromTimeMinutes
        var addedHour = totalMinutes > 59 ? 1 : 0 
        var totalHour = fromTimeHour + durationHour + addedHour
        var day = Math.floor(totalHour/24)
        var dayHour = totalHour - (24 * day)
        var dayMinutes = (totalMinutes % 60)
        if (day == 0){ return (`امروز ${dayMinutes} : ${dayHour}`)}
        if(day == 1){ return (`فردا ${dayMinutes} : ${dayHour}`)}
        if(day == 2){ return (`پس فردا ${dayMinutes} : ${dayHour}`)}
        if(day > 2){ return (` ${day} روز دیگر ${dayMinutes} : ${dayHour}`)}
    }

    React.useEffect(() => {
        if (tableContentDetails.length>0) {
            let totalNumer = 0
            tableContentDetails.map((item,index)=>{
                totalNumer = totalNumer + item.durationTime
                if(index === tableContentDetails.length-1){
                    formValues.shiftDuration = convertNumberToTime(totalNumer)
                    setFormValues(Object.assign({},formValues))
                }
            })
        }else{
            formValues.shiftDuration = "00:00"
            setFormValues(Object.assign({},formValues))
        }
    }, [tableContentDetails]);

    return (
        <Box p={2}>
            <Card>
                <CardContent>
                    <FormPro
                        prepend={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        formValidation={formValidation}
                        setFormValidation={setFormValidation}
                        actionBox={showInlineTable ? 
                            <ActionBox>
                                <Button
                                ref={submitRef}
                                type="submit"
                                role="primary"
                                style={{ display: "none" }}
                                />
                                <Button
                                ref={cancelRef}
                                type="reset"
                                role="secondary"
                                style={{ display: "none" }} 
                                />
                            </ActionBox>
                           : <ActionBox>
                                <Button type="submit" role="primary"                                    
                                    disabled={waiting}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}> {editingShift ? "ویرایش" : "افزودن"}
                                </Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>
                        }
                        submitCallback={editingShift ? handlePutRequest : handleSubmit}
                        resetCallback={handleReset}

                    />
                    {showInlineTable ?
                        <div>
                            <Box mb={2}/>
                            <TablePro
                                title={     
                                    <div>                       
                                        <CardHeader
                                            title="جزئیات شیفت"
                                            action={
                                                checkPermis("functionalManagement/workCalendar/shift/add", datas) ? 
                                                    <Tooltip title="افزودن">
                                                        <ToggleButton
                                                            size={"small"}
                                                            onClick={()=> setShowForm(!showForm)}
                                                        >
                                                            <AddIcon/>
                                                        </ToggleButton>
                                                    </Tooltip>
                                                : ""
                                            }
                                            
                                        />
                                        {showForm && 
                                            <div>
                                                <Box mb={1}/>
                                                <Divider/>
                                                <Box mb={2}/>
                                                <Form  tableContentDetails={tableContentDetails} setTableContentDetails={setTableContentDetails}  fieldsInfo={fieldsInfo} 
                                                        editing={editing} editingShift={editingShift} setShowForm={setShowForm} formValues={detailFormValues} setEditing={setEditing}
                                                        setFormValues={setDetailFormValues} rowData={rowData} shiftId={shiftId}  calculateThruTime={calculateThruTime} setLoadingDetails={setLoadingDetails}/>
                                            </div>
                                        }
                                    </div>
                                }
                                columns={tableColsDetails}
                                rows={tableContentDetails}
                                setRows={setTableContentDetails}
                                loading={loadingDetails}
                                removeCallback={handlerRemoveDetails}
                                edit="callback"
                                editCallback={handleEditDetails}
                            />
                            <Box mb={2}/>
                            <ActionBox>
                                <Button type="submit" role="primary" onClick={trigerHiddenSubmitBtn}
                                    disabled={waiting}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}>{editingShift ? "ویرایش" : "افزودن"}
                                </Button>
                                <Button type="reset" role="secondary" onClick={trigerHiddenCancelBtn}>لغو</Button>
                            </ActionBox>
                        </div>
                    :""}
                    
                </CardContent>
            </Card>
            <Box m={2} />
            <Card>
                <CardContent>
                    <TablePro
                        title="لیست  شیفت ها "
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        loading={loading}
                        exportCsv="خروجی اکسل"
                        filter="external"
                        filterForm={<Exfilter fieldsInfo={fieldsInfo} setTableContent={setTableContent} setLoading={setLoading}/>}
                        rowActions={[{
                            title: "حذف",
                            icon: DeleteIcon,
                            onClick: (row) => {
                                handleOpenDialog(row);
                            },
                            display: (row) => ((row?.companyPartyId && row?.companyPartyId != "") && checkPermis("functionalManagement/workCalendar/shift/delete", datas) ) ? true : false ,
                        },{
                            title: "ویرایش",
                            icon: EditIcon,
                            onClick: (row) => {
                                handleEdit(row);
                            },
                            display: (row) => ((row?.companyPartyId && row?.companyPartyId != "") && checkPermis("functionalManagement/workCalendar/shift/edit", datas) ) ? true : false ,
                        }]}
                    />
                </CardContent>
            </Card>
            <Dialog open={displayDialog}
                    onClose={()=>setDisplayDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">آیا از حذف این ردیف اطمینان دارید؟</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>setDisplayDialog(false)} color="primary">خیر</Button>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>بلی</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}


const Exfilter = ({...restProps}) => {
    
    const {setLoading, fieldsInfo, setTableContent} = restProps;

    const [formValues, setFormValues] = useState ({})

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "code",
        label: "کد شیفت",
        type: "text",
    },{
        name: "title",
        label: " عنوان شیفت",
        type: "text",
        col : 5
    },{
        name: "statusId",
        label: "فعال ",
        type: "indicator",
        col : 1
    },{
        name: "typeEnumId",
        label: " نوع شیفت",
        type: "select",
        options: fieldsInfo?.shiftType ,
        optionLabelField :"description",
        optionIdField:"enumId",
    }]

    const filter = () => {
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/SearchShifts` , {data : {...formValues , statusId : formValues?.statusId == "Y" ? "SWSActive" : "SWSNotActive"}} , axiosKey).then((table)=>{
            setTableContent(table.data?.list)
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            set_waiting(false)
        })
    }

    const handleReset = () => {
        setFormValues({})
        setLoading(true)
        set_waiting(false)
    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={filter}
            resetCallback={handleReset}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary"                                    
                        disabled={waiting}
                        endIcon={waiting?<CircularProgress size={20}/>:null}> جستجو
                    </Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />
    )
}

function Form (props) {

    const {tableContentDetails, setTableContentDetails, setShowForm, fieldsInfo, editing , editingShift , formValues, setFormValues, rowData, shiftId,  calculateThruTime=()=>{}, setEditing, setLoadingDetails} = props;

    const [formValidation, setFormValidation] = React.useState({fromTime : false , duration : false , floatingTime : false , workedFactorTypeId : false});

    const [inValid,setInValid] = useState({fromTime : false , duration : false , floatingTime : false })

    const [display, setDisplay] = useState(false)

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const cx = require("classnames");

    const helperTestClasses = helperTextStyles();
    const classes = useStyles();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const convertTimeToNumber = (time) => {
        var hoursMinutes = time.split(/[.:]/);
        var Hour = parseInt(hoursMinutes[0], 10);
        var Minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return ((Hour*60)+Minutes)
    }

    React.useEffect(()=>{
        if(!editing){
            setFormValues(Object.assign({},formValues,{fromTime : null},{duration : null},{floatingTime : null}))
            setDisplay(true)
        }
        if(editing){
            setFormValues(Object.assign({},formValues))
            setDisplay(true)
        }
    },[editing])
    console.log("formValues" , formValues);
    const fromTimeValidationCallback = () => {
        return new Promise((resolve, reject) => {
            var hoursMinutes = "" 
            var hours = ""
            var minutes = ""
            if(formValues?.fromTime && formValues?.fromTime !== ""){
                hoursMinutes = formValues?.fromTime.split(/[.:]/);
                hours = parseInt(hoursMinutes[0], 10);
                minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                if(hours > 23 || minutes > 59){
                    reject()
                }
                if(hours < 23 && minutes < 59){
                    resolve()
                }
            }
            if(!formValues?.fromTime || formValues?.fromTime === ""){
                resolve()
            }
        })
    }

    const checkValidation = () => {
        return new Promise((resolve, reject) => {
            if(!formValues?.fromTime || formValues?.fromTime === null || !formValues?.duration || formValues?.duration === null ||  !formValues?.workedFactorTypeId || formValues?.workedFactorTypeId === null){
                formValidation.fromTime = (!formValues?.fromTime || formValues?.fromTime.length !== 5) ? true : false
                formValidation.duration = (!formValues?.duration || formValues?.duration.length !== 5) ? true : false
                formValidation.workedFactorTypeId = (!formValues?.workedFactorTypeId || formValues?.workedFactorTypeId === null) ? true : false
                setFormValidation(Object.assign({},formValidation))
                reject() 
            }else{
                resolve()
            }

        })
    }

    const handleCreate = () => {
        checkValidation().then(()=>{
            if(inValid?.fromTime || inValid?.duration || inValid?.floatingTime){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                return 
            }else{
                set_waiting(true)
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                if(editingShift){
                    axios.post(`${SERVER_URL}/rest/s1/functionalManagement/ShiftFactor` , {data : {...formValues , shiftWorkId : shiftId , durationTime : convertTimeToNumber(formValues?.duration) , floating :  (formValues?.floatingTime !== null && formValues?.floatingTime !== undefined) ? convertTimeToNumber(formValues?.floatingTime) : 0} } , axiosKey).then((response)=>{
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                        setLoadingDetails(true)
                        reset()
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                        set_waiting(false)
                    })
                }
                else{
                    tableContentDetails.push({...formValues , thruTime : calculateThruTime(formValues?.fromTime,formValues?.duration) , durationTime : convertTimeToNumber(formValues?.duration) , floating :  (formValues?.floatingTime !== null && formValues?.floatingTime !== undefined) ? convertTimeToNumber(formValues?.floatingTime) : 0 })
                    setTableContentDetails(Object.assign([],tableContentDetails))
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                    reset()
                }
            }
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
        })
    }

    const handleEdit = () => {
        checkValidation().then(()=>{
            if(inValid?.fromTime || inValid?.duration || inValid?.floatingTime){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                return 
            }else{
                set_waiting(true)
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                if(editingShift){
                    axios.put(`${SERVER_URL}/rest/s1/functionalManagement/ShiftFactor` , {data : {...formValues , durationTime : convertTimeToNumber(formValues?.duration) , floating : (formValues?.floatingTime !== null && formValues?.floatingTime !== undefined) ? convertTimeToNumber(formValues?.floatingTime) : 0} } , axiosKey).then((response)=>{
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                        setLoadingDetails(true)
                        reset()
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                        set_waiting(false)
                    })
                }
                else{
                    const index = tableContentDetails.indexOf(rowData); 
                    tableContentDetails[index] = {...formValues , thruTime : calculateThruTime(formValues?.fromTime,formValues?.duration)}
                    setTableContentDetails(Object.assign([],tableContentDetails))
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                    reset()
                }
            }
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
        })

    }

    const reset = () => {
        setShowForm(false)
        setFormValues({})
        setFormValidation({fromTime : false , duration : false , floatingTime : false , workedFactorTypeId : false})
        setInValid({fromTime : false , duration : false , floatingTime : false })
        set_waiting(false)
        setEditing(false)
    }

    const handleChange = (newVal) =>{
        const index = fieldsInfo?.workFactorDetail.findIndex(i=> i.title == newVal?.title )
        setFormValidation(Object.assign({},formValidation,{workedFactorTypeId : false}))
        setFormValues(Object.assign({},formValues,{workedFactorTypeId : fieldsInfo?.workFactorDetail[index]?.workedFactorTypeId }))
    }

    return(
        display && <div>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        id="workedFactorTypeId"
                        name="workedFactorTypeId"
                        options={fieldsInfo?.workFactorDetail}
                        getOptionLabel={(option) => option?.title}
                        value={(fieldsInfo?.workFactorDetail.find(o=>o.workedFactorTypeId == formValues.workedFactorTypeId) ?? "")}
                        onChange={(event, newVal) => {handleChange(newVal)}}
                        fullWidth
                        className={cx("required")}
                        renderInput={(params) => <TextField {...params} label="عامل کاری" id="workedFactorTypeId"
                        helperText={formValidation?.workedFactorTypeId ?  "تعیین این فیلد الزامی است!" : ""}
                        FormHelperTextProps={{ classes: helperTestClasses }}
                        className={formValidation?.workedFactorTypeId ? classes.root : classes.formControl}
                        name="workedFactorTypeId" variant="outlined" required={true}/>}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="fromTime" label="از ساعت" validationCallback={fromTimeValidationCallback}
                        required={true} formValidation={formValidation}  setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="duration" label="مدت شیفت" required={true} formValidation={formValidation}
                        setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="floatingTime" formValidation={formValidation} label="شناوری"
                        setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} required={false}/>
                </Grid>
            </Grid>
            <Box mb={2}/>
            <ActionBox>
                <Button type="submit" role="primary" onClick={()=>editing ? handleEdit() : handleCreate()}
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}>{editing ? "ویرایش" : "افزودن"}
                </Button>
                <Button type="reset" role="secondary" onClick={reset}>لغو</Button>
            </ActionBox>
        </div>
    )
}

function DurationField (props) {

    const classes = useStyles();
    const helperTestClasses = helperTextStyles();
    const cx = require("classnames");

    const {formValues, setFormValues, fieldName, formValidation, setFormValidation, inValid, setInValid, label, required, readOnly = false, disabled = false,
         validationCallback=()=>{return new Promise((resolve, reject) => {resolve()})}} = props

    const handleOnChange = (e) => {
        setFormValidation(Object.assign({},formValidation,{[fieldName] : false}))
        setFormValues(Object.assign({},formValues,{[fieldName] : `${(e?.target?.value[0] && e?.target?.value[0] !== ":") ? e?.target?.value[0] : ""}
                                                                  ${(e?.target?.value[1] && e?.target?.value[1] !== ":") ? (e?.target?.value[1]+":") : ""}
                                                                  ${(e?.target?.value[3] && e?.target?.value[3] !== ":") ? e?.target?.value[3] : ""}
                                                                  ${(e?.target?.value[4] && e?.target?.value[4] !== ":") ? e?.target?.value[4] : ""}`}))
    } 

    React.useEffect(()=>{
        if(formValues[fieldName] && formValues[fieldName] != ""){
            formValues[fieldName] = formValues[fieldName].replace(/[^:0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues[fieldName]])

    const validation = () => {
        if(formValues[fieldName] !== "" && formValues[fieldName]){
            if(formValues[fieldName].length !==5){
                setInValid(Object.assign({},inValid,{[fieldName] : true}))
            }else{
                var minutes = 0
                var hoursMinutes = ""
                hoursMinutes = formValues[fieldName].split(/[.:]/);
                minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                if(minutes > 59){
                    setInValid(Object.assign({},inValid,{[fieldName] : true}))
                }
                if(minutes < 59){
                    validationCallback().then(()=>{
                        setInValid(Object.assign({},inValid,{[fieldName] : false}))
                    }).catch(()=>{
                        setInValid(Object.assign({},inValid,{[fieldName] : true}))
                    })
                }
            }
        }
        if(formValues[fieldName] === "" || !formValues[fieldName]){
            setInValid(Object.assign({},inValid,{[fieldName] : false}))
        }
    }

    return (
        <TextField
            // key={readOnly ? formValues[fieldName] : ""}
            required={required}
            disabled={disabled}
            id="required"
            value={formValues[fieldName]}
            onChange={(e,newData)=>handleOnChange(e)}
            placeholder="__:__"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 5 }}
            // error={inValid[fieldName]|| formValidation[fieldName]}
            helperText={inValid[fieldName] ? "ساعت وارد شده معتبر نمي باشد ." : (formValidation[fieldName] == true) ? "تعیین این فیلد الزامی است!" : ""}
            onBlur={validation}
            label={label}
            className={cx(readOnly && "read-only", (inValid[fieldName]|| formValidation[fieldName]) ? classes.root : classes.formControl)}
            FormHelperTextProps={{ classes: helperTestClasses }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <AccessTimeIcon style={{ color: "#979797"}} />
                    </InputAdornment>
                )
                }}
        />

    )
}