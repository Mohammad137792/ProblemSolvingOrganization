import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Button} from "@material-ui/core";
import InlineTable from "../../../components/inlinetabel";
import CloseIcon from '@material-ui/icons/Close';
const UseStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 800,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
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
export default function ContactModal({contactData,open,handleClose,setDisplay,personContacts}) {
    const classes = UseStyles();
    const [modalStyle] = React.useState(getModalStyle);


    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div style={{width:"100%",display: "flex", flexDirection: "row-reverse"}}>
                <CloseIcon style={{ cursor:"pointer"}}  onClick={()=>{handleClose()}} />
            </div>
        <InlineTable  columns={[
            { title: 'نوع اطلاعات تماس', field: 'purposeDescription' },
            { title: 'اطلاعات تماس', field: "contactNumber"}]}
            exportButton={false} data={personContacts} count={personContacts.length} hideEdit={true} hideDetail={true} title="اطلاعات تماس">
        </InlineTable>
        </div>
    );
    return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
    );
}