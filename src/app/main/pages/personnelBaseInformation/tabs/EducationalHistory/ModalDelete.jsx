import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import { Button, Card, CardContent, Grid, MenuItem, TextField } from "@material-ui/core";
import { SERVER_URL } from "../../../../../../configs";
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";


//config axios
const axiosKey = {
    headers: {
        'api_key': localStorage.getItem('api_key')
    }
}

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
    // const partyId = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !==null) ? partyIdUser : partyIdLogin

    const [modalStyle] = React.useState(getModalStyle);

    const deleteRow = (currentData) => {
        if (currentData.deletequalifaicatioId !== -1) {
            let id = currentData.deletequalifaicatioId

            const val = currentData.partyQualification.map((item, index) => {
                if (index !== id) {
                    return item
                }

            }).filter(item => item !== undefined)


            axios.delete(SERVER_URL + `/rest/s1/fadak/entity/PartyQualification?partyId=${partyId}&fromDate=${currentData.partyQualification[id].fromDate}&qualificationTypeEnumId=${currentData.partyQualification[id].qualificationTypeEnumId}`, axiosKey)



            currentData.deletequalifaicatioId = -1
            currentData.qualifaicatioId = -1
            currentData.partyQualification = [...val]
            props.setCurrentData(Object.assign({}, currentData))
            props.setDisplay(false);
            setTimeout(() => {
                props.setDisplay(true);
            }, 100)
            props.handleClose()
            return null


        }

        if( currentData.deleteJobQualifaicatioId !== -1){

            let id = currentData.deleteJobQualifaicatioId
            console.log("idididid" , id)

            const val = currentData.jobPartyQ.map((item, index) => {
                if (index !== id) {
                    return item
                }

            }).filter(item => item !== undefined)


            axios.delete(SERVER_URL + `/rest/s1/fadak/entity/PartyQualification?partyId=${partyId}&fromDate=${currentData.jobPartyQ[id].fromDate}&qualificationTypeEnumId=${currentData.jobPartyQ[id].qualificationTypeEnumId}`, axiosKey)



            currentData.deleteJobQualifaicatioId = -1
            currentData.jobQualifaicatioId = -1
            currentData.jobPartyQ = [...val]
            props.setCurrentData(Object.assign({}, currentData))
            props.setDisplay(false);
            setTimeout(() => {
                props.setDisplay(true);
            }, 100)

            props.handleClose()
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
                <CloseIcon style={{ cursor: "pointer" }} onClick={() => {
                    props.handleClose()
                }} />
                <p style={{ color: "red", fontSize: "14" }}>اخطار</p>
                <p>آیا از حذف این آیتم مطمئن هستید؟</p>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row-reverse" }}>

                    <Button variant="contained" style={{ background: 'red' }} size="small" onClick={() => {
                        deleteRow(currentData
                        )
                    }}  >
                        حذف
                    </Button>
                    <Button variant="contained" size="small" onClick={() => { props.handleClose() }}  >
                        لغو
                    </Button>
                </div>
            </div>
        </Modal>

    );
};

export default ModalDelete;
