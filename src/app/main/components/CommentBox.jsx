import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import axios from "../api/axiosRest";
import {SERVER_URL} from "../../../configs";
import DisplayField from "./DisplayField";
import FormInput from "./formControls/FormInput";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/Send';
import useListState from "../reducers/listState";
import TextField from "@material-ui/core/TextField";
import FuseScrollbars from "../../../@fuse/components/FuseScrollbars/FuseScrollbars";
import ReplyIcon from '@material-ui/icons/Reply';
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import ClearIcon from '@material-ui/icons/Clear';
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme) => ({
    scrollBox: {
        maxHeight: 450,
    },
    commentsList: {
        backgroundColor: theme.palette.background.default,
        paddingLeft: "12px",
    },
    inline: {
        display: 'inline',
    },
    messageInput: {
        backgroundColor: theme.palette.background.paper,
    },
    itemText: {
        paddingRight: "24px",
    },
    commentItem: {
        '& $menuBox button': {
            display: 'none'
        },
        '&:hover': {
            '& $menuBox button': {
                display: 'inline'
            }
        },
    },
    menuBox: {
        float: "right"
    },
    replyListItem: {
        marginBottom: "-30px"
    },
    replyListItemCard: {
        backgroundColor: "transparent"
    },
    repliedCard: {
        backgroundColor: "transparent",
        margin: "8px 0",
        padding: "6px 8px"
    },
    replyIcon: {
        fontSize: "14px",
        verticalAlign: "middle"
    }
}));

export default function CommentBox({context, callback=(comment)=>new Promise(resolve => resolve(comment))}) {
    const moment = require("moment-jalaali");
    const classes = useStyles();
    const persons = useListState("userId",[])
    const [user, set_user] = useState({})
    const [replyTo, set_replyTo] = useState(null)
    const [formValues, set_formValues] = React.useState({message: ""})
    const [waiting, set_waiting] = useState(false)
    const disabledSubmit = formValues.message.length===0 || waiting

    useEffect(()=>{
        const userIds = context.list.filter(i=>persons.list.findIndex(j=>j.userId===i.userId)<0).map(i=>i.userId)
        if(userIds.length>0) {
            axios.get("/s1/fadak/messengerPersonsInfo?userId=" + userIds).then(res => {
                persons.add(res.data.persons)
                set_user(res.data.user)
            }).catch(() => {});
        } else {
            axios.get("/s1/fadak/messengerPersonsInfo").then(res => {
                set_user(res.data.user)
            }).catch(() => {});
        }
    },[context.list])

    function handle_submit_comment() {
        set_waiting(true)
        const comment = {
            id: context.length.toString(),
            userId: user.userId,
            message: formValues.message,
            date: moment().unix()*1000,
            replyTo: replyTo
        }
        callback(comment).then(cmt => {
            context.add(cmt)
            set_waiting(false)
            reset()
        }).catch(()=>{
            set_waiting(false)
        })
    }
    function handle_cancel_reply() {
        set_replyTo(null)
    }
    function reset() {
        set_formValues({message: ""})
        set_replyTo(null)
    }
    return (
        <React.Fragment>
            <FuseScrollbars className={classes.scrollBox}>
                <List className={classes.commentsList}>
                    {context.list.map((comment,index)=> {
                        const person = persons.list.find(i=>i.userId===comment.userId)||{}
                        let replied = null
                        if(comment.replyTo) {
                            const repliedComment = context.list.find(i => i.id === comment.replyTo)
                            const repliedPerson = persons.list.find(i=>i.userId===repliedComment.userId)||{}
                            replied = {...repliedComment,...repliedPerson}
                        }
                        return <MessageBox key={index} comment={{...comment,...person}} repliedComment={replied} setReplyTo={set_replyTo}/>
                    })}
                </List>
            </FuseScrollbars>
            <List className={classes.commentsList}>
                {replyTo &&
                <ListItem className={classes.replyListItem} alignItems="flex-start">
                    <ListItemAvatar/>
                    <ListItemText
                        className={classes.itemText}
                        primary={
                            <ReplyToMesBox comment={context.list.find(i => i.id === replyTo)} persons={persons}/>
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="cancel reply" onClick={handle_cancel_reply}>
                            <ClearIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                }
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt={user.firstName} src={SERVER_URL+"/rest/s1/fadak/getpersonnelfile1?name="+user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                        className={classes.itemText}
                        primary={
                            <FormInput name="message" valueObject={formValues} valueHandler={set_formValues} grid={false} type="textarea" className={classes.messageInput}/>
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="submit comment" disabled={disabledSubmit} onClick={handle_submit_comment}>
                            {waiting ? <CircularProgress size={24} /> : <SendIcon className="icon-flipped" color={disabledSubmit ? "disabled" : "secondary"}/>}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </React.Fragment>
    )
}

function MessageBox({comment, repliedComment, setReplyTo}) {
    const classes = useStyles();
    const fullName = `${comment.firstName??""} ${comment.lastName??""} ${comment.suffix??""}`
    const repliedFullName = repliedComment ? `${repliedComment.firstName??""} ${repliedComment.lastName??""} ${repliedComment.suffix??""}` : ""
    return (
        <ListItem className={classes.commentItem} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={comment.firstName} src={SERVER_URL+"/rest/s1/fadak/getpersonnelfile1?name="+comment.avatar} />
            </ListItemAvatar>
            <ListItemText
                className={classes.itemText}
                primary={
                    <React.Fragment>
                        <Box className={classes.menuBox}>
                            <Tooltip title="پاسخ">
                                <IconButton onClick={()=>setReplyTo(comment.id)} size="small">
                                    <ReplyIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography color="secondary">{fullName}</Typography>
                        <Typography color="textSecondary">{comment.emplPosition||"نا مشخص"}، <DisplayField value={comment.date} options="Date" format="jD jMMMM jYYYY، HH:mm"/></Typography>
                        <TextField type="textarea" value={comment.message} className="display-paragraph" fullWidth multiline disabled/>
                        {repliedComment &&
                        <Card variant="outlined" className={classes.repliedCard}>
                            <Typography color="textSecondary"><ReplyIcon className={classes.replyIcon}/> در پاسخ به {repliedFullName}</Typography>
                            <Typography noWrap color="textSecondary">{repliedComment.message}</Typography>
                            {/*<TextField type="textarea" value={"\""+repliedComment.message+"\""} className="display-paragraph" fullWidth multiline disabled/>*/}
                        </Card>
                        }
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

function ReplyToMesBox({comment, persons}) {
    const classes = useStyles();
    const person = persons.list.find(i => i.userId === comment.userId)||{}
    const fullName = `${person.firstName??""} ${person.lastName??""} ${person.suffix??""}`

    return (
        <Card variant="outlined" className={classes.replyListItemCard}>
            <CardContent>
                <Typography color="secondary"><Typography component="span" color="textSecondary"><ReplyIcon className={classes.replyIcon}/> پاسخ به </Typography>{fullName}</Typography>
                <Typography noWrap color="textSecondary">{comment.message}</Typography>
                {/*<TextField type="textarea" value={"\""+comment.message+"\""} className="display-paragraph" fullWidth multiline disabled/>*/}
            </CardContent>
        </Card>
    )
}
