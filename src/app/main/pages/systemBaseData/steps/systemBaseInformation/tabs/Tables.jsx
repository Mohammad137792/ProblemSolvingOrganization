import React, {useState} from 'react';
// import {FusePageSimple} from "@fuse";
import {Typography, Tabs, Tab, Button, Paper, TextField, MenuItem, Grid, CardContent} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {setFormDataHelper} from "../../../../../helpers/setFormDataHelper";
import TableForm from './TableForm'
import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../../../../configs";
import SystemBaseInfo from "../systemBaseInformation";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {DeleteOutlined, EditOutlined} from "@material-ui/icons";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import IconButton from "@material-ui/core/IconButton";

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

const Tables = (props) => {
    const dispatch = useDispatch();
console.log("aijauofhv")
    const [formData1, setFormData1] = React.useState({});
    const [currentData, setCurrentData] = React.useState({ setEdite : -1});

    const [data, setData] = React.useState(false);


    const [competenceModelIdGet, setcompetenceModelIdGet] = React.useState(false);


    const [dataCriteria, setdataCriteria] = React.useState(false);
    const [dataCriteria1, setdataCriteria1] = React.useState(false);

    const [addrowss , setaddrowss] = React.useState(false);
    const [addrowss1 , setaddrowss1] = React.useState(false);


    const addFormData1 = setFormDataHelper(setFormData1);
    const [tableContent1, setTableContent1] = React.useState([]);
    const [competeCriteriaToEdit, setcompeteCriteriaToEdit] = React.useState(-1);
    const [display, setDisplay] = React.useState(true);

    const [objst6, setobjst6] = React.useState(false);

    const [IdCriteria, setIdCriteria] = React.useState({});


    const [criterionCode, setcriterionCode] = React.useState(false);
    const [criterionTitle, setcriterionTitle] = React.useState(false);
    const [criterionRateEnumId, setcriterionRateEnumId] = React.useState(false);
    const [parentCriterionId, setparentCriterionId] = React.useState(false);

    {
        console.log("fffdff",currentData)
    }

    const [criterionCode1, setcriterionCode1] = React.useState(false);
    const [criterionTitle1, setcriterionTitle1] = React.useState(false);
    const [criterionRateEnumId1, setcriterionRateEnumId1] = React.useState(false);
    const [parentCriterionId1, setparentCriterionId1] = React.useState(false);

    const [style , setStyle] = React.useState({
        criterionCode : false,
        criterionTitle:false,
        criterionRateEnumId:false,
        parentCriterionId:false,
    })


    React.useEffect(()=> {

        if(formData1.CompetenceCriterion && (formData1.CompetenceCriterion.parentCriterionId === null || !formData1.CompetenceCriterion.parentCriterionId === null)){
            setparentCriterionId(true)
        }

    },[parentCriterionId])

    // React.useEffect(()=> {
    //     if(!formData1.CompetenceCriterion && currentData && competeCriteriaToEdit !== -1
    //         && currentData.setCompetenceCriterion[competeCriteriaToEdit] && !currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode){
    //         setcriterionCode(true)
    //     }
    // },[criterionCode])


console.log("aojkvfajav" , formData1)
    const handleClose = () => {
        setOpen(false);
    };

    const setValidateParent = index =>{
        let arry=[];
        if( index !== -1) {
            currentData.setCompetenceCriterion.map((el, indexEl) => {
                if (indexEl !== index) {
                    arry.push(el)
                }
            })
            arry.push({ criterionTitle: "ریشه", competenceCriterionId: "0" })
            return null
        }
        // arry.push(dataCriteria)
        if(dataCriteria1 !== false){
            arry = dataCriteria1;
        }
        else if(dataCriteria1 === false) {
            arry = dataCriteria
        }
        // setmethodCriteria(arry)
        console.log("aakaav" ,arry,dataCriteria)

    }

    {console.log("addrowss787",addrowss)}

    const addRow =()=> {
        setaddrowss(true)

        const postalfields = ['criterionCode', 'criterionTitle', 'parentCriterionId', 'criterionRateEnumId']
        // const postalfields = ['criterionCode', 'criterionTitle', 'criterionRateEnumId']

        let postalmissing_fileds = []

        postalfields.map((field, index) => {
            // if (addressEdit === -1) {
            if (formData1.CompetenceCriterion) {
                if (formData1.CompetenceCriterion[field] === '' || formData1.CompetenceCriterion[field] === null
                    || typeof formData1.CompetenceCriterion[field] == 'undefined') {

                    postalmissing_fileds.push(field)
                }
            } else {
                postalmissing_fileds.push(field)
            }
            postalmissing_fileds.push(field)

        })

        if (postalmissing_fileds.length !== 4 || parentCriterionId === true ) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            // if(!formData1.CompetenceCriterion){
            //      if(addrowss === true) {
                     if (!formData1.CompetenceCriterion) {
                         setcriterionRateEnumId(true)
                         setparentCriterionId(true)
                         setcriterionTitle(true)
                         setcriterionCode(true)

                     }
                     if (formData1.CompetenceCriterion && (formData1.CompetenceCriterion.criterionRateEnumId === null || !formData1.CompetenceCriterion.criterionRateEnumId)) {
                         setcriterionRateEnumId(true)
                     }
                     if (formData1.CompetenceCriterion && (formData1.CompetenceCriterion.parentCriterionId === null || !formData1.CompetenceCriterion.parentCriterionId )) {
                         setparentCriterionId(true)
                     }
                     if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.criterionTitle === '') {
                         setcriterionTitle(true)
                     }
                     if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.criterionCode === '') {
                         setcriterionCode(true)
                     }

                     // setStyle({
                     //     criterionCode: false,
                     //     criterionTitle: false,
                     //     criterionRateEnumId: false,
                     //     parentCriterionId: false,
                     // })
                     // setparentCriterionId(true)
                     // setcriterionRateEnumId(true)
                     // setcriterionTitle(true)
                     // setcriterionCode(true)
                     // const newFormdata = Object.assign({},formData1);
                     // setFormData1(newFormdata)
                     // setDisplay(false)
                     // setTimeout(() => {
                     //     setDisplay(true)
                     // }, 20)
                 // }
            return null;
        } else {
            if (formData1.CompetenceCriterion) {
                console.log('formData1.CompetenceCriterion',formData1.CompetenceCriterion)
                if(formData1.CompetenceCriterion.parentCriterionId){
                    if(formData1.CompetenceCriterion.parentCriterionId === "0"){
                        formData1.CompetenceCriterion.parentCriterionId = ""
                    } else {
                        formData1.CompetenceCriterion.parentCriterionId = formData1.CompetenceCriterion.parentCriterionId;
                    }
                    setparentId(formData1.CompetenceCriterion.parentCriterionId)
                }
                console.log("props.competenceModelIdGet",props.competenceModelIdGet)
                console.log("fdfddfdf4545",parentIdres)
                // props.setexpandedAccor(false)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));


                    axios.post(SERVER_URL + "/rest/s1/fadak/setCriterionCode"
                        ,
                        {
                            parentCriterionId:formData1.CompetenceCriterion.parentCriterionId === "0" ? "" : formData1.CompetenceCriterion.parentCriterionId,
                            criterionCode: formData1.CompetenceCriterion.criterionCode,
                            criterionTitle: formData1.CompetenceCriterion.criterionTitle,
                            criterionWeight: formData1.CompetenceCriterion.criterionWeight,
                            criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId,
                            description: formData1.CompetenceCriterion.description,
                            competenceModelId: props.competenceModelIdGet

                        }
                        , {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            }
                        }).then(responseunique => {
                        setparentIdres21(formData1.CompetenceCriterion.criterionTitle)

                        formData1.CompetenceCriterion.competenceCriterionId = responseunique.data.codeOut[0];
                        setTimeout(() => {
                            console.log("parentIdres31",parentIdres21,parentIdres31)
                        }, 20)
                        console.log("responseunique",responseunique.data)
                        if(responseunique.data.getList1.length !== 0){
                            console.log("props.setexpandedAccor",props)

                            const a = <>کد معیار باید یکتا باشد
                                <br/>
                                معیار را مجدد وارد کنید
                                <br/>
                                عنوان ثبت شده با این کد معیار برابر است با :
                                <br/>
                                {
                                    responseunique.data.getList1[0]
                                }
                            </>;
                            dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                            ));


                            // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد معیار یکتا باید باشد'));

                            // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'لطفا کد معیار آیتم ثبت شده را تغییر دهید، نام این معیار برابر است با ' + formData1.CompetenceCriterion.criterionTitle
                            //     + 'عناوین معیارهای ثبت شده با این کد معیار برابر است با:'  + responseunique.data.getList1 + 'باید مجدد اطلاعات را برای ثبت وارد کنید'
                            // ));
                            console.log("dffdfdfdfddf7878",responseunique.data.erro)
                            props.setexpandedAccor(true)
                            setFormData1({})
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)
                            // if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined') {
                            //     currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                            //         ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                            //         criterionCode: formData1.CompetenceCriterion.criterionCode
                            //     }
                            // }
                            //
                            // setCurrentData(Object.assign({}, currentData))

                            // if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined') {
                            //     currentData.setCompetenceCriterion[tableContent1.length] = {
                            //         ...currentData.setCompetenceCriterion[tableContent1.length],
                            //         criterionCode: formData1.CompetenceCriterion.criterionCode
                            //     }
                            // }
                            if (typeof formData1.CompetenceCriterion.competenceCriterionId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    competenceCriterionId: formData1.CompetenceCriterion.competenceCriterionId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionWeight != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionWeight: formData1.CompetenceCriterion.criterionWeight
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionRateEnumId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.parentCriterionId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.description != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    description: formData1.CompetenceCriterion.description
                                }
                            }
                            // props.setexpandedAccor(false)
                            // setCurrentData(Object.assign({}, currentData))
                            // setcompeteCriteriaToEdit(-1)
                            // setEnableDisableCreate(false)
                            // props.setEnableDisableCreate(false)
                            //
                            // const newFormdata = Object.assign({}, formData1);
                            // setFormData1({})
                            // setDisplay(false)
                            // setTimeout(() => {
                            //     setDisplay(true)
                            // }, 20)

                            // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                        }
                        else if(responseunique.data.getList1.length === 0)
                        {
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                            if (typeof formData1.CompetenceCriterion.competenceCriterionId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    competenceCriterionId: formData1.CompetenceCriterion.competenceCriterionId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionCode: formData1.CompetenceCriterion.criterionCode
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionWeight != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionWeight: formData1.CompetenceCriterion.criterionWeight
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.criterionRateEnumId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.parentCriterionId != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.description != 'undefined') {
                                currentData.setCompetenceCriterion[tableContent1.length] = {
                                    ...currentData.setCompetenceCriterion[tableContent1.length],
                                    description: formData1.CompetenceCriterion.description
                                }
                            }

                            // let getAllTitles=[];
                            const getAllTitles = [].concat({ criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                , competenceCriterionId: formData1.CompetenceCriterion.competenceCriterionId },dataCriteria);

                            // getAllTitles.push(dataCriteria)
                            // props.setexpandedAccor(false)
                            // setdataCriteria({...,getAllTitles})
                            setdataCriteria(getAllTitles)
                            console.log("sddssdsds789798",currentData)
                            //
                            // setdataCriteria(Object.assign({}, getAllTitles))
                            //
                            // currentData.dataCriteria = {
                            //     ... {criterionTitle: formData1.CompetenceCriterion.criterionTitle,
                            //         competenceCriterionId: 11121}
                            // }
                            // currentData.dataCriteria = {getAllTitles}
                            setCurrentData(Object.assign({}, currentData))
                            setcompeteCriteriaToEdit(-1)
                            setEnableDisableCreate(false)
                            props.setEnableDisableCreate(false)

                            const newFormdata = Object.assign({}, formData1);
                            setFormData1({})
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 20)
                        }

                    }) .catch(error => {
                        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'لطفا کد معیار آیتم ثبت شده را تغییر دهید، نام این معیار برابر است با :' + formData1.CompetenceCriterion.criterionTitle

                        // ));
                        console.log("sddssdsds789798",error)

                    });



            }

            // props.setEnableDisableCreate(false)
            // props.setexpandedAccor(false)

        }

    }
    function getDuplicateArrayElements(arr){
        var sorted_arr = arr.slice().sort();
        var results = [];
        for (var i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] === sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        return results;
    }
    const [parentId, setparentId] = React.useState({ parentCriterionId : formData1.CompetenceCriterion ?
            formData1.CompetenceCriterion.parentCriterionId : ""});
    const [parentIdres, setparentIdres] = React.useState(false);
    const [parentIdres2, setparentIdres2] = React.useState(false);
    const [parentIdres3, setparentIdres3] = React.useState(false);

    const [parentIdres1, setparentIdres1] = React.useState(false);
    const [parentIdres21, setparentIdres21] = React.useState(false);
    const [parentIdres31, setparentIdres31] = React.useState(false);

    React.useEffect(()=>{



        setcompetenceModelIdGet(props.competenceModelIdGet)
        axios.get(SERVER_URL + "/rest/s1/fadak/getRootElement?" +
            "competenceModelId=" + props.competenceModelIdGet , {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response12 => {
            console.log("response12",response12.data)
            setparentIdres2(response12.data.jerkIds1)
            setparentIdres3(response12.data.jerkIds)

        })


        // axios.get(SERVER_URL + "/rest/s1/fadak/setCriterionCode?" +
        //     "competenceModelId=" + props.competenceModelIdGet + "&parentCriterionId=" + parentId, {
        //     headers: {
        //         'api_key': localStorage.getItem('api_key')
        //     },
        // }).then(response => {
        //     setparentIdres(response.data.output3)
        //
        // })

        axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?" +
            "enumTypeList=CriterionRate", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response => {
            setData(response.data)

            axios.get(SERVER_URL + "/rest/s1/fadak/getCompetenceCriterion?competenceModelId=" + props.competenceModelIdGet , {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(responsegetCompetenceCriterion => {
                if(parentIdres21 !== false){
                    console.log("parentIdres21",parentIdres21)
                if(responsegetCompetenceCriterion.data.setCompetenceCriterion.criterionTitle === parentIdres21) {
                    setparentIdres31(responsegetCompetenceCriterion.data.setCompetenceCriterion.competenceCriterionId)
                }
                }


                // for(let i=0 ; i<responsegetCompetenceCriterion.data.setCompetenceCriterion.length ; i++){
                //
                // }
                // const arr1 = ["?", "?", "?", "?", "?", "?"];

                const getAllTitles = [].concat({ criterionTitle: "ریشه", competenceCriterionId: "0" });

                // arr2.push("?");


                // [{ criterionTitle: "ریشه", parentCriterionId: null }]
                //                 getAllTitles.push({ criterionTitle: "ریشه", parentCriterionId: null });

                let findItems=[];
                responsegetCompetenceCriterion.data.setCompetenceCriterion.map((CompetenceModels1, index1) => {
                    responsegetCompetenceCriterion.data.setCompetenceCriterion.map((CompetenceModels, index) => {
                        if(CompetenceModels.parentCriterionId === CompetenceModels1.competenceCriterionId){
                            findItems.push(CompetenceModels.parentCriterionId)
                        }

                    })
                })


                var duplicateitems= getDuplicateArrayElements(findItems);
                console.log("findItems",findItems,duplicateitems)

                responsegetCompetenceCriterion.data.setCompetenceCriterion.map((CompetenceModels, index) => {
                    if(CompetenceModels.criterionTitle !== undefined) {
                        if (index !== (duplicateitems)) {
                            console.log("findItems1212",findItems,duplicateitems)

                            // getAllTitles = {
                            //     "criterionTitle": CompetenceModels.criterionTitle,
                            //     "parentCriterionId": CompetenceModels.parentCriterionId
                            // }
                            //                     getAllTitles.push({criterionTitle:CompetenceModels.criterionTitle,
                            //                         parentCriterionId:CompetenceModels.parentCriterionId
                            //                     })
                            getAllTitles.push({
                                criterionTitle: CompetenceModels.criterionTitle,
                                competenceCriterionId: CompetenceModels.competenceCriterionId
                            })
                            // setdataCriteria(getAllTitles)
                            // setdataCriteria({
                            //     "criterionTitle" : CompetenceModels.criterionTitle,
                            //     "parentCriterionId":CompetenceModels.parentCriterionId
                            // })
                        }
                    }
                })

                setdataCriteria(getAllTitles)

                currentData.dataCriteria = {getAllTitles}

                setCurrentData(Object.assign({},currentData,responsegetCompetenceCriterion.data))

            })
        })
            .catch(error => {
            });


    },[]);
    const [idDelete, setId] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const openDeleteModal = (id) => {
        setId(id);
        setOpen(true);
    };
    const [enablecancel, stenablecancel] = React.useState(false);

    const displayUpdateForm = (index) => {
        setparentCriterionId(false)
        setcriterionRateEnumId(false)
        setcriterionTitle(false)
        setcriterionCode(false)
        setIdCriteria(index)
        currentData.setEdite = index;
        setCurrentData(Object.assign({} , currentData))
        setcompeteCriteriaToEdit(index)
        setEnableDisableCreate(true);
        setDisplay(false);
        setTimeout(() => {
            setDisplay(true);

        },20);
    }

    React.useEffect(() => {

        if (typeof currentData != "undefined" && currentData.setCompetenceCriterion ) {
            let rows = []

            currentData.setCompetenceCriterion.map((CompetenceModel, index) => {


                // let getParent = [];
                // getParent.push(CompetenceModel.parentCriterionId)
                // console.log("cdcdcdcdcd",getParent)
                //
                // setCurrentData(Object.assign({}, currentData,  {getParent: getParent}))
                // setDisplay(false)
                // setTimeout(() => {
                //     setDisplay(true)
                // }, 20)
                if(CompetenceModel.criterionRateEnumId) {
                    data.enums.CriterionRate.map((item, index) => {
                        if (item.enumId ===CompetenceModel.criterionRateEnumId) {
                            // return item;
                            CompetenceModel.criterionRateEnumId = item.description;
                        }
                    });
                }

                let arr = [];
                if(idDelete === index){
                    var index1 = currentData.dataCriteria[index]
                    if(index1 > -1)
                    {
                        currentData.dataCriteria.splice(index1, 1);
                    }
                    if(currentData && currentData.dataCriteria && currentData.dataCriteria.getAllTitles) {
                        currentData.dataCriteria.getAllTitles.filter((item, index2) => {
                            if (index2  !== idDelete+1 ) {
                                arr.push(item)


                                // currentData.setCompetenceCriterion[competeCriteriaToEdit]

                            }
                            setdataCriteria1(arr)
                        })
                        setCurrentData(Object.assign({}, currentData, {dataCriteria: arr}))
                        setDisplay(false)
                        setTimeout(() => {
                            setDisplay(true)
                        }, 20)
                    }
                }

                if(CompetenceModel.parentCriterionId) {
                    console.log("sddssdsds789798",dataCriteria)
                    dataCriteria.map((item, index) => {
                        if (item.competenceCriterionId ===CompetenceModel.parentCriterionId) {
                            // return item;

                            CompetenceModel.parentCriterionId = item.criterionTitle;
                        }
                    });

                }
                if( CompetenceModel && (!CompetenceModel.parentCriterionId ||  CompetenceModel.parentCriterionId === "0")){
                    CompetenceModel.parentCriterionId = "ریشه"
                }

                setparentCriterionId(false)
                setcriterionRateEnumId(false)
                setcriterionTitle(false)
                setcriterionCode(false)


                const row1 = {
                    // id: partyRelation.relationship.partyRelationshipId,
                    id: index,
                    criterionRow: index + 1,
                    criterionCode: CompetenceModel.criterionCode ? CompetenceModel.criterionCode : '',
                    criterionTitle: CompetenceModel.criterionTitle ? CompetenceModel.criterionTitle  :'',
                    criterionWeight: CompetenceModel.criterionWeight ? CompetenceModel.criterionWeight :'',
                    criterionRateEnumId: CompetenceModel.criterionRateEnumId ? CompetenceModel.criterionRateEnumId :'',
                    parentCriterionId: CompetenceModel.parentCriterionId ? CompetenceModel.parentCriterionId :'',
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
            setTableContent1(rows);
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)

            }, 20)
        }

    }, [currentData, data])

    const [enableDisableCreate, setEnableDisableCreate] = React.useState(false);

    const cancelUpdate = () => {
        setaddrowss1(false)

        setaddrowss(false)
        setStyle({
            criterionCode : false,
            criterionTitle:false,
            criterionRateEnumId:false,
            parentCriterionId:false,
        })
        setparentCriterionId(false)
        setparentCriterionId1(false)
        setcriterionRateEnumId(false)
        setcriterionRateEnumId1(false)
        setcriterionTitle(false)
        setcriterionTitle1(false)
        setcriterionCode(false)
        setcriterionCode1(false)
        setcompeteCriteriaToEdit(-1)
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)
        setEnableDisableCreate(false);
        stenablecancel(false)

    };

    const cancelAdd = ()=>{
        setaddrowss1(false)

        setaddrowss(false)
        if(typeof formData1.CompetenceCriterion != "undefined" ){
            if(typeof formData1.CompetenceCriterion.criterionCode != "undefined"){
                formData1.CompetenceCriterion.criterionCode = ''
            }
            if(typeof formData1.CompetenceCriterion.criterionTitle != "undefined"){
                formData1.CompetenceCriterion.criterionTitle = ''
            }
            if(typeof formData1.CompetenceCriterion.criterionWeight != "undefined"){
                formData1.CompetenceCriterion.criterionWeight = ''
            }
            if(typeof formData1.CompetenceCriterion.criterionRateEnumId != "undefined"){
                formData1.CompetenceCriterion.criterionRateEnumId = ''
            }
            if(typeof formData1.CompetenceCriterion.parentCriterionId != "undefined"){
                formData1.CompetenceCriterion.parentCriterionId = ''
            }
            if(typeof formData1.CompetenceCriterion.description != "undefined"){
                formData1.CompetenceCriterion.description = ''
            }

        }
        setStyle({
            criterionCode : false,
            criterionTitle:false,
            criterionRateEnumId:false,
            parentCriterionId:false,
        })
        setparentCriterionId(false)
        setparentCriterionId1(false)
        setcriterionRateEnumId(false)
        setcriterionRateEnumId1(false)
        setcriterionTitle(false)
        setcriterionTitle1(false)
        setcriterionCode(false)
        setcriterionCode1(false)
        const newFormdata = Object.assign({},formData1);
        setFormData1(newFormdata)
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)

    }


    const updateRow = (id) => {
        setaddrowss1(true)
        const postalfields = ['criterionCode', 'criterionTitle', 'parentCriterionId', 'criterionRateEnumId']

        let postalmissing_fileds = []

        postalfields.map((field, index) => {
            let ifFilledPerson = (((currentData.setCompetenceCriterion && !currentData.setCompetenceCriterion[competeCriteriaToEdit][field])
                && (formData1.CompetenceCriterion && (typeof formData1.CompetenceCriterion[field] != 'undefined'
                    && (formData1.CompetenceCriterion[field]).trim() !== ''))
            ) || (
                (currentData.setCompetenceCriterion && currentData.setCompetenceCriterion[competeCriteriaToEdit][field])
                &&
                (
                    (typeof formData1.CompetenceCriterion == 'undefined')
                    ||
                    (formData1.perCompetenceCriterionson && (typeof formData1.CompetenceCriterion[field] == 'undefined'))
                    ||
                    (formData1.CompetenceCriterion && (typeof formData1.CompetenceCriterion[field] != 'undefined'
                        && (formData1.CompetenceCriterion[field]).trim() !== ''))
                )
            )) ? true : false;
            if (!ifFilledPerson) {
                postalmissing_fileds.push(field)
            }
        })

        if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.criterionRateEnumId === null){
            setcriterionRateEnumId(true)
        }
        else {
            setcriterionRateEnumId(false)

        }
        if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.parentCriterionId === null){
            setparentCriterionId(true)
        }
        else {
            setparentCriterionId(false)

        }
        if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.criterionTitle &&  (formData1.CompetenceCriterion.criterionTitle.trim()) === ''){
            setcriterionTitle(true)
        }
        else {
            setcriterionTitle(false)

        }
        if(formData1.CompetenceCriterion &&formData1.CompetenceCriterion.criterionCode && (formData1.CompetenceCriterion.criterionCode.trim()) === ''){
            setcriterionCode(true)
        }
        else {
            setcriterionCode(false)

        }
        // if(!formData1.CompetenceCriterion && !formData1.CompetenceCriterion.criterionCode === '' && currentData
        //     && currentData.setCompetenceCriterion[competeCriteriaToEdit] && !currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode){
        //     setcriterionCode(true)
        // }
        console.log("fffffffffffff78",formData1.CompetenceCriterion)

        if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.criterionRateEnumId === null) {
            setcriterionRateEnumId(true)
            setcriterionRateEnumId1(true)
        }
        if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.parentCriterionId === null) {
            console.log("fffffffffffff78",formData1.CompetenceCriterion)
            setparentCriterionId(true)
            setparentCriterionId1(true)
        }
        if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.criterionTitle&& (formData1.CompetenceCriterion.criterionTitle).trim() === '') {
            setcriterionTitle(true)
            setcriterionTitle1(true)
        }
        if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.criterionCode&& (formData1.CompetenceCriterion.criterionCode).trim() === '') {
            setcriterionCode(true)
            setcriterionCode1(true)
        }


        console.log('fffffffffffff781',criterionRateEnumId,parentCriterionId,criterionTitle,criterionCode)
        if (
            (criterionRateEnumId === true || parentCriterionId === true || criterionTitle===true || criterionCode=== true) ||
            (criterionRateEnumId1 === true || parentCriterionId1 === true || criterionTitle1===true || criterionCode1=== true)
        ) {

            // if (postalmissing_fileds.length > 0 ) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            console.log("parent1parent1",currentData.setCompetenceCriterion[competeCriteriaToEdit],formData1.CompetenceCriterion)

        }
        else

        {

            {
                if (formData1.CompetenceCriterion) {
                    setaddrowss1(false)
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                    let obj6=[];

                    const criteria_obj ={
                        competenceCriterionId : id,
                        criterionCode: formData1.CompetenceCriterion.criterionCode ? formData1.CompetenceCriterion.criterionCode
                            : currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode,
                        criterionTitle: formData1.CompetenceCriterion.criterionTitle
                            ? formData1.CompetenceCriterion.criterionTitle : currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle,
                        criterionWeight: formData1.CompetenceCriterion.criterionWeight ? formData1.CompetenceCriterion.criterionWeight
                            :currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionWeight ,
                        criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId ?
                            formData1.CompetenceCriterion.criterionRateEnumId:currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId ,
                        parentCriterionId: (formData1.CompetenceCriterion.parentCriterionId === "0" ? "" : formData1.CompetenceCriterion.parentCriterionId)?
                            formData1.CompetenceCriterion.parentCriterionId
                            :currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId ,
                        description: formData1.CompetenceCriterion.description ? formData1.CompetenceCriterion.description:
                            currentData.setCompetenceCriterion[competeCriteriaToEdit].description,
                        competenceModelId : props.competenceModelIdGet
                    }

                    // dataCriteria.map((item, index) => {
                    //     if (item.criterionTitle === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId) {
                    //         // setafteradd(true)
                    //         currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId = item.competenceCriterionId
                    //     }
                    //     else if(item.competenceCriterionId === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId){
                    //         currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId = item.competenceCriterionId;
                    //     }
                    // });


                    dataCriteria.map((item, index) => {
                        if (item.criterionTitle === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId) {
                            // setafteradd(true)
                            currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId = item.competenceCriterionId
                            criteria_obj.parentCriterionId = item.competenceCriterionId
                        }
                        else if(item.competenceCriterionId === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId){
                            currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId = item.competenceCriterionId;
                            criteria_obj.parentCriterionId = item.competenceCriterionId

                        }
                    });

                    data.enums.CriterionRate.map((item, index) => {
                        if (item.description === currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId) {
                            currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId = item.enumId
                        } else if(item.enumId === currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId) {
                            currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId = item.enumId

                        }
                    });


                    console.log("888888cri",criteria_obj)

                        if(formData1.CompetenceCriterion) {

                            var parent1 =  '';
                            if(criteria_obj.parentCriterionId === "0"){
                                criteria_obj.parentCriterionId = null;
                            }
                            if(formData1.CompetenceCriterion.parentCriterionId === "0"){
                                formData1.CompetenceCriterion.parentCriterionId = null
                                 parent1 =  formData1.CompetenceCriterion.parentCriterionId
                                criteria_obj.parentCriterionId = formData1.CompetenceCriterion.parentCriterionId
                            }
                            console.log("parent1parent1",currentData.setCompetenceCriterion[competeCriteriaToEdit],formData1.CompetenceCriterion)
                            axios.put(SERVER_URL + "/rest/s1/fadak/setCriterionCodeInUpdate?competenceModelId=" + props.competenceModelIdGet
                                + "&competenceCriterionId=" + id,
                                {
                                    parentCriterionId: formData1.CompetenceCriterion.parentCriterionId ?? criteria_obj.parentCriterionId,
                                    criterionCode: formData1.CompetenceCriterion.criterionCode ? formData1.CompetenceCriterion.criterionCode :
                                        (competeCriteriaToEdit !== -1 &&
                                        currentData && currentData.setCompetenceCriterion[competeCriteriaToEdit]) ?
                                         currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode : "",
                                    criterionTitle: formData1.CompetenceCriterion.criterionTitle ?? criteria_obj.criterionTitle,
                                    criterionWeight: formData1.CompetenceCriterion.criterionWeight ?? criteria_obj.criterionWeight,
                                    criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId ?? (currentData && currentData.setCompetenceCriterion[competeCriteriaToEdit] && currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId),
                                    description: formData1.CompetenceCriterion.description ??  criteria_obj.description,
                                }
                                , {
                                    timeout: AXIOS_TIMEOUT,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        api_key: localStorage.getItem('api_key')
                                    }
                                }).then(responseunique => {
                                console.log("fffdff132132", formData1.CompetenceCriterion.parentCriterionId)


                                // if(formData1.CompetenceCriterion.criterionTitle) {
                                //     //patch with formData
                                //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                //         {
                                //             criterionTitle: formData1.CompetenceCriterion.criterionTitle,
                                //         }
                                //         , {
                                //             timeout: AXIOS_TIMEOUT,
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 api_key: localStorage.getItem('api_key')
                                //             }
                                //         }).then(response131231 => {
                                //         console.log("dsdddddddd", response131231.data)
                                //         if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined') {
                                //             currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //                 ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //                 criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                //             }
                                //         }
                                //
                                //     })
                                // }
                                // if(formData1.CompetenceCriterion.criterionTitle === ''){
                                //     console.log("fddddddddddddddddd",formData1.CompetenceCriterion)
                                //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                //         {
                                //             criterionTitle: currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle,
                                //         }
                                //         , {
                                //             timeout: AXIOS_TIMEOUT,
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 api_key: localStorage.getItem('api_key')
                                //             }
                                //         }).then(response131231 => {
                                //         console.log("dsdddddddd", response131231.data)
                                //         if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined') {
                                //             currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //                 ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //                 criterionTitle: currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle
                                //             }
                                //         }
                                //     })
                                // }


                                // if ( formData1.CompetenceCriterion.parentCriterionId
                                //     && responseunique.data.getList123[0] === false) {
                                //     console.log("fffdff11111",formData1.CompetenceCriterion.parentCriterionId,dataCriteria)
                                //     dataCriteria.map((item, index) => {
                                //         if (item.criterionTitle === formData1.CompetenceCriterion.parentCriterionId) {
                                //             // setafteradd(true)
                                //             formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                //         }
                                //         else if(item.competenceCriterionId === formData1.CompetenceCriterion.parentCriterionId){
                                //             formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                //         }
                                //     });
                                //     currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //         ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //         parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                //     }
                                //     console.log("fffdff11111",formData1.CompetenceCriterion.parentCriterionId)
                                // }

                                console.log("sffdsfsfsdfsfsfsfs", responseunique.data)
                                let arr =[];
                                if(responseunique.data.getList1.indexOf(criteria_obj.criterionTitle) > -1) {
                                    responseunique.data.getList1.filter((item, index2) => {
                                        console.log("cccccccccc",item)
                                        if (item !== criteria_obj.criterionTitle) {
                                            arr.push(item)
                                        }
                                        responseunique.data.getList1 = arr;
                                    })
                                }
                                console.log("cccccccccc",formData1.CompetenceCriterion.parentCriterionId)


                                // if ( formData1.CompetenceCriterion &&formData1.CompetenceCriterion.parentCriterionId ===
                                //     && responseunique.data.getList123[0] === false) {
                                //     console.log("fffdff11111", formData1.CompetenceCriterion.parentCriterionId, dataCriteria)
                                //     dataCriteria.map((item, index) => {
                                //         if (item.criterionTitle === formData1.CompetenceCriterion.parentCriterionId) {
                                //             // setafteradd(true)
                                //             formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                //         } else if (item.competenceCriterionId === formData1.CompetenceCriterion.parentCriterionId) {
                                //             formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                //         }
                                //     });
                                //     currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //         ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //         parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                //     }
                                //     console.log("fffdff11111", formData1.CompetenceCriterion.parentCriterionId)
                                //     setCurrentData(Object.assign({}, currentData))
                                // }

                                if ( formData1.CompetenceCriterion && formData1.CompetenceCriterion.parentCriterionId
                                    && responseunique.data.getList123[0] === false) {
                                    console.log("fffdff11111", formData1.CompetenceCriterion.parentCriterionId, dataCriteria)
                                    dataCriteria.map((item, index) => {
                                        if (item.criterionTitle === formData1.CompetenceCriterion.parentCriterionId) {
                                            // setafteradd(true)
                                            formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                        } else if (item.competenceCriterionId === formData1.CompetenceCriterion.parentCriterionId) {
                                            formData1.CompetenceCriterion.parentCriterionId = item.criterionTitle
                                        }
                                    });
                                    currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                        ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                        parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                    }
                                    console.log("fffdff11111", formData1.CompetenceCriterion.parentCriterionId)
                                    setCurrentData(Object.assign({}, currentData))
                                }

                                if(formData1.CompetenceCriterion.parentCriterionId === null) {
                                    dataCriteria.map((item, index) => {
                                        console.log("fffdddddddddd", formData1.CompetenceCriterion.parentCriterionId)
                                        formData1.CompetenceCriterion.parentCriterionId = "ریشه"
                                    });
                                        currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                            ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                            parentCriterionId: formData1.CompetenceCriterion.parentCriterionId
                                        }
                                }

                                let arrTotal=[];
                                if(responseunique.data.getList1.length !== 0 ){
                                    // arrTotal
                                }
                                   // const a = <> کد معیار را تغییر دهید، عنوان معیارهای ثبت شده با این کد معیار
                                   //     برابر است با:<br/>{rrrr}</>;
                                   //  dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                                   //  ));

                                    if(responseunique.data.getList123[0] === false && responseunique.data.getList1.length !== 0 && responseunique.data.getList1[0] !==null ){
                                        console.log("ffffffffff",responseunique.data.getList1)
                                        //patch
                                        const a = <>کد معیار باید یکتا باشد
                                            <br/>
                                            کد معیار را برای معیار انتخاب شده مجدد ویرایش نمایید
                                            <br/>
                                            عنوان ثبت شده با این کد معیار برابر است با :
                                            <br/>
                                            {
                                                responseunique.data.getList1[0]
                                            }
                                            </>;
                                        dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                                        ));
                                        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد معیار یکتا باید باشد'));
                                    }

                                if(responseunique.data.getList123[0] === false && responseunique.data.getList1.length === 0){
                                    //patch
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                                }
                                if(responseunique.data.getList123[0] === true){
                                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'لطفا معیار بالاتر را تغییر دهید'));
                                }

                                // if(formData1.CompetenceCriterion.criterionCode) {
                                //     //patch with formData
                                //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                //         {
                                //             criterionCode: formData1.CompetenceCriterion.criterionCode,
                                //         }
                                //         , {
                                //             timeout: AXIOS_TIMEOUT,
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 api_key: localStorage.getItem('api_key')
                                //             }
                                //         }).then(response131231 => {
                                //         // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                                //
                                //         console.log("dsdddddddd", response131231.data)
                                //         if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined' && responseunique.data.getList1.length === 0) {
                                //             currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //                 ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //                 criterionCode: formData1.CompetenceCriterion.criterionCode
                                //             }
                                //         }
                                //
                                //     })
                                // }
                                // if(formData1.CompetenceCriterion.criterionCode === ''){
                                //     console.log("fddddddddddddddddd",formData1.CompetenceCriterion)
                                //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                //         {
                                //             criterionCode: currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode,
                                //         }
                                //         , {
                                //             timeout: AXIOS_TIMEOUT,
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 api_key: localStorage.getItem('api_key')
                                //             }
                                //         }).then(response131231 => {
                                //         // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                                //
                                //         console.log("dsdddddddd", response131231.data)
                                //         if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined' && responseunique.data.getList1.length === 0) {
                                //             currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //                 ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //                 criterionCode:currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode
                                //             }
                                //         }
                                //     })
                                // }


                                if(formData1.CompetenceCriterion.criterionTitle) {
                                    //patch with formData
                                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/CompetenceCriterion" , {data : 
                                        {
                                            criterionTitle: formData1.CompetenceCriterion.criterionTitle,
                                            competenceCriterionId : id
                                        }}
                                        , {
                                            timeout: AXIOS_TIMEOUT,
                                            headers: {
                                                'Content-Type': 'application/json',
                                                api_key: localStorage.getItem('api_key')
                                            }
                                        }).then(response131231 => {
                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                                        console.log("dsdddddddd", response131231.data)
                                        if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined' && responseunique.data.getList1.length === 0) {
                                            currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                                ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                                criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                            }
                                        }

                                    })
                                }
                                if(formData1.CompetenceCriterion.criterionTitle === ''){
                                    console.log("fddddddddddddddddd",formData1.CompetenceCriterion)
                                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/CompetenceCriterion" , {data : 
                                        {
                                            criterionTitle: currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle,
                                            competenceCriterionId : id
                                        }}
                                        , {
                                            timeout: AXIOS_TIMEOUT,
                                            headers: {
                                                'Content-Type': 'application/json',
                                                api_key: localStorage.getItem('api_key')
                                            }
                                        }).then(response131231 => {
                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                                        console.log("dsdddddddd", response131231.data)
                                        if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined' && responseunique.data.getList1.length === 0) {
                                            currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                                ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                                criterionTitle:currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode
                                            }
                                        }
                                    })
                                }

                                // if (typeof formData1.CompetenceCriterion.criterionCode != 'undefined' && responseunique.data.getList1.length === 0) {
                                //     currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //         ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //         criterionCode: formData1.CompetenceCriterion.criterionCode
                                //     }
                                // }
                                // if (typeof formData1.CompetenceCriterion.criterionTitle != 'undefined') {
                                //     currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                //         ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                //         criterionTitle: formData1.CompetenceCriterion.criterionTitle
                                //     }
                                // }
                                if (typeof formData1.CompetenceCriterion.criterionWeight != 'undefined') {
                                    currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                        ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                        criterionWeight: formData1.CompetenceCriterion.criterionWeight
                                    }
                                }
                                if (typeof formData1.CompetenceCriterion.criterionRateEnumId != 'undefined') {
                                    currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                        ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                        criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId
                                    }
                                }

                            console.log("akvjadvjasvjaj")

                                if (typeof formData1.CompetenceCriterion.description != 'undefined') {
                                    console.log("fffdff11111", formData1.CompetenceCriterion.description, 7789789)
                                    currentData.setCompetenceCriterion[competeCriteriaToEdit] = {
                                        ...currentData.setCompetenceCriterion[competeCriteriaToEdit],
                                        description: formData1.CompetenceCriterion.description
                                    }
                                }

                                setCurrentData(Object.assign({}, currentData))
                                setFormData1({})
                                setDisplay(false)
                                setTimeout(() => {
                                    setDisplay(true)
                                }, 2000)
                            })
                                .catch(error => {
                                    let rrrr = [];
                                    for (var i = 0; i < parentIdres2.length; i++) {
                                        if (parentIdres2[i] === formData1.CompetenceCriterion.criterionCode) {
                                            //error
                                            rrrr.push(parentIdres3[i])
                                        }
                                    }
                                    console.log("rrrr797979", rrrr)
                                    // // if (rrrr) {
                                    // //     const a = <> کد معیار را تغییر دهید، عنوان معیارهای ثبت شده با این کد معیار
                                    // //         برابر است با:<br/>{rrrr}</>;
                                    // //     dispatch(setAlertContent(ALERT_TYPES.WARNING, a
                                    // //     ));
                                    // // }
                                    // if (formData1.CompetenceCriterion.criterionRateEnumId) {
                                    //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                    //         {
                                    //             criterionTitle: criteria_obj.criterionTitle,
                                    //             criterionWeight: criteria_obj.criterionWeight,
                                    //             criterionRateEnumId: formData1.CompetenceCriterion.criterionRateEnumId,
                                    //             description: criteria_obj.description,
                                    //         }
                                    //         , {
                                    //             timeout: AXIOS_TIMEOUT,
                                    //             headers: {
                                    //                 'Content-Type': 'application/json',
                                    //                 api_key: localStorage.getItem('api_key')
                                    //             }
                                    //         }).then(response131231 => {
                                    //         console.log("dsdddddddd", response131231.data)
                                    //
                                    //     })
                                    // } else {
                                    //     axios.patch(SERVER_URL + "/rest/e1/CompetenceCriterion?competenceCriterionId=" + id,
                                    //         {
                                    //             criterionTitle: criteria_obj.criterionTitle,
                                    //             criterionWeight: criteria_obj.criterionWeight,
                                    //             // criterionRateEnumId: criteria_obj.criterionRateEnumId,
                                    //             description: criteria_obj.description,
                                    //         }
                                    //         , {
                                    //             timeout: AXIOS_TIMEOUT,
                                    //             headers: {
                                    //                 'Content-Type': 'application/json',
                                    //                 api_key: localStorage.getItem('api_key')
                                    //             }
                                    //         }).then(response131231 => {
                                    //         console.log("dsdddddddd", response131231.data)
                                    //
                                    //     })
                                    // }
                                    // props.setexpandedAccor(false)

                                });


                        }

                }

            }
            setFormData1({})
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 2000)
            props.setEnableDisableCreate(false)
            // props.setexpandedAccor(false)
            setparentCriterionId(false)
            setcriterionRateEnumId(false)
            setcriterionTitle(false)
            setcriterionCode(false)
            setcompeteCriteriaToEdit(-1)
            setEnableDisableCreate(false)
            props.setEnableDisableCreate(false)
        }
    }
    React.useEffect(()=>{

    },[dataCriteria]);


    React.useEffect(()=>{

    },[IdCriteria]);

    React.useEffect(()=>{

    },[idDelete]);


    React.useEffect(()=>{

    },[dataCriteria1]);

    React.useEffect(()=>{

    },[competenceModelIdGet]);
    React.useEffect(()=>{

    },[parentId]);
    React.useEffect(()=>{

    },[parentIdres,parentIdres2,parentIdres3]);
    React.useEffect(()=>{

    },[objst6]);
    React.useEffect(()=>{

    },[parentIdres21,parentIdres31]);

    React.useEffect(()=>{

    },[addrowss]);
    React.useEffect(()=>{

    },[addrowss1]);

    return (
        <Grid>

            {display && data && <TableForm addFormData1={addFormData1}  setFormData1={setFormData1} formData1={formData1} tableContent1={tableContent1} data={data}
                                           enableDisableCreate ={enableDisableCreate} dataCriteria={dataCriteria} dataCriteria1={dataCriteria1}
                                           addRow={addRow} cancelAdd={cancelAdd} currentData={currentData}
                                           addrowss={addrowss} addrowss1={addrowss1}
                                           competeCriteriaToEdit={competeCriteriaToEdit} updateRow={updateRow}
                                           setCurrentData={setCurrentData} idDelete={idDelete} cancelUpdate={cancelUpdate}
                                           handleClose={handleClose}  setTableContent1={setTableContent1} setDisplay={setDisplay} open={open} display={display}
                                           setStyle={setStyle} competenceModelIdGet={competenceModelIdGet}
                                           criterionCode={criterionCode} criterionTitle={criterionTitle}
                                           criterionRateEnumId={criterionRateEnumId} parentCriterionId={parentCriterionId}
                                           setcriterionCode={setcriterionCode} setcriterionTitle={setcriterionTitle}
                                           setcriterionRateEnumId={setcriterionRateEnumId} setparentCriterionId={setparentCriterionId}
                                           setdataCriteria={setdataCriteria}
                                           criterionCode1={criterionCode1} criterionTitle1={criterionTitle1}
                                           criterionRateEnumId1={criterionRateEnumId1} parentCriterionId1={parentCriterionId1}
                                           setcriterionCode1={setcriterionCode1} setcriterionTitle1={setcriterionTitle1}
                                           setcriterionRateEnumId1={setcriterionRateEnumId1} setparentCriterionId1={setparentCriterionId1}
                                           addrows1={addrowss1}
            />}
        </Grid>

    );
}

export default Tables;