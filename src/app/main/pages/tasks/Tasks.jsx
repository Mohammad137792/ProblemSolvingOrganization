import React, {createRef} from 'react';
import {CardContent, Grid, Typography} from "@material-ui/core";
import {FusePageSimple} from "../../../../@fuse";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import TaskPanel from "./TaskPanel";
import CardHeader from "@material-ui/core/CardHeader";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {SERVER_URL} from "../../../../configs";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListSubheader from "@material-ui/core/ListSubheader";
import Button from "@material-ui/core/Button";
import NewProcessPanel from "./NewProcessPanel";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "100%"
    },
    sidebar: {
        backgroundColor: theme.palette.primary.light+"0d",
        borderRight: "1px solid #ddd"
    },
}));

const ViewLoading = ()=>(
    <Box textAlign="center" color="text.secondary" p={2}>
        <CircularProgress />
        <Typography variant={"body1"}>در حال دریافت</Typography>
    </Box>
)

const Tasks = () => {
    const classes = useStyles();
    const [action, setAction] = React.useState('Default');
    const [taskList, setTaskList] = React.useState([]);
    const [taskLoading, setTaskLoading] = React.useState(true);
    const [task, setTask] = React.useState(null);

    const myScrollElement = createRef();
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    function loadTask(e){
        const taskId = e.currentTarget.attributes['data-taskid'].value;
        setTask(taskList.find(i=>i.taskId===taskId))
        setAction("Task")
        console.log("load task #"+taskId)
    }

    function loadTasksList(){
        setTaskLoading(true)
        return new Promise((resolve, reject) => {
            const moment = require('moment-jalaali')
            axios.get(SERVER_URL +"/rest/s1/fadak/process/task", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    filterId:"7bbba147-5313-11eb-80ec-0050569142e7",
                    firstResult:0,
                    maxResults:15,
                },
            }).then(res => {
                console.log('tasklist',res)
                let rows=[];
                let process=res.data._embedded.processDefinition
                let processTasks = res.data?._embedded?.task ? res.data?._embedded?.task : []

                if(processTasks.length > 0){
                    processTasks.sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(b.created) - new Date(a.created);
                      });

                    processTasks.forEach((task)=>{
                        let entry={};
                        entry.taskName=task.name;
                        entry.processName=process?.find(ele=>ele.id===task.processDefinitionId)?.name
                        entry.recieveDate=moment(task.created).format('HH:mm   jYYYY/jM/jD')
                        entry.taskId=task.id;
                        entry.formKey=task.formKey
                        rows.push(entry)
                    })
                }

                setTaskList(rows)
                setTaskLoading(false)
                console.log("task list",res)
                resolve(rows)
            }).catch(err => {
                console.log("get task list error..",err)
                reject(err)
            });
        })
    }
    React.useEffect(()=>{
        loadTasksList().then()
    },[])

    React.useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                setAction("Default")
                // setTask(null)
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    React.useEffect(()=>{
        scroll_to_top()
        switch (action){
            case "Default":
                setTask(null)
                break;
            case "OpenNewTask":
                loadTasksList().then(tasks => setTask(tasks[0]))
                // setTask(taskList[0])
                break;
            case "TaskCompleted":
                setTask(null)
                loadTasksList().then(() => setAction("Default"))
                break;
            default:
        }
    },[action])

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={
                <CardHeader title={"پیشخوان"} style={{width:"100%"}}
                            action={
                                <Button type="button" color="secondary" variant="outlined"
                                        startIcon={<span className="material-icons">library_add</span>}
                                        onClick={()=>setAction('NewProcess')}
                                >
                                    فرآیند جدید
                                </Button>
                            }
                />
            }
            content={
                <Grid container className={classes.container}>
                    <Grid item xs={12} sm={4} md={3} className={classes.sidebar}>
                        <List component="nav" aria-labelledby="nested-list-subheader"
                              subheader={
                                  <ListSubheader component="div" id="nested-list-subheader">لیست وظایف</ListSubheader>
                              }
                        >
                            {taskLoading?
                                <ViewLoading/>
                                :taskList.length>0?
                                    taskList.map((task,ind)=>(
                                        <ListItem button key={ind}>
                                            <ListItemText primary={task.taskName} data-taskid={task.taskId} onClick={loadTask}
                                                          secondary={
                                                              <Box display="flex"><Box flexGrow={1}>{task.processName}</Box><Box>{task.recieveDate}</Box></Box>
                                                          }
                                                          secondaryTypographyProps={{component:'div'}}
                                            />
                                        </ListItem>
                                    )):
                                    <Box p={2}>موردی وجود ندارد.</Box>
                            }
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                        <Box p={2}>
                            <Card>
                                {/*<CardContent>*/}
                                    {action==='NewProcess'?
                                        <NewProcessPanel setAction={setAction}/> :
                                        <TaskPanel task={task} setAction={setAction} scrollTop={scroll_to_top}/>
                                    }
                                {/*</CardContent>*/}
                            </Card>
                        </Box>

                    </Grid>
                </Grid>
            }
        />
    );
}
export default Tasks;
