import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import { Button, Card, CardContent, Grid, MenuItem, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SERVER_URL } from "../../../../../../configs";
import { useSelector } from "react-redux/es/hooks/useSelector";
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
    const { currentData } = props

    const [modalStyle] = React.useState(getModalStyle);
    // const partyId= useSelector(({auth}) => auth.user.data.partyId);

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);

    const configs = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    }

    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const deleteRow = (currentData, setCurrentData, id, setTableContent, familyToEdit, setDisplay) => {
        if (currentData && currentData.result && currentData.result[id].relationship && currentData.result[id].relationship.partyRelationshipId) {
           
            const partyRelationshipId = currentData.result[id].relationship.partyRelationshipId

            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/Familydetails?partyRelationshipId=" + partyRelationshipId, configs).then(resDeletd => {
                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=" + partyRelationshipId, configs)
                    .then(res => {

                        let arrry = [];
                        currentData.result.filter((item, index) => {
                            if (index !== id) {
                                arrry.push(item)
                            }
                        })

                        setCurrentData(Object.assign({}, currentData, { result: arrry }))
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)



                    });
            })
        }
        props.handleClose()
    };

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} className={classes.paper}>
                <div style={{ width: "100%", display: "flex", flexDirection: "row-reverse" }}>
                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => {
                        props.handleClose()
                    }} />
                </div>
                {/*<CloseIcon style={{cursor:"pointer"}} onClick={()=>{*/}
                {/*props.handleClose()*/}
                {/*}} />*/}
                <p style={{ color: "red", fontSize: "14" }}>اخطار</p>
                <p>آیا از حذف مورد انتخاب شده مطمئن هستید؟</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>


                    <Button variant="contained" size="small" onClick={() => { props.handleClose() }}  >
                        لغو
                    </Button>
                    <Button variant="outlined" style={{ backgroundColor: "red" }} size="small" onClick={() => {
                        deleteRow(props.currentData,
                            props.setCurrentData,
                            props.id, props.setTableContent, props.familyToEdit, props.setDisplay)
                    }}  >
                        حذف
                    </Button>
                </div>
            </div>
        </Modal>

    );
};

export default ModalDelete;