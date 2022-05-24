import React, {useEffect, useState} from "react";
import useListState from "../../../reducers/listState";
import Card from "@material-ui/core/Card";
import {Box, Button, CardContent, Typography} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import axios from "../../../api/axiosRest";
import {DEFAULT_ACTION} from "./FileManager"
import {makeStyles, styled} from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import ArrowForwardIosSharpIcon from "@material-ui/icons/ExpandMore";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import TransferList from "../../../components/TransferList";
import FormProPersonnelFilter from "../../../components/formControls/FormProPersonnelFilter";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles(() => ({
    indicatorLabel: {
        fontSize: "85%",
        whiteSpace: "nowrap"
    },
}));

const formDefaultValues = {
    name: "",
    file: null
}

export default function FileForm({files, folderId, action, setAction, personnel, loadPersonnel, handleClose, setSelectedFile}) {
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    // const [formValidation, set_formValidation] = useState({})
    const [waiting, set_waiting] = useState(false)
    const subscribers = useListState("partyRelationshipId", [])
    const removedSubscribers = useListState("partyRelationshipId", [])

    const isFolder = action.type==="addFolder" || action.type==="editFolder"
    const isEdit = action.type==="editFile" || action.type==="editFolder"

    const formStructure = [{
        name    : "name",
        type    : "text",
        label   : isFolder ? "نام پوشه" : "نام فایل",
        variant : "standard",
        col     : 6,
        // required: true
    },{
        name    : "file",
        type    : "inputFile",
        label   : "فایل",
        variant : "standard",
        col     : 6,
        // required: true,
        display : !isFolder
    }]

    function handle_submit() {
        if(action.type === "addFile" && !formValues.file) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فایل انتخاب نشده است!'));
            return
        }
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        switch (action.type) {
            case "addFolder":
            case "addFile":
                create_file()
                break
            case "editFolder":
            case "editFile":
                update_file()
                break
            default:
        }
    }

    function create_file() {
        const filename = formValues.name || formValues.file?.name?.split(".")[0] || ""
        const subscribersList = JSON.stringify(subscribers.list.map(item=>({
            partyRelationshipId: item.partyRelationshipId||"N",
            receiveNotification: item.receiveNotification||"N",
            updatePermission: item.updatePermission||"N",
            addPermission: item.addPermission,
        })))
        const packet = new FormData();
        if(formValues.file) {
            packet.append("file",formValues.file)
            packet.append("size",formValues.file.size)
        }
        packet.append("name",filename)
        packet.append("folderId",folderId)
        packet.append("subscribers",subscribersList)
        axios.post("/s1/filesManagement/file", packet).then(res=>{
            const newFile = {...formValues, ...res.data}
            files.add(newFile)
            setSelectedFile(newFile)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, `${isFolder?"پوشه":"فایل"} جدید با موفقیت ایجاد شد.`))
            handle_reset()
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }

    function update_file() {
        const filename = formValues.name || formValues.file?.name?.split(".")[0] || ""
        const subscribersList = JSON.stringify(subscribers.list.map(item=>({
            partyRelationshipId: item.partyRelationshipId,
            receiveNotification: item.receiveNotification||"N",
            updatePermission: item.updatePermission||"N",
            addPermission: item.addPermission||"N",
            fromDate: item.fromDate||null,
            edited: item.edited||false,
        })))
        const removedSubscribersList = JSON.stringify(removedSubscribers.list.filter(i=>i.fromDate).map(item=>({
            partyRelationshipId: item.partyRelationshipId,
            fromDate: item.fromDate,
        })))
        const packet = new FormData();
        if(formValues.file) {
            packet.append("newFile",formValues.file)
            packet.append("size",formValues.file.size)
        }
        packet.append("fileId",formValues.fileId)
        packet.append("name",filename)
        packet.append("folderId",folderId)
        packet.append("subscribers",subscribersList)
        packet.append("removedSubscribers",removedSubscribersList)
        axios.post("/s1/filesManagement/file/updateFile", packet).then(res=>{
            const newFile = {...formValues, ...res.data}
            files.update(newFile)
            setSelectedFile(newFile)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, `ویرایش ${isFolder?"پوشه":"فایل"} با موفقیت انجام شد.`))
            handle_reset()
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }

    function handle_reset() {
        set_waiting(false)
        set_formValues(formDefaultValues)
        setAction(DEFAULT_ACTION)
        subscribers.set([])
        // handleClose()
    }

    useEffect(()=>{
        set_formValues(action.payload)
        subscribers.set(action.payload.subscribers||[])
    },[action])

    return (
        <Card variant="outlined">
            <CardContent>
                <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                         // formValidation={formValidation} setFormValidation={set_formValidation}
                         prepend={formStructure}
                         actionBox={<ActionBox>
                             <Button type="button" onClick={handle_submit} role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{isEdit?"ویرایش":"افزودن"}</Button>
                             <Button type="button" onClick={handle_reset} role="secondary" disabled={waiting}>لغو</Button>
                             {/*<Button type="button" onClick={()=>console.log(formValues)} role="tertiary">LOG</Button>*/}
                         </ActionBox>}
                >
                    <Grid item xs={12}>
                        <PersonnelTransferList subscribers={subscribers} removedSubscribers={removedSubscribers} personnel={personnel} loadPersonnel={loadPersonnel} isFolder={isFolder}/>
                    </Grid>
                </FormPro>
            </CardContent>
        </Card>
    )
}


const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    padding: theme.spacing(0),
    flexDirection: 'row-reverse',
    '&.Mui-expanded': {
        minHeight: "45px"
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        display: "flex",
        '& span': {
            content: "",
            flex: "1 1 auto",
            borderTop: `1px solid ${theme.palette.divider}`,
            marginTop: "12px",
        },
        '& .MuiTypography-root': {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
        '&.Mui-expanded': {
            marginTop: "12px",
            marginBottom: "12px",
        },
    },
    '& .MuiIconButton-root.MuiAccordionSummary-expandIcon': {
        paddingRight: 0,
        paddingLeft: 0
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
}));

function PersonnelTransferList({personnel, subscribers, removedSubscribers, loadPersonnel, isFolder}) {
    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleAddSub = (items) => new Promise(resolve => {
        removedSubscribers.remove(items)
        resolve(items)
    })
    const handleDelSub = (items) => new Promise(resolve => {
        removedSubscribers.add(items)
        items.forEach(item => {

        })
        resolve(items)
    })

    const display_org_info = (item) => {
        let info = []
        if(item.emplPosition) info.push(item.emplPosition)
        if(item.unitOrganization) info.push(item.unitOrganization)
        if(item.organizationName) info.push(item.organizationName)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudoId} ─ ${item.firstName||'-'} ${item.lastName||'-'} ${item.suffix||''}`
    const display_form = (item) => {
        const setValue = (name, value) => {
            const newItem = Object.assign({}, {...item, [name]: value, edited: true})
            subscribers.update(newItem)
        }
        return (
            <Box display={"flex"}>
                <PermissionIndicator name="updatePermission" label="ویرایش/حذف" values={item} setValue={setValue}/>
                {isFolder && <PermissionIndicator name="addPermission" label="افزودن" values={item} setValue={setValue}/>}
                <PermissionIndicator name="receiveNotification" label="اطلاع رسانی" values={item} setValue={setValue}/>
            </Box>
        )
    }
    return (
        <React.Fragment>
            <Accordion expanded={expanded === 'sharePanel'} onChange={handleChange('sharePanel')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>اشتراک گذاری</Typography><span/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TransferList
                                rightTitle="لیست پرسنل"
                                rightContext={personnel}
                                rightItemLabelPrimary={display_name}
                                rightItemLabelSecondary={display_org_info}
                                leftTitle="لیست مشترکان"
                                leftContext={subscribers}
                                leftItemLabelPrimary={display_name}
                                leftItemLabelSecondary={display_form}
                                onMoveRight={handleDelSub}
                                onMoveLeft={handleAddSub}
                                rightFilterForm={
                                    <FormProPersonnelFilter
                                        searchMethod={loadPersonnel}
                                        // formValues={formValues}
                                        // setFormValues={set_formValues}
                                    />
                                }
                            />
                        </Grid>
                    </Grid>

                </AccordionDetails>
            </Accordion>
        </React.Fragment>
    )
}

function PermissionIndicator({label, name, values, setValue}) {
    const classes = useStyles();
    const onClick = e => {
        e.stopPropagation()
    }
    const onChange = e => {
        e.stopPropagation()
        setValue(name, e.target.checked?"Y":"N")
    }
    return (
        <FormControlLabel
            label={<span className={classes.indicatorLabel} onClick={onClick}>{label}</span>}
            style={{ padding: "0 4px 0 0" }}
            control={<Switch name={name} checked={values[name]==="Y"} onChange={onChange} size="small"/>}
        />
    )
}
