import React from 'react';
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SERVER_URL} from "../../../../../../../configs";
import {useSelector} from "react-redux/es/hooks/useSelector";
import CloseIcon from '@material-ui/icons/Close';
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
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
        axios.get(SERVER_URL + "/rest/s1/fadak/getCompetenceCriterionParent?" +
            "competenceModelId=" + competenceModelIdGet, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
                console.log("RERERER",response.data)
            setcompetenceModelIdGet1(response.data.jerkIds)
        })
        axios.get(SERVER_URL + "/rest/s1/fadak/getListByCriteria?" +
            "competenceModelId=" + competenceModelIdGet, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response232323 => {
            console.log("RERERER78978974444",response232323.data,competenceModelIdGet)

                   })
        axios.get(SERVER_URL + "/rest/s1/fadak/getListByCriteria?" +
            "competenceModelId=" + competenceModelIdGet, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response1111 => {
            console.log("RERERER78978977878787",response1111.data.getList)
            setcompetenceCriterionIdList(response1111.data.getList)
            setcompetenceCriterionIdList1(response1111.data.getList1)
        })

    },[])


    React.useEffect(()=>{

    },[competenceModelIdGet1]);

    React.useEffect(()=>{

    },[competenceCriterionId1]);
    React.useEffect(()=>{

    },[competenceCriterionIdList,competenceCriterionIdList1]);

    const deleteRow = (currentData,setCurrentData,id,setTableContent1,competeCriteriaToEdit,setDisplay,dataCriteria,setdataCriteria,competenceModelIdGet)=>{
        if(currentData ) {

            const competenceCriterionId = currentData.setCompetenceCriterion[id].competenceCriterionId;
            setcompetenceCriterionId(competenceCriterionId)
            const parentCriterionId = currentData.setCompetenceCriterion[id].parentCriterionId;
            console.log("competenceModelIdGet1898",competenceCriterionIdList)
            console.log("competenceModelIdGet18981",competenceCriterionIdList1)
            let arr25=[];
            for(var i=0 ; i < competenceCriterionIdList1.length ; i++){
                console.log("dsdssdsdddd255",competenceCriterionIdList1)
                if(competenceCriterionIdList1[i].length !== 0){
                    console.log("dsdssdsdddd255",i)
                    for (var j =0 ; j < competenceCriterionIdList1[i].length ; j++){
                        console.log("dsdssdsdddd255",competenceCriterionIdList1[i])
                        console.log("dsdssdsdddd255",competenceCriterionId)
                        if(competenceCriterionIdList1[i][0] === competenceCriterionId.toString()) {
                            console.log("dsdssdsdddd255",competenceCriterionIdList[i])
                            arr25.push(competenceCriterionIdList[i])
                        }
                    }
                }
            }
            console.log("dsdssdsdddd255",arr25[0])
            // if(competenceModelIdGet1.indexOf(competenceCriterionId.toString()) > -1 ){
            //     console.log("competenceModelIdGet1",competenceModelIdGet1)
            //     alert("امکان حذف نیست")
            // }
            console.log("dffddffdf",parentCriterionId,competenceCriterionId)
            // axios.delete(SERVER_URL + "/rest/s1/fadak/deleteCriteria?competenceCriterionId=" + competenceCriterionId, {
            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/CompetenceCriterion?competenceCriterionId=" + competenceCriterionId, {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            })
                .then(res => {
                    // currentData.result[familyToEdit] = {}
                    // setTableContent(preFormData => preFormData.filter(member => {
                    //     // console.log(`member: ${member.id} and id: ${id}`);
                    //     // console.log(res.data);
                    //     return member.id !== id
                    //
                    // }))
                    let arrry = [];
                    currentData.setCompetenceCriterion.filter((item, index) => {
                        if (index !== id) {
                            arrry.push(item)
                        }
                    })


                    // const arr2 = [].concat({ criterionTitle: "ریشه", competenceCriterionId: "0" });

                    let arr1 = [];
                    let arr2 = [];
                        // var index1 = currentData.dataCriteria[id]
                        // if(index1 > -1)
                        // {
                        //     currentData.dataCriteria.splice(index1, 1);
                        // }
                        // arr1.push({ criterionTitle: "ریشه", competenceCriterionId: "0" })
                        // arr2.push({ criterionTitle: "ریشه", competenceCriterionId: "0" })
                        if(currentData && currentData.dataCriteria && currentData.dataCriteria.getAllTitles) {
                            currentData.dataCriteria.getAllTitles.filter((item, index2) => {
                                console.log("sdsdssddssd7777",currentData.dataCriteria,id +1 ,index2)
                                if (index2  !== id+1 ) {
                                    arr1.push(item)
                                    console.log("sdsdssddssd7777",item)

                                }
                                setdataCriteria(arr1)
                            })
                            currentData.dataCriteria = arr1;
                            // setCurrentData(Object.assign({}, currentData, {dataCriteria: arr1}))
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)
                        console.log("sdsdssddssd789789789789",currentData.dataCriteria,id,arr1)
                        }
                    if(currentData && currentData.dataCriteria && currentData.dataCriteria) {

                        currentData.dataCriteria.filter((item, index2) => {
                            console.log("sdsdssddssd7777",currentData.dataCriteria,id +1 ,index2)
                            if (index2  !== id+1 ) {
                                arr2.push(item)
                                console.log("sdsdssddssd777789898",item)

                            }
                            setdataCriteria(arr2)
                        })
                        currentData.dataCriteria = arr2;
                        // setCurrentData(Object.assign({}, currentData, {dataCriteria: arr1}))
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)
                        console.log("sdsdssddssd789789789789",currentData,id,arr1)
                    }

                    setCurrentData(Object.assign({}, currentData, {setCompetenceCriterion: arrry} ))
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)
                    console.log("dfdfdfdfsetCompetenceCriterion",currentData.setCompetenceCriterion)

                }) .catch(error => {
                if(competenceModelIdGet1.indexOf(competenceCriterionId.toString()) > -1 ){
                    console.log("competenceModelIdGet1",competenceModelIdGet1)

                    // alert("امکان حذف نیست")
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'امکان حذف نیست'));

                } else {
                    // should be in a new line

                    const a = <> باید معیار پایینتر را پاک کنید که عناوین آنها برابر است با:<br />{arr25[0]}</>;
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                    ));


                    // dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید معیار پایینتر را پاک کنید که عناوین آنها برابر است با ' +
                    //     `\n ${arr25[0]}`


                    // ));
                    // alert('باید معیار بالاتر را پاک کنید')
                }
                // alert(error)
                // dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید معیار بالاتر برای این معیار را تغییر دهید'));

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