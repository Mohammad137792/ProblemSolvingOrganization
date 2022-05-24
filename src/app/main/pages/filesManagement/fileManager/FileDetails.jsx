import React, {useEffect, useState} from "react";
import useListState from "../../../reducers/listState";
import axios from "../../../api/axiosRest";
import {Box} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FileTypeIcon from "./FileTypeIcon";
import Grid from "@material-ui/core/Grid";
import DisplayField from "../../../components/DisplayField";
import {makeStyles} from "@material-ui/core/styles";
import FilePreview from "./FilePreview";
import {useDispatch} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import ConfirmDialog, {useDialogReducer} from "../../../components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default
    },
}));

export default function FileDetails({file, action, setAction, deleteCallback}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(null)
    const [permissions, set_permissions] = useState({
        updatePermission: "N",
    })
    const subscribers = useListState("partyRelationshipId")
    const deleteDialog = useDialogReducer(handle_delete)

    const fileOrFolderStr = file?.fileType ? "فایل" : "پوشه"

    function handle_edit() {
        setAction({
            type: file.fileType ? "editFile" : "editFolder",
            payload: {...file, subscribers: subscribers.list}
        })
    }
    function handle_delete() {
        set_waiting("delete")
        axios.delete("/s1/filesManagement/file?fileId="+file.fileId).then(()=>{
            deleteCallback(file)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, `حذف ${fileOrFolderStr} با موفقیت انجام شد.`))
            set_waiting(null)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در عملیات حذف!'));
            set_waiting(null)
        })
    }
    function handle_download() {
        set_waiting("download")
        axios.get("/s1/fadak/getpersonnelfile1?name="+file.fileLocation,{responseType: 'blob'}).then(res => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
                new Blob([res.data]),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${file.name}.${file.fileType}`,
            );
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            set_waiting(null)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
            set_waiting(null)
        });
    }
    function format_size(size) {
        if(!size) return null
        const units = [" B", " KB", " MB", " GB"]
        let index = 0
        while(index < units.length-1 && size > 1024) {
            index++
            size/=1024
        }
        return Number.parseFloat(size).toFixed(0) + units[index]
    }

    useEffect(()=>{
        if(file) {
            axios.get("/s1/filesManagement/file/fileDetails?fileId="+file.fileId).then(res => {
                set_permissions(res.data.userPermissions)
                subscribers.set(res.data.fileUsers)
            }).catch(() => {});
        }
    },[file])

    return (
        <Box className={classes.root}>
            {file && (
                <React.Fragment>
                    <Box display="flex" className="w-full">
                        <Box p={2} py={1}>
                            <FileTypeIcon size="large" fileType={file.fileType}/>
                        </Box>
                        <Box py={2} pr={1} flexGrow={1} style={{overflow: "auto"}}>
                            <Grid container spacing={1} >
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={1} direction="column">
                                        <Grid item xs={12}><DisplayField variant="display" label={`نام ${fileOrFolderStr}`} value={file.name} noWrap/></Grid>
                                        {file.fileType && <>
                                            <Grid item xs={12}><DisplayField variant="display" label="نوع فایل" value={file.fileType} noWrap/></Grid>
                                            <Grid item xs={12}><DisplayField variant="display" label="نسخه" value={file.version} noWrap/></Grid>
                                            <Grid item xs={12}><DisplayField variant="display" label="اندازه" value={format_size(file.size)} noWrap/></Grid>
                                        </>}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={1} direction="column">
                                        <Grid item xs={12}><DisplayField variant="display" label="ایجاد کننده" value={file.ownerPartyName} noWrap/></Grid>
                                        <Grid item xs={12}><DisplayField variant="display" label="ایجاد شده در" value={file.createdDate} options="Date" noWrap/></Grid>
                                        <Grid item xs={12}><DisplayField variant="display" label="آخرین ویرایش توسط" value={file.modifierPartyName} noWrap/></Grid>
                                        <Grid item xs={12}><DisplayField variant="display" label="ویرایش شده در" value={file.modifiedDate} options="Date" noWrap/></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box py={1}>
                            <FilePreview file={file}/>
                        </Box>
                        <Box px={1}>
                            <CardHeader
                                action={
                                    <ToggleButtonGroup orientation="vertical" size="small">
                                        {file.fileType &&
                                        <Tooltip title="دانلود">
                                            <ToggleButton size="small" value="download" onClick={handle_download} selected={false} disabled={waiting}>
                                                {waiting==="download"?<CircularProgress size={20}/>:<DownloadIcon/>}
                                            </ToggleButton>
                                        </Tooltip>
                                        }
                                        <Tooltip title="ویرایش">
                                            <ToggleButton size="small" value="edit" onClick={handle_edit} selected={action.type==="editFile"||action.type==="editFolder"} disabled={permissions.updatePermission!=="Y" || waiting}>
                                                <EditIcon/>
                                            </ToggleButton>
                                        </Tooltip>
                                        <Tooltip title="حذف">
                                            <ToggleButton size="small" value="delete" onClick={deleteDialog.show} selected={false} disabled={permissions.updatePermission!=="Y" || waiting}>
                                                {waiting==="delete"?<CircularProgress size={20}/>:<DeleteIcon/>}
                                            </ToggleButton>
                                        </Tooltip>
                                    </ToggleButtonGroup>
                                }
                            />
                        </Box>
                    </Box>
                    <ConfirmDialog
                        dialogReducer={deleteDialog}
                        title={`آیا از حذف این ${fileOrFolderStr} اطمینان دارید؟`}
                    />
                </React.Fragment>
            )}
        </Box>
        // <Box className={classes.FilePreviewRoot}>
        //     {file && (
        //         <React.Fragment>
        //             <CardHeader action={
        //                 <ToggleButtonGroup size="small">
        //                     {file.fileType &&
        //                     <Tooltip title="دانلود">
        //                         <ToggleButton size="small" value="download" onClick={handle_download} selected={false} disabled={waiting}>
        //                             {waiting==="download"?<CircularProgress size={20}/>:<DownloadIcon/>}
        //                         </ToggleButton>
        //                     </Tooltip>
        //                     }
        //                     <Tooltip title="ویرایش">
        //                         <ToggleButton size="small" value="edit" onClick={handle_edit} selected={action.type==="editFile"||action.type==="editFolder"} disabled={permissions.updatePermission!=="Y" || waiting}>
        //                             <EditIcon/>
        //                         </ToggleButton>
        //                     </Tooltip>
        //                     <Tooltip title="حذف">
        //                         <ToggleButton size="small" value="delete" onClick={deleteDialog.show} selected={false} disabled={permissions.updatePermission!=="Y" || waiting}>
        //                             {waiting==="delete"?<CircularProgress size={20}/>:<DeleteIcon/>}
        //                         </ToggleButton>
        //                     </Tooltip>
        //                 </ToggleButtonGroup>
        //             }/>
        //             <Box align={"center"}>
        //                 <Box mt={2} mb={1}>
        //                     <FileTypeIcon size="large" fileType={file.fileType}/>
        //                 </Box>
        //                 <Typography variant="subtitle2">{file.name}</Typography>
        //             </Box>
        //             <Box m={2}><Divider variant="fullWidth"/></Box>
        //             <FilePreview file={file}/>
        //             <Box p={2}>
        //                 <Grid container spacing={2}>
        //                     {file.fileType &&
        //                     <Grid item xs={12}><DisplayField variant="display" label="نوع فایل" value={file.fileType}/></Grid>
        //                     }
        //                     <Grid item xs={12}><DisplayField variant="display" label="ایجاد کننده" value={file.ownerPartyName}/></Grid>
        //                     <Grid item xs={12}><DisplayField variant="display" label="ایجاد شده در" value={file.createdDate} options="Date"/></Grid>
        //                     <Grid item xs={12}><DisplayField variant="display" label="آخرین ویرایش توسط" value={file.modifierPartyName}/></Grid>
        //                     <Grid item xs={12}><DisplayField variant="display" label="ویرایش شده در" value={file.modifiedDate} options="Date"/></Grid>
        //                     {file.fileType &&
        //                     <Grid item xs={12}><DisplayField variant="display" label="نسخه" value={file.version}/></Grid>
        //                     }
        //                 </Grid>
        //             </Box>
        //             {/*<Box p={2}>*/}
        //             {/*    <Typography color="textSecondary" variant="subtitle2"><small>افرادی که این {file.fileType?"فایل":"پوشه"} را مشاهده می کنند:</small></Typography>*/}
        //             {/*    <Typography>{get_subscribers_name_list()}</Typography>*/}
        //             {/*</Box>*/}
        //             <ConfirmDialog
        //                 dialogReducer={deleteDialog}
        //                 title={`آیا از حذف این ${fileOrFolderStr} اطمینان دارید؟`}
        //             />
        //         </React.Fragment>
        //     )}
        // </Box>
    )
}
