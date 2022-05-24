import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import {Button, CardContent, CardHeader, Divider, Grid, IconButton} from "@material-ui/core";
import ActionBox from "../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import TablePro from "../../../components/TablePro";
import useListState from "../../../reducers/listState";
import UserCompany from "../../../components/formControls/UserCompany";
import FormPro from "../../../components/formControls/FormPro";
import FormInput from "../../../components/formControls/FormInput";
import axios from "../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import Alert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ConfirmDialog, {useDialogReducer} from "../../../components/ConfirmDialog";
import ModalPro from "../../../components/ModalPro";
import TrafficInfoUpload from "./TrafficInfoUpload";
import checkPermis from "../../../components/CheckPermision";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
// import AssignmentIcon from "@material-ui/icons/Assignment";

const defaultAction = {type: "add", payload: {}}

export default function TrafficInfoForm({dataList, editObject, resetEditObject, data, set_data}) {
    let moment = require("moment-jalaali");
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const [trafficInfo, set_trafficInfo] = useState({createDate: moment().format("Y-MM-DD")})
    const reset_trafficInfo = () => set_trafficInfo({createDate: moment().format("Y-MM-DD"),...data.user})
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [waiting, set_waiting] = useState(false)
    const [baseData, set_baseData] = useState({})
    const [wrongTimes, set_wrongTimes] = useState([])
    const [action, set_action] = useState(defaultAction)
    const [personnel, set_personnel] = useState([])
    const timesheet = useListState("id",[])
    const uploadModal = useDialogReducer()
    const dialogDelete = useDialogReducer(handle_remove)
    // const refDownloadLink = React.useRef(null);

    const isDeviceSelected = !!trafficInfo.attendanceDeviceId

    const trafficForm = [
        {
            label   : "تاریخ ایجاد",
            name    : "createDate",
            type    : "display",
            options : "Date",
        },{
            name    : "companyPartyId",
            label   : "شرکت",
            type    : editObject.companyParytId ? "display" : "component",
            options : "Organization",
            optionIdField: "partyId",
            optionLabelField: "organizationName",
            component: <UserCompany/>,
        },{
            label   : "کاربر وارد کننده اطلاعات",
            name    : "username",
            type    : "display",
        },{
            name    : "attendanceDeviceId",
            label   : "سیستم کنترل کارکرد",
            type    : editObject.id ? "display" : "select",
            options : data.devices,
            optionIdField: "attendanceDeviceId",
            optionLabelField: "title",
            required: true
        },{
            label   : "",
            name    : "trafficInfoId",
            type    : "text",
            style   : {display:"none"},
            col     :0
        },
    ]
    const timesheetForm = [
        {
            name    : "timeSheetDeviceId",
            label   : "شناسه کارکرد",
            type    : "text",
            required: false,
            disabled: true //!isDeviceSelected || action.type==="edit",
        },{
            name    : "cardId",
            label   : "پرسنل",
            type    : "select",
            options : personnel,
            optionIdField: "cardId",
            getOptionLabel: opt => `${opt.cardNumber} ─ ${opt.fullName}`,
            otherOutputs: [{name: "cardNumber", optionIdField: "cardNumber"},
                {name: "fullName", optionIdField: "fullName"}],
            required: true,
            disabled: !isDeviceSelected,
        },{
            name    : "mainWorkedFactorId",
            label   : "عامل کاری",
            type    : "select",
            options : data.factors,
            optionIdField: "workedFactorTypeId",
            getOptionLabel: opt => `${opt.code} ─ ${opt.equivalent}`,
            // optionLabelField: "equivalent",
            required: true,
            disabled: !isDeviceSelected,
            otherOutputs: [{name: "uomId", optionIdField: "uomId"},
                           {name: "uomDescription", optionIdField: "uomDescription"}],
            changeCallback: () => set_formValues(prevState => ({...prevState, amount: null})),
            disableClearable: true,
        },{
            name    : "amount",
            label   : "مقدار" + (formValues.uomDescription ? `(${formValues.uomDescription})` : ""),
            type    : formValues.uomId === "WFTHours" ? "hour" : "number",
            required: true,
            disabled: !isDeviceSelected || !formValues.mainWorkedFactorId,
        },{
            name    : "date",
            label   : "تاریخ",
            type    : "date",
            required: true,
            disabled: !isDeviceSelected,
        },{
            name    : "timeSheetStatusId",
            label   : "وضعیت",
            type    : "select",
            options : data.statuses,
            optionIdField: "statusId",
            disabled: true,
        },{
            name    : "parentTimesheetId",
            label   : " شناسه کارکرد اشتباه",
            type    : "select",
            options : wrongTimes,
            optionIdField: "timeSheetDeviceId",
            optionLabelField: "timeSheetDeviceId",
            disabled: !isDeviceSelected,
        },{
            name    : "projectId",
            label   : "پروژه",
            type    : "select",
            options : data.projects,
            optionIdField: "workedProjectId",
            optionLabelField: "title",
            disabled: !isDeviceSelected,
        }
    ]
    const columns = [
        {
            name    : "timeSheetId",
            label   : "",
            type    : "text",
            style   : {display:"none"},
    },{
            name    : "timeSheetDeviceId",
            label   : " شناسه کارکرد",
            type    : "text",
        },{
            name    : "cardId",
            label   : "پرسنل",
            type    : "render",
            render  : row => `${row.cardNumber} ─ ${row.fullName}`
        },{
            name    : "mainWorkedFactorId",
            label   : "عامل کاری",
            type    : "select",
            options : data.factors,
            optionIdField: "workedFactorTypeId",
            // getOptionLabel: opt => `${opt.code} ─ ${opt.equivalent}`,

            optionLabelField: "mainWorkedFactorDes",
        },{
            name    : "date",
            label   : "تاریخ",
            type    : "date",
        },{
            name    : "amount",
            label   : "مقدار",
            type    : "render",
            render  : row => {
                if(row.uomId != "WFTHours"){
                    return row.amount
                }
                else{
                    const h = Math.floor(row.amount / 60)
                    const m = row.amount - h * 60
                    const hh = h < 10 ? "0" + h : h.toString()
                    const mm = m < 10 ? "0" + m : m.toString()
                    return `${hh}:${mm}`
                }   
            }
            // type    : formValues.uomId === "WFTHours" ? "hour" : "number",
    }]

    function handle_import_timesheet(list,fileLocation) {
        list.forEach(item => {
            item.imported = true
        })
        timesheet.add(list)
        set_trafficInfo(prevState => ({...prevState, fileLocation}))
    }

    function handle_submit_timesheet() {
        if(action.type==="add") {
            if(formValues["timesheetDeviceId"] && formValues["timesheetDeviceId"]!="" && timesheet.list.findIndex(item => item["timesheetDeviceId"] === formValues["timesheetDeviceId"]) > -1) {
                set_formValidation({
                    timesheetDeviceId: {error: true, helper: " شناسه کارکرد تکراری است!"}
                })
                return false
            }
            let sorted = timesheet.list?.sort(function (a, b) {
                return b.id - a.id;
              })

            let lastId  = sorted[0] ? sorted[0].id++ : 1

            timesheet.add({...formValues,id:lastId})
            set_formValues(formDefaultValues)
        } else {
            timesheet.update(formValues)
            set_formValues(formDefaultValues)
        }
    }

    function handle_submit_traffic() {
        if(!trafficInfo.attendanceDeviceId) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'انتخاب سیستم کنترل کارکرد ضروری است!'));
            return false
        }
        set_waiting(true)
        const packet = Object.assign({},trafficInfo, {timesheet: timesheet.list})
        axios.post("/s1/functionalManagement/trafficInfo",{data:packet}).then(res => {
            getTrafficTable()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ثبت کارکرد با موفقیت انجام شد."))
            handle_reset_traffic()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        }).finally(() => {
            set_waiting(false)
        });
    }

    function handle_reset_traffic() {
        set_formValues(formDefaultValues)
        reset_trafficInfo()
        timesheet.set([])
        resetEditObject()
    }

    function handle_edit(row) {
        set_action({type: "edit", payload: row})
    }

    function handle_remove(row) {
        set_action(defaultAction)
        timesheet.remove(row)
    }

    function getTrafficTable() {
        axios.get("/s1/functionalManagement/trafficInfo?attendanceDeviceId="+trafficInfo.attendanceDeviceId).then(res => {
            

            let wrongs = [],
            trafficInfo = res.data.trafficInfoList
            dataList.set(trafficInfo)
            // res.data.trafficInfoList.map(x=>{
            for (let i = 0; i<trafficInfo?.length ; i++){
                for (let sheet of trafficInfo[i].timesheet){
                    if(sheet.timeSheetStatusId=="TSSOpen"){
                        wrongs.push(sheet)
                    }
                }
                if(i == trafficInfo?.length - 1){
                    set_wrongTimes(wrongs)
                }
            }
           
        }).catch(()=>{});
    }

    const handle_download = () => {
        set_waiting(true)
        axios.get("/s1/functionalManagement/trafficInfo/downloadTimesheet",{params: {timesheet: timesheet.list}}).then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]),);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','کارکرد.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
        }).finally(() => {
            set_waiting(false)
        });
    }
    // const handle_download_sample = () => {
    //     refDownloadLink.current.click()
    // }

    useEffect(() => {
        if(action.type === "edit") {
            set_formValues(action.payload)
        }
    },[action])

    useEffect(() => {
        if(!editObject.id) {
            set_trafficInfo(prevState => ({...prevState,
                userId: data.user.userId,
                username: data.user.username
            }))
        }
    },[data.user.userId])

    useEffect(() => {
        if(editObject.id) {
            set_trafficInfo(editObject.data)
            timesheet.set(editObject.data.timesheet)
            set_formValues(formDefaultValues)
        }
    },[editObject.id])
    
    useEffect(() => {
        set_baseData(formValues)
    },[formValues])

    useEffect(() => {
        axios.get("/s1/functionalManagement/Cards?attendanceDeviceId="+trafficInfo.attendanceDeviceId).then(res => {
            set_personnel(res.data.cardsList)
        }).catch(() => {});
        if(trafficInfo.attendanceDeviceId){
            axios.get("/s1/functionalManagement/WorkingFactorEquivalent?attendanceDeviceId="+trafficInfo.attendanceDeviceId).then(res => {
                set_data(prevState => ({...prevState, factors: res.data.workingFactorEquivalentList,statuses:res.data.statuses}))
            }).catch(()=>{});
            getTrafficTable()
            
        }
        
    },[trafficInfo.attendanceDeviceId])

    function openUpload(){
        if(trafficInfo.attendanceDeviceId){
            uploadModal.show()
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'انتخاب سیستم کنترل کارکرد ضروری است!'));

        }
    }

    return (
        <Card>
            <CardHeader title="ثبت کارکرد"/>
            <CardContent>
                <Grid container spacing={2}>
                    {trafficForm.map((input,index)=>(
                        <FormInput key={index} {...input} valueObject={trafficInfo} valueHandler={set_trafficInfo}/>
                    ))}
                </Grid>
                <Box m={2}/>
                <Card variant="outlined">
                    <CardHeader
                        title="جزئیات کارکرد"
                        action={
                            <Box>
                                <Tooltip title="بارگذاری فایل">
                                    <IconButton onClick={openUpload}>
                                        <CloudUploadIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="دریافت فایل">
                                    <IconButton onClick={handle_download}>
                                        {waiting?<CircularProgress size={20}/>:<CloudDownloadIcon/>}
                                    </IconButton>
                                </Tooltip>
                                {/*<Tooltip title="دریافت فایل نمونه">*/}
                                {/*    <IconButton onClick={handle_download_sample}>*/}
                                {/*        <AssignmentIcon/>*/}
                                {/*    </IconButton>*/}
                                {/*</Tooltip>*/}
                                {/*<a ref={refDownloadLink} className="hidden" href={process.env.PUBLIC_URL + "/assets/docs/workedFactors.xlsx"} target="_blank" download/>*/}
                            </Box>
                        }
                    />
                    <Divider/>
                    <CardContent>
                        {!isDeviceSelected && (
                            <Box mb={2}><Alert severity="warning" variant="outlined">ابتدا سیستم کنترل کارکرد را انتخاب کنید!</Alert></Box>
                        )}
                        <FormPro
                            formValues={formValues} setFormValues={set_formValues}
                            formValidation={formValidation} setFormValidation={set_formValidation}
                            prepend={timesheetForm}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary" disabled={!isDeviceSelected}>{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                <Button type="reset" role="secondary" disabled={!isDeviceSelected}>لغو</Button>
                            </ActionBox>}
                            submitCallback={handle_submit_timesheet}
                        />
                    </CardContent>
                    <TablePro
                        columns={columns}
                        rows={timesheet.list}
                        setRows={timesheet.set}
                        showTitleBar={false}
                        showRowNumber={false}
                        rowCondition={row => {
                            if(row["imported"]) return "success"
                            if(!row["timesheetId"]) return "info"
                            return "default"
                        }}
                        rowActions={[{
                            title   : "حذف",
                            icon    : DeleteIcon,
                            onClick : dialogDelete.show,
                            display : (row) => !row["timesheetId"] || checkPermis("functionalManagement/trafficInfo/edit/deleteTimesheet", datas)
                        },{
                            title   : "ویرایش",
                            icon    : EditIcon,
                            onClick : handle_edit,
                            display : (row) => !row["imported"] && (!row["timesheetId"] || checkPermis("functionalManagement/trafficInfo/edit/editTimesheet", datas))
                        }]}
                    />
                    <ConfirmDialog
                        dialogReducer={dialogDelete}
                        title="آیا از حذف این ردیف اطمینان دارید؟"
                    />
                    <ModalPro
                        title={"بارگذاری فایل کارکردها"}
                        open={uploadModal.display}
                        setOpen={uploadModal.close}
                    >
                        <TrafficInfoUpload columns={columns} baseData={trafficInfo} onConfirm={handle_import_timesheet} closeModal={uploadModal.close}/>
                    </ModalPro>
                </Card>
                <Box m={2}/>
                <ActionBox>
                    <Button type="button" onClick={handle_submit_traffic} role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{editObject.id ? "ویرایش" : "افزودن"}</Button>
                    <Button type="button" onClick={handle_reset_traffic} role="secondary" disabled={waiting}>لغو</Button>
                </ActionBox>
            </CardContent>
        </Card>
    )
}
