import React, {useState} from "react";
import {Box, Button, Grid, IconButton} from "@material-ui/core";
import useListState from "../../../../../reducers/listState";
import Divider from "@material-ui/core/Divider";
import TablePro from "../../../../../components/TablePro";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Tooltip from "@material-ui/core/Tooltip";
import axios from "../../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import ListProAccordion from "../../../../../components/ListProAccordion";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";
import ModalPro from "../../../../../components/ModalPro";
import FormInput from "../../../../../components/formControls/FormInput";
import ActionBox from "../../../../../components/ActionBox";
import DialogActions from "@material-ui/core/DialogActions";
import ListPro from "../../../../../components/ListPro";
import {red} from "@material-ui/core/colors";
import Error from "@material-ui/icons/ErrorOutline";
import makeStyles from "@material-ui/styles/makeStyles";

const primaryKey = "partyRelationshipId"
const VALID_TYPES = ["xls"]

const useStyles = makeStyles((theme) => ({
    row: {
        height: 50,
        "& .MuiSvgIcon-root": {
            marginTop: "6px"
        },
        "& .MuiTypography-root": {
            lineHeight: "34px"
        }
    },
}));

export default function ActionsPersonnelOperation({formVariables, set_formVariables}) {
    const dispatch = useDispatch();
    const uploadModal = useDialogReducer()
    const [waiting, set_waiting] = useState(false)
    const refDownloadLink = React.useRef(null);
    const [workedProjects, set_workedProjects] = useState([])
    const [workedFactorTypes, set_workedFactorTypes] = useState([])
    const personnel = useListState(primaryKey,formVariables.personnel||[])
    const registryWorkedFactorId = formVariables?.registryWorkedFactorId

    const columns = [{
        name    : "workedProjectId",
        label   : "پروژه",
        type    : "select",
        options : workedProjects,
        optionIdField: "workedProjectId",
        optionLabelField: "title",
        style   : {width: "25%"}
    },{
        name    : "workedFactorTypeId",
        label   : "عامل کارکردی",
        type    : "select",
        options : workedFactorTypes,
        optionIdField: "workedFactorTypeId",
        optionLabelField: "title",
        style   : {width: "25%"},
        required: true
    },{
        name    : "amountFactor",
        label   : "میزان عامل",
        type    : "number",
        required: true
    },{
        name    : "amountObligation",
        label   : "سقف عامل",
        type    : "number",
        required: true
    }]

    const set_item_operations = (item) => (newOperations) => {
        item.operations = newOperations
        personnel.update(item)
    }
    const handle_download = () => {
        set_waiting(true)
        axios.get("/s1/payroll/workedFactor/workedFactorSheet?registryWorkedFactorId="+registryWorkedFactorId).then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]),);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','aaa.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            set_waiting(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
            set_waiting(false)
        });
    }
    const handle_download_sample = () => {
        refDownloadLink.current.click()
    }

    React.useEffect(()=>{
        axios.get("/s1/payroll/workedProject").then(res => {
            set_workedProjects(res.data.workedProjectsList)
        }).catch(()=>{});
        axios.get("/s1/payroll/workedFactorType").then(res => {
            set_workedFactorTypes(res.data.workedFactorTypesList)
        }).catch(()=>{});
    },[])

    React.useEffect(()=>{
        axios.get("/s1/payroll/workedFactor?registryWorkedFactorId="+registryWorkedFactorId).then(res => {
            const workedFactors = res.data.workedFactorsListByParty
            let personnelList = Object.assign([], personnel.list)
            personnelList.forEach(person => {
                person.operations = workedFactors[person[primaryKey]]
            })
            personnel.set(personnelList)
        }).catch(()=>{});
    },[registryWorkedFactorId])

    React.useEffect(()=>{
        set_formVariables(prev => ({...prev, personnel: personnel.list}))
    },[personnel.list])

    return (
        <React.Fragment>
            <ListProAccordion
                title="بررسی کارکرد پرسنل"
                context={personnel}
                action={
                    <Box>
                        <Tooltip title="بارگذاری فایل">
                            <IconButton onClick={uploadModal.show}>
                                <CloudUploadIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="دریافت فایل">
                            <IconButton onClick={handle_download}>
                                {waiting?<CircularProgress size={20}/>:<CloudDownloadIcon/>}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="دریافت فایل نمونه">
                            <IconButton onClick={handle_download_sample}>
                                <AssignmentIcon/>
                            </IconButton>
                        </Tooltip>
                        <a ref={refDownloadLink} className="hidden" href={process.env.PUBLIC_URL + "/assets/docs/workedFactors.xlsx"} target="_blank" download/>
                    </Box>
                }
                renderAccordionSummary={(item) => <Typography>{`${item.pseudoId} ─ ${item.fullName}`}</Typography>}
                renderAccordionDetails={(item) => {
                    const handle_add = (newData) => new Promise((resolve, reject) => {
                        const packet = {
                            ...newData,
                            registryWorkedFactorId,
                            partyRelationshipId: item.partyRelationshipId
                        }
                        axios.post("/s1/payroll/workedFactor",packet).then(res=>{
                            resolve({...packet,...res.data})
                        }).catch(()=>{
                            reject()
                        })
                    })
                    const handle_edit = (newData, oldData) => new Promise((resolve, reject) => {
                        axios.post("/s1/payroll/workedFactor",newData).then(()=>{
                            resolve()
                        }).catch(()=>{
                            reject()
                        })
                    })
                    const handle_remove = (rowData) => new Promise((resolve, reject) => {
                        axios.delete("/s1/payroll/workedFactor?workedFactorId="+rowData.workedFactorId).then(()=>{
                            resolve()
                        }).catch(()=>{
                            reject()
                        })
                    })
                    return <TablePro
                        title={`لیست کارکردهای ${item.fullName}`}
                        columns={columns}
                        rows={item.operations}
                        setRows={set_item_operations(item)}
                        edit="inline"
                        editCallback={handle_edit}
                        add="inline"
                        addCallback={handle_add}
                        removeCallback={handle_remove}
                        className="w-full"
                    />
                }}
            />
            <Divider/>
            <ModalPro
                title={"بارگذاری فایل کارکردها"}
                open={uploadModal.display}
                setOpen={uploadModal.close}
            >
                <UploadPanel personnel={personnel} closeModal={uploadModal.close} columns={columns}/>
            </ModalPro>
        </React.Fragment>
    )
}

function UploadPanel({personnel, closeModal, columns}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [state, set_state] = useState("upload") // upload , uploading , error , view
    const [formValues, set_formValues] = useState({})
    const [formValidation, set_formValidation] = useState({})
    const personnelWorkedFactors = useListState(primaryKey,[])
    const errors = useListState()

    const set_item_operations = (item) => (newOperations) => {
        item.operations = newOperations
        personnelWorkedFactors.update(item)
    }
    const handle_resolve = (rowData) => new Promise(resolve => resolve(rowData))

    const handle_upload = () => {
        if(!formValues.file) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فایل انتخاب نشده است!'));
            return
        }
        const fileFormat = formValues.file.name.split(".").slice(-1)[0]
        if(VALID_TYPES.indexOf(fileFormat)<0){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'نوع فایل انتخاب شده باید xls باشد!'));
            return
        }
        set_state("uploading")
        const packet = new FormData();
        packet.append("file",formValues.file)
        axios.post("/s1/payroll/workedFactor/workedFactorSheet",packet).then((res) => {
            if(res.data.status === true) {
                const workedFactors = res.data.workedFactorsListByParty
                let personnelList = Object.assign([], personnel.list)
                // personnelList.forEach(person => {
                //     person.operations = workedFactors[person[primaryKey]]
                // })
                for (let i = 0; i < personnelList.length ; i++){
                    personnelList[i].operations = workedFactors[personnelList[i][primaryKey]]
                    if(i == personnelList.length-1){
                        personnelWorkedFactors.set(personnelList)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "بارگذاری و پردازش فایل با موفقیت انجام شد."));
                        set_state("view")
                    }
                }

            } else {
                errors.set(res.data.errors)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "پردازش فایل با خطا مواجه شد."));
                set_state("error")
            }
        }).catch(() => {
            set_state("upload")
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ارسال اطلاعات!"));
        });
    }

    const handle_confirm = () => {
        personnel.set(personnelWorkedFactors.list)
        closeModal()
        personnelWorkedFactors.set([])
        set_state("upload")
    }

    const handle_back_to_upload = () => {
        set_state("upload")
    }

    if(state === "view") return (
        <Box>
            <Divider/>
            <ListProAccordion
                title="کارکرد پرسنل بارگذاری شده"
                context={personnelWorkedFactors}
                renderAccordionSummary={(item) => <Typography>{`${item.pseudoId} ─ ${item.fullName}`}</Typography>}
                renderAccordionDetails={(item) => (
                    <TablePro
                        title={`لیست کارکردهای ${item.fullName}`}
                        columns={columns}
                        rows={item.operations}
                        setRows={set_item_operations(item)}
                        edit="inline"
                        editCallback={handle_resolve}
                        add="inline"
                        addCallback={handle_resolve}
                        removeCallback={handle_resolve}
                        className="w-full"
                    />)
                }
            />
            <Divider/>
            <DialogActions>
                <ActionBox>
                    <Button type="button" onClick={handle_confirm} role="primary">تایید</Button>
                    <Button type="button" onClick={closeModal} role="secondary">لغو</Button>
                </ActionBox>
            </DialogActions>
        </Box>
    )
    if(state === "error") return (
        <Box>
            <Divider/>
            <ListPro
                title="لیست خطاها"
                context={errors}
                itemLabelPrimary={item => (
                    <Grid container spacing={2} className={classes.row}>
                        <Grid item>
                            <Error fontSize={"small"} style={{color: red[500]}}/>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Typography noWrap>{item.description}</Typography>
                        </Grid>
                    </Grid>
                )}
                selectable={false}
            />
            <Divider/>
            <DialogActions>
                <ActionBox>
                    <Button type="button" onClick={handle_back_to_upload} role="primary">بازگشت</Button>
                    <Button type="button" onClick={closeModal} role="secondary">لغو</Button>
                </ActionBox>
            </DialogActions>
        </Box>
    )
    if(state === "uploading") return (
        <Box>
            <Divider/>
            <Box textAlign="center" color="text.secondary" p={4}>
                <CircularProgress />
                <Typography variant={"body1"}>در حال بارگذاری فایل</Typography>
            </Box>
        </Box>
    )
    return (
        <Box>
            <Divider/>
            <Box m={2}>
                <FormInput label="انتخاب فایل" name="file" type="inputFile" accept=".xls,.xlsx" valueObject={formValues} valueHandler={set_formValues} validationObject={formValidation} validationHandler={set_formValidation} grid={false}/>
            </Box>
            <Divider/>
            <DialogActions>
                <ActionBox>
                    <Button type="button" onClick={handle_upload} role="primary" disabled={state === "uploading"} endIcon={state === "uploading"?<CircularProgress size={20}/>:null}>ارسال فایل</Button>
                    {/*<Button type="button" onClick={()=>console.log(formValues)} role="tertiary">LOG</Button>*/}
                </ActionBox>
            </DialogActions>
        </Box>
    )
}
