import React from "react";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import EventNoteIcon from '@material-ui/icons/EventNote';
import axios from "axios";
import {SERVER_URL} from "../../../../configs";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../store/actions/fadak";

function loadComponent(name) {
    return  React.lazy(() =>
        import(`./forms/${name}.jsx`).catch( ()=>import(`./forms/FormNotFound.jsx`) )
    );
}

function formatVariables(varObject) {
    let variables = {};
    Object.keys(varObject).map(key=>{
        variables[key] = {value: varObject[key]}
    });
    return variables
}

const ViewDefault = ()=>(
    <Box textAlign="center" color="text.secondary" p={4}>
        <EventNoteIcon />
        <Typography variant={"body1"}>محتوای پیش فرض</Typography>
    </Box>
)

const ViewLoading = ({message="در حال دریافت اطلاعات"})=>(
    <Box textAlign="center" color="text.secondary" p={4}>
        <CircularProgress />
        <Typography variant={"body1"}>{message}</Typography>
    </Box>
)

const ViewPanel = ({task, formVariables, setAction, scrollTop})=>{
    const dispatch = useDispatch();
    const TaskForm = loadComponent(task?.formKey)

    function submitCallback(formData,isSubmited,processInstanceId) {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        let variables = formatVariables(formData);
        if(!isSubmited){
            const packet = {
                taskId: task.taskId,
                variables: variables
            }
            axios.post(SERVER_URL +"/rest/s1/fadak/process/form", packet,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setAction("TaskCompleted")
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            });
        }
        else{

            const packet = {
                variables: variables,
                processInstanceId:processInstanceId
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/variables", packet, {
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setAction("TaskCompleted")
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            });
        }
    }

    return (
        <React.Suspense fallback={<ViewLoading message="در حال بارگذاری"/>}>
            <TaskForm formVariables={formVariables} taskId={task?.taskId} submitCallback={submitCallback} scrollTop={scrollTop} setAction={setAction}/>
        </React.Suspense>
    )
}

export default function TaskPanel({task, setAction, scrollTop}) {
    const dispatch = useDispatch();
    const [state, setState] = React.useState("Default")
    const [formVariables, setFormVariables] = React.useState({})

    React.useEffect(()=>{
        if(task){
            setState("Loading")
            axios.get(SERVER_URL+"/rest/s1/fadak/process/form",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    taskId: task.taskId
                }
            }).then(res => {
                setFormVariables(res.data)
                setState("Panel")
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در دریافت اطلاعات!'));
                setFormVariables({})
                setState("Default")
            });
        }else {
            setState("Default")
        }
    },[task])

    if(state==="Panel"){
        return <ViewPanel task={task} setAction={setAction} formVariables={formVariables} scrollTop={scrollTop}/>
    }
    if(state==="Loading"){
        return <ViewLoading/>
    }
    return <ViewDefault/>
}
