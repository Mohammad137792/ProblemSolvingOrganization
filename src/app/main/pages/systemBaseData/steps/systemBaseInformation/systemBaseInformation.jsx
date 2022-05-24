import React,{Component} from 'react';
import {FusePageSimple} from "@fuse";
import {Typography, Tabs, Tab, Button, Paper, TextField, MenuItem, Grid, CardContent} from "@material-ui/core";
import SystemBaseInfo from "./tabs/SystemBaseInfo";
import { makeStyles } from '@material-ui/core/styles';
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../../../configs";
import {DeleteOutlined, EditOutlined} from "@material-ui/icons";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import IconButton from "@material-ui/core/IconButton";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import {useSelector} from "react-redux/es/hooks/useSelector";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '350',
        },
    },
    table: {
        minWidth: 650,
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const SystemBaseInformation = (props) => {
    const [formData, setFormData] = React.useState({});
    const [currentData, setCurrentData] = React.useState({});
    const [enablecancel, stenablecancel] = React.useState(false);

    const addFormData = setFormDataHelper(setFormData);
    const [tableContent, setTableContent] = React.useState([]);
    const [enableDisableCreate, setEnableDisableCreate] = React.useState(false);

    const [expandedAccor, setexpandedAccor] = React.useState(false);
    const [idDelete, setId] = React.useState([]);
    const [idCompete, setIdCompete] = React.useState([]);
    const [createDate1, setcreateDate1] = React.useState(false);
    const [competeToEdit, setcompeteToEdit] = React.useState(-1);

    const [title, settitle] = React.useState(false);
    const [title1, settitle1] = React.useState(false);


    const [competenceModelIdGet, setcompetenceModelIdGet] = React.useState(false);
    const [addrowss , setaddrowss] = React.useState(false);


    const [open, setOpen] = React.useState(false);

    const [partyIdOrg, setpartyIdOrg] = React.useState(false);

    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    React.useEffect(()=>{

        axios.get(SERVER_URL + "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" + partyRelationshipId, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response1 => {

            if(response1.data.orgPartyRelationResult[0]) {
                setpartyIdOrg(response1.data.orgPartyRelationResult[0].toPartyId)
            }
        })

        axios.get(SERVER_URL + "/rest/s1/fadak/getCompetenceModel", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
            console.log("sddssddssdsetCurrentData",response.data)
            setCurrentData(response.data)
            // setDisplay(false)
            // setTimeout(() => {
            //     setDisplay(true)
            //
            // }, 20)
            // let rows = []
            // response.data.getCompetenceModel.map((CompetenceModel, index) => {
            //     setIdCompete(CompetenceModel.competenceModelId)
            //     let converted_date_createDate = new Date(CompetenceModel.createDate).toLocaleDateString('fa-IR');
            //     const row1 = {
            //         // id: partyRelation.relationship.partyRelationshipId,
            //         id: index,
            //         // criterionRow: CompetenceModel.competenceModelId,
            //         criterionTitle: CompetenceModel.title,
            //         createDate: converted_date_createDate,
            //         description: CompetenceModel.description,
            //         delete: <Button variant="outlined" color="secondary"
            //                         onClick={() => openDeleteModal(CompetenceModel.competenceModelId)}><DeleteOutlined/></Button>,
            //         modify: <Button variant="outlined" color="secondary"
            //                         onClick={
            //                             () => {
            //                                 displayUpdateForm(index)
            //                             }
            //                         }
            //         >ویرایش</Button>,
            //     };
            //     rows.push(row1)
            // })
            // setTableContent(rows);
            // setDisplay(false)
            // setTimeout(() => {
            //     setDisplay(true)
            //
            // }, 20)
        }).catch(error => {
        });

    },[]);

    const [display, setDisplay] = React.useState(true);

    React.useEffect(() => {
        console.log('CompetenceModelCompetenceModel',78789789)

        if (typeof currentData != "undefined" && currentData.getCompetenceModel) {
            console.log('CompetenceModelCompetenceModel454545454',currentData)
            let rows = []
            currentData.getCompetenceModel.map((CompetenceModel, index) => {
                console.log('CompetenceModelCompetenceModel',CompetenceModel)
                setIdCompete(CompetenceModel.competenceModelId)
                let converted_date_createDate = new Date(CompetenceModel.createDate).toLocaleDateString('fa-IR');
                // if(CompetenceModel.title !== '' || CompetenceModel.title !== null || CompetenceModel.title !== undefined){
                //     settitle(false)
                // } else {
                //     settitle(true)
                // }
                const row1 = {
                    // id: partyRelation.relationship.partyRelationshipId,
                    id: index,
                    criterionRow: index+1,
                    criterionTitle: CompetenceModel.title,
                    createDate: converted_date_createDate,
                    description: CompetenceModel.description,
                    modify:<Grid><IconButton  onClick={() => displayUpdateForm(index)}><EditOutlined /></IconButton>
                        <Button startIcon={<RemoveRedEyeIcon/>}></Button>
                    </Grid>,
                    delete: <Button variant="outlined" color="secondary"
                                    onClick={() => openDeleteModal(index)}><DeleteOutlined/></Button>,
                    // modify: <Button variant="outlined" color="secondary"
                    //                 onClick={
                    //                     () => {
                    //                         displayUpdateForm(index)
                    //                     }
                    //                 }
                    // >ویرایش</Button>,
                };
                rows.push(row1)
            })
            setTableContent(rows);
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)

            }, 20)
        }

    }, [currentData])


    React.useEffect(()=>{
        // if(typeof  formData.CompetenceModel !='undefined'){
        //     if(typeof formData.CompetenceModel.title !='undefined'){
        //         settitle(false)
        //
        //     }else {
        //         if(competeToEdit !== -1 && currentData.getCompetenceModel && currentData.getCompetenceModel[competeToEdit].title){
        //             settitle(false)
        //         }else {
        //             settitle(true)
        //         }
        //     }
        //
        // }
    },[title])


    const handleClose = () => {
        setOpen(false);
    };
    const displayUpdateForm = (index) => {
        if(currentData && currentData.getCompetenceModel && currentData.getCompetenceModel[index].competenceModelId) {
            setcompetenceModelIdGet(currentData.getCompetenceModel[index].competenceModelId)
        }
        setexpandedAccor(true)
        console.log("fddfdfdf789789798",index)
        setcompeteToEdit(index)
        setEnableDisableCreate(true);
        setDisplay(false);
        setTimeout(() => {
            setDisplay(true);

        },20);
    }

    const openDeleteModal = (id) => {
        setId(id);
        setOpen(true);
    };

    // React.useEffect(()=>{
    //
    //
    // },[idDelete]);

    const dispatch = useDispatch();




    const addRow =()=> {
        setaddrowss(true)
        console.log("dsdssdsdsdsdsd",partyIdOrg)

        const postalfields = ['title']

        let postalmissing_fileds = []

        postalfields.map((field, index) => {
            // if (addressEdit === -1) {
            if (formData.CompetenceModel) {
                if (formData.CompetenceModel[field] === '' || formData.CompetenceModel[field] === null || typeof  formData.CompetenceModel[field] == 'undefined') {

                    postalmissing_fileds.push(field)
                }
            } else {
                postalmissing_fileds.push(field)
            }
            postalmissing_fileds.push(field)

        })
        if (postalmissing_fileds.length !== 1 || title === true ) {
        // if (title === true) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            if (!formData.CompetenceModel) {
            settitle(true)

            }
            if (formData.CompetenceModel && formData.CompetenceModel.title === '') {
                settitle(true)
            }
            return null;
        }
        else {
            setexpandedAccor(false)
            if (formData.CompetenceModel) {
                console.log("partyIdOrgpartyIdOrg",partyIdOrg)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                axios.post(SERVER_URL + "/rest/s1/fadak/entity/CompetenceModel", {data : 
                    {
                        title: formData.CompetenceModel.title,
                        createDate: Date.now(),
                        description: formData.CompetenceModel.description,
                        companyPartyId:partyIdOrg
                    }}
                    , {
                        timeout: AXIOS_TIMEOUT,
                        headers: {
                            'Content-Type': 'application/json',
                            api_key: localStorage.getItem('api_key')
                        }
                    }).then(response => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                    formData.CompetenceModel.competenceModelId = response.data.competenceModelId;
                    if (typeof formData.CompetenceModel.competenceModelId != 'undefined') {
                        currentData.getCompetenceModel[tableContent.length] = {
                            ...currentData.getCompetenceModel[tableContent.length],
                            competenceModelId: formData.CompetenceModel.competenceModelId
                        }
                    }
                    if (typeof formData.CompetenceModel.title != 'undefined') {
                        currentData.getCompetenceModel[tableContent.length] = {
                            ...currentData.getCompetenceModel[tableContent.length],
                            title: formData.CompetenceModel.title
                        }
                    }
                    // if (typeof formData.CompetenceModel.createDate != 'undefined') {
                    let converted_date = ''
                    // if (typeof formData.CompetenceModel.createDate != "undefined") {
                    var fulldate = new Date(Date.now());
                    // converted_date = fulldate.toLocaleDateString('fa-IR');
                    converted_date = new Date().getTime();
                    console.log("fddfdf",converted_date,fulldate)
                    // }
                    // else {
                    //
                    //      converted_date = "";
                    // }
                    currentData.getCompetenceModel[tableContent.length] = {
                        ...currentData.getCompetenceModel[tableContent.length],
                        createDate: converted_date
                    }
                    // }
                    if (typeof formData.CompetenceModel.description != 'undefined') {
                        currentData.getCompetenceModel[tableContent.length] = {
                            ...currentData.getCompetenceModel[tableContent.length],
                            description: formData.CompetenceModel.description
                        }
                    }
                    // if(currentData && currentData.getCompetenceModel && currentData.getCompetenceModel[tableContent.length].competenceModelId) {
                    setcompetenceModelIdGet(response.data.competenceModelId)
                    console.log("idCompeteidCompete",response.data.competenceModelId)
                    // }
                    console.log("descriptiondescription", response.data)
                    setCurrentData(Object.assign({}, currentData))
                    console.log("currentData788", currentData)
                })
                    .catch(error => {

                    });
            }
            setcompeteToEdit(-1)
            setexpandedAccor(false)
            setEnableDisableCreate(false)
            const newFormdata = Object.assign({}, formData);
            setFormData({})
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
        }
    }

    const cancelAdd = ()=>{
        settitle(false)
        setaddrowss1(false)
        setaddrowss(false)
        settitle(false)
        settitle1(false)
        setexpandedAccor(false)
        if(typeof formData.CompetenceModel != "undefined" ){
            if(typeof formData.CompetenceModel.title != "undefined"){
                formData.CompetenceModel.title = ''
            }
            if(typeof formData.CompetenceModel.createDate != "undefined"){
                formData.CompetenceModel.createDate = ''
            }
            if(typeof formData.CompetenceModel.description != "undefined"){
                formData.CompetenceModel.description = ''
            }
        }
        const newFormdata = Object.assign({},formData);
        setFormData(newFormdata)
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)

    }
    const [addrowss1 , setaddrowss1] = React.useState(false);

    const updateRow = (id) => {
        setaddrowss1(true)
        const postalfileds = ['title']

        let postal_fileds = []

        postalfileds.map((field, index) => {
            let ifFilled = (((formData.CompetenceModel && (typeof formData.CompetenceModel[field] != 'undefined'
                    && (formData.CompetenceModel[field]).trim() !== ''))
            ) || (

                (
                    (typeof formData.CompetenceModel == 'undefined')
                    ||
                    (formData.CompetenceModel && (typeof formData.CompetenceModel[field] == 'undefined'))
                    ||
                    (formData.CompetenceModel && (typeof formData.CompetenceModel[field] != 'undefined' && (formData.CompetenceModel[field]).trim() !== ''))
                )
            )) ? true : false;
            if (!ifFilled) {
                postal_fileds.push(field)
            }

        })
        if (formData.CompetenceModel &&formData.CompetenceModel.title&& (formData.CompetenceModel.title).trim() === '') {
            settitle(true)
            settitle1(true)
        }

        if (title === true || title1 === true) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            return null;
        }
        else {
            // if (typeof formData.postalAddress == 'undefined') {
            //     console.log("sfdfsfsfsf", 33334, formData)
            //     settitle(false)
            //
            //     // setcompeteToEdit(-1)
            //     setDisplay(false)
            //     setTimeout(() => {
            //         setDisplay(true)
            //     }, 20)
            //     setEnableDisableCreate(false);
            //     stenablecancel(false)
            // } else
            {
                setcreateDate1(true)
                if (formData.CompetenceModel) {
                    setaddrowss1(false)
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                    if(formData.CompetenceModel.title){
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/CompetenceModel" , {data : 
                            {
                                title: formData.CompetenceModel.title,
                                companyPartyId:partyIdOrg,
                                createDate: Date.now(),
                                competenceModelId : id
                            }}
                            , {
                                timeout: AXIOS_TIMEOUT,
                                headers: {
                                    'Content-Type': 'application/json',
                                    api_key: localStorage.getItem('api_key')
                                }
                            }).then(response => {
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  آپدیت شد'));
                            formData.CompetenceModel.competenceModelId = response.data.competenceModelId;
                            if (typeof formData.CompetenceModel.competenceModelId != 'undefined') {
                                currentData.getCompetenceModel[competeToEdit] = {
                                    ...currentData.getCompetenceModel[competeToEdit],
                                    competenceModelId: formData.CompetenceModel.competenceModelId
                                }
                            }
                            if (typeof formData.CompetenceModel.title != 'undefined') {
                                currentData.getCompetenceModel[competeToEdit] = {
                                    ...currentData.getCompetenceModel[competeToEdit],
                                    title: formData.CompetenceModel.title
                                }

                            }
                            let converted_date = ''
                            var fulldate = new Date(Date.now());
                            converted_date = new Date().getTime();
                            currentData.getCompetenceModel[competeToEdit] = {
                                ...currentData.getCompetenceModel[competeToEdit],
                                createDate: converted_date
                            }
                            setCurrentData(Object.assign({}, currentData))
                            setTimeout(()=>{
                                setDisplay(true)
                            },20)
                        })
                    }
                    if(formData.CompetenceModel.description){
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/CompetenceModel" , {data : 
                            {
                                description: formData.CompetenceModel.description,
                                companyPartyId:partyIdOrg,
                                createDate: Date.now(),
                                competenceModelId : id
                            }}
                            , {
                                timeout: AXIOS_TIMEOUT,
                                headers: {
                                    'Content-Type': 'application/json',
                                    api_key: localStorage.getItem('api_key')
                                }
                            }).then(response => {
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  آپدیت شد'));
                            formData.CompetenceModel.competenceModelId = response.data.competenceModelId;
                            if (typeof formData.CompetenceModel.competenceModelId != 'undefined') {
                                currentData.getCompetenceModel[competeToEdit] = {
                                    ...currentData.getCompetenceModel[competeToEdit],
                                    competenceModelId: formData.CompetenceModel.competenceModelId
                                }
                            }
                            if (typeof formData.CompetenceModel.description != 'undefined') {
                                currentData.getCompetenceModel[competeToEdit] = {
                                    ...currentData.getCompetenceModel[competeToEdit],
                                    description: formData.CompetenceModel.description
                                }
                            }
                            let converted_date = ''
                            var fulldate = new Date(Date.now());
                            converted_date = new Date().getTime();
                            currentData.getCompetenceModel[competeToEdit] = {
                                ...currentData.getCompetenceModel[competeToEdit],
                                createDate: converted_date
                            }
                            setCurrentData(Object.assign({}, currentData))
                            setTimeout(()=>{
                                setDisplay(true)
                            },20)
                        })
                    }
                }
        setFormData({})
                setexpandedAccor(false)
                setcompeteToEdit(-1)
                setEnableDisableCreate(false)
            }
        }
    }


    const cancelUpdate = () => {
        setexpandedAccor(false)
        settitle(false)
        settitle1(false)
        // setaddrowss(false)
        setaddrowss1(false)

        if(typeof formData.CompetenceModel != "undefined" ){
            if(typeof formData.CompetenceModel.title != "undefined"){
                formData.CompetenceModel.title = ''
            }
            if(typeof formData.CompetenceModel.createDate != "undefined"){
                formData.CompetenceModel.createDate = ''
            }
            if(typeof formData.CompetenceModel.description != "undefined"){
                formData.CompetenceModel.description = ''
            }
        }
        setcompeteToEdit(-1)
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)
        setEnableDisableCreate(false);
        stenablecancel(false)
    };

    React.useEffect(()=>{
        // if(currentData && currentData.getCompetenceModel && currentData.getCompetenceModel[competeToEdit].competenceModelId) {
        //     setcompetenceModelIdGet(currentData.getCompetenceModel[competeToEdit].competenceModelId)
        // }
    },[competenceModelIdGet]);

    React.useEffect(()=>{
        // if(currentData && currentData.getCompetenceModel && currentData.getCompetenceModel[competeToEdit].competenceModelId) {
        //     setcompetenceModelIdGet(currentData.getCompetenceModel[competeToEdit].competenceModelId)
        // }
    },[partyIdOrg]);
    React.useEffect(()=>{
    },[addrowss]);
    React.useEffect(()=>{
    },[addrowss1]);
    React.useEffect(()=>{
    },[title1]);
    return (
        <Grid>
            {display && <SystemBaseInfo addFormData={addFormData} setEnableDisableCreate={setEnableDisableCreate} addRow={addRow} cancelAdd={cancelAdd}
                                        competeToEdit={competeToEdit} competenceModelIdGet={competenceModelIdGet} settitle={settitle} title={title}
                                        idDelete={idDelete}  idCompete={idCompete} setCurrentData={setCurrentData} currentData={currentData}
                                        expandedAccor={expandedAccor} setexpandedAccor={setexpandedAccor} addrowss={addrowss}
                                        setFormData={setFormData} formData={formData} tableContent={tableContent} enableDisableCreate={enableDisableCreate}
                                        handleClose={handleClose}  setTableContent={setTableContent} setDisplay={setDisplay} open={open} display={display}
                                        enablecancel={enablecancel} updateRow={updateRow} cancelUpdate={cancelUpdate} createDate1={createDate1}
                                        settitle1={settitle1} title1={title1} addrowss1={addrowss1}
            />}
        </Grid>

    );
}

export default SystemBaseInformation;