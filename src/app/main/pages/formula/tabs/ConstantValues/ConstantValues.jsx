import React from 'react';
import ConstantValuesForm from './ConstantValuesForm';
import { useEffect, useState } from 'react';
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import {useSelector} from "react-redux";
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useDispatch} from 'react-redux'
import { isEmpty } from 'lodash';

const ConstantValues = () => {
    //use dispatch to show alerts 
    const dispatch = useDispatch();
    //set value of the form field that user input
    const [formData, setFormData] = React.useState({})
    const addFormData = setFormDataHelper(setFormData);
    //axios headers definition
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }
    //user login information
    const contentIdFormData = new FormData()
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    //data of Enum entity
    const[data,setData]=useState()
    // for checking necessary field
    const[style , setStyle]=useState({
        "creatorEmplPositionId" : true ,
        "typeOfConstantValues": true ,
        "title" : true ,
    })
    //data of dataBase except Enum entity
    const [currentData,setCurrentData]=useState({deleteTableRow : -1 , editedTableRow : -1 })
    //reset name of input file when cancel clicked
    const[handleInputFile,setHandleInputFile]=useState()
    //handle disabled condition in edit mode
    const [editSituation,setEditSituation]=useState(false)
    //table state
    const[tableContent , setTableContent]=useState([])
    //handle table show
    const[loading , setLoading]=useState(true)
    //previousData in edit mode for handle create in edit mode
    const[previousData,setPreviousData]=useState({})
    //edited data handle
    const[editInfo,setEditInfo]=React.useState();
    //handle creating situation
    const[firstTimeCreate,setFirstTimeCreate]=useState(false)
    //handle data createed by editing 
    const[updateInlineData,setUpdateInlineData]=useState([])
    //change dataBase information after edit
    const[postUpdateInline,setPostUpdateInline]=useState(false)
    //position of creator if other accounts want see the detail
    const [creatorPosition,setCreatorPosition]=useState({})
    //handle button situation of form and handle functions
    const[handleButton,setHandleButton]=useState(false)
    //edited Version
    const[editCopy,setEditCopy]=useState()
    const[companyId , setCompanyId]=React.useState();
    const [showFoem,setShowForm] = useState(false)
    const [inlineTableContent, setInlineTableContent] = React.useState([]);
    const [storeInlineTableContent , setStoreInlineTableContent] = React.useState([]);
    const [errorStyle,setErrorStyle] = React.useState({invThruData : false , overlapThurDate : false , overlapFromDate : false});
    //------------------------------------>get data from dataBase<-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Person?partyId=" + partyId , axiosKey)
            .then((getFullName)=>{
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship/?partyRelationshipId=" + partyRelationshipId, axiosKey)
                    .then(getToParty=> {
                        const toParty =getToParty.data.result[0].toPartyId
                        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Organization?partyId=" + toParty, axiosKey)
                            .then(getCompanyPartyId=>{
                                axios.get(SERVER_URL + `/rest/s1/fadak/OrganizationInformationTable?partyId=${partyId}&partyRelationshipId=${partyRelationshipId} ` , axiosKey)
                                    .then((userPositions)=>{
                                        let positionsId=[]
                                        userPositions.data.Info.map((item)=>{
                                            if(!item.thruDate || item.thruDate==""){
                                                positionsId.push(item.emplPositionId)
                                            }
                                        })
                                        axios.get(SERVER_URL + "/rest/s1/fadak/entity/EmplPosition?emplPositionId=" , axiosKey)
                                            .then(emplPositionId=>{
                                                let positionsInformation=[]
                                                positionsId.map((positions , index)=>{
                                                    emplPositionId.data.result.map((id)=>{
                                                        if(positions==id.emplPositionId){
                                                            positionsInformation[index]={
                                                                positionId : id.emplPositionId ,
                                                                positionName : id.description
                                                            }
                                                        }
                                                    })
                                                })
                                                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=ConstantType" , axiosKey)
                                                    .then(getTypeOfConstantValues=>{
                                                        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant" , axiosKey)
                                                            .then((getCurrentData)=>{
                                                                setCurrentData(prevState => ({
                                                                    ...prevState,
                                                                    fullName :  `${getFullName?.data?.result[0]?.firstName || ''} ${ getFullName?.data?.result[0]?.lastName || ""} ${ getFullName?.data?.result[0]?.suffix || ""}`  ,
                                                                    companyName : getCompanyPartyId.data.result[0].organizationName ,
                                                                    positionsInformation :positionsInformation ,
                                                                    companyPartyId : getCompanyPartyId.data.result[0].partyId ,
                                                                    userInformation : getCurrentData.data.result
                                                                  }))
                                                                  setData(Object.assign({},data,{typeOfConstantValues: getTypeOfConstantValues.data.result}))
                                                            })
                                                    })
                                            })
                                    })
                            })
                    }) 
            })
    },[])
    //------------------------------------>show information that posted before in the table and also is used for show updated information by user<-----------------------------------------------------------------------------------------------
    useEffect (()=>{
        if(loading )
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
            .then(companyId=>{
                setCompanyId(companyId.data.partyId)
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant?companyPartyId=" + companyId.data.partyId , axiosKey)
                    .then((getCurrentData)=>{
                        setTableContent(getCurrentData.data.result)
                        setLoading(false)
                        if(firstTimeCreate ){
                            informationOfEditedRow(getCurrentData.data.result[getCurrentData.data.result.length-1])
                        }
                    })
            })
    },[loading])
    //------------------------------------>the purpose of this section is determined the value of constantType version and it changes by changing the constantType (copy is filled systematically)<-----------------------------------------------
    useEffect(()=>{
        if ( currentData ){
            if(!editInfo){
                setCurrentData(Object.assign({},currentData,{copy : 1}))
            }
        }
    },[formData?.typeOfConstantValues?.enumId,editInfo??""])
    //------------------------------------>add form data that filled by user in the table and show them and post the information to the "Constant" entity<----------------------------------------------------------------------------------------
    const setDataToTable =(()=>{
        let necesseryFields = ["creatorEmplPositionId","typeOfConstantValues","title"]
        let necesseryFieldCheck=[]
        necesseryFields.map((item , index)=>{
            if ((!formData) || (!formData[item]) || (formData && formData[item] && formData[item]==null)) {
                    necesseryFieldCheck.push(item)
                }
        })
        if(necesseryFieldCheck.length >0){
            setStyle((preState)=>({...preState,
                creatorEmplPositionId : (formData && formData.creatorEmplPositionId && formData.creatorEmplPositionId != null)? true : false ,
                typeOfConstantValues : (formData && formData.typeOfConstantValues && formData.typeOfConstantValues != null)? true : false,
                title : (formData && formData.title && formData.title != null)? true : false,
                
            }))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید'));
            return null
        }
        if(new Date(formData.fromDate).getTime() >= new Date(formData.thruDate).getTime()){
            setErrorStyle((preState)=>({...preState , invThruData : true}))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فيلد " تا تاريخ " صحيح وارد نشده است'));
            return null
        }
        formData.fromDate = formData.fromDate ??  ""
        formData.thruDate = formData.thruDate ??  ""
        if (tableContent.length>0){
            let failDate=[]
            tableContent.map((dateitem,dateIndex)=>{
                if (dateitem.archive==="N" && dateitem.constantTypeEnumId===formData?.typeOfConstantValues?.enumId  && dateitem.companyPartyId==companyId){
                    const formFromDateDay = (new Date (formData.fromDate)).getDate()
                    const formFromDateMonth = (new Date (formData.fromDate)).getMonth()
                    const formFromDateYear = (formData.fromDate && formData.fromDate != "") ?( new Date (formData.fromDate)).getFullYear() : Math.log(0)
                    const formThruDateDay = (new Date (formData.thruDate)).getDate()
                    const formThruDateMonth = (new Date (formData.thruDate)).getMonth()
                    const formThruDateYear = (formData.thruDate && formData.thruDate != "") ?(new Date (formData.thruDate)).getFullYear() : Infinity
                    const dataBaseThruDateDay = (new Date (dateitem.thruDate)).getDate()
                    const dataBaseThruDateMonth = (new Date (dateitem.thruDate)).getMonth()
                    const dataBaseThruDateYear = (new Date (dateitem.thruDate)).getFullYear()
                    const dataBaseFromDateDay = (new Date (dateitem.fromDate)).getDate()
                    const dataBaseFromDateMonth = (new Date (dateitem.fromDate)).getMonth()
                    const dataBaseFromDateYear = (new Date (dateitem.fromDate)).getFullYear()
                    if (formFromDateYear-dataBaseThruDateYear>0 ? true : (formFromDateYear-dataBaseThruDateYear==0 ? (formFromDateMonth-dataBaseThruDateMonth>0 ? true : (formFromDateMonth-dataBaseThruDateMonth==0 ? (formFromDateDay-dataBaseThruDateDay>0 ? true : false):false)) : false) || (dataBaseFromDateYear-formThruDateYear>0 ? true : (dataBaseFromDateYear-formThruDateYear==0 ? (dataBaseFromDateMonth-formThruDateMonth>0 ? true : (dataBaseFromDateMonth-formThruDateMonth==0 ? (dataBaseFromDateDay-formThruDateDay>0 ? true : false):false)) : false))){
                    
                    }
                    else{
                        setErrorStyle((preState)=>({...preState , overlapThurDate : true , overlapFromDate : true}))
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بازه تاریخ انتخاب شده با سایر رکورد ها دارای همپوشانی است'));
                        failDate.push("formFromDateDay")
                        return null
                    }
                }
                if(dateIndex == tableContent.length-1 && failDate.length==0){
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
                    if( formData?.attachedFile?.contentLocation ){
                        contentIdFormData.append("file", formData.attachedFile.contentLocation)
                        axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                            .then(response => {
                                let newRowData = {
                                    creatorEmplPositionId : formData.creatorEmplPositionId.positionId ,
                                    creatorPartyId : partyId ,
                                    title : formData?.title , 
                                    constantTypeEnumId : formData?.typeOfConstantValues?.enumId , 
                                    companyPartyId : currentData.companyPartyId ,
                                    createDate :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                                    copy : 1 ,
                                    description : formData?.description ,
                                    contentLocation : (response) ? response.data.name : '' ,
                                    archive : "N" ,
                                    relationCode : new Date().valueOf() ,
                                    fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                                    thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : ""
                                }
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : newRowData} , axiosKey)
                                    .then((res)=>{
                                        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant"  , axiosKey)
                                        .then((res)=>{
                                            setFirstTimeCreate(true)
                                            setLoading(true)
                                            setEditSituation(true)
                                            setEditInfo(res.data.result[res.data.result.length-1])
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                        })
                                    }).catch(err => {
                                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                                    })
                                
                            }).catch(()=>{
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                            })
                    }
                    if (!formData.attachedFile){
                        let newRowData = {
                            creatorEmplPositionId : formData.creatorEmplPositionId.positionId ,
                            creatorPartyId : partyId ,
                            title : formData?.title , 
                            constantTypeEnumId : formData?.typeOfConstantValues?.enumId , 
                            companyPartyId : currentData.companyPartyId ,
                            createDate : formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime())  ,
                            copy : 1 ,
                            description : formData?.description ,
                            contentLocation : '' , 
                            archive : "N" ,
                            relationCode : new Date().valueOf(),
                            fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                            thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : ""
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : newRowData} , axiosKey)
                        .then(()=>{
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant"  , axiosKey)
                            .then((res)=>{
                                setLoading(true)
                                setFirstTimeCreate(true)
                                setEditSituation(true)
                                setEditInfo(res.data.result[res.data.result.length-1])
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                            })
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                        })
                    }
                setFormData({})
                setHandleButton(true)
                    setStyle((preState)=>({...preState,
                        "creatorEmplPositionId" : true ,
                        "typeOfConstantValues": true ,
                        "title" : true ,
                    }))
                    setErrorStyle((preState)=>({...preState,
                        invThruData : false , overlapThurDate : false , overlapFromDate : false
                    }))
                }
            })
        }
        if (tableContent.length==0){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
            if( formData?.attachedFile?.contentLocation ){
                contentIdFormData.append("file", formData.attachedFile.contentLocation)
                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                    .then(response => {
                        let newRowData = {
                            creatorEmplPositionId : formData.creatorEmplPositionId.positionId ,
                            creatorPartyId : partyId ,
                            title : formData?.title , 
                            constantTypeEnumId : formData?.typeOfConstantValues?.enumId , 
                            companyPartyId : currentData.companyPartyId ,
                            createDate :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                            copy : 1 ,
                            description : formData?.description ,
                            contentLocation : (response) ? response.data.name : '' ,
                            archive : "N" ,
                            relationCode : new Date().valueOf() ,
                            fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                            thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : ""
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , { data : newRowData} , axiosKey)
                            .then((res)=>{
                                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant"  , axiosKey)
                                .then((res)=>{
                                    setFirstTimeCreate(true)
                                    setLoading(true)
                                    setEditSituation(true)
                                    setEditInfo(res.data.result[res.data.result.length-1])
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                })
                            }).catch(err => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                            })
                        
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                    })
            }
            if (!formData.attachedFile){
                let newRowData = {
                    creatorEmplPositionId : formData.creatorEmplPositionId.positionId ,
                    creatorPartyId : partyId ,
                    title : formData?.title , 
                    constantTypeEnumId : formData?.typeOfConstantValues?.enumId , 
                    companyPartyId : currentData.companyPartyId ,
                    createDate : formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime())  ,
                    copy : 1 ,
                    description : formData?.description ,
                    contentLocation : '' , 
                    archive : "N" ,
                    relationCode : new Date().valueOf(),
                    fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                    thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : ""
                }
                axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : newRowData} , axiosKey)
                .then(()=>{
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant"  , axiosKey)
                    .then((res)=>{
                        setLoading(true)
                        setFirstTimeCreate(true)
                        setEditSituation(true)
                        setEditInfo(res.data.result[res.data.result.length-1])
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                    })
                }).catch(err => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                })
            }
            setFormData({})
            setHandleButton(true)
            setStyle((preState)=>({...preState,
                "creatorEmplPositionId" : true ,
                "typeOfConstantValues": true ,
                "title" : true ,
            }))
            setErrorStyle((preState)=>({...preState,
                invThruData : false , overlapThurDate : false , overlapFromDate : false
            }))
        }

    })
    //------------------------------------>confirm created data and able to fill inline table and also used for create new data in editing mode<--------------------------------------------------------------------------------------------------
    const confirm =(index) =>{
        if(!firstTimeCreate){
            if(!formData.attachedFile && !formData.title && !formData.description && !formData.fromDate && !formData.thruDate){
                if(inlineTableContent.length == storeInlineTableContent.length){
                    let upData=[]
                    if(storeInlineTableContent.length>0){
                        storeInlineTableContent.map((item,index)=>{
                            const ind = inlineTableContent.findIndex(i=> i.constantValueId == item.constantValueId )
                            if(ind>-1){
                                if(inlineTableContent[ind].value != item.value || inlineTableContent[ind].faTitle != item.faTitle){
                                    upData.push(ind)
                                }
                            }
                            else{
                                upData.push(ind)
                            }
                            if(index == storeInlineTableContent.length-1){
                                if(upData.length == 0){
                                    cancel()
                                }
                                else {
                                    confirmEditInfo()
                                }
                            }
                        })
                    }
                    else{
                        cancel()
                    }
                }
                else {
                    confirmEditInfo()
                }
            }
            else {
                confirmEditInfo()
            }
        }
        else {
            confirmEditInfo()
        }
    }
    const confirmEditInfo = ()=>{
        let necesseryFields = ["creatorEmplPositionId","title"]
        let necesseryFieldCheck=[]
        formData.fromDate = formData.fromDate ?? editInfo.fromDate ?? ""
        formData.thruDate = formData.thruDate ?? editInfo.thruDate ?? ""
        formData.creatorEmplPositionId = formData.creatorEmplPositionId ?? editInfo.creatorEmplPositionId ?? ""
        formData.typeOfConstantValues = formData.typeOfConstantValues ?? editInfo.constantTypeEnumId ?? ""
        formData.title = formData.title ?? editInfo.title ?? ""
        necesseryFields.map((item , index)=>{
            if ((!formData) || (!formData[item]) || (formData && formData[item] && formData[item]==null)) {
                necesseryFieldCheck.push(item)
            }
        })
        if(necesseryFieldCheck.length >0){
            setStyle((preState)=>({...preState,
                creatorEmplPositionId : (formData && formData.creatorEmplPositionId && formData.creatorEmplPositionId != null)? true : false ,
                typeOfConstantValues : (formData && formData.typeOfConstantValues && formData.typeOfConstantValues != null)? true : false,
                title : (formData && formData.title && formData.title != null)? true : false,
            }))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید'));
            return null
        }
        if(new Date(formData.fromDate).getTime() >= new Date(formData.thruDate).getTime()){
            setErrorStyle((preState)=>({...preState , invThruData : true}))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فيلد " تا تاريخ " صحيح وارد نشده است'));
            return null
        }
        let failDate=[]
        tableContent.map((dateitem,dateIndex)=>{
            if (dateitem.archive==="N" && dateitem.constantTypeEnumId===editInfo?.constantTypeEnumId && dateitem.constantId != editInfo.constantId  && dateitem.companyPartyId==companyId){
                const formFromDateDay = (new Date (formData.fromDate)).getDate()
                const formFromDateMonth = (new Date (formData.fromDate)).getMonth()
                const formFromDateYear = (formData.fromDate && formData.fromDate != "") ?( new Date (formData.fromDate)).getFullYear() : Math.log(0)
                const formThruDateDay = (new Date (formData.thruDate)).getDate()
                const formThruDateMonth = (new Date (formData.thruDate)).getMonth()
                const formThruDateYear = (formData.thruDate && formData.thruDate != "") ?(new Date (formData.thruDate)).getFullYear() : Infinity
                const dataBaseThruDateDay = (new Date (dateitem.thruDate)).getDate()
                const dataBaseThruDateMonth = (new Date (dateitem.thruDate)).getMonth()
                const dataBaseThruDateYear = (new Date (dateitem.thruDate)).getFullYear()
                const dataBaseFromDateDay = (new Date (dateitem.fromDate)).getDate()
                const dataBaseFromDateMonth = (new Date (dateitem.fromDate)).getMonth()
                const dataBaseFromDateYear = (new Date (dateitem.fromDate)).getFullYear()
                if (formFromDateYear-dataBaseThruDateYear>0 ? true : (formFromDateYear-dataBaseThruDateYear==0 ? (formFromDateMonth-dataBaseThruDateMonth>0 ? true : (formFromDateMonth-dataBaseThruDateMonth==0 ? (formFromDateDay-dataBaseThruDateDay>0 ? true : false):false)) : false) || (dataBaseFromDateYear-formThruDateYear>0 ? true : (dataBaseFromDateYear-formThruDateYear==0 ? (dataBaseFromDateMonth-formThruDateMonth>0 ? true : (dataBaseFromDateMonth-formThruDateMonth==0 ? (dataBaseFromDateDay-formThruDateDay>0 ? true : false):false)) : false))){

                }
                else{
                    setErrorStyle((preState)=>({...preState , overlapThurDate : true , overlapFromDate : true}))
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بازه تاریخ انتخاب شده با سایر رکورد ها دارای همپوشانی است'));
                    failDate.push(formFromDateDay)
                    return null
                }

            }
            if(dateIndex==tableContent.length-1 && failDate.length==0){
                dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
                if (formData.attachedFile && formData.attachedFile.contentLocation) {
                    contentIdFormData.append("file", formData.attachedFile.contentLocation)
                    axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                        .then(response => {
                            let updatedData={
                                creatorEmplPositionId : (formData.description) ?? editInfo.creatorEmplPositionId ,
                                creatorPartyId : partyId ,
                                title : (formData.title) ? formData.title : editInfo.title , 
                                constantTypeEnumId : editInfo.constantTypeEnumId, 
                                companyPartyId : editInfo.companyPartyId ,
                                createDate : formData?.createDate ? Math.round(new Date(formData.createDate).getTime())  : editInfo.createDate ,
                                copy : editInfo.copy ,
                                description : (formData.description) ? formData.description : editInfo.description ,
                                contentLocation : (response) ? response.data.name : editInfo.contentLocation ,
                                archive : editInfo.archive ,
                                relationCode : editInfo.relationCode ,
                                fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : (editInfo.fromDate ? Math.round(new Date(editInfo.fromDate).getTime())  :"") ,
                                thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : (editInfo.fromDate ? Math.round(new Date(editInfo.fromDate).getTime()) :"")
                            }
                            if(!handleButton){
                                let postData={...updatedData , archive:"N" , copy : editCopy }
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : postData}, axiosKey)
                                    .then(()=>{
                                        var putRows
                                        tableContent.map((item,index)=>{
                                            if(item.relationCode==updatedData.relationCode){
                                                let putData={...item,archive:"Y"}
                                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : putData }  , axiosKey)
                                                clearTimeout(putRows)
                                                putRows=setTimeout(()=>{
                                                    setCreatorPosition({})
                                                    setEditInfo()
                                                    setFirstTimeCreate(false)
                                                    setLoading(true)
                                                    setEditSituation(false)
                                                    setPostUpdateInline(true)
                                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد '));
                                                },1000)
                                            }
                                        })
                                })
                            }
                            if(handleButton){
                                let dataForPut = {...updatedData,constantId : editInfo.constantId }
                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : dataForPut} , axiosKey)
                                    .then(()=>{
                                        setCreatorPosition({})
                                        setFirstTimeCreate(false)
                                        setLoading(true)
                                        setEditInfo()
                                        setEditSituation(false)
                                        setHandleButton(false)
                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد '));
                                    })
                            }
                        }).catch(()=>{
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ERROR'));
                        })
                }
                if (!formData.attachedFile) {  
                    let updatedData={
                        creatorEmplPositionId : (formData.creatorEmplPositionId) ?? editInfo.creatorEmplPositionId ,
                        creatorPartyId : partyId ,
                        title : (formData.title) ? formData.title : editInfo.title , 
                        constantTypeEnumId : editInfo.constantTypeEnumId, 
                        companyPartyId : editInfo.companyPartyId ,
                        createDate : formData?.createDate ? Math.round(new Date(formData.createDate).getTime())  : editInfo.createDate ,
                        copy : editInfo.copy ,
                        description : (formData.description) ? formData.description : editInfo.description ,
                        contentLocation : editInfo.contentLocation ?? "" , 
                        archive : editInfo.archive ,
                        relationCode : editInfo.relationCode ,
                        fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : (editInfo.fromDate ? Math.round(new Date(editInfo.fromDate).getTime())  :"") ,
                        thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : (editInfo.fromDate ? Math.round(new Date(editInfo.fromDate).getTime()) :"")
                    }
                    if(!handleButton){
                        let postData={...updatedData , archive:"N" , copy : editCopy }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : postData}, axiosKey)
                        .then(()=>{
                            var putRows
                            tableContent.map((item,index)=>{
                                if(item.relationCode==updatedData.relationCode){
                                    let putData={...item,archive:"Y"}
                                    axios.put(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : putData} , axiosKey)
                                    clearTimeout(putRows)
                                    putRows=setTimeout(()=>{
                                        setCreatorPosition({})
                                        setEditInfo()
                                        setFirstTimeCreate(false)
                                        setLoading(true)
                                        setEditSituation(false)
                                        setPostUpdateInline(true)
                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد '));
                                    },1000)
                                }
                            })
                        })
                    }
                    if(handleButton){
                        let dataForPut = {...updatedData , constantId : editInfo.constantId}
                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/Constant" , {data : dataForPut} , axiosKey)
                            .then(()=>{
                                setCreatorPosition({})
                                setFirstTimeCreate(false)
                                setLoading(true)
                                setEditInfo()
                                setEditSituation(false)
                                setHandleButton(false)
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد '));
        
                            })
                    }
                }
                setHandleInputFile(Date.now())
                setFormData({})
            }
        })
    }
    //------------------------------------>delete function of special row in table <--------------------------------------------------------------------------------------------------------------------------------------------------------------
    const deleteRow=(data)=>{
        return new Promise((resolve, reject) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال حذف می باشد '));
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue?constantId=" + data?.constantId  , axiosKey)
                .then((inputIdValue)=>{
                    if (!isEmpty(inputIdValue.data.result)){
                        let constantValueInFormula = 0
                        inputIdValue.data.result.map((item1,index1)=>{
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/FormulaConstant?constantValueId=" + item1.constantValueId , axiosKey ).then((exist)=>{
                                if(exist.data.result.length>0){constantValueInFormula=constantValueInFormula+1}
                                if(index1==inputIdValue.data.result.length-1 && constantValueInFormula==0){
                                    inputIdValue.data.result.map((item2,index2)=>{
                                        axios.delete(SERVER_URL + `/rest/s1/fadak/entity/ConstantValue?constantValueId=${item2.constantValueId}`, axiosKey)
                                            .then(()=>{
                                                if(index2==inputIdValue.result.data.length-1){
                                                    axios.delete(SERVER_URL + "/rest/s1/fadak/entity/Constant?constantId=" + data?.constantId, axiosKey)
                                                    .then(()=>{
                                                        resolve()
                                                    }).catch(()=>{
                                                        reject()
                                                    })
                                                }
                                            })
                                    }) 
                                }
                                if(index1==inputIdValue.data.result.length-1 && constantValueInFormula!=0){
                                    reject("این مقدار ثابت در فرمول استفاده شده است و امکان حذف آن وجود ندارد")
                                }
                            })
                        })  
                    }
                    else{
                        axios.delete(SERVER_URL + "/rest/s1/fadak/entity/Constant?constantId=" + data?.constantId, axiosKey)
                        .then(()=>{
                            resolve()
                        }).catch(()=>{
                            reject()
                        })
                    }
                })

        })
    }
    //------------------------------------>set the  previous information table index to currentData and use it to show that information in thier own field of form as defaultValue and get information for creating in editing mode<--------------
    const informationOfEditedRow =(data)=>{
        if (data?.archive && data?.archive == "Y" ){setShowForm(true)}
        if (data?.archive && data?.archive == "N" ){setShowForm(false)}
        setPreviousData(data)
        setEditInfo(data)
        setEditSituation(true)
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue?constantId=" + data?.constantId , axiosKey)
        .then(res => {
            setUpdateInlineData(res.data.result)
        })
        let max=0
        var getMax;
        let copyOfDataBase=[]
        tableContent.map((userData , userIndex )=>{
            if (data.relationCode == userData.relationCode){
                copyOfDataBase.push(userData.copy)
                clearTimeout(getMax);
                getMax=setTimeout(() => { 
                    max=Math.max.apply(null,copyOfDataBase)
                    setEditCopy(max+1)
                } ,  100)
            }  
        })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Person?partyId=" + data.creatorPartyId , axiosKey)
            .then(creatorName=>{
                setCurrentData(Object.assign({},currentData,{ creatorFullName : `${creatorName?.data?.result[0]?.firstName || ''} ${ creatorName?.data?.result[0]?.lastName || ""} ${ creatorName?.data?.result[0]?.suffix || ""}` }))
            })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/EmplPosition" , axiosKey)
            .then(emplPositionId=>{
                let positionsInformation = {}
                emplPositionId.data.result.map((positions , index)=>{
                    if(positions.emplPositionId==data.creatorEmplPositionId){
                        positionsInformation={
                            positionId : positions.emplPositionId ,
                            positionName : positions.description
                        }
                    }
                    if(index==emplPositionId.data.result.length-1 && positions.emplPositionId==data.creatorEmplPositionId){
                        let positionsInformation={
                            positionId : positions.emplPositionId ,
                            positionName : positions.description
                        }
                        setCreatorPosition(Object.assign({},positionsInformation) )
                    }
                    if(index==emplPositionId.data.result.length-1 && positions.emplPositionId !=data.creatorEmplPositionId && positionsInformation){
                        setCreatorPosition(Object.assign({},positionsInformation) )
                    }
                })
            })
    }
    //------------------------------------>reset the fields of form information<------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const cancel = () => {
        if (editInfo) {
            setEditInfo()
            setEditSituation(false)
            setFirstTimeCreate(false)
            // reset input file name to ""
            setHandleInputFile(Date.now())
            setCreatorPosition({})
            setFormData({})
            setShowForm(false)
            return null
        }
        setStyle((preState)=>({...preState,
            "creatorEmplPositionId" : true ,
            "typeOfConstantValues": true ,
            "title" : true ,
        })) 
        setErrorStyle((preState)=>({...preState,
            invThruData : false , overlapThurDate : false , overlapFromDate : false
        }))
        setEditInfo()
        setFormData({})
        setFirstTimeCreate(false)
        setFormData({})
        setEditSituation(false)
        // reset input file name to ""
        setHandleInputFile(Date.now())
        setShowForm(false)
    }
    //------------------------------------>handle dataBase after post data of editing mode--------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect (()=>{
        if(postUpdateInline){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/Constant" , axiosKey)
                .then((getCurrentData)=>{
                    updateInlineData.map((item)=>{
                        let postData={
                            constantId : getCurrentData.data.result[getCurrentData.data.result.length-1].constantId ,
                            sequenceNum : item.sequenceNum ,
                            enTitle: item.enTitle ,
                            faTitle : item.faTitle ,
                            value : item.value
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue", {data : postData} , axiosKey )
                    })
                })
        }
    },[postUpdateInline])
    return (
        <>
            {//set props and will run when currentData and Data Quantified because they used in ConstantValueForm<------------------------------------------------------------------------------------------------------------------------------
               currentData && data  &&
                <ConstantValuesForm
                    data={data}
                    formValues={formData}
                    addFormValue={addFormData}
                    setFormData={setFormData}
                    setDataToTable={setDataToTable}
                    setStyle={setStyle}
                    style={style}
                    currentData={currentData}
                    setCurrentData={setCurrentData}
                    cancel={cancel}
                    confirm={confirm}
                    addFormValue={addFormData}
                    handleInputFile={handleInputFile}
                    setHandleInputFile={setHandleInputFile}
                    editSituation = {editSituation}
                    setEditSituation = {setEditSituation}
                    tableContent={tableContent}
                    setTableContent={setTableContent}
                    loading={loading}
                    setLoading={setLoading}
                    deleteRow={deleteRow}
                    informationOfEditedRow={informationOfEditedRow}
                    editInfo={editInfo}
                    setEditInfo={setEditInfo}
                    firstTimeCreate={firstTimeCreate}
                    setFirstTimeCreate={setFirstTimeCreate}
                    creatorPosition={creatorPosition}
                    setCreatorPosition={setCreatorPosition}
                    handleButton={handleButton}
                    updateInlineData={updateInlineData}
                    setUpdateInlineData={setUpdateInlineData}
                    showFoem={showFoem}
                    setShowForm={setShowForm}
                    inlineTableContent={inlineTableContent} 
                    setInlineTableContent={setInlineTableContent}
                    storeInlineTableContent={storeInlineTableContent}
                    setStoreInlineTableContent={setStoreInlineTableContent}
                    errorStyle={errorStyle}
                    setErrorStyle={setErrorStyle}
                />
            }
        </>
    );
};
export default ConstantValues;