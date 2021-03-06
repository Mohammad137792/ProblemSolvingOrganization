import React, {useState} from 'react';
import {Button, Typography, Dialog, Icon, Slide} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/styles';
import {red} from '@material-ui/core/colors';
import {FuseScrollbars, FuseSettings} from '@fuse';
import translate from "../../main/helpers/translate";

const Transition = React.forwardRef(function Transition(props, ref) {
    const {direction} = useTheme();
    return <Slide direction={direction === "rtl" ? "right" : "left"} ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
    button: {
        position: 'absolute',
        right: 0,
        // top: 160,
        bottom: 20,
        minWidth: 48,
        width: 48,
        height: 48,
        opacity: .9,
        padding: 0,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 999,
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[500],
            opacity: 1
        }
    },
    '@keyframes rotating': {
        from: {
            transform: 'rotate(0deg)'
        },
        to: {
            transform: 'rotate(360deg)'
        }
    },
    buttonIcon: {
        animation: '$rotating 3s linear infinite'
    },
    dialogPaper: {
        position: 'fixed',
        width: 380,
        maxWidth: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        top: 0,
        height: '100%',
        minHeight: '100%',
        bottom: 0,
        right: 0,
        margin: 0,
        zIndex: 1000,
        borderRadius: 0
    }
}));

function SettingsPanel() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button id="fuse-settings" className={classes.button} variant="contained" onClick={handleOpen}>
                <Icon className={classes.buttonIcon}>settings</Icon>
            </Button>

            <Dialog
                TransitionComponent={Transition}
                aria-labelledby="settings-panel"
                aria-describedby="settings"
                open={open}
                keepMounted
                onClose={handleClose}
                BackdropProps={{invisible: true}}
                classes={{
                    paper: classes.dialogPaper
                }}
            >
                <FuseScrollbars className="p-24 sm:p-32">
                    <Typography className="mb-32" variant="h6">{translate("Theme Settings")}</Typography>
                    <FuseSettings/>
                </FuseScrollbars>
            </Dialog>
        </React.Fragment>
    );
}

export default SettingsPanel;
