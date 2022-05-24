import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Button,TextField} from "@material-ui/core";
import InlineTable from "../../../../components/inlinetabel";
import CloseIcon from '@material-ui/icons/Close';
import {submitDelete} from "../../../../../store/actions/fadak";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak/alert.actions";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";

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
export default function ValidFormula({open,handleClose,data}) {
    // debugger
    const classes = UseStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [formValues,setFormValues]=React.useState({});
    const [result,setResult]=React.useState("");
    const executeFormula=(formValue)=>{
        let postData={}

        postData.data=formValue;
        for(let param in postData.data){
            if(parseInt(postData.data[param]))
                postData.data[param] = parseInt(postData.data[param])
        }
        postData.formulaId=data?.formulaId
        axios.post(SERVER_URL+"/rest/s1/rule/formula/execute",postData,{headers:{"api_key":localStorage.getItem("api_key")}}).then(res=>{
            // debugger
            setResult(res.data.result)
        })
    }
    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div style={{width:"100%",display: "flex", flexDirection: "row-reverse"}}>
                <CloseIcon style={{ cursor:"pointer"}}  onClick={()=>{handleClose()}} />
            </div>
        <FormPro prepend={data?.main} formValues={formValues} setFormValues={setFormValues}
                 actionBox={
                     <ActionBox>
                         <Button onClick={() => executeFormula(formValues)} role="primary">تست
                             فرمول</Button>
                     </ActionBox>
                 }>
        </FormPro>
            <br/>
                <Grid>
                <Grid item sm={4}>
                <TextField fullWidth variant="outlined" value={result} label={data?.output} disabled/>
                </Grid>
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