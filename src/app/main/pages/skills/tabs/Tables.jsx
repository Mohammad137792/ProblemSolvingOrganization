import React, {useState} from 'react';
// import {FusePageSimple} from "@fuse";
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
    FormControl
} from "@material-ui/core";
import {Card,
    CardHeader, Chip,
    InputLabel,
     Select,
    Switch
} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core/styles';
import {setFormDataHelper} from "../../../helpers/setFormDataHelper";
import TableForm from './TableForm'
import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../../configs";
import SystemBaseInfo from "../skills";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {DeleteOutlined, EditOutlined} from "@material-ui/icons";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import IconButton from "@material-ui/core/IconButton";
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

const Tables = (props) => {
    const dispatch = useDispatch();
    console.log("aijauofhv")
    const [formData1, setFormData1] = React.useState({});
    const [skillCodesskills, setskillCodesskills] = React.useState(false);
    const [skillCodesskills1, setskillCodesskills1] = React.useState(false);

    const [currentData, setCurrentData] = React.useState({ setEdite : -1});
    const [cc1, setcc1] = React.useState(false);

    const [data, setData] = React.useState(false);


    const [toSkillIds, settoSkillIds] = React.useState(false);
console.log("asofkiapifj" , SERVER_URL)

    const [competenceModelIdGet, setcompetenceModelIdGet] = React.useState(false);


    const [dataCriteria, setdataCriteria] = React.useState(false);
    const [dataCriteria2, setdataCriteria2] = React.useState(false);
    const [dataCriteria3, setdataCriteria3] = React.useState(false);
    const [dataCriteria4, setdataCriteria4] = React.useState(false);
    const [dataCriteria7, setdataCriteria7] = React.useState(false);
    const [dataCriteria1, setdataCriteria1] = React.useState(false);

    const [addrowss , setaddrowss] = React.useState(false);
    const [ccc2 , setccc2] = React.useState(false);
    const [ccc6 , setccc6] = React.useState(false);
    const [addrowss1 , setaddrowss1] = React.useState(false);

    const [title, settitle] = React.useState(false);
    const [skillCode, setskillCode] = React.useState(false);
    const [skillCode1, setskillCode1] = React.useState(false);
    const [title1, settitle1] = React.useState(false);

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
    const [partyIdOrg, setpartyIdOrg] = React.useState(false);
    const [partyIdOrg1, setpartyIdOrg1] = React.useState(false);


    React.useEffect(()=> {
        axios.get(SERVER_URL + "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" + partyRelationshipId, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response1 => {

            if(response1.data.orgPartyRelationResult[0]) {
                console.log("fffffffffddddddddddd",response1.data.orgPartyRelationResult[0])
                if(response1.data.orgPartyRelationResult[0].toPartyId !== "200154"){
                    setpartyIdOrg1(true)
                }


                setpartyIdOrg(response1.data.orgPartyRelationResult[0].toPartyId)
            }
        })

    },[])

    const getUnique = (array1)=>{
        var uniqueArray = [];

        // Loop through array values
        for(var value of array1){
            if(uniqueArray.indexOf(value) === -1){
                uniqueArray.push(value);
            }
        }
        return uniqueArray;
    }

    console.log("aojkvfajav" , props)
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
        if (!formData1.CompetenceCriterion) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            settitle(true)
            setskillCode(true)

        }
        console.log("cdddddddddddddddddddddddddd",title,skillCode)
        if (title === true || skillCode === true) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
            if (!formData1.CompetenceCriterion) {
                settitle(true)
                setskillCode(true)

            }
            if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.title === '') {
                settitle(true)
            }
            if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.skillCode === '') {
                setskillCode(true)
            }
            return null;
        } else {
            if (formData1 && formData1.CompetenceCriterion) {
                setccc2(true)
                if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.skillCode){
                    let yyyy=[];
                    console.log("tytytytytytytytytytytytytyty",skillCodesskills,formData1.CompetenceCriterion.skillCode)
                    // if(skillCodesskills) {
                        if (skillCodesskills && skillCodesskills.indexOf((formData1.CompetenceCriterion.skillCode).toString()) > -1) {
                            console.log("tytytytytytytytytytytytytyty", skillCodesskills, formData1.CompetenceCriterion.skillCode)
                            for (var i = 0; i < skillCodesskills1.length; i++) {
                                if (skillCodesskills[i] === formData1.CompetenceCriterion.skillCode) {
                                    yyyy.push(skillCodesskills1[i])
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
                    // }
                    else {

                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/Skill", {data : 
                            {
                                title: formData1.CompetenceCriterion.title,
                                skillCode: formData1.CompetenceCriterion.skillCode,
                                status: formData1.status ? (formData1.status === true ? "Y" : "N") : "",
                                companyPartyId: partyIdOrg,
                                parentSkillId:props.competenceModelIdGet

                            }}
                            , {
                                timeout: AXIOS_TIMEOUT,
                                headers: {
                                    'Content-Type': 'application/json',
                                    api_key: localStorage.getItem('api_key')
                                }
                            }).then(response => {
                            console.log("fffff78787", 2, formData1)
                            console.log("fffff78787", 3, response.data)
                            formData1.CompetenceCriterion.skillId = response.data.skillId
                            if(!formData1.status){
                                axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                                    {
                                        status:  "N" , 
                                        skillId : formData1.CompetenceCriterion.skillId
                                    }}
                                    , {
                                        timeout: AXIOS_TIMEOUT,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            api_key: localStorage.getItem('api_key')
                                        }
                                    }).then(response131231 => {
                                    if (typeof formData1.status != 'undefined') {
                                        currentData.result[competeCriteriaToEdit] = {
                                            ...currentData.result[competeCriteriaToEdit],
                                            status: formData1.status
                                        }
                                    }
                                    setCurrentData(Object.assign({}, currentData))
                                    setDisplay(false)
                                    setTimeout(()=>{
                                        setDisplay(true)
                                    },20)
                                })
                            }
                            if (formData1.CompetenceCriterion && formData1.CompetenceCriterion.CompanyRoleAdded
                                && formData1.CompetenceCriterion.CompanyRoleAdded.length > 0) {
                                console.log("formData1.CompetenceCriterion.CompanyRoleAdded", formData1.CompetenceCriterion.CompanyRoleAdded)
                                var data = [];
                                let arry = [];
                                formData1.CompetenceCriterion.CompanyRoleAdded.map((item, index) => {
                                    data.push({toSkillId: item})
                                })
                                let postdata = [];
                                let item;
                                for (var i = 0; i < data.length; i++) {
                                    item = {
                                        toSkillId: data[i].toSkillId,
                                        fromSkillId: formData1.CompetenceCriterion.skillId
                                    }
                                    postdata.push(item);
                                    // currentData.result[tableContent1.length].toSkillId.push.push(data[i].toSkillId);
                                    // setCurrentData(Object.assign({}, currentData))

                                }
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/SkillTag",
                                    {data : postdata}
                                    ,
                                    {
                                        timeout: AXIOS_TIMEOUT,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            api_key: localStorage.getItem('api_key')
                                        }
                                    }
                                ).then(response78787 => {
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                                    if(currentData.result[tableContent1.length]) {
                                        if (typeof currentData.result[tableContent1.length].toSkillId =='undefined') {
                                            currentData.result[tableContent1.length].toSkillId = [];
                                        }
                                    }
                                    // setCurrentData(Object.assign({}, currentData))

                                    // currentData.result[tableContent1.length] = {
                                    //     ...currentData.result[tableContent1.length],
                                    //     toSkillId: currentData.result[tableContent1.length].toSkillId.push(formData1.CompetenceCriterion.CompanyRoleAdded)
                                    // }
                                    for (var i=0;i<formData1.CompetenceCriterion.CompanyRoleAdded.length;i++){
                                        currentData.result[tableContent1.length].toSkillId.push(formData1.CompetenceCriterion.CompanyRoleAdded[i]);

                                    }
                                    console.log("ddddddd3333",currentData.result[tableContent1.length].toSkillId)
                                    setCurrentData(Object.assign({}, currentData))
                                    // setDisplay(false)
                                    // setTimeout(() => {
                                    //     setDisplay(true)
                                    // }, 20)

                                })

                                // currentData.result[tableContent1.length] = {
                                //     ...currentData.result[tableContent1.length],
                                //     toSkillId: formData1.CompetenceCriterion.CompanyRoleAdded
                                // }

                            }

                            // d = [formData1.CompetenceCriterion]

                            // currentData.result.push(d)
                            // setCurrentData(Object.assign({}, {
                            //     result:d
                            // }))

                            // if(!currentData.result[tableContent1.length]){
                            //     currentData.result[tableContent1.length] = {}
                            // }
                            if (typeof formData1.CompetenceCriterion.skillId != 'undefined') {
                                currentData.result[tableContent1.length] = {
                                    ...currentData.result[tableContent1.length],
                                    skillId: formData1.CompetenceCriterion.skillId
                                }
                            }

                            if (typeof formData1.CompetenceCriterion.title != 'undefined') {
                                currentData.result[tableContent1.length] = {
                                    ...currentData.result[tableContent1.length],
                                    title: formData1.CompetenceCriterion.title
                                }
                            }
                            if (typeof formData1.CompetenceCriterion.skillCode != 'undefined') {
                                currentData.result[tableContent1.length] = {
                                    ...currentData.result[tableContent1.length],
                                    skillCode: formData1.CompetenceCriterion.skillCode
                                }
                            }
                            if (typeof formData1.status != 'undefined') {
                                currentData.result[tableContent1.length] = {
                                    ...currentData.result[tableContent1.length],
                                    status: formData1.status
                                }
                            }
                            setCurrentData(Object.assign({}, currentData))
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                        })

                    }
                }




            }
            setcompeteCriteriaToEdit(-1)
            setEnableDisableCreate(false)
            // const newFormdata = Object.assign({}, formData);
            setFormData1({})
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
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
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);


    {
        if(props.dataCriteria5){
            console.log("fffffffffffffffffffffffffff",props.dataCriteria5)
            setdataCriteria7(props.dataCriteria5)
        }
    }



    React.useEffect(()=>{


        setcompetenceModelIdGet(props.competenceModelIdGet)



        axios.get(SERVER_URL + "/rest/s1/fadak/getskillsFromBaseCompany?" +
            "companyPartyId=200154" , {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response1277 => {
            console.log("fdddd433",response1277.data)
            let getAllTitles1=[];
            response1277.data.result.map((CompetenceModels, index) => {

                getAllTitles1.push({
                    title: CompetenceModels.title,
                    code: CompetenceModels.code
                })
            })
            setdataCriteria3(getAllTitles1)

            // currentData.dataCriteria3 = {getAllTitles1}


        })



        axios.get(SERVER_URL + "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" + partyRelationshipId, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(response1 => {

            console.log("fdddddddddddfffffff",props.competenceModelIdGet)
                if(props.competenceModelIdGet !== false) {
                    axios.get(SERVER_URL + "/rest/s1/fadak/getskillsCurrentBasedOnParent1?" +
                         "companyPartyId=" + response1.data.orgPartyRelationResult[0].toPartyId + "&parentSkillId=" + props.competenceModelIdGet
                        , {
                        headers: {
                            'api_key': localStorage.getItem('api_key')
                        },
                    }).then(response1233 => {

                        // setCurrentData(response1233.data)
                        setCurrentData(Object.assign({},currentData,response1233.data))
                        settoSkillIds(response1233.data.result1222)

                        console.log("response122424242", response1233.data, props.competenceModelIdGet, response1.data.orgPartyRelationResult[0].toPartyId)
                    })
                }

            if(response1.data.orgPartyRelationResult ) {
                if(response1.data.orgPartyRelationResult[0]) {
                    console.log("ffffffffff", response1.data.orgPartyRelationResult[0].toPartyId)
                    axios.get(SERVER_URL + "/rest/s1/fadak/getskills?companyPartyId=" + response1.data.orgPartyRelationResult[0].toPartyId
                        , {
                            headers: {
                                'api_key': localStorage.getItem('api_key')
                            },
                        }).then(response177979 => {
                        console.log("getAllTitlesgetAllTitles", response177979.data.result)
                        // setdataCriteria2(response177979.data.result)
                    })
                }
            }

            axios.get(SERVER_URL + "/rest/s1/fadak/getskillsCurrent1", {
                headers: {
                    'api_key': localStorage.getItem('api_key')
                },
            }).then(response12332222 => {

                console.log("dddddddd",response12332222)




            })





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

                // currentData.dataCriteria = {getAllTitles}

                // setCurrentData(Object.assign({},currentData,responsegetCompetenceCriterion.data))

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
    const [enablecancel111, setenablecancel111] = React.useState(false);
    const [enablecance22, setenablecance22] = React.useState(false);
    const [enablecance33, setenablecance33] = React.useState(false);

    const displayUpdateForm = (index) => {
        if(index === tableContent1.length && ccc2 === true){
            setenablecance33(true)
            setDisplay(false);
            // setTimeout(() => {
            //     setDisplay(true);
            //
            // },20);
        }
        if(index !== tableContent1.length && ccc2===true){
            setenablecance33(false)
            // setDisplay(false);
            // setTimeout(() => {
            //     setDisplay(true);
            //
            // },20);
        }
        if(currentData && currentData.result && currentData.result[index]){
            // setenablecance22(currentData.resultList[index].title)
            console.log("cvvvvcc",currentData)
            setenablecancel111(currentData.result[index].skillId)

        }
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

        if (typeof currentData != "undefined" && currentData.result ) {
            let rows = []
                console.log("currentDatacurrentData",currentData)
            currentData.result.map((CompetenceModel, index) => {
                let arr = [];


                axios.get(SERVER_URL + "/rest/s1/fadak/getSkillCodeOfSkills?companyPartyId=" + partyIdOrg + "&parentSkillId=" + CompetenceModel.parentSkillId, {
                    headers: {
                        'api_key': localStorage.getItem('api_key')
                    },
                }).then(response1434343 => {
                    console.log("response1434343",response1434343.data,partyIdOrg,CompetenceModel.parentSkillId)
                    setskillCodesskills(response1434343.data.result1)
                    setskillCodesskills1(response1434343.data.result2)

                })

                // if(currentData.result[index]){
                //     if(currentData.result[index].length === 0) {
                //         currentData.result[index].toSkillId=[];
                //     }
                // }
                const row1 = {
                    // id: partyRelation.relationship.partyRelationshipId,
                    id: index,
                    criterionCode: CompetenceModel.skillCode ? CompetenceModel.skillCode : '',
                    criterionTitle: CompetenceModel.title ? CompetenceModel.title  :'',
                    // criterionWeight: CompetenceModel.status ? CompetenceModel.status :'',
                    criterionWeight:
                        <FormControl>
                            {
                                console.log("CompetenceModel.title",CompetenceModel.status)
                            }
                            <FormControlLabel
                                control={<Switch name="status"
                                                 checked={(CompetenceModel.status === "N" || CompetenceModel.status === undefined) ? false : true}
                                />}
                                label="فعال"/>
                        </FormControl>
                    ,
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

        setskillCode(false)
        setskillCode1(false)
        settitle(false)
        settitle1(false)
        setcompeteCriteriaToEdit(-1)
        setDisplay(false)
        setFormData1({})
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
            if(typeof formData1.CompetenceCriterion.skillCode != "undefined"){
                formData1.CompetenceCriterion.skillCode = ''
            }
            if(typeof formData1.CompetenceCriterion.title != "undefined"){
                formData1.CompetenceCriterion.title = ''
            }
            if(typeof formData1.status != "undefined"){
                formData1.status = false
            }
            if(typeof formData1.CompetenceCriterion.CompanyRoleDeleted != "undefined"){
                formData1.CompetenceCriterion.CompanyRoleDeleted = ''
            }
            if(typeof formData1.CompetenceCriterion.CompanyRoleAdded != "undefined"){
                formData1.CompetenceCriterion.CompanyRoleAdded = ''
            }

        }

        setskillCode(false)
        setskillCode1(false)
        settitle(false)
        settitle1(false)
        const newFormdata = Object.assign({},formData1);
        setFormData1(newFormdata)
        setDisplay(false)
        setTimeout(()=>{
            setDisplay(true)
        },20)

    }


    const updateRow = (id) => {
        setaddrowss1(true)

        // if(formData1.CompetenceCriterion &&formData1.CompetenceCriterion.title && (formData1.CompetenceCriterion.title.trim()) === ''){
        //     settitle(true)
        // }
        // else {
        //     settitle(false)
        //
        // }
        if(competeCriteriaToEdit !== -1 && currentData &&  currentData.result[competeCriteriaToEdit] ){

            if(typeof currentData.result[competeCriteriaToEdit].skillCode =='undefined'
                ){
                console.log("fffffffffdddddddddd", formData1,currentData.result[competeCriteriaToEdit])
                if( (!formData1.CompetenceCriterion || (formData1.CompetenceCriterion &&
                    typeof formData1.CompetenceCriterion.skillCode == 'undefined'))) {
                    console.log("fffffffffdddddddddd", formData1)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
                    setskillCode(true)
                    setskillCode1(true)
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 2000)
                }
            } else {
                if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.skillCode&& (formData1.CompetenceCriterion.skillCode).trim() === '') {
                    setskillCode(true)
                    setskillCode1(true)
                }
            }
            if(typeof currentData.result[competeCriteriaToEdit].title == 'undefined'
                && (!formData1.CompetenceCriterion || (formData1.CompetenceCriterion
                && !formData1.CompetenceCriterion.title))){
                console.log("fffffffffdddddddddd",formData1)
                settitle(true)
                settitle1(true)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));

            }else {
                if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.title&& (formData1.CompetenceCriterion.title).trim() === '') {
                    settitle(true)
                    settitle1(true)
                }
            }
            console.log("fffffffffdddddddddd",formData1,skillCode,skillCode1,title1,title,currentData.result[competeCriteriaToEdit])
        }
        if(!formData1.CompetenceCriterion){
            if(competeCriteriaToEdit !== -1 && currentData &&  currentData.result[competeCriteriaToEdit] ){

                if(typeof currentData.result[competeCriteriaToEdit].skillCode =='undefined'
                ){
                    // console.log("fffffffffdddddddddd", formData1,currentData.result[competeCriteriaToEdit])
                    // if( (!formData1.CompetenceCriterion || (formData1.CompetenceCriterion &&
                    //     typeof formData1.CompetenceCriterion.skillCode == 'undefined'))) {
                    //     console.log("fffffffffdddddddddd", formData1)
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
                        setskillCode(true)
                        setskillCode1(true)
                    //     setDisplay(false)
                    //     setTimeout(() => {
                    //         setDisplay(true)
                    //     }, 2000)
                    // }
                }
                // else {
                //     if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.skillCode&& (formData1.CompetenceCriterion.skillCode).trim() === '') {
                //         setskillCode(true)
                //         setskillCode1(true)
                //     }
                // }
                        // if(typeof currentData.result[competeCriteriaToEdit].title == 'undefined'
                        //     && (!formData1.CompetenceCriterion || (formData1.CompetenceCriterion
                        //         && !formData1.CompetenceCriterion.title))){
                        //     console.log("fffffffffdddddddddd",formData1)
                        //     settitle(true)
                        //     settitle1(true)
                        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
                        //
                        // }else {
                        //     if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.title&& (formData1.CompetenceCriterion.title).trim() === '') {
                        //         settitle(true)
                        //         settitle1(true)
                        //     }
                        // }
                console.log("fffffffffdddddddddd",formData1,skillCode,skillCode1,title1,title,currentData.result[competeCriteriaToEdit])
            }
        }
        if(formData1.CompetenceCriterion || formData1.status){
            if(competeCriteriaToEdit !== -1 && currentData &&  currentData.result[competeCriteriaToEdit] ){
                if(typeof currentData.result[competeCriteriaToEdit].skillCode =='undefined'
                ){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));
                    setskillCode(true)
                    setskillCode1(true)

                }
            }
        }
        if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.skillCode&& (formData1.CompetenceCriterion.skillCode).trim() === '') {
            setskillCode(true)
            setskillCode1(true)
        }
        if (formData1.CompetenceCriterion &&formData1.CompetenceCriterion.title&& (formData1.CompetenceCriterion.title).trim() === '') {
            settitle(true)
            settitle1(true)
        }
        if(title=== true || title1 === true || skillCode=== true || skillCode1 === true){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید فیلدهای ضروری تکمیل شوند'));

        }
        else
        {

            {
                settitle(false)
                settitle1(false)
                setskillCode(false)
                setskillCode1(false)
                console.log("dsdddddddd4541111", formData1.status)
                if(!formData1.status){
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
                        if (typeof formData1.status != 'undefined') {
                            currentData.result[competeCriteriaToEdit] = {
                                ...currentData.result[competeCriteriaToEdit],
                                status: formData1.status
                            }
                        }
                        setCurrentData(Object.assign({}, currentData))
                        setDisplay(false)
                        setTimeout(()=>{
                            setDisplay(true)
                        },20)
                    })
                }
                if(typeof formData1.status !='undefined'){
                    // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                    if(formData1.status === true){
                        formData1.status = "Y"
                    }else if(formData1.status === false || formData1.status === undefined) {
                        formData1.status = "N"
                    }
                    // if(!currentData.result[competeCriteriaToEdit].status){
                    //     currentData.result[competeCriteriaToEdit] =[]
                    // }


                    axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill"  , {data : 
                        {
                            status: formData1.status  ,
                            skillId : id
                        }}
                        , {
                            timeout: AXIOS_TIMEOUT,
                            headers: {
                                'Content-Type': 'application/json',
                                api_key: localStorage.getItem('api_key')
                            }
                        }).then(response131231 => {
                        console.log("dsdddddddd", response131231.data)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                        // if(!currentData.result[competeCriteriaToEdit].status){
                        //     currentData.result[competeCriteriaToEdit] =[]
                        // }
                        if (typeof formData1.status != 'undefined') {
                            currentData.result[competeCriteriaToEdit] = {
                                ...currentData.result[competeCriteriaToEdit],
                                status: formData1.status
                            }
                            setCurrentData(Object.assign({}, currentData))
                            setDisplay(false)
                            setTimeout(() => {
                                setDisplay(true)
                            }, 2000)
                        }
                        // if (typeof formData1.status != 'undefined') {
                        //     currentData.result[competeCriteriaToEdit] = {
                        //         ...currentData.result[competeCriteriaToEdit],
                        //         status: formData1.status
                        //     }
                        // }
                    })
                }
                console.log("dsdddddddd4541111", competeCriteriaToEdit)

                if (formData1.CompetenceCriterion) {
                    setaddrowss1(false)
                        if (formData1.CompetenceCriterion.skillCode) {
                            console.log("gggggggggg",1)
                            let yyyy = [];
                            if (skillCodesskills.indexOf(formData1.CompetenceCriterion.skillCode) > -1) {
                                console.log("gggggggggg",1)
                                for (var i = 0; i < skillCodesskills1.length; i++) {
                                    console.log("gggggggggg",1)
                                    if (skillCodesskills[i] === formData1.CompetenceCriterion.skillCode) {
                                        console.log("gggggggggg",1)
                                        yyyy.push(skillCodesskills1[i])
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
                            } else {
                                console.log("gggggggggg",1)

                                // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                                console.log("ffffffff789789789", formData1.CompetenceCriterion.skillCode)

                                axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                                    {
                                        skillCode: formData1.CompetenceCriterion.skillCode,
                                        skillId : id
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
                                    if (typeof formData1.CompetenceCriterion.skillCode != 'undefined') {
                                        console.log("gggggggggg",1)

                                        currentData.result[competeCriteriaToEdit] = {
                                            ...currentData.result[competeCriteriaToEdit],
                                            skillCode: formData1.CompetenceCriterion.skillCode
                                        }
                                        setCurrentData(Object.assign({}, currentData))

                                    }
                                })
                            }
                        }

                    if(formData1.CompetenceCriterion.CompanyRoleDeleted || formData1.CompetenceCriterion.CompanyRoleAdded || formData1.CompetenceCriterion.title) {
                        console.log("gggggggggg",1)

                        // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

                        var parent1 =  '';

                        console.log("ssdffffffff",id)
                        if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.CompanyRoleDeleted
                            && formData1.CompetenceCriterion.CompanyRoleDeleted.length > 0) {
                            console.log("ssdffffffff333", typeof formData1.CompetenceCriterion.CompanyRoleDeleted,typeof formData1.CompetenceCriterion.CompanyRoleDeleted[0])
                            console.log("ssdffffffff333", formData1.CompetenceCriterion.CompanyRoleDeleted, formData1.CompetenceCriterion.CompanyRoleDeleted[0])
                            console.log("ssdffffffff", formData1.CompetenceCriterion.CompanyRoleDeleted, ccc2, competeCriteriaToEdit,tableContent1.length)
                            if (currentData.result[competeCriteriaToEdit] && currentData.result[competeCriteriaToEdit].toSkillId) {
                                // if (ccc2 === true && competeCriteriaToEdit === (tableContent1.length -1) && props.addrowss365 !== true) {
                                    // if (props.addrowss365 === true || (ccc2 === true && competeCriteriaToEdit !== tableContent1.length && enablecance33 === true)) {
                                    console.log("ssdffffffff", formData1.CompetenceCriterion.CompanyRoleDeleted)
                                    {
                                        console.log("ssdffffffff", formData1.CompetenceCriterion.CompanyRoleDeleted)
                                        formData1.CompetenceCriterion.CompanyRoleDeleted.map((item, index) => {

                                            // data.push({code:item})
                                            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/SkillTag?fromSkillId=" + id + "&toSkillId=" + item, {
                                                headers: {
                                                    'api_key': localStorage.getItem('api_key')
                                                },
                                            })
                                                .then(res2222 => {
                                                    // if (props.addrowss365 === true || (ccc2 === true && competeCriteriaToEdit !== tableContent1.length)) {
                                                        setcc1(props.addrowss365)
                                                        setccc6(true)
                                                        setDisplay(false)
                                                        setTimeout(() => {
                                                            setDisplay(true)
                                                        }, 2000)
                                                        for (var i = 0; i < currentData.result[competeCriteriaToEdit].toSkillId.length; i++) {
                                                            console.log("dsdddddddd44333", currentData.result[competeCriteriaToEdit].toSkillId)
                                                            if (currentData.result[competeCriteriaToEdit].toSkillId[i] === item.toString()) {
                                                                console.log("dsdddddddd44333", item)
                                                                var spliced = currentData.result[competeCriteriaToEdit].toSkillId.splice(i, 1);
                                                                console.log("dsdddddddd44333", spliced)
                                                            }

                                                        }
                                                    // }
                                                })

                                        })
                                    }
                                // }
                            }
                        }
                        setFormData1({})
                        const _currentData = Object.assign({}, currentData)
                        // setCurrentData(false);
                        setTimeout( () => {
                            setCurrentData(_currentData);
                        }, 20)

                        if(formData1.CompetenceCriterion && formData1.CompetenceCriterion.CompanyRoleAdded
                            && formData1.CompetenceCriterion.CompanyRoleAdded.length > 0) {
                            console.log("formData1.CompetenceCriterion.CompanyRoleAdded",formData1.CompetenceCriterion.CompanyRoleAdded)
                            var data = [];
                            let arry=[];
                            formData1.CompetenceCriterion.CompanyRoleAdded.map( (item, index) => {
                                data.push({toSkillId:item})
                            })
                            if(!currentData.result[competeCriteriaToEdit].toSkillId) {
                                currentData.result[competeCriteriaToEdit].toSkillId=[];
                            }
                            let skilltags = []
                            for (var i=0;i<data.length;i++){

                                currentData.result[competeCriteriaToEdit].toSkillId.push(data[i].toSkillId);
                                setCurrentData(Object.assign({}, currentData))
                                setDisplay(false)
                                setTimeout(() => {
                                    setDisplay(true)
                                }, 200)
                                console.log("ggggggggggggggggg",currentData.result[competeCriteriaToEdit])
                                skilltags.push({
                                    toSkillId:data[i].toSkillId,
                                    fromSkillId:id
                                })

                            }
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/SkillTag" ,
                                {data : skilltags}
                                ,
                                {
                                    timeout: AXIOS_TIMEOUT,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        api_key: localStorage.getItem('api_key')
                                    }
                                }
                            ).then(response78787 => {
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                            })
                            console.log("AAAAA", currentData.result[competeCriteriaToEdit].toSkillId);
                        }



                        if(formData1.CompetenceCriterion.title){
                            console.log("ffffffff789789789",formData1.CompetenceCriterion.title)
                            axios.patch(SERVER_URL + "/rest/s1/fadak/entity/Skill" , {data : 
                                {
                                    title: formData1.CompetenceCriterion.title,
                                    skillId : id
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
                                if (typeof formData1.CompetenceCriterion.title != 'undefined') {
                                    currentData.result[competeCriteriaToEdit] = {
                                        ...currentData.result[competeCriteriaToEdit],
                                        title: formData1.CompetenceCriterion.title
                                    }
                                    setCurrentData(Object.assign({}, currentData))

                                }

                            })
                        }


                    }
                    setDisplay(false)
                    setTimeout(() => {
                        setDisplay(true)
                    }, 20)
                    // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));

                }

            }
            setDisplay(false)
            setTimeout(() => {
                setDisplay(true)
            }, 20)
            setFormData1({})
            // props.setexpandedAccor(false)
            setparentCriterionId(false)
            setcriterionRateEnumId(false)
            setcriterionTitle(false)
            setcriterionCode(false)
            setcompeteCriteriaToEdit(-1)
            setEnableDisableCreate(false)
            // props.setEnableDisableCreate(false)
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


    React.useEffect(()=>{

    },[dataCriteria2]);
    React.useEffect(()=>{

    },[toSkillIds]);
    React.useEffect(()=>{

    },[enablecancel111]);
    React.useEffect(()=>{
    },[title1,skillCode,skillCode1,title,partyIdOrg1]);
    React.useEffect(()=>{
    },[enablecance22]);
    React.useEffect(()=>{
    },[dataCriteria4]);

    React.useEffect(()=>{
    },[dataCriteria7]);
    React.useEffect(()=>{
        setcc1(props.addrowss365)
    },[cc1]);
    React.useEffect(()=>{
    },[ccc2]);
    React.useEffect(()=>{
    },[ccc6]);
    React.useEffect(()=>{
        if(competeCriteriaToEdit !== -1) {
            // if (competeCriteriaToEdit === tableContent1.length && ccc2 === true){
            //     setenablecance33(true)
            // }
            // if(competeCriteriaToEdit !== tableContent1.length ){
            //     setenablecance33(false)
            // }
                }
    },[enablecance33]);

    React.useEffect(()=>{
    },[skillCodesskills1]);
    React.useEffect(()=>{
    },[skillCodesskills]);

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
                                           dataCriteria2={dataCriteria2}
                                           addrows1={addrowss1} toSkillIds={toSkillIds} enablecancel111={enablecancel111}
                                           skillCode ={skillCode} skillCode1={skillCode1} setskillCode1={setskillCode1} setskillCode={setskillCode}
                                           title={title} title1={title1} settitle={settitle} settitle1={settitle1}
                                           dataCriteria3={dataCriteria3} enablecance22={enablecance22}
                                           setdataCriteria3={setdataCriteria3} dataCriteria4={dataCriteria4}
                                           dataCriteria7={dataCriteria7} partyIdOrg1={partyIdOrg1} cc1={cc1} ccc2={ccc2}
                                           skillCodesskills={skillCodesskills}
            />}
        </Grid>

    );
}

export default Tables;