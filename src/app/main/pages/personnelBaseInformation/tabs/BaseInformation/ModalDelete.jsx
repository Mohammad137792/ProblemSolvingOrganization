import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import {SERVER_URL} from "../../../../../../configs";
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 200,
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


const ModalDelete = props => {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);

const deleteRow = (id,setTableContent)=>{
    axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyContent?partyContentId=" + id ,{
        headers: {
            'api_key': localStorage.getItem('api_key')
        },  })
        .then(res => {
            props.handleClose();
            setTableContent(preFormData => preFormData.filter(member => {
                return member.id !== id

            }))
        });
    props.handleClose()
};
     // }
{
}
    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >

            <div style={modalStyle} className={classes.paper}>
                <div style={{width:"100%",display: "flex", flexDirection: "row-reverse"}}>
                    <CloseIcon style={{ cursor:"pointer"}}  onClick={()=>{
                        props.handleClose()
                    }} />
                </div>

                <p style={{color : "red", fontSize: "14"}}>??????????</p>
                <p>?????? ???? ?????? ???????? ???????????? ?????? ?????????? ????????????</p>
                <div style={{display:"flex",justifyContent: "space-between"}}>



                    <Button variant="contained"  size="small" onClick={()=>{props.handleClose()}}  >
                        ??????
                    </Button>
                    <Button variant="outlined" style={{backgroundColor:"red"}} size="small" onClick={()=>{deleteRow(props.id,props.setTableContent,
                    )}}  >
                        ??????
                    </Button>
                </div>
            </div>
        </Modal>

    );
};

export default ModalDelete;