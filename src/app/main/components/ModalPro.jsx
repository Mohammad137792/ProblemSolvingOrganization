import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    headerButtonBox: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    headerButton: {
        color: theme.palette.grey[500],
    },
    closeButton: {
        color: theme.palette.grey[500],
        marginLeft: theme.spacing(2)
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const {titleBgColor,titleColor, children, classes, onClose, actions, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other} style={{backgroundColor:titleBgColor,color:titleColor}}>
            <Typography variant="h6">{children}</Typography>
            <Box className={classes.headerButtonBox} display="flex" flexDirection="row-reverse">
                {onClose ? (
                    <Tooltip title="بستن پنجره">
                        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
                {actions && actions.map((act, ind) => (
                    <Tooltip key={ind} title={act.title}>
                        <IconButton className={classes.headerButton} onClick={act.onClick}>
                            <act.icon/>
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs({open, setOpen, title, content, actions, headerActions,titleColor, titleBgColor,scroll="body", maxWidth="md", fullWidth=true, ...restProps}) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                scroll={scroll}
                open={open}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
            >
                {title &&
                <DialogTitle id="customized-dialog-title" onClose={handleClose} actions={headerActions} titleBgColor={titleBgColor} titleColor={titleColor}>
                    {title}
                </DialogTitle>
                }
                {content &&
                <DialogContent dividers>
                    {content}
                </DialogContent>
                }
                {restProps.children}
                {actions &&
                <DialogActions>
                    {actions}
                </DialogActions>
                }
            </Dialog>
        </div>
    );
}
