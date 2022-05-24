import {useDispatch} from "react-redux";
import React, {useState} from "react";
import useListState from "../../../reducers/listState";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import axios from "../../../api/axiosRest";
import {Box, Button, Grid} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TablePro from "../../../components/TablePro";
import DialogActions from "@material-ui/core/DialogActions";
import ActionBox from "../../../components/ActionBox";
import ListPro from "../../../components/ListPro";
import Error from "@material-ui/icons/ErrorOutline";
import {red} from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormInput from "../../../components/formControls/FormInput";
import makeStyles from "@material-ui/styles/makeStyles";

const primaryKey = "timesheetDeviceId"
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

export default function TrafficInfoUpload({onConfirm, closeModal, columns,baseData}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [state, set_state] = useState("upload") // upload , uploading , error , view
    const [formValues, set_formValues] = useState({})
    const [fileLocation, set_fileLocation] = useState(null)
    const [formValidation, set_formValidation] = useState({})
    const dataList = useListState(primaryKey,[])
    const errors = useListState()

    const handle_resolve = (rowData) => new Promise(resolve => resolve(rowData))

    const handle_upload = () => {
        if(!formValues.file) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فایل انتخاب نشده است!'));
            return
        }
        const fileFormat = formValues.file.name.split(".").slice(-1)[0]
        if(VALID_TYPES.indexOf(fileFormat)<0){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'نوع فایل انتخاب شده صحیح نیست!'));
            return
        }
        set_state("uploading")
        const packet = new FormData();
        packet.append("file",formValues.file)
        // packet.append("attendanceDeviceId",baseData.attendanceDeviceId)
        // packet.append("data",JSON.stringify(baseData))
        // packet.append("data",JSON.stringify(baseData))
        // packet.append("data",JSON.stringify(baseData))
        // packet.append("data",baseData)
        // console.log('baseData' ,baseData); 
        let deviceData = {data:baseData}

        for (var pair of packet.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        axios.post("/s1/functionalManagement/trafficInfo/uploadTimesheet",packet).then((res) => {
            deviceData.fileName = res.data.fileName
            axios.post("/s1/functionalManagement/trafficInfo/applyTimesheet",deviceData).then((res) => {
                if(res.data.status === true) {
                    dataList.set(res.data.trafficInfo.timesheet)
                    set_fileLocation(res.data.fileLocation)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "بارگذاری و پردازش فایل با موفقیت انجام شد."));
                    set_state("view")
                } else {
                    errors.set(res.data.errors)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "پردازش فایل با خطا مواجه شد."));
                    set_state("error")
                }
            }).catch(() => {
                set_state("upload")
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ارسال اطلاعات!"));
            });
        }).catch(() => {
            set_state("upload")
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ارسال اطلاعات!"));
        });
    }

    const handle_confirm = () => {
        onConfirm(dataList.list,fileLocation)
        closeModal()
        dataList.set([])
        set_state("upload")
    }

    const handle_back_to_upload = () => {
        set_state("upload")
    }

    if(state === "view") return (
        <Box>
            <Divider/>
            <TablePro
                title="جزئیات کارکرد"
                columns={columns}
                rows={dataList.list}
                removeCallback={handle_resolve}
                className="w-full"
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
                <FormInput label="فایل کارکرد" name="file" type="file" valueObject={formValues} valueHandler={set_formValues} validationObject={formValidation} validationHandler={set_formValidation} grid={false} multiline/>
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
