import React from 'react';
import {Dialog, Slide, AppBar, Toolbar, IconButton, Typography, makeStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const style = makeStyles({
    appbar: {
        position: "relative"
    },
    frame: {
        width: "100%",
        height: "100%",
        border: "none"
    }
});

const DashboardDialog = ({open, setOpen, config}) => {
    const handleClose = () => setOpen(false);
    const classes = style();
    console.log("advkavavafvavh" ,config )
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appbar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6">
                        {config.title}
                    </Typography>
                </Toolbar>
            </AppBar>

            <iframe src={config.url} id="testFrame" className={classes.frame} title={config.title}/>
        </Dialog>
    );
}

export default DashboardDialog;