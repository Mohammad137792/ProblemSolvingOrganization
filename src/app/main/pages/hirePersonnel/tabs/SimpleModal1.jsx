import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {
    Button,
    Card,
    CardContent,
    CardHeader, Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem, Select,
    TextField
} from "@material-ui/core";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function SimpleModal1() {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">عنوان</h2>
            <p id="simple-modal-description">
                <TextField  id="standard-basic" label="عنوان" />



                {/*Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
            </p>
            {/*<SimpleModal1 />*/}
        </div>
    );

    return (
        <div>
            <Button variant="contained" color="primary" size="small" type="button" onClick={handleOpen}>
                حذف            </Button>

            {/*<Modal*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="simple-modal-title"*/}
            {/*    aria-describedby="simple-modal-description"*/}
            {/*>*/}
            {/*    {body}*/}
            {/*</Modal>*/}
        </div>
    );
}
