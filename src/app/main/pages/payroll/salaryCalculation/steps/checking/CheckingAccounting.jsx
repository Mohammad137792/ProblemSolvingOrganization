import React, {useState,useEffect} from "react";
import TablePro from "../../../../../components/TablePro";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ListProAccordion from "../../../../../components/ListProAccordion";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDialog, {useDialogReducer} from "../../../../../components/ConfirmDialog";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import FormPro from "../../../../../components/formControls/FormPro";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';

const useStyles = makeStyles(() => ({
    row: {
        width: "100%",
        '& $rowActionBox': {
            right: "60px",
        },
        '& $rowActionBox button': {
            display: 'none'
        },
        '&:hover': {
            '& $rowActionBox button': {
                display: 'inline'
            }
        },
    },
    formBox: {
        position: "relative"
    },
    rowActionBox: {
        width: "fit-content",
        position: "absolute",
        right: "0px",
        top: "calc(50% - 24px)",
        backdropFilter: "blur(2px)",
    },
}));

export default function CheckingAccounting({context , set_formVariables,noEdit}) {
    const [editing, set_editing] = useState(null)
    const [fieldsInfo, setFieldsInfo] = useState([])
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        if(editing && set_formVariables)
        set_formVariables((prevState)=>{return{...prevState,vouchers:context.list}})
    },[context])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/detailAccount`, axiosKey).then(res => { 
            // let stringArray =  '[\"'+res.data.allAccount.join('\",\"')+'\"]'
            // '[\"'+fieldsInfo.allAccount?.join('\",\"')+'\"]'
            // console.log('stringArray',res.data.allAccount.join('\",\"'))
            setFieldsInfo(res.data.allAccount)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }


    return (
        <React.Fragment>
            <ListProAccordion
                title="لیست سندهای حسابداری"
                context={context}
                renderAccordionSummary={(item,expanded) => <ItemSummary item={item} context={context} noEdit={noEdit} expanded={expanded} set_editing={set_editing}/>}
                renderAccordionDetails={(item) => <ItemDetails item={item} context={context} noEdit={noEdit} editing={editing} set_editing={set_editing} fieldsInfo={fieldsInfo} />}
                action={
                    <Tooltip title="دریافت فایل">
                        <IconButton>
                            <CloudDownloadIcon/>
                        </IconButton>
                    </Tooltip>
                }
            />
        </React.Fragment>
    )
}

function ItemSummary({item, context, expanded, set_editing,noEdit}) {
    const moment = require('moment-jalaali');
    const classes = useStyles();
    const removeDialog = useDialogReducer(row => context.remove(row))

    const handle_remove = (e) => {
        e.stopPropagation()
        removeDialog.show()
    }
    const handle_edit = (e) => {
        if(expanded === item[context.pk]) {
            e.stopPropagation()
        }
        set_editing(item[context.pk])
    }

    return (
        <Box className={classes.row} display="flex">
            <Typography>{`${item.code} ─ ${item.description}`}</Typography>
            <Box ml={3}><Typography color="textSecondary">{moment(item.date).format("jD jMMMM jYYYY")}</Typography></Box>
            {!noEdit && <div className={classes.rowActionBox}>
                <Tooltip title="حذف">
                    <IconButton onClick={handle_remove}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="ویرایش">
                    <IconButton onClick={handle_edit}>
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
            </div>}
            <ConfirmDialog
                dialogReducer={removeDialog}
                title="آیا از حذف این سند اطمینان دارید؟"
            />
        </Box>
    )
}

function ItemDetails({item, context, editing, set_editing,fieldsInfo,noEdit}) {
    const classes = useStyles();
    const [formValues, set_formValues] = useState(item)

    const handle_edit = (e) => {
        e.stopPropagation()
        context.update(formValues)

        set_editing(null)
    }
    const handle_cancel = (e) => {
        e.stopPropagation()
        set_editing(null)
        set_formValues(item)
    }
    const set_item_articles = (item) => (newOperations) => {
        item.articles = newOperations
        context.update(item)
    }

    const formStructure = [{
        name    : "code",
        label   : "شماره سند",
        type    : "text",
        variant : "standard",
        col     : 2,
    },{
        name    : "description",
        label   : "توضیحات سند",
        type    : "text",
        variant : "standard",
        col     : 5,
    },{
        name    : "date",
        label   : "تاریخ سند",
        type    : "date",
        variant : "standard"
    }]

    const tableColumns = [{
        name    : "glAccountCode",
        label   : "حساب معین",
        type    : "text",
        style   : {width: "20%"}
    },{
        name    : "creditor",
        label   : "بستانکار",
        type    : "number",
        style   : {width: "10%"}
    },{
        name    : "debter",
        label   : "بدهکار",
        type    : "number",
        style   : {width: "10%"}
    },{
        name    : "gdAccounts",
        label   : "حساب تفصیلی",
        type    : "multiselect",
        // options : ""+fieldsInfo+"",
        // optionIdField   : "detailedAccountId",
        // optionLabelField: "enumDescription",
        style   : {width: "30%"}
    },{
        name    : "xx5",
        label   : "شرح",
        type    : "text",
    }]

    return (
        <Box className="w-full">
            {editing === item[context.pk] &&
                <Box p={2} className={classes.formBox}>
                    <FormPro
                        formValues={formValues}
                        setFormValues={set_formValues}
                        prepend={formStructure}
                    />
                    <div className={classes.rowActionBox}>
                        <Tooltip title="لغو">
                            <IconButton onClick={handle_cancel}>
                                <CloseIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="تایید">
                            <IconButton onClick={handle_edit}>
                                <DoneIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Box>
            }
            <TablePro
                rows={item.articles}
                setRows={set_item_articles(item)}
                columns={tableColumns}
                showTitleBar={false}
                dit = {noEdit ? false : "inline"}
                editCallback={() => new Promise(resolve => resolve() )}
            />
        </Box>
    )
}
