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
    const { currentData , partyIdOrg } = props

    const [modalStyle] = React.useState(getModalStyle);

    const confg = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    }


    console.log("jkvavavavsvdabv" , props)
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);


    const partyId =   (partyIdOrg !== null ) ? partyIdOrg :(partyIdUser !== null) ? partyIdUser : partyIdLogin


    const deleteRow = (currentData, setCurrentData, id, setTableContent, addressToEdit, setdisplay1) => {

        if (currentData && currentData.postalList) {
            const contactMechId = currentData.postalList[id].contactMechId;

            const fromDate = currentData.postalList[id].fromDate;

            console.log("adijaja", fromDate , contactMechId , partyId)
            axios.put(SERVER_URL + `/rest/s1/fadak/entity/PartyContactMech` , {data : {partyId : partyId , contactMechId : contactMechId , fromDate : fromDate , thruDate : Date.now() }}
            , confg).then(response => {
                let val = currentData?.postalList
                val.splice(id, 1);
                setCurrentData(Object.assign({}, currentData, { postalList: val }))
                setdisplay1(false)
                setTimeout(() => {
                    setdisplay1(true)
                }, 20)
            })

        }
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
            <div style={modalStyle} className={classes.paper}>
                <div style={{ width: "100%", display: "flex", flexDirection: "row-reverse" }}>
                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => {
                        props.handleClose()
                    }} />
                </div>
                <p style={{ color: "red", fontSize: "14" }}>اخطار</p>
                <p>آیا از حذف مورد انتخاب شده مطمئن هستید؟</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>


                    <Button variant="contained" size="small" onClick={() => { props.handleClose() }}  >
                        لغو
                    </Button>
                    <Button variant="outlined" style={{ backgroundColor: "red" }} size="small" onClick={() => {
                        deleteRow(deleteRow(props.currentData,
                            props.setCurrentData,
                            props.id, props.setTableContent, props.addressToEdit, props.setdisplay1))
                    }}  >
                        حذف
                    </Button>
                </div>
            </div>

        </Modal>


    );
};

export default ModalDelete;
