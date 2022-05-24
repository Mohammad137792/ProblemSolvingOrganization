import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import { useState } from 'react';
import { useEffect } from 'react';
import { Button ,Grid ,TextField , Typography } from "@material-ui/core";
import TablePro from '../../../../components/TablePro';
import ActionBox from './../../../../components/ActionBox';
import FormPro from './../../../../components/formControls/FormPro';
import { makeStyles } from "@material-ui/core/styles";
import {useDispatch} from 'react-redux'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak"; 

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
    const { data , editSituation , setEditSituation , updateInlineData , setUpdateInlineData , updateSituation , showFoem , tableContent , setTableContent , storeInlineTableContent , setStoreInlineTableContent}  = props
    // const [tableContent, setTableContent] = React.useState([]);
    const [constantId , setConstantId]=useState({})
    const tableCols = [
        {name: "sequenceNum", label: "شماره", type: "number", style: {width:"10%"} },
        {name: "enTitle", label: "عنوان  انگلیسی", type: "text", style: {width:"20%"} },
        {name: "faTitle", label: "عنوان فارسی", type: "text", style: {width:"20%"} },
        {name: "value", label: "مقدار", type: "number" , style: {width:'10%'}}
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const [newData,setNewData]=useState(true)
    const[loading,setLoading]=React.useState(true);
    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            if(!updateSituation){
                axios.delete(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue?constantValueId=" + rowData.constantValueId , axiosKey )
                .then(res => {
                    resolve()
                }).catch(err => {
                    reject(err)
                });
            }
            else{
                let deleteRow=[]
                const TableIndex = tableContent.findIndex(i=>rowData.code == i.code)
                if(tableContent[TableIndex]?.constantValueId){
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/FormulaConstant?constantValueId=" + tableContent[TableIndex]?.constantValueId , axiosKey )
                    .then(res => {
                        if(res.data.result.length>0){
                            reject("این مقدار ثابت در فرمول استفاده شده است و امکان حذف آن وجود ندارد")
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
            }
        })
    }
    useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue?constantId=" + data?.constantId , axiosKey)
            .then(res => {
                setStoreInlineTableContent(res.data.result)
            })
    },[]);
    useEffect(()=>{
        setConstantId(Object.assign({},constantId,{constantId :  data?.constantId }))
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue?constantId=" + data?.constantId , axiosKey)
            .then(res => {
                if(updateSituation){
                    let array = []
                    if(res.data.result.length>0){
                        res.data.result.map((item,index)=>{
                            item={...item , code : new Date().valueOf() + index }
                            array.push(item)
                        if(index == res.data.result.length-1){
                            setTimeout(()=>{
                                setTableContent(array)
                                setLoading(false)
                                setNewData(false)
                            },100)

                        }
                        })
                    }
                    else{
                        setTableContent([])
                        setLoading(false)
                        setNewData(false)
                    }

                }
                else{
                    setTableContent(res.data.result)
                    setLoading(false)
                    setNewData(false)
                }
            })
    },[newData,data?.constantId]);

    return (
        <> 
            {showFoem ? 
                <TablePro
                    // title="مدارک مورد نیاز"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    exportCsv="مقادیر ثابت"
                />
                : ""}
            {!showFoem ?
                <TablePro
                    // title="مدارک مورد نیاز"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    add="external"
                    addForm={<InlineForm data={data}  setNewData={setNewData} newData={newData} tableContent={tableContent} setTableContent={setTableContent} constantId={constantId}
                    editSituation={editSituation} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData}  loading={loading} updateSituation={updateSituation}
                    loading ={loading} setLoading={setLoading} />}
                    edit="external"
                    editForm={<InlineForm data={data}  setNewData={setNewData} newData={newData} tableContent={tableContent} setTableContent={setTableContent} constantId={constantId}
                    editSituation={editSituation} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData}  loading={loading} editing={true} updateSituation={updateSituation}
                    loading ={loading} setLoading={setLoading}/>}
                    removeCallback={handleRemove}
                    loading={loading}
                    exportCsv="مقادیر ثابت"
                />
                :""}
        </>
    )
}

function InlineForm({ editing = false, ...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose ,  data , excelData , excelSituation , companyId , setExcelData , loading , setLoading ,
         setHandleInputFile , editSituation , updateInlineData , setUpdateInlineData , tableContent , setTableContent , constantId , setNewData , newData , updateSituation} = restProps;
    const [edit,setEdit]=useState(editing)
    const [formValidation, setFormValidation] =React.useState({});
    const [invStyle , setInvStyle] = useState({uniqNum : false , uniqTitle : false , invNum : false , invTitle : false})
    const formStructure = [
    invStyle.uniqNum || invStyle.invNum ? {
        type    : "component",
        component: <InvNum formValues={formValues} setFormValues={setFormValues} style={invStyle} setStyle={setInvStyle} /> ,
        col     : 3
    } : {
        label:  "شماره",
        name:   "sequenceNum",
        type:   "number",
        required : true ,
        col     : 3
    }, invStyle.uniqTitle || invStyle.uniqTitle ? {
        type    : "component",
        component: <InvTitle formValues={formValues} setFormValues={setFormValues} style={invStyle} setStyle={setInvStyle} /> ,
        col     : 3
    }: {
        label:  "عنوان انگلیسی",
        name:   "enTitle",
        type:   "text",
        required : true ,
        col     : 3
    },{
        label:  "عنوان فارسی",
        name:   "faTitle",
        type:   "text",
        col     : 3
    },{
        label:  "مقدار",
        name:   "value",
        type:   "number",
        col     : 3
    }]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch();
    const handleCreate = ()=>{
        if(!formValues.sequenceNum || formValues.sequenceNum=="" || !formValues.enTitle || !formValues.enTitle=="" ){
            if(!formValues.sequenceNum || formValues.sequenceNum==""){setInvStyle((preState)=>({...preState , invNum : true}))}
            if(!formValues.enTitle || !formValues.enTitle==""){setInvStyle((preState)=>({...preState , invTitle : true}))}
            if((!formValues.sequenceNum || formValues.sequenceNum=="") && (!formValues.enTitle || !formValues.enTitle=="")){setInvStyle((preState)=>({...preState , invNum : true , invTitle : true}))}
        }
        const ind = tableContent.findIndex(i=>i.sequenceNum===parseInt( formValues.sequenceNum, 10) || i.enTitle == formValues.enTitle || i.sequenceNum===formValues.sequenceNum) 
        if(ind>-1){
            if (tableContent[ind].sequenceNum==parseInt( formValues.sequenceNum, 10) || tableContent[ind].sequenceNum == formValues.sequenceNum){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره وارد شده تکراری می باشد"))
                setInvStyle((preState)=>({...preState , uniqNum : true}))
            }
            if (tableContent[ind].enTitle==formValues.enTitle){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "عنوان انگلیسی وارد شده تکراری می باشد"))
                setInvStyle((preState)=>({...preState , uniqTitle : true}))
            }
            if (tableContent[ind].enTitle==formValues.enTitle && (tableContent[ind].sequenceNum==parseInt( formValues.sequenceNum, 10) || tableContent[ind].sequenceNum == formValues.sequenceNum)){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره و عنوان انگلیسی وارد شده تکراری می باشد"));
                setInvStyle((preState)=>({...preState , uniqNum : true , uniqTitle : true }))
            }
            return null
        }
        else{
            if(!updateSituation){
                let formData=formValues
                if(!formData.value || formData.value==""){formData.value=0}
                let postData=Object.assign({},formData, constantId)
                axios.post(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue", {data : postData} , axiosKey )
                    .then(()=>{ 
                        successCallback(formValues)
                        setFormValues({})
                        setNewData(true)
                        setLoading(true)
                        setInvStyle((preState)=>({...preState , uniqNum : false , uniqTitle : false , invNum : false , invTitle : false}))
                    }).catch(()=>{
                    })
            
            }
            else {
                let formData={...formValues , code : new Date().valueOf()} 
                successCallback(formData)
                setInvStyle((preState)=>({...preState , uniqNum : false , uniqTitle : false , invNum : false , invTitle : false}))
                setFormValues({})
                if(!formData.value || formData.value==""){formData.value=0}
                var finishItrate
                let createUpdate=[]
                if(tableContent.length>0){
                    tableContent.map((item,index)=>{
                        createUpdate.push(item)
                        clearTimeout(finishItrate)
                        finishItrate=setTimeout(()=>{
                            createUpdate.push(formData)
                            setUpdateInlineData(createUpdate)
                        },100)
                    })
                }
                if(tableContent.length==0){
                    let formData={...formValues , code : new Date().valueOf()} 
                    successCallback(formData)
                    createUpdate.push(formData)
                    setUpdateInlineData(createUpdate)
                }
            }   
        } 
    }
        // edit callBack of TableProEditInline 
    const handleEdit = ()=>{
        if(!formValues.sequenceNum || formValues.sequenceNum=="" || !formValues.enTitle || !formValues.enTitle=="" ){
            if(!formValues.sequenceNum || formValues.sequenceNum==""){setInvStyle((preState)=>({...preState , invNum : true}))}
            if(!formValues.enTitle || !formValues.enTitle==""){setInvStyle((preState)=>({...preState , invTitle : true}))}
            if((!formValues.sequenceNum || formValues.sequenceNum=="") && (!formValues.enTitle || !formValues.enTitle=="")){setInvStyle((preState)=>({...preState , invNum : true , invTitle : true}))}
        }
        const ind = (tableContent.findIndex(i=>(i.sequenceNum===parseInt(formValues.sequenceNum, 10) || i.enTitle == formValues.enTitle || i.sequenceNum===formValues.sequenceNum) && (formValues.code != i.code ? true : false )))
        if(ind > -1 ){
            if (tableContent[ind].sequenceNum==parseInt(formValues.sequenceNum, 10) || tableContent[ind].sequenceNum == formValues.sequenceNum){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره وارد شده تکراری می باشد"));
                setInvStyle((preState)=>({...preState , uniqNum : true}))
            }
            if (tableContent[ind].enTitle==formValues.enTitle){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "عنوان انگلیسی وارد شده تکراری می باشد"));
                setInvStyle((preState)=>({...preState , uniqTitle : true}))
            }
            if (tableContent[ind].enTitle==formValues.enTitle && (tableContent[ind].sequenceNum==parseInt(formValues.sequenceNum, 10) || tableContent[ind].sequenceNum == formValues.sequenceNum)){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره و عنوان انگلیسی وارد شده تکراری می باشد"));
                setInvStyle((preState)=>({...preState , uniqNum : true , uniqTitle : true}))
            }
        }
        else{
            let formData=formValues
            if(!updateSituation){
                if(!formData.value || formData.value==""){formData.value=0}
                let updatedData=Object.assign({},formData,constantId)
                axios.put(SERVER_URL + "/rest/s1/fadak/entity/ConstantValue", {data : updatedData} , axiosKey )
                    .then(() => {
                        successCallback(formValues)
                        setInvStyle((preState)=>({...preState , uniqNum : false , uniqTitle : false , invNum : false , invTitle : false}))
                    }).catch(()=>{
                    })
            }
            else{
                const TableIndex = tableContent.findIndex(i=>formValues.code == i.code)
                if(!formData.value || formData.value==""){formData.value=0}
                successCallback(formValues)
                setInvStyle((preState)=>({...preState , uniqNum : false , uniqTitle : false , invNum : false , invTitle : false}))
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
                            setUpdateInlineData(editedData)
                            
                        },100)
                    }
                })
            }
        }
    }
    React.useEffect(()=>{
        if(!invStyle.uniqTitl){
            formValues.enTitle = formValues?.enTitle ? formValues?.enTitle.replace(/[^A-Za-z0-9]/gi, "") : "" ;
            setFormValues(Object.assign({},formValues))
        }

    },[formValues.enTitle])
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
            resetCallback={()=>handleClose()}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{edit ? "ویرایش" : "افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

function InvNum(props) {
    const {formValues , setFormValues , style , setStyle }=props
    const [val ,setVal]=useState(formValues.sequenceNum)
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();
    const handleOnchange = (newVal)=>{
        setStyle((preState)=>({...preState , uniqNum : false}))
        setVal(newVal)
        formValues.sequenceNum = newVal
        setFormValues(Object.assign({},formValues))
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                 <TextField 
                    type="number"
                    onChange={e=>handleOnchange(e.target.value)}
                    value ={val}
                    fullWidth margin="none"
                    limitTags = {2}  
                    required label="شماره"
                    helperText={(!style.uniqNum) ? "" : "کد وارد شده تکراری است"}
                    className={(!style.uniqNum) ? classes.formControl : classes.root}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    id="sequenceNum"
                    name="sequenceNum"  variant={"outlined"} 
                />
            </Grid>
        </Grid>
    )
}

function InvTitle(props) {
    const {formValues , setFormValues , style , setStyle }=props
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();
    const [val ,setVal]=useState(formValues.enTitle)
    const handleOnchange = (newVal)=>{
        setStyle((preState)=>({...preState , uniqTitle : false}))
        setVal(newVal ? newVal.replace(/[^A-Za-z0-9]/gi, "") : "")
        formValues.enTitle = val ? val.replace(/[^A-Za-z0-9]/gi, "") : ""
        setFormValues(Object.assign({},formValues))
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <TextField 
                    fullWidth margin="none"
                    type="text"
                    value={val}
                    onChange={e=>handleOnchange(e.target.value)}
                    limitTags = {2}  
                    required label="عنوان انگلیسی"
                    helperText={(!style.uniqTitle) ? "" : "عنوان انگلیسی وارد شده تکراری است"}
                    className={(!style.uniqTitle) ? classes.formControl : classes.root}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    id="enTitle"
                    name="enTitle"  variant={"outlined"}
                />
            </Grid>
        </Grid>
    )
}