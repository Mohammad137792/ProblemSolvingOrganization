import React from 'react';
import InputFactorsForm from './InputFactorsForm';
import { useEffect } from 'react';
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import {useSelector} from "react-redux";
import { useState } from 'react';
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useDispatch} from 'react-redux'

const InputFactors = () => {
    //use dispatch to show allerts 
    const dispatch = useDispatch();
    //set value of the form field that user input
    const [formData, setFormData] = React.useState({})
    const addFormData = setFormDataHelper(setFormData);
    //to control on or off of indicator in table
    const [checkedStatus,setCheckedStatus]=useState({defaultValue: true})
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
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const userIdLogin = useSelector(({ auth }) => auth.user.data.userId);
    //data of Enum entity
    const[data,setData]=useState()
    // for checking necessary field
    const[style , setStyle]=useState({
        "positions" : true ,
        "typeOfInputFactor": true ,
    })
    const contentIdFormData = new FormData()
    //data of dataBase except Enum entity
    const [currentData,setCurrentData]=useState({deleteTableRow : -1 , excelSituation : ""})
    // handle excel value when user input the excel file in edit mode 
    const [storeEditedTableRow , setStoreEditedTableRow]=useState()
    // handle name of excel file when click on cancel button
    const [handleInputFile , setHandleInputFile]=useState()
    //for load table pro
    const [loading,setLoading]=useState(true)
    //edit data handler
    const [editInfo,setEditInfo]=React.useState();
    // table data handler
    const [tableContent,setTableContent]=useState([])
    // handle add for firstTime
    const [submit,setSubmit]=React.useState(false);
    //handle data createed by editing 
    const [updateInlineData,setUpdateInlineData]=useState([])
    const [postInlineUpdate,setPostInlineUpdate]=React.useState(false);
    const [companyId , setCompanyId]=React.useState();
    const [editVersion,setEditVersion]=useState()
    const [showFoem,setShowForm] = useState(false)
    const [errorStyle,setErrorStyle] = React.useState({invThruData : false , overlapThurDate : false , overlapFromDate : false});
    const [inlineTableContent, setInlineTableContent] = React.useState([]);
    const [storeInlineTableContent , setStoreInlineTableContent] = React.useState([]);
    //------------------------------------>get data from dataBase<-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Person?partyId=" + partyId  , axiosKey)
            .then((getFullName)=>{

                axios.get(SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship?partyRelationshipId=" + partyRelationshipId, axiosKey)
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
                                                axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=InputFactor" , axiosKey)
                                                    .then(getTypeOfInputFactorValues=>{
                                                        axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , axiosKey)
                                                            .then((getCurrentData)=>{
                                                                setCurrentData(prevState => ({
                                                                    ...prevState,
                                                                    fullName : `${getFullName?.data?.result[0]?.firstName || ''} ${ getFullName?.data?.result[0]?.lastName || ""} ${ getFullName?.data?.result[0]?.suffix || ""}` ,
                                                                    companyName : getCompanyPartyId.data.result[0]?.organizationName ,
                                                                    positionsInformation :positionsInformation ,
                                                                    companyPartyId : getCompanyPartyId.data.result[0]?.partyId ,
                                                                    userInformation : getCurrentData.data.result
                                                                  }))
                                                                  setData(Object.assign({},data,{typeOfInputFactor: getTypeOfInputFactorValues.data.result}))
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
        if(loading){
            let tableRowsArrey=[]
            var table
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
                .then(companyId=>{
                    setCompanyId(companyId.data.partyId)
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor?companyPartyId=" + companyId.data.partyId , axiosKey)
                        .then((newData)=>{
                            if(newData.data.result.length>0){
                                newData.data.result.map((item,index)=>{
                                    item={...item, statusId : (item.statusId === "Activated" || item.statusId === undefined || item.statusId===null ) ? "Y" : "N"}
                                    tableRowsArrey.push(item)
                                    clearTimeout(table)
                                    table=setTimeout(()=>{                                
                                        setTableContent(tableRowsArrey)
                                        setTimeout(()=>{
                                            setLoading(false)  
                                        },100)
                                    },500)
                                })
                            }
                            else{
                                setTableContent([])
                                setLoading(false)
                            }
                        })
                })
        }
    },[loading])
    //------------------------------------>the purpose of this section is determined the value of constantType version and it changes by changing the constantType (copy is filled systematically)<----------------------------------------------
    useEffect(()=>{
        if ( currentData ){
            if(!editInfo){
                setCurrentData(Object.assign({},currentData,{version : 1}))
            }
        }
    },[formData?.typeOfInputFactor?.enumId,editInfo??""])
    useEffect (()=>{
        if(submit){
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
            .then(companyId=>{
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor?companyPartyId=" + companyId.data.partyId , axiosKey)
                    .then((newData)=>{
                        newData.data.result[newData.data.result.length-1]={...newData.data.result[newData.data.result.length-1] ,  statusId : (newData.data.result[newData.data.result.length-1].statusId === "Activated" || newData.data.result[newData.data.result.length-1].statusId === undefined || newData.data.result[newData.data.result.length-1].statusId===null ) ? "Y" : "N"}
                        informationOfEditedRow(newData.data.result[newData.data.result.length-1])
                    })
            })
        }
    },[submit])
    //------------------------------------>add form data that filled by user in the table and show them and post the information to the "Constant" entity<---------------------------------------------------------------------------------------
    const setDataToTable =(()=>{
        let necesseryFields = ["positions","typeOfInputFactor"]
        let necesseryFieldCheck=[]
        formData.fromDate = formData?.fromDate ?? ""
        formData.thruDate = formData?.thruDate ?? ""
        necesseryFields.map((item , index)=>{
            if ((!formData) || (!formData[item]) || (formData && formData[item] && formData[item]==null)) {
                    necesseryFieldCheck.push(item)
                }
        })
        if(necesseryFieldCheck.length >0){
            setStyle((preState)=>({...preState,
                positions : (formData && formData.positions && formData.positions != null)? true : false ,
                typeOfInputFactor : (formData && formData.typeOfInputFactor && formData.typeOfInputFactor != null)? true : false,
            }))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید'));
            return null
        }
        if(new Date(formData.fromDate).getTime() >= new Date(formData.thruDate).getTime()){
            setErrorStyle((preState)=>({...preState , invThruData : true}))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فيلد " تا تاريخ " صحيح وارد نشده است'));
            return null
        }
        if (tableContent.length>0){
            let failDate=[]
            tableContent.map((dateitem,dateIndex)=>{
                if (dateitem.statusId==="Y" && dateitem.type===formData?.typeOfInputFactor?.enumId && dateitem.companyPartyId==companyId){
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
                if(dateIndex==tableContent.length-1  && failDate.length==0){
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
                    if( formData?.attachedFile ){
                        contentIdFormData.append("file", formData.attachedFile)
                        axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                            .then(response => {
                                let newRowData = {
                                    emplPositionId : formData.positions.positionId ,
                                    partyId : partyId ,
                                    type : formData?.typeOfInputFactor?.enumId , 
                                    version : currentData.version ,
                                    date :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                                    companyPartyId : currentData.companyPartyId ,
                                    statusId : (formData.active==true || formData.active==undefined) ? "Activated" : "Deactivated",
                                    relationCode : new Date().valueOf() ,
                                    fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                                    thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : "" ,
                                    content : (response) ? response.data.name : '' ,
                                }
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                                .then((res)=>{
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                    setLoading(true)
                                    setSubmit(true)
                                }).catch(err => {
                                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                                })
                            }).catch(err => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                            })
                    }
                    if (!formData.attachedFile){
                        let newRowData = {
                            emplPositionId : formData.positions.positionId ,
                            partyId : partyId ,
                            type : formData?.typeOfInputFactor?.enumId , 
                            version : currentData.version ,
                            date :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                            companyPartyId : currentData.companyPartyId ,
                            statusId : (formData.active==true || formData.active==undefined) ? "Activated" : "Deactivated",
                            relationCode : new Date().valueOf() ,
                            fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                            thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : "" ,
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                        .then((res)=>{
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                            setLoading(true)
                            setSubmit(true)
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                        })
                    }
                    currentData.excelSituation=""
                    setCurrentData(Object.assign({},currentData))
                    setFormData({})
                    setStyle((preState)=>({...preState,
                        "positions" : true ,
                        "typeOfInputFactor": true ,
                    }))
                    setErrorStyle((preState)=>({...preState,
                        invThruData : false , overlapThurDate : false , overlapFromDate : false
                    }))
                }
            })
        }
        if (tableContent.length==0){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
            if( formData?.attachedFile ){
                contentIdFormData.append("file", formData.attachedFile)
                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                    .then(response => {
                        let newRowData = {
                            emplPositionId : formData.positions.positionId ,
                            partyId : partyId ,
                            type : formData?.typeOfInputFactor?.enumId , 
                            version : currentData.version ,
                            date :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                            companyPartyId : currentData.companyPartyId ,
                            statusId : (formData.active==true || formData.active==undefined) ? "Activated" : "Deactivated",
                            relationCode : new Date().valueOf() ,
                            fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                            thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : "" ,
                            content : (response) ? response.data.name : '' ,
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                        .then((res)=>{
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                            setLoading(true)
                            setSubmit(true)
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                        })
                    }).catch(err => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                    })
            }
            if (!formData.attachedFile){
                let newRowData = {
                    emplPositionId : formData.positions.positionId ,
                    partyId : partyId ,
                    type : formData?.typeOfInputFactor?.enumId , 
                    version : currentData.version ,
                    date :  formData.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                    companyPartyId : currentData.companyPartyId ,
                    statusId : (formData.active==true || formData.active==undefined) ? "Activated" : "Deactivated",
                    relationCode : new Date().valueOf() ,
                    fromDate : formData.fromDate ? Math.round(new Date(formData.fromDate).getTime()) : "" ,
                    thruDate : formData.thruDate ? Math.round(new Date(formData.thruDate).getTime()) : "" ,
                }
                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                .then((res)=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                    setLoading(true)
                    setSubmit(true)
                }).catch(err => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                })
            }
            currentData.excelSituation=""
            setCurrentData(Object.assign({},currentData))
            setFormData({})
            setStyle((preState)=>({...preState,
                "positions" : true ,
                "typeOfInputFactor": true ,
            }))
            setErrorStyle((preState)=>({...preState,
                invThruData : false , overlapThurDate : false , overlapFromDate : false
            }))
        }
    })
    //------------------------------------>put new data and edit table after changing the previous information<-----------------------------------------------------------------------------------------------------------------------------------
    const editedInformation=(index)=>{
        if (!submit){
            if(!formData.active && !formData.attachedFile  && !formData.fromDate && !formData.thruDate){
                if(inlineTableContent.length == storeInlineTableContent.length){
                    let upData=[]
                    if(storeInlineTableContent.length>0){
                        storeInlineTableContent.map((item,index)=>{
                            const ind = inlineTableContent.findIndex(i=> i.pseudoId == item.pseudoId )
                            if(ind>-1){
                                if(inlineTableContent[ind].value != item.value ){
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
        if (submit){
            if( formData?.attachedFile ){
                contentIdFormData.append("file", formData.attachedFile)
                axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                    .then(response => {
                        let newRowData = {
                            emplPositionId : formData?.positions?.positionId ?? editInfo.emplPositionId ?? "",
                            partyId : partyId ,
                            type : editInfo.type , 
                            version : editInfo.version ,
                            date :  formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                            companyPartyId : currentData.companyPartyId ,
                            statusId : formData?.active ? ((formData?.active==true) ? "Activated" : "Deactivated" ) : editInfo.statusId=="Y" ? "Activated" : "Deactivated" ,
                            relationCode : editInfo.relationCode ,
                            fromDate : formData?.fromDate ? Math.round(new Date(formData?.fromDate).getTime()) : (editInfo.fromDate ?? "") ,
                            thruDate : formData?.thruDate ? Math.round(new Date(formData?.thruDate).getTime()) : (editInfo.thruDate ?? "") ,
                            content : (response) ? response.data.name : '' ,
                        }
                        if(submit){
                            axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : {...newRowData , inputId : editInfo.inputId}} , axiosKey)
                            .then((res)=>{
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                setLoading(true)
                                setSubmit(false)
                            }).catch(err => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                            })
                        }
                        else{
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                            .then((res)=>{
                                tableContent.map((item , index)=>{
                                    if (item.relationCode==newRowData.relationCode && item.statusId=="Y"){
                                        item={...item , statusId : "Deactivated"}
                                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : item} , axiosKey)
                                            .then(()=>{
                                                if(index==tableContent.length-1){
                                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                    setPostInlineUpdate(true)
                                                    setLoading(true)
                                                }
                                            })
                                    }
                                    else{
                                        if(index==tableContent.length-1){
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                            setPostInlineUpdate(true)
                                            setLoading(true)
    
                                        }
                                    }
                                })
                            }).catch(err => {
                                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                            })
                        }
                    }).catch(err => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                    })
            }
            if (!formData.attachedFile){
                let newRowData = {
                    emplPositionId : formData?.positions?.positionId ?? editInfo.emplPositionId ?? "",
                    partyId : partyId ,
                    type : editInfo.type , 
                    version : editInfo.version ,
                    date :  formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                    companyPartyId : currentData.companyPartyId ,
                    statusId : formData?.active ? ((formData?.active==true) ? "Activated" : "Deactivated" ) : editInfo.statusId=="Y" ? "Activated" : "Deactivated"  ,
                    relationCode : editInfo.relationCode ,
                    fromDate : formData?.fromDate ? Math.round(new Date(formData?.fromDate).getTime()) : (editInfo.fromDate ?? "") ,
                    thruDate : formData?.thruDate ? Math.round(new Date(formData?.thruDate).getTime()) : (editInfo.thruDate ?? "") ,
                }
                if(submit){
                    axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : {...newRowData , inputId : editInfo.inputId }} , axiosKey)
                    .then((res)=>{
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                        setLoading(true)
                        setSubmit(false)
                    }).catch(err => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                    })
                }
                else{
                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                    .then((res)=>{
                        tableContent.map((item , index)=>{
                            if (item.relationCode==newRowData.relationCode && item.statusId=="Y"){
                                item={...item , statusId : "Deactivated"}
                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : item} , axiosKey)
                                    .then(()=>{
                                        if(index==tableContent.length-1){
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                            setPostInlineUpdate(true)
                                            setLoading(true)
                                        }
                                    })
                            }
                            else{
                                if(index==tableContent.length-1){
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                    setPostInlineUpdate(true)
                                    setLoading(true)
    
                                }
                            }
                        })
                    }).catch(err => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                    })
                }
            }
            setCheckedStatus({defaultValue:true})
            setFormData({})
            setEditInfo()
        }
    }
    const confirmEditInfo = ()=>{
        let necesseryFields = ["positions"]
        let necesseryFieldCheck=[]
        formData.fromDate = formData?.fromDate ?? editInfo.fromDate ?? ""
        formData.thruDate = formData?.thruDate ?? editInfo.thruDate ?? ""
        formData.positions=formData.positions?? editInfo.emplPositionId ?? ""
        necesseryFields.map((item , index)=>{
            if ((!formData) || (!formData[item]) || (formData && formData[item] && formData[item]==null)) {
                    necesseryFieldCheck.push(item)
                }
        })
        if(necesseryFieldCheck.length >0){
            setStyle((preState)=>({...preState,
                positions : (formData && formData.positions && formData.positions != null)? true : false ,
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
            if (dateitem.statusId==="Y" && dateitem.type===editInfo.type && dateitem.companyPartyId==companyId && dateitem.inputId != editInfo.inputId){
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
            if(dateIndex==tableContent.length-1  && failDate.length==0){
                if( formData?.attachedFile ){
                    contentIdFormData.append("file", formData.attachedFile)
                    axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config)
                        .then(response => {
                            let newRowData = {
                                emplPositionId : formData?.positions?.positionId ?? editInfo.emplPositionId ?? "",
                                partyId : partyId ,
                                type : editInfo.type , 
                                version : editVersion ,
                                date :  formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                                companyPartyId : currentData.companyPartyId ,
                                statusId : formData?.active ? ((formData?.active==true) ? "Activated" : "Deactivated" ) : editInfo.statusId=="Y" ? "Activated" : "Deactivated" ,
                                relationCode : editInfo.relationCode ,
                                fromDate : formData?.fromDate ? Math.round(new Date(formData?.fromDate).getTime()) : (editInfo.fromDate ?? "") ,
                                thruDate : formData?.thruDate ? Math.round(new Date(formData?.thruDate).getTime()) : (editInfo.thruDate ?? "") ,
                                content : (response) ? response.data.name : '' ,
                            }
                            if(submit){
                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : {...newRowData , inputId : editInfo.inputId }} , axiosKey)
                                .then((res)=>{
                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                    setLoading(true)
                                    setSubmit(false)
                                }).catch(err => {
                                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                                })
                            }
                            else{
                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                                .then((res)=>{
                                    tableContent.map((item , index)=>{
                                        if (item.relationCode==newRowData.relationCode && item.statusId=="Y"){
                                            item={...item , statusId : "Deactivated"}
                                            axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : item} , axiosKey)
                                                .then(()=>{
                                                    if(index==tableContent.length-1){
                                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                        setPostInlineUpdate(true)
                                                        setLoading(true)
                                                    }
                                                })
                                        }
                                        else{
                                            if(index==tableContent.length-1){
                                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                setPostInlineUpdate(true)
                                                setLoading(true)
        
                                            }
                                        }
                                    })
                                }).catch(err => {
                                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                                })
                            }
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                        })
                }
                if (!formData.attachedFile){
                    let newRowData = {
                        emplPositionId : formData?.positions?.positionId ?? editInfo.emplPositionId ?? "",
                        partyId : partyId ,
                        type : editInfo.type , 
                        version : editVersion ,
                        date :  formData?.createDate ? Math.round(new Date(formData.createDate).getTime()) : Math.round(new Date().getTime()) ,
                        companyPartyId : currentData.companyPartyId ,
                        statusId : formData?.active ? ((formData?.active==true) ? "Activated" : "Deactivated" ) : editInfo.statusId=="Y" ? "Activated" : "Deactivated"  ,
                        relationCode : editInfo.relationCode ,
                        fromDate : formData?.fromDate ? Math.round(new Date(formData?.fromDate).getTime()) : (editInfo.fromDate ?? "") ,
                        thruDate : formData?.thruDate ? Math.round(new Date(formData?.thruDate).getTime()) : (editInfo.thruDate ?? "") ,
                    }
                    if(submit){
                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : {...newRowData , inputId : editInfo.inputId}} , axiosKey)
                        .then((res)=>{
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                            setLoading(true)
                            setSubmit(false)
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                        })
                    }
                    else{
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : newRowData} , axiosKey)
                        .then((res)=>{
                            tableContent.map((item , index)=>{
                                if (item.relationCode==newRowData.relationCode && item.statusId=="Y"){
                                    item={...item , statusId : "Deactivated"}
                                    axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , {data : item} , axiosKey)
                                        .then(()=>{
                                            if(index==tableContent.length-1){
                                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                setPostInlineUpdate(true)
                                                setLoading(true)
                                            }
                                        })
                                }
                                else{
                                    if(index==tableContent.length-1){
                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                        setPostInlineUpdate(true)
                                        setLoading(true)
        
                                    }
                                }
                            })
                        }).catch(err => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات ناموفق بود '));
                        })
                    }
                }
                setCheckedStatus({defaultValue:true})
                setFormData({})
                setEditInfo()
                setErrorStyle((preState)=>({...preState,
                    invThruData : false , overlapThurDate : false , overlapFromDate : false
                }))
            }
        })
    }
    useEffect (()=>{
        if(postInlineUpdate){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , axiosKey)
                .then((getCurrentData)=>{
                    updateInlineData.map((item)=>{
                        let postData={
                            inputId : getCurrentData.data.result[getCurrentData.data.result.length-1].inputId ,
                            pseudoId : item.pseudoId ,
                            value: item.value ,
                        }
                        axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue", {data : postData} , axiosKey )
                    })
                })
        }
    },[postInlineUpdate])
    //------------------------------------>set the  previous information table index to currentData and use it to show that information in thier own field of form as defaultValue<---------------------------------------------------------------
    const informationOfEditedRow =(data)=>{
        if (data?.statusId && data?.statusId == "N" ){setShowForm(true)}
        if (data?.statusId && data?.statusId == "Y" ){setShowForm(false)}
        setEditInfo(data)
        setStoreEditedTableRow(data)
        setCheckedStatus({defaultValue: (data.statusId=="Activated" || data?.statusId==true || data?.statusId=="Y") ? true : false})
        let max=0
        var getMax;
        let copyOfDataBase=[]
        tableContent.map((userData , userIndex )=>{
            if (data.relationCode == userData.relationCode){
                copyOfDataBase.push(userData.version)
                clearTimeout(getMax);
                getMax=setTimeout(() => { 
                    max=Math.max.apply(null,copyOfDataBase)
                    setEditVersion(max+1)
                } ,  100)
            }  
        })
    }
    //------------------------------------>reset the fields of form information<------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const cancel = () => {
        if (editInfo) {
            setEditInfo()
            // reset input file name to ""
            setHandleInputFile(Date.now())
            setCheckedStatus({defaultValue: true})
            setShowForm(false)
            return null
        }
        setFormData({})
        setStyle((preState)=>({...preState,
            "positions" : true ,
            "typeOfInputFactor": true ,
        })) 
        setErrorStyle((preState)=>({...preState,
            invThruData : false , overlapThurDate : false , overlapFromDate : false
        }))
        setCheckedStatus({defaultValue: true})
        // reset input file name to ""
        setHandleInputFile(Date.now())
        setShowForm(false)
    }
    return (
        <>
            {//-------------------------->set props and will run when currentData and Data Quantified because they used in ConstantValueForm<----------------------------------------------------------------------------------------------------
                currentData && data  && 
                <InputFactorsForm
                    data={data}
                    formValues={formData}
                    addFormValue={addFormData}
                    setFormData={setFormData}
                    setDataToTable={setDataToTable}
                    checkedStatus={checkedStatus}
                    setCheckedStatus={setCheckedStatus}
                    setStyle={setStyle}
                    style={style}
                    currentData={currentData}
                    setCurrentData={setCurrentData}
                    cancel={cancel}
                    editedInformation={editedInformation}
                    addFormValue={addFormData}
                    handleInputFile={handleInputFile}
                    setHandleInputFile={setHandleInputFile}
                    loading={loading}
                    setLoading={setLoading}
                    informationOfEditedRow={informationOfEditedRow}
                    editInfo={editInfo}
                    setEditInfo={setEditInfo}
                    tableContent={tableContent}
                    setTableContent={setTableContent}
                    submit ={submit}
                    updateInlineData={updateInlineData}
                    setUpdateInlineData={setUpdateInlineData}
                    showFoem={showFoem}
                    setShowForm={setShowForm}
                    errorStyle={errorStyle}
                    setErrorStyle={setErrorStyle}
                    inlineTableContent={inlineTableContent} 
                    setInlineTableContent={setInlineTableContent}
                    storeInlineTableContent={storeInlineTableContent}
                    setStoreInlineTableContent={setStoreInlineTableContent}
                />
            }
        </>
    );
};
export default InputFactors;