import React from "react";
import {Typography} from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../configs";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import {withStyles} from "@material-ui/styles";
import { green } from '@material-ui/core/colors';
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ALERT_TYPES, setAlertContent} from "../../../store/actions/fadak";
import {useDispatch} from "react-redux";

const GreenListItem = withStyles(() => ({
    root: {
        '&:hover': {
            color: green["500"],
            backgroundColor: green["50"],
        }
    },
}))(ListItem);

const ViewLoading = ()=>(
    <Box textAlign="center" color="text.secondary" p={2}>
        <CircularProgress />
        <Typography variant={"body1"}>در حال دریافت</Typography>
    </Box>
)

export default function NewProcessPanel(props){
    const dispatch = useDispatch();
    const {setAction} = props;
    const [processList, setProcessList] = React.useState([])
    const [processListLoading, setProcessListLoading] = React.useState(true)
    React.useEffect(()=>{
        axios.get(SERVER_URL+"/rest/s1/fadak/process/list",{
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setProcessListLoading(false)
            setProcessList(res.data["outList"])
        }).catch(() => {
            setProcessListLoading(false)
        });
    },[])
    function startProcess(processDefinitionId){
        const packet = {
            processDefinitionId,
        };
        axios.post(SERVER_URL+"/rest/s1/fadak/process/start",packet,{
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {basicToken: localStorage.getItem('Authorization')}
        }).then(() => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فرآیند با موفقیت شروع شد.'));
            setAction("OpenNewTask")
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در شروع فرآیند!'));
            setAction("Default")
        });
    }
    return (
        <React.Fragment>
            <Typography variant={"h6"}>شروع فرآیند جدید</Typography>
            <List subheader={<ListSubheader>لیست فرآیندها</ListSubheader>}>
                {processListLoading?
                    <ViewLoading/>:
                    processList.map((p,i)=>(
                        <React.Fragment key={i}>
                            {i>0 && <Divider variant="fullWidth" component="li" />}
                            <GreenListItem button key={i} component="li" onClick={()=>startProcess(p.id)}>
                                <Box display="flex" style={{width:"100%"}}>
                                    <Box flexGrow={1}>{p.name}</Box>
                                    <Box><PlayCircleOutlineIcon /></Box>
                                </Box>
                            </GreenListItem>
                        </React.Fragment>
                    ))
                }
            </List>
        </React.Fragment>
    )
}
