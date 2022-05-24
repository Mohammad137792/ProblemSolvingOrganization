import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SERVER_URL} from "../../../../../../configs";
import CloseIcon from '@material-ui/icons/Close';


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



    const config = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    }


const deleteRow = (id,setTableContent,partyIdsets,fromDate1)=>{

    console.log("partyIdsetspartyIdsets",partyIdsets)




    let fromDate=0;

        if (props.fromDate?.ContactMechList) {
            props.fromDate.ContactMechList.map(item => {
                if (item.contactMechId === id) {
                    fromDate = item.fromDate
                }
            })
        }




        const putData = {contactMechId : id , partyId : partyIdsets , fromDate :  fromDate , thruDate : Date.now()  }
        axios.put(SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech" , {data : putData} , config).then(response => {
            console.log('dvijajavdvava' , response)
            setTableContent(preFormData => preFormData.filter(member => {

                return member.id !== id
            }))
        })






    props.handleClose()
};
     // }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {/*<CloseIcon style={{cursor:"pointer"}} onClick={()=>{*/}
                {/*props.handleClose()*/}
            {/*}} />*/}
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
                {/*<Button variant="contained" color="primary" size="small" onClick={()=>{deleteRow(props.id,props.setTableContent,props.partyId,*/}
                    {/*props.fromDate1)}}  >*/}
                    {/*حذف*/}
                {/*</Button>*/}
                <div style={{display:"flex",justifyContent: "space-between"}}>

                    <Button variant="contained" size="small" onClick={()=>{props.handleClose()}}  >
                        لغو
                    </Button>
                    <Button variant="outlined" style={{backgroundColor:"red"}} size="small" onClick={()=>{deleteRow(props.id,props.setTableContent,props.partyIdsets)}}  >
                        حذف
                    </Button>
                </div>

            </div>
        </Modal>

    );
};

export default ModalDelete;