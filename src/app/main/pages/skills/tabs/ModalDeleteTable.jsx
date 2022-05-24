import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SERVER_URL} from "../../../../../configs";
import {useSelector} from "react-redux/es/hooks/useSelector";
import CloseIcon from '@material-ui/icons/Close';
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux/es/hooks/useDispatch";


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


const ModalDeleteTable = props => {
    const dispatch = useDispatch();

    const classes = useStyles();
    const {currentData,dataCriteria,competenceModelIdGet} = props

    const [modalStyle] = React.useState(getModalStyle);
    // const partyId= useSelector(({auth}) => auth.user.data.partyId);

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);

    // const partyId = (partyIdUser !==null) ? partyIdUser : partyIdLogin
    const [competenceModelIdGet1, setcompetenceModelIdGet1] = React.useState([]);
    const [competenceCriterionId1, setcompetenceCriterionId] = React.useState(false);
    const [competenceCriterionIdList, setcompetenceCriterionIdList] = React.useState(false);
    const [competenceCriterionIdList1, setcompetenceCriterionIdList1] = React.useState(false);

    React.useEffect(() => {


        console.log("RERERER789789",competenceCriterionId1)


        console.log("props.competenceModelIdGet",competenceModelIdGet)
        // axios.get(SERVER_URL + "/rest/s1/fadak/getCompetenceCriterionParent?" +
        //     "competenceModelId=" + competenceModelIdGet, {
        //     headers: {
        //         'api_key': localStorage.getItem('api_key')
        //     },
        // }).then(response => {
        //         console.log("RERERER",response.data)
        //     setcompetenceModelIdGet1(response.data.jerkIds)
        // })
        // axios.get(SERVER_URL + "/rest/s1/fadak/getListByCriteria?" +
        //     "competenceModelId=" + competenceModelIdGet, {
        //     headers: {
        //         'api_key': localStorage.getItem('api_key')
        //     },
        // }).then(response232323 => {
        //     console.log("RERERER78978974444",response232323.data,competenceModelIdGet)
        //
        //            })
        // axios.get(SERVER_URL + "/rest/s1/fadak/getListByCriteria?" +
        //     "competenceModelId=" + competenceModelIdGet, {
        //     headers: {
        //         'api_key': localStorage.getItem('api_key')
        //     },
        // }).then(response1111 => {
        //     console.log("RERERER78978977878787",response1111.data.getList)
        //     setcompetenceCriterionIdList(response1111.data.getList)
        //     setcompetenceCriterionIdList1(response1111.data.getList1)
        // })

    },[])


    React.useEffect(()=>{

    },[competenceModelIdGet1]);

    React.useEffect(()=>{

    },[competenceCriterionId1]);
    React.useEffect(()=>{

    },[competenceCriterionIdList,competenceCriterionIdList1]);

    const deleteRow = (currentData,setCurrentData,id,setTableContent1,competeCriteriaToEdit,setDisplay,dataCriteria,setdataCriteria,competenceModelIdGet)=>{
        console.log("vvvvvvvvvv",id)
        if(currentData &&currentData.result[id] ) {
console.log("FFFFFFFFFF",currentData)
            const competenceCriterionId = currentData.result[id].skillId;
            setcompetenceCriterionId(competenceCriterionId)
            // const parentCriterionId = currentData.setCompetenceCriterion[id].parentSkillId;
            axios.delete(SERVER_URL + "/rest/s1/fadak/deleteSkill?skillId=" + competenceCriterionId, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            })
                .then(res => {
                    console.log("ddddddfffffffffff",res.data)
                    let arrry = [];
                    currentData.result.filter((item, index) => {
                        if (index !== id) {
                            arrry.push(item)
                        }
                    })

                    setCurrentData(Object.assign({}, currentData, {result: arrry} ))
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)

                }) .catch(error => {

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'امکان حذف نیست'));

            });
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
                    <Button variant="outlined" style={{backgroundColor:"red"}} size="small" onClick={()=>{deleteRow(props.currentData,
                        props.setCurrentData,
                        props.id,props.setTableContent1,props.competeCriteriaToEdit,props.setDisplay,props.dataCriteria,props.setdataCriteria
                        ,props.competenceModelIdGet)}}  >
                        حذف
                    </Button>
                </div>
            </div>
        </Modal>

    );
};

export default ModalDeleteTable;