import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Button} from "@material-ui/core";
import InlineTable from "../../../components/inlinetabel";
import CloseIcon from '@material-ui/icons/Close';
import {submitDelete} from "../../../../store/actions/fadak";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak/alert.actions";

const UseStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
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
export default function DeleteModal({open,handleClose,rowDelete,dispatch,setTableContent,setExcelData}) {
    const classes = UseStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const deletePosition=(id,pseudoId)=>{
        axios.delete(SERVER_URL + "/rest/s1/fadak/emplPosition?emplPositionId="+id,{
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'))
            deleteRow(id,pseudoId);
        })
    }
    const deleteRow=(id,pseudoId)=>{
        handleClose(id)
        setTableContent(prevState => prevState.filter(value => value.id !== id))
        setExcelData(prevState => prevState.filter(value => value["کد پست سازمانی"] !== pseudoId))
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div style={{width:"100%",display: "flex", flexDirection: "row-reverse"}}>
                <CloseIcon style={{ cursor:"pointer"}}  onClick={()=>{handleClose()}} />
            </div>
            <Grid>ایا از حذف این مورد اطمینان دارید؟</Grid>
            <Grid>
                <Button variant="contained" className="mt-5" onClick={()=>deletePosition(rowDelete?.id,rowDelete.pseudoId)}>بله</Button> &nbsp;&nbsp;&nbsp;
                <Button variant="contained" className="mt-5" onClick={handleClose}>خیر</Button>
            </Grid>
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