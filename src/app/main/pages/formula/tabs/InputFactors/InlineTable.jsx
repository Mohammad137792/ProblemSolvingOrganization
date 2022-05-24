import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import { useState } from 'react';
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button ,Grid ,TextField } from "@material-ui/core";
import TablePro from './TablePro';
import ActionBox from './../../../../components/ActionBox';
import FormPro from './../../../../components/formControls/FormPro';
import { makeStyles } from "@material-ui/core/styles";
import xlsx from 'xlsx'

const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red",
        borderWidth: "1px",
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& label span": {
            color: "red"
        }

    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        },
    }
}));
const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        width: "100%",
        "& label span": {
            color: "red"
        }

    },
    NonDispaly: {
        display: "none"
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    enter: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "green"
        },
    },
    inputRoot: {
        // height: "54px",
        flexWrap: "nowrap",
        overflow: "hidden"
    },
    listbox: {
        boxSizing: 'border-box',

        // margin: 0,
        // padding: '8px 0',
        // overflow: 'auto',
        // textOverflow: "ellipsis",
        //
        // listStyle: 'none',
        // maxHeight: '40vh',
        //
        direction: 'rtl',
        '& ul': {
            padding: 0,
            margin: 0,
            direction: 'rtl',
            //     // textAlign: "right",
            //     '& li':{
            //         // textAlign: "right",
            //         direction: 'rtl'
            //     }
        },
    },
});
 
export default function InlineTable(props){
    
    const { data , companyId , setHandleInputFile , editSituation , updateInlineData , setUpdateInlineData , showFoem , tableContent , setTableContent , storeInlineTableContent , setStoreInlineTableContent}  = props
    const [excelSituation,setExcelSituation]=useState()
    //primary key of input factor entity used for edit and remove requestes
    const [inputId , setInputId]=useState()
    const dispatch = useDispatch();
    //handle edit or add of excel data
    const [excelEditation,setExcelEditation]=useState(false)
    const [excelData,setExcelData]=useState()
    //inline table creating information
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "number", style: {width:"30%"} },
        {name: "fullName", label: "نام و نام خانوادگی", type: "text", style: {width:"30%"} },
        {name: "value", label: "مقدار", type: "number" , style: {width:'20%'}}
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    //used for update table after create new line of data in inline table or edit one row information
    const [newData,setNewData]=useState({})
    //handle showing the data of excel file in inline table
    const [handleTable , setHandleTable]=useState({newUserData : []})
    //validate the data of excel file
    const [invalidExcelPseudoId,setInvalidExcelPseudoId]=useState()
    //show the pseudoId list which are not exist to user
    const [displayDialog,setDisplayDialog]=useState(false)
    const [displayExcelDialog,setDisplayExcelDialog]=useState(false)
    const[loading,setLoading]=useState(true)
    const [fileInfo , setFileInfo] = React.useState({})
    // remove callBack of TableProEditInline 
    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            if(!editSituation){
                axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , axiosKey)
                    .then((InputFactorValue)=>{
                        InputFactorValue.data.result.map(item=>{
                            if(item.pseudoId==rowData.pseudoId && item.inputId==inputId){
                                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?valueId=" + item.valueId , axiosKey )
                                .then(res => {
                                    resolve()
                                }).catch(err => {
                                    reject(err)
                                });
                            }
                        })
                    })
            }
            else{
                axios.get(SERVER_URL + `/rest/s1/fadak/entity/InputFactorValue?inputId=${inputId}&pseudoId=${rowData.pseudoId}` , axiosKey ).then((valueInfo)=>{
                    let deleteRow=[]
                    const TableIndex = tableContent.findIndex(i=> i.pseudoId == rowData.pseudoId )
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/FormulaInputFactor?inputFactorValueId=" + valueInfo.data.result[0]?.valueId , axiosKey )
                    .then(res => {
                        if(res.data.result.length>0){
                            reject("از این عامل ورودی در فرمول استفاده شده است امکان حذف آن وجود ندارد")
                        }
                        else{
                            tableContent.map((item,index)=>{
                                if(index!=TableIndex){
                                    deleteRow.push(item)
                                }
                                if(index==updateInlineData.length-1){
                                    setTimeout(()=>{
                                        setUpdateInlineData(deleteRow)
                                        resolve()
                                    },100)
                                }
                            })
                        }
                    }).catch(err => {
                        tableContent.map((item,index)=>{
                            if(index!=TableIndex){
                                deleteRow.push(item)
                            }
                            if(index==updateInlineData.length-1){
                                setTimeout(()=>{
                                    setUpdateInlineData(deleteRow)
                                    resolve()
                                },100)
                            }
                        })
                    });
                })
            }
        })
    }
    //show fullName of excel data in table
    useEffect(()=>{
        if (excelEditation && excelData){
            setExcelData()
            setHandleInputFile(Date.now())
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , axiosKey)
                .then((getCurrentData)=>{
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?inputId=" + data?.inputId , axiosKey)
                        .then(tableData => {
                            let data=[]
                            if(tableData.data.result.length>0){
                                tableData.data.result.map((item , index)=>{
                                    let fullName = ""
                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${item.pseudoId}&companyId=${companyId}`  , axiosKey)
                                        .then((response)=>{
                                            fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}`  
                                            let  rowsData={
                                                pseudoId : item.pseudoId ,
                                                value : item.value , 
                                                fullName : fullName , 
                                            }
                                            data.push(rowsData) 
                                            // setHandleTable({newUserData : data})
                                            if (index==tableData.data.result.length-1){
                                                setTableContent(data)
                                                setUpdateInlineData(data)
                                                setLoading(false)
                                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                setExcelEditation(false)
                                            }                      
                                        })
                                })
                            }
                            if(tableData.data.result.length==0) {
                                setTableContent(data)
                                setUpdateInlineData(data)
                                setLoading(false)
                                setExcelEditation(false)
                            }
                        })
                })
        }
    },[excelEditation])
    useEffect(()=>{
        console.log("companyId" , companyId);
        if (excelData){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات فایل اکسل در حال ثبت می باشد '));
        }
        if(data?.inputId){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactor" , axiosKey)
                .then((getCurrentData)=>{
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?inputId=" + data?.inputId , axiosKey)
                        .then(res => {
                            setStoreInlineTableContent(res.data.result)
                            if (excelData) {
                                // if user import excel file and want to edit information via this file
                                if (excelSituation=="edit" && !editSituation){
                                    let errorId=[]
                                    var handleId;
                                    if (res.data.result.length>0){
                                        res.data.result.map(deleted=>{
                                            axios.delete(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?valueId=" + deleted.valueId , axiosKey )
                                        })
                                    }
                                    let availibility = []
                                    excelData.map((excelItem , excelIndex)=>{
                                        excelItem={...excelItem , inputId : data?.inputId}
                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                availibility.push (excelItem.pseudoId)
                                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , {data : excelItem} , axiosKey )
                                                    .then(()=>{
                                                        if(excelIndex==excelData.length-1){
                                                            if(errorId.length>0){
                                                                setInvalidExcelPseudoId(errorId) 
                                                                setDisplayDialog(true)
                                                            }
                                                            setExcelEditation(true) 
                                                            setExcelSituation()
                                                        }  
                                                    })
                                                    
                                            })
                                            // find invalid edit pseudoId
                                            .catch(()=>{
                                                errorId.push(excelItem.pseudoId)
                                                if(excelIndex==excelData.length-1){
                                                    if(availibility.length == 0){
                                                        setUpdateInlineData([])
                                                        setTableContent([])
                                                        setLoading(false)
                                                        setExcelSituation()
                                                        setInvalidExcelPseudoId(errorId) 
                                                        setDisplayDialog(true)
                                                    }
                                                    else{
                                                        setExcelEditation(true)
                                                        setExcelSituation()
                                                        if(errorId.length>0){
                                                            setInvalidExcelPseudoId(errorId) 
                                                            setDisplayDialog(true)
                                                        }

                                                    }

                                                }
                                            })   
                                    })
                                }    
                                if (excelSituation=="edit" && editSituation){
                                    setLoading(true)
                                    let errorId=[]
                                    let upData=[]
                                    let availibility = []
                                    excelData.map((excelItem , excelIndex)=>{
                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                availibility.push (excelItem.pseudoId)
                                                let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                excelItem={...excelItem,fullName : fullName}
                                                upData.push(excelItem)
                                                if(excelIndex==excelData.length-1){
                                                    setUpdateInlineData(upData)
                                                    setTableContent(upData)
                                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                    setInvalidExcelPseudoId(errorId) 
                                                    setTimeout(()=>{
                                                        setLoading(false)
                                                        setExcelSituation()
                                                    },100)
                                                    if(errorId.length>0){
                                                        setTimeout(()=>{
                                                            setDisplayDialog(true)
                                                        },100)
                                                        
                                                    }
                                                } 
                                                    
                                            }).catch((catchres)=>{
                                                errorId.push(excelItem.pseudoId)
                                                if(excelIndex==excelData.length-1){
                                                    if(availibility.length == 0){
                                                        setUpdateInlineData([])
                                                        setTableContent([])
                                                        setInvalidExcelPseudoId(errorId) 
                                                        setTimeout(()=>{
                                                            setLoading(false)
                                                            setExcelSituation()
                                                            setDisplayDialog(true)
                                                        },100)
                                                        
                                                    }
                                                    else{
                                                        setUpdateInlineData(upData)
                                                        setTableContent(upData)
                                                        setTimeout(()=>{
                                                            setLoading(false)
                                                            setExcelSituation()
                                                        },100)
                                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                        setInvalidExcelPseudoId(errorId) 
                                                        if(errorId.length>0){
                                                            setTimeout(()=>{
                                                                setDisplayDialog(true)
                                                            },100)
                                                        }

                                                    }

                                                } 
                                            })   
                                    })
                                }
                                // if user import excel file and want to add information via this file
                                if (excelSituation=="add" && !editSituation) {
                                    let errorId=[]
                                    var handleId;
                                    let availibility = []
                                    excelData.map((excelItem , excelIndex)=>{
                                        let itemLength =[]
                                        // update the value of pseudoId in excel file that exist in dataBase
                                        if(res.data.result.length>0){
                                            res.data.result.map((dataBaseItem , dataBaseIndex)=>{
                                                if (excelItem.pseudoId==dataBaseItem.pseudoId){
                                                    itemLength.push(excelItem.pseudoId)
                                                    dataBaseItem.value = excelItem.value + dataBaseItem.value

                                                    axios.put (SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , {data : dataBaseItem} , axiosKey)
                                                        .then(()=>{
                                                            availibility.push (excelItem.pseudoId)
                                                            if(excelIndex==excelData.length-1){
                                                                setExcelEditation(true) 
                                                                setExcelSituation()
                                                                if(errorId.length>0){
                                                                    setInvalidExcelPseudoId(errorId) 
                                                                    setDisplayDialog(true)
                                                                    
                                                                }
                                                            }
                                                        })
                                                }
                                                // if pseudoId of excel file was new so post the value as new data
                                                if(dataBaseIndex==res.data.result.length-1 && excelItem.pseudoId !== dataBaseItem.pseudoId ){
                                                    if (itemLength.length==0){
                                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                                            .then((response)=>{
                                                                excelItem={...excelItem , inputId : data?.inputId}
                                                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , {data : excelItem} , axiosKey )
                                                                    .then(()=>{
                                                                        availibility.push (excelItem.pseudoId)
                                                                        if(excelIndex==excelData.length-1){
                                                                            setExcelEditation(true) 
                                                                            setExcelSituation()
                                                                            if(errorId.length>0){
                                                                                setInvalidExcelPseudoId(errorId) 
                                                                                setDisplayDialog(true)
                                                                            }
                                                                        }
                                                                    })
                                                            })
                                                            // find invalid add pseudoId
                                                            .catch(()=>{
                                                                errorId.push(excelItem.pseudoId)
                                                                if(excelIndex==excelData.length-1){
                                                                    if(availibility.length>0){
                                                                        setExcelEditation(true) 
                                                                        setExcelSituation()
                                                                        if(errorId.length>0){
                                                                            setInvalidExcelPseudoId(errorId) 
                                                                            setDisplayDialog(true)
                                                                        }
                                                                    }
                                                                    else{
                                                                        setLoading(false)
                                                                        setExcelSituation()
                                                                        setInvalidExcelPseudoId(errorId)
                                                                        if(errorId.length>0){
                                                                            setTimeout(()=>{
                                                                                setDisplayDialog(true)
                                                                            },100)
                                                                        }
                                                                    }

                                                                }
                                                            })
                                                    }
                                                }
                                            })
                                        }
                                        //just post data if there is no data in the dataBase before
                                        else{
                                            let availibility = []
                                            axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                availibility.push (excelItem.pseudoId)
                                                excelItem={...excelItem , inputId : data?.inputId}
                                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , {data : excelItem} , axiosKey )
                                                    .then(()=>{
                                                        if(excelIndex==excelData.length-1){
                                                            setExcelEditation(true) 
                                                            setInvalidExcelPseudoId(errorId) 
                                                            setDisplayDialog(true)
                                                            setExcelSituation()
                                                        }
                                                    })
                                            })
                                            // find invalid add pseudoId
                                            .catch(()=>{
                                                errorId.push(excelItem.pseudoId)
                                                if(excelIndex==excelData.length-1){
                                                    if(availibility.length == 0){
                                                        setTableContent([])
                                                        setLoading(false)
                                                        setExcelSituation()
                                                    }
                                                    else{
                                                        setTimeout(() => { 
                                                            setExcelSituation()
                                                            setExcelEditation(true) 
                                                            setInvalidExcelPseudoId(errorId) 
                                                            setDisplayDialog(true)
                                                        } ,  100)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                                if (excelSituation=="add" && editSituation) {
                                    setLoading(true)
                                    let errorId=[]
                                    var handleId;
                                    let upData=[]
                                    let availibility = []
                                    excelData.map((excelItem , excelIndex)=>{
                                        const ind = tableContent.findIndex(i=> i.pseudoId == excelItem.pseudoId )
                                        if (ind > -1){
                                            tableContent[ind].value = excelItem.value + tableContent[ind].value
                                            availibility.push (excelItem.pseudoId)
                                        }
                                        if(ind < 0){
                                            axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                excelItem={...excelItem,fullName : fullName}
                                                upData.push(excelItem)
                                                availibility.push (excelItem.pseudoId)
                                            })
                                            // find invalid add pseudoId
                                            .catch(()=>{
                                                errorId.push(excelItem.pseudoId)
                                            })
                                        }
                                        if (excelIndex == excelData.length-1){
                                                tableContent.map((dataItem , dataIndex)=>{
                                                    if (dataIndex != tableContent.length-1){
                                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${dataItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                                        .then((response)=>{
                                                            let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                            dataItem={...dataItem,fullName : fullName}
                                                            upData.push(dataItem)
                                                        })
                                                    }
                                                    if (dataIndex == tableContent.length-1){
                                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${dataItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                                        .then((response)=>{
                                                            let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                            dataItem={...dataItem,fullName : fullName}
                                                            upData.push(dataItem)
                                                            setTimeout(() => { 
                                                                if(availibility.length>0){
                                                                    setTableContent(upData)
                                                                    setUpdateInlineData(upData)
                                                                    setExcelSituation()
                                                                    setTimeout(()=>{
                                                                        setLoading(false)
                                                                    },100)
                                                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                                    setInvalidExcelPseudoId(errorId)
                                                                    if(errorId.length>0){
                                                                        setTimeout(()=>{
                                                                            setDisplayDialog(true)
                                                                        },100)
                                                                    }
                                                                }
                                                                else{
                                                                    setLoading(false)
                                                                    setExcelSituation()
                                                                    setInvalidExcelPseudoId(errorId)
                                                                    if(errorId.length>0){
                                                                        setTimeout(()=>{
                                                                            setDisplayDialog(true)
                                                                        },100)
                                                                    }
                                                                }
                                                            } ,  100)
                                                        })
                                                        
                                                    }
                                                })
                                        }
                                    })
                                }
                                // create data of inline table by new user via excel file 
                                if (excelSituation=="" && !editSituation) {
                                    setLoading(true)
                                    let errorId=[]
                                    var handleId;
                                    let availibility = []
                                    excelData.map((excelItem , excelIndex)=>{
                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                availibility.push (excelItem.pseudoId)
                                                excelItem={...excelItem , inputId : data?.inputId}
                                                axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , {data : excelItem} , axiosKey )
                                                    .then(()=>{
                                                        if(excelIndex==excelData.length-1 ){
                                                            
                                                            if(errorId.length>0) {
                                                                setInvalidExcelPseudoId(errorId) 
                                                                setDisplayDialog(true)
                                                            }
                                                            setExcelEditation(true) 
                                                            setExcelSituation()
                                                        }
                                                    })
                                            })
                                            // find invalid pseudoId
                                            .catch((catchres)=>{
                                                errorId.push(excelItem.pseudoId)

                                                if(excelIndex==excelData.length-1 ){
                                                    if(availibility.length == 0){
                                                        setExcelSituation()
                                                        if(errorId.length>0) {
                                                            setInvalidExcelPseudoId(errorId) 
                                                            setDisplayDialog(true)
                                                        }
                                                    }
                                                    else{
                                                        if(errorId.length>0) {
                                                            setInvalidExcelPseudoId(errorId) 
                                                            setDisplayDialog(true)
                                                        }
                                                        setExcelEditation(true) 
                                                        setExcelSituation()
                                                    }
                                                }
                                            })
                                    })
                                }
                                if (excelSituation=="" && editSituation) {
                                    setLoading(true)
                                    let errorId=[]
                                    var handleId;
                                    var handleUp
                                    let availibility = []
                                    let upData=[]
                                    excelData.map((excelItem , excelIndex)=>{
                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${excelItem.pseudoId}&companyId=${companyId}`  , axiosKey)
                                            .then((response)=>{
                                                let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                excelItem={...excelItem,fullName : fullName}
                                                upData.push(excelItem)
                                                availibility.push (excelItem.pseudoId)
                                                if(excelIndex==excelData.length-1 ){
                                                    setTableContent(upData)
                                                    setUpdateInlineData(upData)
                                                    setInvalidExcelPseudoId(errorId) 
                                                    setExcelSituation()
                                                    if(errorId.length>0) {
                                                        setTimeout(()=>{
                                                            setDisplayDialog(true)
                                                        },100)
                                                    }
                                                    setTimeout(()=>{
                                                        setLoading(false)
                                                    },100)
                                                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
            
                                                }
                                            })
                                            // find invalid pseudoId
                                            .catch((catchres)=>{
                                                errorId.push(excelItem.pseudoId)
                                                if(excelIndex==excelData.length-1){
                                                    if(availibility.length == 0){
                                                        setTableContent([])
                                                        setUpdateInlineData()
                                                        setExcelSituation()
                                                        setTimeout(()=>{
                                                            setLoading(false)
                                                        },100)
                                                        setInvalidExcelPseudoId(errorId) 
                                                        if(errorId.length>0) {
                                                            setTimeout(()=>{
                                                                setDisplayDialog(true)
                                                            },100)
                                                        }
                                                    }
                                                    else{
                                                        setInvalidExcelPseudoId(errorId) 
                                                        setExcelSituation()
                                                        if(errorId.length>0) {
                                                            setTimeout(()=>{
                                                                setDisplayDialog(true)
                                                            },100)
                                                        }
                                                        setTableContent(upData)
                                                        setUpdateInlineData(upData)
                                                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                                        setTimeout(()=>{
                                                            setLoading(false)
                                                        },100)
                                                    }
                                                }
                                            })
                                    })
                                }
                            }
                            // show fullName of pseudoId of dataBase information in the inline table 
                            if (!excelData){
                                var handleTableData;
                                let data =[]
                                if(res.data.result.length>0 ){
                                    res.data.result.map((item,index)=>{
                                        let fullName = ""
                                        axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${item.pseudoId}&companyId=${companyId}` , axiosKey)
                                            .then((response)=>{
                                                console.log("response" , response.data);
                                                fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                let  rowsData={
                                                    pseudoId : item.pseudoId ,
                                                    value : item.value , 
                                                    fullName : fullName , 
                                                }
                                                data.push(rowsData) 
                                                if(index ==  res.data.result.length-1)
                                                setTimeout(() => { 
                                                    setTableContent(data)
                                                    setUpdateInlineData(data)
                                                    setLoading(false)
                                                } ,  100)           
                                            })
                                        
                                    })
                                }
                                if(res.data.result.length==0){
                                    setTableContent([])
                                    setUpdateInlineData([])
                                    setLoading(false)
                                }
                            }
                            //set value of primary key of input factor entity
                            setInputId( data?.inputId)
                        })
                })
        }
    },[ newData , excelSituation , data?.inputId]);
    useEffect(()=>{
        if(fileInfo && fileInfo.name){
            const file = fileInfo
            const promise = new Promise ((resolve , reject)=>{
                const fileReader = new FileReader ()
                fileReader.readAsArrayBuffer(file)
                fileReader.onload = (e) => {
                    const bufferArrey = e.target.result
                    const wb = xlsx.read(bufferArrey , {type : "buffer"})
                    const wsName = wb.SheetNames[0]
                    const ws = wb.Sheets[wsName]
                    const data = xlsx.utils.sheet_to_json(ws)
                    resolve(data)

                }
                fileReader.onerror=(error)=>{
                    reject(error)
                }
            })
            promise.then((data)=>{
                setExcelData(data)
                if(tableContent.length==0){
                    setExcelSituation("")
                }
                else{
                    setDisplayExcelDialog(true)
                }
            })
        }
    },[fileInfo]);
    //handle closing window of invalid pseudoId
    const handlCloseDialog=()=>{
        setDisplayDialog(false)
        if(!editSituation){setExcelEditation(true)}
        setInvalidExcelPseudoId([])
    }
    const handlCloseExcelDialog =()=>{
        setDisplayExcelDialog(false)
    }
    const handleAdd =()=>{
        setDisplayExcelDialog(false)
        setExcelSituation("add")
    }
    const handleEdit =()=>{
        setDisplayExcelDialog(false)
        setExcelSituation("edit")
    }

    return (
        <> 
            { tableContent && showFoem &&
                <TablePro
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    exportCsv="عوامل ورودی"
                    hiddenHeader={true}
                />
            }
            { tableContent && !showFoem &&
                    <TablePro
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    add="external"
                    addForm={<InlineForm data={data} excelData={excelData} excelSituation={excelSituation}  setExcelData={setExcelData} inputId={inputId} setNewData={setNewData} newData={newData} tableContent={tableContent} setTableContent={setTableContent}
                    setHandleInputFile={setHandleInputFile} editSituation={editSituation} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData} companyId={companyId} loading={loading} setLoading={setLoading} />}
                    edit="external"
                    editForm={<InlineForm data={data} excelData={excelData} excelSituation={excelSituation}  setExcelData={setExcelData} inputId={inputId} setNewData={setNewData} newData={newData} tableContent={tableContent} setTableContent={setTableContent}
                    setHandleInputFile={setHandleInputFile} editSituation={editSituation} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData} companyId={companyId} loading={loading} editing={true} setLoading={setLoading}/>}
                    removeCallback={handleRemove}
                    loading={loading}
                    exportCsv="عوامل ورودی"
                    setFileInfo={setFileInfo}
                    hiddenHeader={false}
                />
            }
            { invalidExcelPseudoId && 
                <Dialog open={displayDialog}
                    onClose={handlCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">اخطار</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        کد پرسنلی های زیر  نامعتبر می باشند و افزوده نشدند : 
                        </DialogContentText>
                        {invalidExcelPseudoId.map((item , index)=>
                            <DialogContentText>
                                {`${index+1} - ${item}`}
                            </DialogContentText>
                        )}   
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlCloseDialog} color="primary">متوجه شدم </Button>
                    </DialogActions>
                </Dialog>
            }
            { displayExcelDialog &&
                <Dialog open={displayExcelDialog}
                    onClose={handlCloseExcelDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">قصد انجام کدام عملیات زیر را دارید ؟</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            با انتخاب گزینه افزودن داده های قبلی حفظ و داده های جدید افزوده خواهد شد و
                            با انتخاب گزینه ویرایش داده های قبلی حذف و فقط داده های جدید ذخیره خواهد شد  
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAdd} color="primary">افزودن</Button>
                        <Button onClick={handleEdit} color="primary" autoFocus>ویرایش</Button>
                    </DialogActions>
                </Dialog>
            }       
        </>
    )
}

function InlineForm({ editing = false, ...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose ,  data , excelData , excelSituation , companyId , setExcelData , setLoading ,
         setHandleInputFile , editSituation , updateInlineData , setUpdateInlineData , tableContent , setTableContent , inputId , setNewData , newData} = restProps;
    const [invalidId,setInvalidId]=React.useState(false)
    const [formValidation, setFormValidation] =React.useState({});
    const [style ,setStyle]=useState(false)
    const [edit,setEdit]=useState(editing)
    const formStructure = [
        invalidId ? {
        label:  "کد پرسنلی",
        name:   "pseudoId",
        type:   "component",
        component : <InvalidPseudoId invalidId={invalidId} setInvalidId={setInvalidId} formValues={formValues} setFormValues={setFormValues} tableContent={tableContent} setStyle={setStyle} style={style}/> ,
        col     : 4
    } : {
        label:  "کد پرسنلی",
        name:   "pseudoId",
        type:   "number",
        required : true ,
        disabled : edit ,
        col     : 4
    },{
        label:  "نام و نام خانوادگی",
        name:   "fullName",
        type:   "text",
        disabled :true ,
        col     : 4
    },{
        label:  "مقدار",
        name:   "value",
        type:   "number",
        col     : 4
    }]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch();
    const handleCreate = ()=>{
        let formData = formValues
        if(style){return}
        else{
            if(!editSituation){
                if(!formData.value || formData.value==""){formData.value=0}
                if(tableContent.length==0){
                    let postData=Object.assign({},formData, {inputId : inputId } )
                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue", {data : postData} , axiosKey )
                        .then((res) => {
                            successCallback (formData)
                            setFormValues({})
                            setNewData(Object.assign({},newData,formData)) 
                        })
                }
                if(tableContent.length>0){
                    let exist=[]
                    tableContent.map((item,index)=>{
                        if (item.pseudoId==formData.pseudoId){
                            exist.push(formData)
                        }
                        if(index==tableContent.length-1 && item.pseudoId==formData.pseudoId){
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , axiosKey)
                            .then((InputFactorValue)=>{
                                InputFactorValue.data.result.map((InputFactorValueItem)=>{
                                    if(InputFactorValueItem.pseudoId==formData.pseudoId && InputFactorValueItem.inputId==inputId){
                                        let updatedData={...formData, value : parseFloat(formData.value) + parseFloat(InputFactorValueItem.value) , inputId : InputFactorValueItem.inputId  , valueId : InputFactorValueItem.valueId}
                                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue",   {data : updatedData} , axiosKey )
                                        .then((res) => {
                                            successCallback (formData)
                                            setFormValues({})
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                            setNewData(Object.assign({},newData,formData)) 
                                        })
                                    }
                                })
                            })
                        }
                        if(index==tableContent.length-1 && item.pseudoId!=formData.pseudoId && exist.length==0){
                            let postData=Object.assign({},formData, {inputId : inputId } )
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue", {data : postData} , axiosKey )
                                .then((res) => {
                                    successCallback (formData)
                                    setFormValues({})
                                    setNewData(Object.assign({},newData,formData)) 
                                })
                        }
                        if(index==tableContent.length-1 && item.pseudoId!=formData.pseudoId && exist.length>0){
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , axiosKey)
                            .then((InputFactorValue)=>{
                                InputFactorValue.data.result.map((InputFactorValueItem)=>{
                                    if(InputFactorValueItem.pseudoId==formData.pseudoId && InputFactorValueItem.inputId==inputId){
                                        let updatedData={...formData, value : parseFloat(formData.value) + parseFloat(InputFactorValueItem.value) , inputId : InputFactorValueItem.inputId  , valueId : InputFactorValueItem.valueId}
                                        axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue",   {data : updatedData} , axiosKey )
                                        .then((res) => {
                                            successCallback (formData)
                                            setFormValues({})
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, ' اطلاعات با موفقیت ثبت شد'));
                                            setNewData(Object.assign({},newData,formData)) 
                                        })
                                    }
                                })
                            })
                        }
                    })
                }
            }
            if(editSituation){
                if(!formData.value || formData.value==""){formData.value=0}
                if(tableContent.length==0){
                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${formData.pseudoId}&companyId=${companyId}` , axiosKey)
                    .then((response)=>{
                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                        formData={...formData,fullName : fullName}
                        let createUpdate=[]
                        createUpdate.push(formData)
                        setTimeout(()=>{
                            successCallback (formData)
                            setFormValues({})
                            setTableContent(createUpdate)
                            setUpdateInlineData(createUpdate)
                        },500)
                    })
                }
                if(tableContent.length>0){
                    let exist=[]
                    tableContent.map((item,index)=>{
                        if (item.pseudoId==formData.pseudoId){
                            exist.push(formData)
                        }
                        if(index==tableContent.length-1 && item.pseudoId==formData.pseudoId){
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?" , axiosKey)
                            .then((InputFactorValue)=>{
                                InputFactorValue.data.result.map((InputFactorValueItem)=>{
                                    if(InputFactorValueItem.pseudoId==formData.pseudoId && InputFactorValueItem.inputId==inputId){
                                        let updatedData={...formData, value : parseFloat(formData.value) + parseFloat(InputFactorValueItem.value)}

                                        var finishItrate
                                        let createUpdate=[]
                                        if(tableContent.length>0){
                                            tableContent.map((upitem,index)=>{
                                                if (upitem.pseudoId==formData.pseudoId){
                                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${formData.pseudoId}&companyId=${companyId}` , axiosKey)
                                                    .then((response)=>{
                                                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                        updatedData={...updatedData,fullName : fullName}
                                                        createUpdate.push(updatedData)
                                                    })
                                                }
                                                else{
                                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${upitem.pseudoId}&companyId=${companyId}` , axiosKey)
                                                    .then((response)=>{
                                                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                        upitem={...upitem,fullName : fullName}
                                                        createUpdate.push(upitem)
                                                    })
                                                }
                                                
                                                clearTimeout(finishItrate)
                                                finishItrate=setTimeout(()=>{
                                                    successCallback (formData)
                                                    setFormValues({})
                                                    setTableContent(createUpdate)
                                                    setUpdateInlineData(createUpdate)
                                                },1000)
                                            })
                                        }
                                    }
                                })
                            })
                        }
                        if(index==tableContent.length-1 && item.pseudoId!=formData.pseudoId && exist.length==0){
                            var finishItrate
                            let createUpdate=[]
                            if(tableContent.length>0){
                                tableContent.map((upitem,index)=>{
                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${upitem.pseudoId}&companyId=${companyId}` , axiosKey)
                                    .then((response)=>{
                                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                        upitem={...upitem,fullName : fullName}
                                        createUpdate.push(upitem)
                                        if (index==tableContent.length-1){
                                            axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${formData.pseudoId}&companyId=${companyId}` , axiosKey)
                                            .then((response)=>{
                                                let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                formData={...formData,fullName : fullName}
                                                createUpdate.push(formData)
                                            })
                                        }
                                    })
                                    clearTimeout(finishItrate)
                                    finishItrate=setTimeout(()=>{
                                        successCallback (formData)
                                        setFormValues({})
                                        setTableContent(createUpdate)
                                        setUpdateInlineData(createUpdate)
                                    },1000)
                                })
                            }
                        }
                        if(index==tableContent.length-1 && item.pseudoId!=formData.pseudoId && exist.length>0){
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , axiosKey)
                            .then((InputFactorValue)=>{
                                InputFactorValue.data.result.map((InputFactorValueItem)=>{
                                    if(InputFactorValueItem.pseudoId==formData.pseudoId && InputFactorValueItem.inputId==inputId){
                                        let updatedData={...formData, value : parseFloat(formData.value) + parseFloat(InputFactorValueItem.value)}
                                        var finishItrate
                                        let createUpdate=[]
                                        if(tableContent.length>0){
                                            tableContent.map((upitem,index)=>{
                                                if (upitem.pseudoId==formData.pseudoId){
                                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${formData.pseudoId}&companyId=${companyId}` , axiosKey)
                                                    .then((response)=>{
                                                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                        updatedData={...updatedData,fullName : fullName}
                                                        createUpdate.push(updatedData)
                                                    })
                                                }
                                                else{
                                                    axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${upitem.pseudoId}&companyId=${companyId}` , axiosKey)
                                                    .then((response)=>{
                                                        let fullName = `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}` 
                                                        upitem={...upitem,fullName : fullName}
                                                        createUpdate.push(upitem)
                                                    })
                                                }
                                                
                                                clearTimeout(finishItrate)
                                                finishItrate=setTimeout(()=>{
                                                    successCallback (formData)
                                                    setFormValues({})
                                                    setTableContent(createUpdate)
                                                    setUpdateInlineData(createUpdate)
                                                },1000)
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    })
                }
            }
        }
    }
        // edit callBack of TableProEditInline 
    const handleEdit = ()=>{
        let formData=formValues
        if(!editSituation){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue" , axiosKey)
                .then((InputFactorValue)=>{
                    InputFactorValue.data.result.map((item)=>{
                        if(item.pseudoId==formValues.pseudoId && item.inputId==inputId){
                            if(!formData.value || formData.value==""){formData.value=0}
                            let updatedData=Object.assign({},formData, {inputId : item.inputId } , {valueId : item.valueId})
                            axios.put(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue",   {data : updatedData} , axiosKey )
                                .then(() => {
                                    setEdit(false)
                                    successCallback(formData)
                                    setNewData(Object.assign({},newData,formData)) 
                                })
                        }
                    })
                })
        }
        else{
            const TableIndex = tableContent.findIndex(i=>i.pseudoId == formValues.pseudoId )
            if(!formData.value || formData.value==""){formData.value=0}
            successCallback(formValues)
            let editedData=[]
            tableContent.map((item,index)=>{
                if(index==TableIndex){
                    editedData.push(formData)
                }
                if(index!=TableIndex){
                    editedData.push(item)
                }
                if(index==tableContent.length-1){
                    setTimeout(()=>{
                        setTableContent(editedData)
                        setUpdateInlineData(editedData)
                        setEdit(false)
                        setFormValues({})
                    },100)
                }
            })
        }
    }
    const handleClosefunc =()=>{
        handleClose()
        setInvalidId(false)
        setStyle(false)     
    }
    React.useEffect(()=>{
        if(formValues?.pseudoId && formValues?.pseudoId !=""){
            var getName;
            clearTimeout(getName);
            getName=setTimeout(() => { 
                axios.get(SERVER_URL + `/rest/s1/fadak/fullNameOfPseudoId?pseudoId=${formValues.pseudoId}&companyId=${companyId}` , axiosKey)
                    .then((response)=>{
                        setFormValues(prevState =>({
                            ...prevState,
                            fullName : `${response.data?.firstName || ''} ${ response.data?.lastName || ""} ${ response.data?.suffix || ""}`  ,
                        
                        }))     
                        setInvalidId(false)
                        setStyle(false)                
                    })
                    // error in pseudoId that input by user in creating data in inline table
                    .catch(()=>{
                        setFormValues(prevState =>({
                            ...prevState,
                            fullName : ""
                        }))
                        setInvalidId(true)
                        setStyle(true)
                    })
            } , 1000)
        }
    },[formValues.pseudoId])
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(edit){
                    handleEdit()
                }else{
                    handleCreate()
                }
            }}
            resetCallback={handleClosefunc}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{edit ? "ویرایش" : "افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

function InvalidPseudoId(props) {
    const {invalidId , setInvalidId ,formValues , setFormValues , tableContent ,style , setStyle}=props
    const [val,setVal]=useState(formValues.pseudoId)
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();
    const autoCompleteHandlerChange = (newVal)=>{
        setStyle(false)
        setVal(newVal)
        formValues.pseudoId = newVal 
        setFormValues(Object.assign({},formValues))
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                 <TextField 
                        type={"number"}
                        value={val}
                        onChange={(e) => { autoCompleteHandlerChange(e.target.value) }}
                        fullWidth margin="none"  
                        label="کد پرسنلی"
                        helperText={(!style) ? "" : "کد پرسنلی وارد شده نامعتبر است"}
                        className={(!style) ? classes.formControl : classes.root}
                        FormHelperTextProps={{ classes: helperTestClasses }}
                        FormHelperTextProps={{ classes: helperTestClasses }}
                        id="code"
                        name="code"  variant={"outlined"} 
                />
            </Grid>
        </Grid>
    )
}
  