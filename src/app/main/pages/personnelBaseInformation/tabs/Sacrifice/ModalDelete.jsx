import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import { Button, Card, CardContent, Grid, MenuItem, TextField } from "@material-ui/core";
import { SERVER_URL } from "../../../../../../configs";
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";


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

    const [modalStyle] = React.useState(getModalStyle);

    const deleteRow = (id, setTableContent) => {

        if (id.deleteDiseaseId !== -1) {
           
            const diseaseHistoryId = id.DiseaseHistory[id.deleteDiseaseId].diseaseHistoryId


            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/DiseaseHistory?diseaseHistoryId=" + diseaseHistoryId,
                axiosKey).then(res => {


                    let newtable = id.DiseaseHistory.map(item => {
                        if (item.diseaseHistoryId !== diseaseHistoryId) {
                            return item
                        }
                    }).filter(item => item !== undefined)
                    id.DiseaseHistory = [...newtable]
                    props.setCurrentData(Object.assign({}, id, { "deleteDiseaseId": -1 } ,{"diseaseId" : -1}))
                    setTableContent(rows => {
                        return {
                            ...rows,
                            Disease: newtable
                        }
                    }
                    )
                    props.setDisplay(false)
                    setTimeout(() => {
                        props.setDisplay(true)
                    }, 20)
                })

        }
        if (id.deleteExperimentId !== -1) {
            const experimentHistoryId = id.ExperimentHistory[id.deleteExperimentId].experimentHistoryId

            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/ExperimentHistory?experimentHistoryId=" + experimentHistoryId,
                axiosKey).then(res => {


                    let newtable = id.ExperimentHistory.map(item => {
                        if (item.experimentHistoryId !== experimentHistoryId) {
                            return item
                        }
                    }).filter(item => item !== undefined)
                    id.ExperimentHistory = [...newtable]
                    props.setCurrentData(Object.assign({}, id, { "deleteExperimentId": -1 } , {"experimentId" : -1}))

                    setTableContent(rows => {
                        return {
                            ...rows,
                            Experiment: newtable
                        }
                    }
                    )
                   props.setDisplay(false)
                    setTimeout(() => {
                        props.setDisplay(true)
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
                <CloseIcon style={{ cursor: "pointer" }} onClick={() => {
                    props.handleClose()
                }} />
                <p style={{ color: "red", fontSize: "14" }}>اخطار</p>
                <p>آیا از حذف این آیتم مطمئن هستید؟</p>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row-reverse" }}>

                    <Button variant="contained" style={{ background: 'red' }} size="small" onClick={() => {
                        deleteRow(props.id, props.setTableContent,
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
