import React from "react";
import {IconButton} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PostAddIcon from '@material-ui/icons/PostAdd';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RestorePageIcon from '@material-ui/icons/RestorePage';
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import FindInPageIcon from '@material-ui/icons/FindInPage';
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

const useStyles = makeStyles(() => ({
    menuIcon: {
        minWidth: "36px"
    }
}));

export default function EditorToolbar({handle_save, handle_restore, handle_new, saveFlag}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const datas = useSelector(({ fadak }) => fadak);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const menuItemClick = (method) => () => {
        method();
        setOpen(false);
    }
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <Box px={1}>
            <IconButton onClick={handle_save} disabled={saveFlag}>
                <SaveIcon/>
            </IconButton>
            <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <MoreVertIcon />
            </IconButton>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement={"bottom-end"} style={{zIndex:100}}>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: 'right top'}}
                    >
                        <Paper elevation={3}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" dense onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={menuItemClick(handle_restore)} disabled={saveFlag || true}>
                                        <ListItemIcon className={classes.menuIcon}>
                                            <RestorePageIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">بازگردانی تغییرات</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={menuItemClick(handleClose)} disabled>
                                        <ListItemIcon className={classes.menuIcon}>
                                            <FileCopyIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">ایجاد رونوشت</Typography>
                                    </MenuItem>
                                    <Divider />
                                    {checkPermis("questionnaire/editor/create", datas) &&
                                    <MenuItem onClick={menuItemClick(handle_new)}>
                                        <ListItemIcon className={classes.menuIcon}>
                                            <PostAddIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">پرسشنامه جدید</Typography>
                                    </MenuItem>
                                    }
                                    <MenuItem disabled>
                                        <ListItemIcon className={classes.menuIcon}>
                                            <FindInPageIcon fontSize="small" />
                                        </ListItemIcon>
                                        <Typography variant="inherit">فراخوانی پرسشنامه</Typography>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}
