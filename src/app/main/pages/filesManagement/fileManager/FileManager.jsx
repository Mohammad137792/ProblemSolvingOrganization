import React, {createRef, useEffect, useState} from "react";
import {Box, CardHeader, Typography} from "@material-ui/core";
import {FusePageSimple} from "../../../../../@fuse";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import useListState from "../../../reducers/listState";
import {makeStyles} from "@material-ui/core/styles";
import axios from "../../../api/axiosRest";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import UploadFileIcon from '@material-ui/icons/CloudUpload';
import FileExplorer from "./FileExplorer";
import Divider from "@material-ui/core/Divider";
import FileForm from "./FileForm";
import FileDetails from "./FileDetails";
import FolderIcon from "@material-ui/icons/FolderOutlined";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme) => ({
    ContentBox: {
        minHeight: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    FileInfoSide: {
        width: 260,
        minHeight: "100%",
        backgroundColor: theme.palette.background.default
    },
    BreadcrumbItem: {
        cursor: "pointer"
    },
}));

const MAIN_ROOT_FOLDER = {
    fileId: "",//"_MainFolder_",
    name: "فایل های من",
}

export const DEFAULT_ACTION = {type: "", payload: {}}

export default function FileManager() {
    const myScrollElement = createRef();
    const classes = useStyles();
    const root = useListState("fileId",[MAIN_ROOT_FOLDER])
    const files = useListState("fileId")
    const personnel = useListState("partyRelationshipId")
    const [action, set_action] = useState(DEFAULT_ACTION)
    const [addPermission, set_addPermission] = useState("N")
    const [waiting, set_waiting] = useState(false)
    const [selectedFiles, set_selectedFiles] = useState([])
    const selectedFile = selectedFiles[0]||null
    const tableColumns = [{
        name    : "name",
        label   : "نام فایل",
        type    : "text",
        style   : {width: "40%"}
    },{
        name    : "fileType",
        label   : "نوع فایل",
        type    : "text",
    },{
        name    : "ownerPartyName",
        label   : "ایجاد کننده",
        type    : "text",
    },{
        name    : "modifiedDate",
        label   : "ویرایش",
        type    : "date",
    }]
    function get_current_folder_id() {
        return root.list.slice(-1)[0].fileId
    }

    const tableActions = [{
        id      : "addFolder",
        title   : "ایجاد پوشه",
        icon    : CreateNewFolderIcon,
        onClick : () => set_action({type: "addFolder", payload: {}}),
        disabled: waiting || addPermission!=="Y"
    },{
        id      : "addFile",
        title   : "بارگذاری فایل",
        icon    : UploadFileIcon,
        onClick : () => set_action({type: "addFile", payload: {}}),
        disabled: waiting || addPermission!=="Y"
    }]
    const fileFormProps = {
        files,
        folderId: get_current_folder_id(),
        action,
        setAction: set_action,
        personnel,
        loadPersonnel: load_personnel,
        setSelectedFile: (newFile) => set_selectedFiles([newFile])
    }
    const tableFormActions = [{
        id      : "addFolder",
        form    : <FileForm {...fileFormProps}/>
    },{
        id      : "addFile",
        form    : <FileForm {...fileFormProps}/>
    },{
        id      : "editFolder",
        form    : <FileForm {...fileFormProps}/>
    },{
        id      : "editFile",
        form    : <FileForm {...fileFormProps}/>
    }]

    useEffect(()=>{
        set_waiting(true)
        const folderId = get_current_folder_id()
        files.set(null)
        axios.get("/s1/filesManagement/myFiles?folderId="+folderId).then(res => {
            files.set(res.data.files)
            set_addPermission(res.data.addPermission)
            set_waiting(false)
        }).catch(() => {
            files.set([])
            set_addPermission("N")
            set_waiting(false)
        });
    },[root.list])

    function handle_double_click(row) {
        if(!row.fileType) {
            root.add(row)
            scroll_to_top()
        }
    }
    function handle_change_root(folder) {
        const index = root.list.indexOf(folder);
        if(index<root.length-1) {
            const out = root.list.slice(index - root.length + 1)
            root.remove(out)
        }
    }
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    function load_personnel(filter={}) {
        axios.post("/s1/fadak/searchUsers",{data: filter}).then(res => {
            personnel.set(res.data.result)
        }).catch(() => {
            personnel.set([])
        });
    }
    function delete_file(file) {
        files.remove(file)
        set_action(DEFAULT_ACTION)
        set_selectedFiles([])
    }

    useEffect(()=>{
        load_personnel()
    },[])

    return <FusePageSimple
        ref={myScrollElement}
        header={
            <CardHeader title={"مدیریت مستندات"}/>
        }
        content={
            <Box className={classes.ContentBox}>
                <Collapse in={selectedFile}>
                    <FileDetails file={selectedFile} action={action} setAction={set_action} deleteCallback={delete_file}/>
                    <Divider variant="fullWidth"/>
                </Collapse>
                <Box bg="white">
                    <FileExplorer
                        title={
                            <Breadcrumbs aria-label="breadcrumb">
                                <FolderIcon/>
                                {root.list.map((folder,index) => (
                                    <BreadcrumbItem key={index} folder={folder} onClick={handle_change_root}/>
                                ))}
                            </Breadcrumbs>
                        }
                        columns={tableColumns}
                        rows={files.list||[]}
                        loading={files.list===null}
                        selectable
                        singleSelect
                        selectedRows={selectedFiles}
                        setSelectedRows={set_selectedFiles}
                        actions={tableActions}
                        formActions={tableFormActions}
                        showForm={action.type}
                        showRowNumber={false}
                        defaultOrderBy="fileType"
                        dblClickCallback={handle_double_click}
                        fixedLayout={true}
                    />
                </Box>
            </Box>
            // <Box display="flex" className={classes.ContentBox}>
            //     <Box flexGrow={1} flexBasis={0} bg="white">
            //         <FileExplorer
            //             title={
            //                 <Breadcrumbs aria-label="breadcrumb">
            //                     <FolderIcon/>
            //                     {root.list.map((folder,index) => (
            //                         <BreadcrumbItem key={index} folder={folder} onClick={handle_change_root}/>
            //                     ))}
            //                 </Breadcrumbs>
            //             }
            //             columns={tableColumns}
            //             rows={files.list||[]}
            //             loading={files.list===null}
            //             selectable
            //             singleSelect
            //             selectedRows={selectedFiles}
            //             setSelectedRows={set_selectedFiles}
            //             actions={tableActions}
            //             formActions={tableFormActions}
            //             showForm={action.type}
            //             showRowNumber={false}
            //             defaultOrderBy="fileType"
            //             dblClickCallback={handle_double_click}
            //             fixedLayout={true}
            //         />
            //     </Box>
            //     <Box>
            //         <Divider orientation="vertical" variant="fullWidth"/>
            //     </Box>
            //     <FileDetails file={selectedFile} action={action} setAction={set_action} deleteCallback={delete_file}/>
            // </Box>
        }
    />
}

function BreadcrumbItem({folder, onClick}) {
    const classes = useStyles();
    return (
        <Typography onClick={()=>onClick(folder)} className={classes.BreadcrumbItem}>{folder.name}</Typography>
    )
}
