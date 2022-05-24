import React,{Component} from 'react';
import {FusePageSimple} from "@fuse";
import {
    Typography,
    Tabs,
    Tab,
    Button,
    Paper,
    TextField,
    MenuItem,
    Grid,
    CardContent,
    Switch,
    FormControl
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {setFormDataHelper} from "../../helpers/setFormDataHelper";
import AddressInfoForm from "../personnelBaseInformation/tabs/AddressInformation/AddressInfo";
import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../configs";
import {DeleteOutlined, EditOutlined} from "@material-ui/icons";
import {ALERT_TYPES, setAlertContent} from "../../../store/actions/fadak";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import IconButton from "@material-ui/core/IconButton";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import {useSelector} from "react-redux/es/hooks/useSelector";
import SkillInfo from "./tabs/SkillInfo";

import {Card,
    CardHeader, Chip,
    InputLabel,
    Select,
} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

const Skills = (props) => {
    const [formData, setFormData] = React.useState({});
    const [currentData, setCurrentData] = React.useState({});
    const [skillCodes, setskillCodes] = React.useState(false);
    const [skillCodes1, setskillCodes1] = React.useState(false);
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
    const [skillCode, setskillCode] = React.useState(false);
    const [skillCode1, setskillCode1] = React.useState(false);
    const [title1, settitle1] = React.useState(false);

    const [dataCriteria5, setdataCriteria5] = React.useState(false);
    const [dataCriteria6, setdataCriteria6] = React.useState(false);

    const [competenceModelIdGet, setcompetenceModelIdGet] = React.useState(false);
    const [addrowss , setaddrowss] = React.useState(false);
    const [addrowss365 , setaddrowss365] = React.useState(false);


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

                axios.get(SERVER_URL + "/rest/s1/fadak/getskillsCurrent?companyPartyId=" + response1.data.orgPartyRelationResult[0].toPartyId, {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                }).then(response => {
                    console.log("sddssddssdsetCurrentData", response.data, response1.data.orgPartyRelationResult[0].toPartyId)
                    setCurrentData(response.data)

                }).catch(error => {
                });
            }
        })

        axios.get(SERVER_URL + "/rest/s1/fadak/getSkillCodeOfGroups", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response32233223 => {
            setskillCodes(response32233223.data.result1)
            setskillCodes1(response32233223.data.result2)
        })

    },[]);

    const [display, setDisplay] = React.useState(true);

    React.useEffect(() => {

        if (typeof currentData != "undefined" && currentData.resultList) {
            console.log('CompetenceModelCompetenceModel454545454',currentData)
            let rows = []
            currentData.resultList.map((CompetenceModel, index) => {


                // currentData.setdataCriteria5 = {getAllTitles1}

                const row1 = {
                    // id: partyRelation.relationship.partyRelationshipId,
                    id: index,
                    code: CompetenceModel.skillCode,
                    title: CompetenceModel.title,
                    seq: CompetenceModel.sequenceNum,
                    description:

                        <FormControl>
                            {
                                console.log("CompetenceModel.title",CompetenceModel.status)
                            }
                            <FormControlLabel
                                control={<Switch name="status"
                                                 checked={(CompetenceModel.status === "N" || CompetenceModel.status === undefined) ? false : true}
                                />}
                                label="فعال"/>
                        </FormControl>,
                    // CompetenceModel.status,
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
            // setDisplay(false)
            // setTimeout(() => {
            //     setDisplay(true)
            //
            // }, 20)
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
        if(currentData && currentData.resultList && currentData.resultList[index].skillId) {
            setcompetenceModelIdGet(currentData.resultList[index].skillId)
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
        setaddrowss365(true)
        if (!formData.CompetenceModel) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            settitle(true)
            setskillCode(true)

        }
        if (title === true || skillCode === true) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            if (!formData.CompetenceModel) {
                settitle(true)
                setskillCode(true)

            }
            if (formData.CompetenceModel && formData.CompetenceModel.title === '') {
                settitle(true)
            }
            if (formData.CompetenceModel && formData.CompetenceModel.skillCode === '') {
                setskillCode(true)
            }
            return null;
        }
        else {
            // setexpandedAccor(true)
            if (formData.CompetenceModel) {
                console.log("partyIdOrgpartyIdOrg",partyIdOrg)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                let yyyy =[];
                if(skillCodes.indexOf(formData.CompetenceModel.skillCode) > -1){
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد گروه تکراری است'));
                    for (var i = 0; i < skillCodes.length; i++) {
                        if (skillCodes[i] === formData.CompetenceModel.skillCode) {
                            yyyy.push(skillCodes1[i])
                        }
                    }
                    // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد گروه مهارت باید یکتا باشد' + yyyy));
                    const a = <>کد گروه مهارت باید یکتا باشد
                        <br/>
                        مهارت را مجدد وارد کنید
                        <br/>
                        عنوان ثبت شده با این کد مهارت در این گروه مهارت برابر است با :
                        <br/>
                        {
                            yyyy
                        }
                    </>;
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                    ));
                }

                else {
                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/Skill", { data : 
                        {
                            title: formData.CompetenceModel.title,
                            skillCode: formData.CompetenceModel.skillCode,
                            status: formData.status ? (formData.status === true ? "Y" : "N") : "",
                            sequenceNum: formData.CompetenceModel.sequenceNum,
                            description: formData.CompetenceModel.description,
                            companyPartyId: partyIdOrg,

                        }}
                        , {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            }
                        }).then(response => {

                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                        formData.CompetenceModel.skillId = response.data.skillId;
                        setcompetenceModelIdGet(formData.CompetenceModel.skillId)
                        // if (typeof formData.CompetenceModel.description != 'undefined') {
                        if (!formData.status) {
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                                {
                                    status: "N" , 
                                    skillId : formData.CompetenceModel.skillId
                                }}
                                , {
                                    timeout: AXIOS_TIMEOUT,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        api_key: localStorage.getItem('api_key')
                                    }
                                }).then(response131231 => {

                            })
                        }

                        currentData.resultList[tableContent.length] = {
                            ...currentData.resultList[tableContent.length],
                            skillId: formData.CompetenceModel.skillId
                        }
                        // }
                        if (typeof formData.CompetenceModel.description != 'undefined') {
                            currentData.resultList[tableContent.length] = {
                                ...currentData.resultList[tableContent.length],
                                description: formData.CompetenceModel.description
                            }
                        }

                        if (typeof formData.status != 'undefined') {
                            currentData.resultList[tableContent.length] = {
                                ...currentData.resultList[tableContent.length],
                                status: formData.status
                            }
                        }

                        if (typeof formData.CompetenceModel.title != 'undefined') {
                            currentData.resultList[tableContent.length] = {
                                ...currentData.resultList[tableContent.length],
                                title: formData.CompetenceModel.title
                            }
                        }
                        if (typeof formData.CompetenceModel.skillCode != 'undefined') {
                            currentData.resultList[tableContent.length] = {
                                ...currentData.resultList[tableContent.length],
                                skillCode: formData.CompetenceModel.skillCode
                            }
                        }
                        if (typeof formData.CompetenceModel.sequenceNum != 'undefined') {
                            currentData.resultList[tableContent.length] = {
                                ...currentData.resultList[tableContent.length],
                                sequenceNum: formData.CompetenceModel.sequenceNum
                            }
                        }
                        setCurrentData(Object.assign({}, currentData))

                    })
                        .catch(error => {

                        });
                }
            }
            setcompeteToEdit(-1)
            // setexpandedAccor(true)
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
        setskillCode(false)
        setskillCode1(false)
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
        if (formData.CompetenceModel &&formData.CompetenceModel.skillCode&& (formData.CompetenceModel.skillCode).trim() === '') {
            setskillCode(true)
            setskillCode1(true)
        }
        if (formData.CompetenceModel &&formData.CompetenceModel.title&& (formData.CompetenceModel.title).trim() === '') {
            settitle(true)
            settitle1(true)
        }
        if (title === true || title1 === true || skillCode === true || skillCode1 === true) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            console.log("fffffffddsssssss",formData.CompetenceModel,currentData.resultList[competeToEdit],skillCode,skillCode1)
            return null;
        }

        else
       {
           // settitle(false)
           // settitle1(false)
           // setskillCode(false)
           // setskillCode1(false)
           setcreateDate1(true)
           if(!formData.status){
               axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                   {
                       status:  "N" , 
                       skillId : id
                   }}
                   , {
                       timeout: AXIOS_TIMEOUT,
                       headers: {
                           'Content-Type': 'application/json',
                           api_key: localStorage.getItem('api_key')
                       }
                   }).then(response131231 => {
                   if (typeof formData.status != 'undefined') {
                       currentData.resultList[competeToEdit] = {
                           ...currentData.resultList[competeToEdit],
                           status: formData.status
                       }
                   }
                   setCurrentData(Object.assign({}, currentData))
                   setDisplay(false)
                   setTimeout(()=>{
                       setDisplay(true)
                   },20)
               })
           }
           if(typeof formData.status !='undefined'){
               dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

               axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill"  , {data : 
                   {
                       status: (formData.status === true) ? "Y" :  "N" ,
                       skillId : id
                   }}
                   , {
                       timeout: AXIOS_TIMEOUT,
                       headers: {
                           'Content-Type': 'application/json',
                           api_key: localStorage.getItem('api_key')
                       }
                   }).then(response131231 => {
                   dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  آپدیت شد'));

                   if(formData.status === true){
                       formData.status = "Y"
                   }else {
                       formData.status = "N"
                   }
                   // if(!currentData.resultList[competeToEdit].status){
                   //     currentData.resultList[competeToEdit] =[]
                   // }
                   // currentData.resultList[competeToEdit].status = formData.status
                   if (typeof formData.status != 'undefined') {
                       currentData.resultList[competeToEdit] = {
                           ...currentData.resultList[competeToEdit],
                           status: formData.status
                       }
                   }
                   setCurrentData(Object.assign({}, currentData))
                   setDisplay(false)
                   setTimeout(()=>{
                       setDisplay(true)
                   },20)
                   // if (typeof formData1.status != 'undefined') {
                   //     currentData.result[competeCriteriaToEdit] = {
                   //         ...currentData.result[competeCriteriaToEdit],
                   //         status: formData1.status
                   //     }
                   // }
               })
           }
           if (formData) {
               setaddrowss1(false)
               dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                if(formData.CompetenceModel && formData.CompetenceModel.skillCode){
                    if(skillCodes.indexOf(formData.CompetenceModel.skillCode) > -1){
                        let yyyy =[];
                        if(skillCodes.indexOf(formData.CompetenceModel.skillCode) > -1){
                            // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد گروه تکراری است'));
                            for (var i = 0; i < skillCodes.length; i++) {
                                if (skillCodes[i] === formData.CompetenceModel.skillCode) {
                                    yyyy.push(skillCodes1[i])
                                }
                            }
                            // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد گروه مهارت باید یکتا باشد' + yyyy));
                            const a = <>کد گروه مهارت باید یکتا باشد
                                <br/>
                                مهارت را مجدد وارد کنید
                                <br/>
                                عنوان ثبت شده با این کد گروه مهارت برابر است با :
                                <br/>
                                {
                                    yyyy
                                }
                            </>;
                            // setDisplay(false)
                            setTimeout(()=>{
                                // setDisplay(true)
                            dispatch(setAlertContent(ALERT_TYPES.WARNING, a));
                            },2000)
                        }
                        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد گروه تکراری است'));
                        setEnableDisableCreate(false)
                        setexpandedAccor(false)
                    } else {
                        axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                            {
                                skillCode: (formData.CompetenceModel && formData.CompetenceModel.skillCode) ??(currentData && competeToEdit !== -1&&currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].skillCode) ,
                                skillId : id
                            }}
                            , {
                                timeout: AXIOS_TIMEOUT,
                                headers: {
                                    'Content-Type': 'application/json',
                                    api_key: localStorage.getItem('api_key')
                                }
                            }).then(response => {
                            if (typeof formData.CompetenceModel.skillCode != 'undefined') {
                                currentData.resultList[competeToEdit] = {
                                    ...currentData.resultList[competeToEdit],
                                    skillCode: formData.CompetenceModel.skillCode
                                }
                            }
                            setCurrentData(Object.assign({}, currentData))
                            setDisplay(false)
                            setTimeout(()=>{
                                setDisplay(true)
                            },20)
                        })
                    }
                }

                if(formData.CompetenceModel.title || formData.CompetenceModel.sequenceNum ||  formData.CompetenceModel.description) {
                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                        {
                            title: (formData.CompetenceModel && formData.CompetenceModel.title) ?? (currentData && competeToEdit !== -1 && currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].title),
                            // skillCode: (formData.CompetenceModel && formData.CompetenceModel.skillCode) ??(currentData && competeToEdit !== -1&&currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].skillCode) ,
                            // status: (formData.status ? (formData.status === true ? "Y" : "N") : "") ??(currentData && competeToEdit !== -1&&currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].status) ,
                            sequenceNum: (formData.CompetenceModel && formData.CompetenceModel.sequenceNum) ?? (currentData && competeToEdit !== -1 && currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].sequenceNum),
                            description: (formData.CompetenceModel && formData.CompetenceModel.description) ?? (currentData && competeToEdit !== -1 && currentData.resultList[competeToEdit] && currentData.resultList[competeToEdit].description),
                            companyPartyId: partyIdOrg,
                            skillId : id

                        }}
                        , {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            }
                        }).then(response => {
                        setCurrentData(Object.assign({}, currentData))
                        // setDisplay(false)
                        setTimeout(()=>{
                            // setDisplay(true)
                        },2000)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  آپدیت شد'));
                        if (typeof formData.CompetenceModel.description != 'undefined') {
                            currentData.resultList[competeToEdit] = {
                                ...currentData.resultList[competeToEdit],
                                description: formData.CompetenceModel.description
                            }
                        }
                        if (typeof formData.CompetenceModel.title != 'undefined') {
                            currentData.resultList[competeToEdit] = {
                                ...currentData.resultList[competeToEdit],
                                title: formData.CompetenceModel.title
                            }
                        }
                        // if (typeof formData.CompetenceModel.skillCode != 'undefined') {
                        //     currentData.resultList[competeToEdit] = {
                        //         ...currentData.resultList[competeToEdit],
                        //         skillCode: formData.CompetenceModel.skillCode
                        //     }
                        // }
                        if (typeof formData.CompetenceModel.sequenceNum != 'undefined') {
                            currentData.resultList[competeToEdit] = {
                                ...currentData.resultList[competeToEdit],
                                sequenceNum: formData.CompetenceModel.sequenceNum
                            }
                        }
                        setCurrentData(Object.assign({}, currentData))
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)
                    })
                        .catch(error => {

                        });
                }


           }
           setFormData({})
           setDisplay(false)
           setTimeout(()=>{
               setDisplay(true)
           },20)
           setexpandedAccor(true)
           setcompeteToEdit(-1)
           setEnableDisableCreate(false)
        }
    }


    const cancelUpdate = () => {
        setexpandedAccor(false)
        settitle(false)
        setskillCode(false)
        setskillCode1(false)
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
        setFormData({})
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
    },[title1,title,skillCode,skillCode1]);
    React.useEffect(()=>{
    },[expandedAccor]);


    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/getskillsCurrent1", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response12332222 => {
            let getAllTitles11=[];
            response12332222.data.resultList.map((CompetenceModel, index) => {
                getAllTitles11.push({
                    title: CompetenceModel.title,
                    code: CompetenceModel.skillId
                })
            })
            console.log("ffffffffffffffff4444444444",getAllTitles11)
                // setdataCriteria5(getAllTitles11)

        })
    },[dataCriteria5]);


    React.useEffect(()=>{
    },[competenceModelIdGet]);
    React.useEffect(()=>{
    },[addrowss365]);

    React.useEffect(()=>{
    },[skillCodes,skillCodes1]);


    return (
        <Grid>
            {display && <SkillInfo addFormData={addFormData} setEnableDisableCreate={setEnableDisableCreate} addRow={addRow} cancelAdd={cancelAdd}
                                        competeToEdit={competeToEdit} competenceModelIdGet={competenceModelIdGet} settitle={settitle} title={title}
                                        idDelete={idDelete}  idCompete={idCompete} setCurrentData={setCurrentData} currentData={currentData}
                                        expandedAccor={expandedAccor} setexpandedAccor={setexpandedAccor} addrowss={addrowss}
                                        setFormData={setFormData} formData={formData} tableContent={tableContent} enableDisableCreate={enableDisableCreate}
                                        handleClose={handleClose}  setTableContent={setTableContent} setDisplay={setDisplay} open={open} display={display}
                                        enablecancel={enablecancel} updateRow={updateRow} cancelUpdate={cancelUpdate} createDate1={createDate1}
                                        settitle1={settitle1} title1={title1} addrowss1={addrowss1}
                                   skillCode={skillCode} skillCode1={skillCode1}
                                   setskillCode={setskillCode} setskillCode1={setskillCode1}
                                   dataCriteria6={dataCriteria6} dataCriteria5={dataCriteria5} setcompetenceModelIdGet={setcompetenceModelIdGet}
                                   addrowss365={addrowss365} setaddrowss365={setaddrowss365}
                                   skillCodes={skillCodes}

            />}
        </Grid>

    );
}

export default Skills;