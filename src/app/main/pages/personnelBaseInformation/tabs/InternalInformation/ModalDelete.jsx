import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SERVER_URL} from "../../../../../../configs";
import {useSelector} from "react-redux/es/hooks/useSelector";
import CloseIcon from "../ContactInformation/ModalDelete1";


const useStyles = makeStyles((theme) => ({
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


const ModalDelete = props => {
    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);
    // const [tableContent, setTableContent] = React.useState([]);
    // const [tableContent, setTableContent] = React.useState([]);
    const partyId= useSelector(({auth}) => auth.user.data.partyId);

const deleteRow = (id,setTableContent)=>{

    axios.delete(SERVER_URL + "/rest/s1/fadak/entity/AssetPartyAssignment?assetId="+ id +"&partyId="+ partyId +"&roleTypeId=100000&fromDate=*" , {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    })
        .then(res => {
            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/Asset?assetId=" + id, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            })
                .then(res => {
                })
            setTableContent(preFormData => preFormData.filter(member => {
                // console.log(`member: ${member.id} and id: ${id}`);
                return member.id !== id

            }))
        })
    props.handleClose()
}
     // }

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
                {/*<CloseIcon style={{cursor:"pointer"}} onClick={()=>{*/}
                {/*props.handleClose()*/}
                {/*}} />*/}
                <p style={{color : "red", fontSize: "14"}}>اخطار</p>
                <p>آیا از حذف مورد انتخاب شده مطمئن هستید؟</p>

                <div style={{display:"flex",justifyContent: "space-between"}}>

                    <Button variant="contained" size="small" onClick={()=>{props.handleClose()}}  >
                        لغو
                    </Button>
                    <Button variant="outlined" style={{backgroundColor:"red"}} size="small" onClick={()=>{deleteRow(props.id,props.setTableContent)}}  >
                        حذف
                    </Button>
                </div>

            </div>
        </Modal>

    );
}

export default ModalDelete;