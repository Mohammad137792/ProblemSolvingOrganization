import React, {useState} from "react";
import {Box, Card, IconButton} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {SERVER_URL} from "../../../configs";
import {makeStyles} from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import FormInputDropFile from "./formControls/FormInputDropFile";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
    avatarContainer: {
        position: "relative",
        '&:hover': {
            '& $avatarEditButtonBox': {
                display: 'flex'
            }
        },
    },
    avatarEditButtonBox: {
        position: "absolute",
        width:  "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.5)",
        zIndex: 2,
        display: "none",
        justifyContent: "center",
        alignItems: "center"
    },
    avatarFileBox: {
        position: "absolute",
        width:  "100%",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        position: "absolute",
        width: "100%",
        height: "100%",
        '& img': {
            width: "100%",
            height: "100%",
        }
    },
}));

export default function UploadImage({imageLocation, defaultImage, card, cardVariant, padding, setValue, label, onSubmit, fitContain}) {
    const classes = useStyles();
    const cx = require('classnames');
    const [waiting, set_waiting] = useState(false)
    const [editing, set_editing] = useState(false)
    const [hasFile, set_hasFile] = useState(false)

    function handle_post() {
        set_waiting(true)
        onSubmit().then(() => {
            handle_reset()
        }).finally(() => {
            set_waiting(false)
        })
    }
    function handle_reset() {
        set_editing(false)
        set_hasFile(false)
        setValue(null)
    }
    function set_file(input) {
        setValue(input)
        set_hasFile(true)
    }

    return (
        <Box component={card?Card:null} variant={card?cardVariant:null} p={padding}>
            <Box className={cx("square-box",classes.avatarContainer)}>
                {imageLocation ? (
                    <Avatar variant="square" src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + imageLocation)} className={classes.avatar} imgProps={{className: cx(fitContain?"object-contain w-full":"object-cover")}}/>
                ): defaultImage ? (
                    <img src={defaultImage} className={classes.avatar} alt=""/>
                ):(
                    <Avatar variant="square" className={classes.avatar} imgProps={{className: cx(fitContain?"object-contain w-full":"object-cover")}}/>
                )}
                {!editing ? (
                    <Box className={classes.avatarEditButtonBox}>
                        <IconButton onClick={() => set_editing(true)}>
                            <EditIcon fontSize="large"/>
                        </IconButton>
                    </Box>
                ):(
                    <Box className={classes.avatarFileBox}>
                        <Box className="w-full">
                            <FormInputDropFile multiline label={label} setValue={set_file} variant="standard" disableClearable accept="image/*"/>
                        </Box>
                        <Box align="center">
                            <IconButton onClick={handle_reset} disabled={waiting}>
                                <CloseIcon/>
                            </IconButton>
                            <IconButton onClick={handle_post} disabled={!hasFile || waiting}>
                                {waiting? <CircularProgress size={24} /> : <DoneIcon/>}
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
