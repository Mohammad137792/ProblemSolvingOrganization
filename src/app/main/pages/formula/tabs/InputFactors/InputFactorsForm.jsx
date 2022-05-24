import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {Card, CardContent, CardHeader, Grid, TextField,  FormControl , FormControlLabel , Switch} from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button'
import DatePicker from './../../../../components/DatePicker';
import InlineTable from "./InlineTable"
import {Add} from "@material-ui/icons";
import TablePro from "../../../../components/TablePro"
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useDispatch} from 'react-redux'

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
    }
});

const InputFactorsForm = (props) => {
    let {data , currentData , formValues , setFormData , addFormValue , setStyle , style , setDataToTable , informationOfEditedRow , submit , updateInlineData , setUpdateInlineData ,
         setCurrentData , cancel , editedInformation , checkedStatus , setCheckedStatus  , handleInputFile , setHandleInputFile , loading , setLoading , deleteRow ,
         editInfo , setEditInfo , tableContent , setTableContent , showFoem , setShowForm , errorStyle , setErrorStyle , inlineTableContent , setInlineTableContent ,
         storeInlineTableContent , setStoreInlineTableContent} =props

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const dispatch = useDispatch();

    const helperTestClasses = helperTextStyles();
    const classes = useStyles();
    //handle change of AutoComplete field and put the information in formData State
    const handleChange =((inputData,field)=>{
        if (inputData==null){formValues = { ...formValues, [field]: null }}
        if (inputData!= null){
            setStyle(prevState => ({...prevState,[field] : true }))
            formValues = { ...formValues,[field] : inputData }
        }
        setFormData(formValues)
    })
    //handle Date change 
    const handlDate=(date,field)=>{ 
        if (date==null && field =="createDate" ){formValues = { ...formValues, createDate: new Date ()}}
        if(date!==null){
            formValues = {...formValues,[field]: new Date(date)}
        }
        const newFormData = Object.assign({}, formValues)
        setFormData(newFormData)
    }
    //handle situation of indicator
    const switchHandler = event => {
        if(!showFoem){
            formValues = { ...formValues, active : event.target.checked }
            const newFormData = Object.assign({}, formValues)
            setFormData(newFormData)
            checkedStatus.defaultValue=event.target.checked
            setCheckedStatus(checkedStatus)
        }
      }
    const tableCols = [
        {name: "type", label: "عنوان عامل ورودی", type: "select", options: "InputFactor" , style: {maxWidth:"80px"}},
        {name: "version", label: "ورژن", type: "text",  style: {maxWidth:"80px"}},
        {name: "date", label: "تاریخ ایجاد", type: "date" , style: {maxWidth:"80px"}},
        {name: "statusId", label: "فعال", type: "indicator", style: {maxWidth:"80px"}},
        {name: "fromDate", label: "از تاریخ", type: "date" , style: {maxWidth:"100px"}},
        {name: "thruDate", label: "تا تاریخ", type: "date" , style: {maxWidth:"100px"}}
    ]
    const deleteConfirm=(data)=>{
        return new Promise((resolve, reject) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'اطلاعات در حال حذف می باشد '));
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/InputFactorValue?inputId=" + data?.inputId  , axiosKey)
                .then((inputIdValue)=>{
                    if (inputIdValue.data.result.length>0){
                        let inputFactorValueInFormula = 0
                        inputIdValue.data.result.map((item1 , index1)=>{
                            axios.get(SERVER_URL + "/rest/s1/fadak/entity/FormulaInputFactor?inputFactorValueId=" + item1.valueId , axiosKey ).then((exist)=>{
                                if(exist.data.result.length>0){inputFactorValueInFormula=inputFactorValueInFormula+1}
                                if(index1==inputIdValue.data.result.length-1 && inputFactorValueInFormula == 0){
                                    inputIdValue.data.result.map((item2 , index2)=>{
                                        axios.delete(SERVER_URL + `/rest/s1/fadak/entity/InputFactorValue?valueId=${item2.valueId}`, axiosKey)
                                            .then(()=>{
                                                if(index2==inputIdValue.data.result.length-1){
                                                    axios.delete(SERVER_URL + "/rest/s1/fadak/entity/InputFactor?inputId=" + data?.inputId, axiosKey)
                                                        .then(()=>{
                                                            resolve()
                                                        }).catch(()=>{
                                                            reject()
                                                        })
                                                }
                                            })
                                    })   
                                }
                                if(index1==inputIdValue.data.result.length-1 && inputFactorValueInFormula!=0){
                                    reject("از این عامل ورودی در فرمول استفاده شده است امکان حذف آن وجود ندارد")
                                }
                            })
                        }) 
                    }
                    if (inputIdValue.data.result.length==0){
                        axios.delete(SERVER_URL + "/rest/s1/fadak/entity/InputFactor?inputId=" + data?.inputId, axiosKey)
                            .then(()=>{
                                resolve()
                            }).catch(()=>{
                                reject()
                            })
                    }
                })
        })
    }
    return (
        <>
            <Card>
                <CardContent>
                    <Card variant="outlined">
                        <CardHeader title="عوامل ورودی"/>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {showFoem ? 
                                        <>
                                            <Grid item xs={12} md={4}>
                                                <Autocomplete 
                                                    id="InputFactorTypeEnumId" name="InputFactorTypeEnumId"
                                                    options={data.typeOfInputFactor}
                                                    getOptionLabel={options => options.description}
                                                    onChange={(event,inputData)=>{handleChange(inputData , "typeOfInputFactor")}}
                                                    disabled={(editInfo) ? true : false}
                                                    // inputProps={(editInfo) ? { readOnly : true } : ""}
                                                    value={formValues.typeOfInputFactor ??
                                                        (data.typeOfInputFactor.find(o=>o.enumId==editInfo?.type) ?? "")}
                                                    renderInput={params => {
                                                        return (
                                                            <TextField required
                                                                {...params}
                                                                helperText={(style && style.typeOfInputFactor) ? "" : "پر کردن این فیلد الزامی است"}
                                                                className={(style && style.typeOfInputFactor) ? classes.formControl : classes.root}
                                                                FormHelperTextProps={{ classes: helperTestClasses }}
                                                                variant="outlined"
                                                                label="نوع عامل ورودی"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField  fullWidth
                                                    variant="outlined" id="version" name="version"
                                                    label="نسخه ی عامل ورودی" type={"number"}
                                                    disabled={true}
                                                    // inputProps={{ readOnly : true }}
                                                    value={(formValues.typeOfInputFactor && currentData?.version) ? currentData?.version : (editInfo?.version ?? "")}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <FormControl>
                                                    <FormControlLabel
                                                        control={<Switch
                                                            id="active"
                                                            name="active"
                                                            checked={checkedStatus.defaultValue}
                                                            onChange={switchHandler} 
                                                        />}
                                                        label="فعال" />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    :
                                        <>
                                            <Grid item xs={12} md={3}>
                                                <Autocomplete 
                                                    id="InputFactorTypeEnumId" name="InputFactorTypeEnumId"
                                                    options={data.typeOfInputFactor}
                                                    getOptionLabel={options => options.description}
                                                    onChange={(event,inputData)=>{handleChange(inputData , "typeOfInputFactor")}}
                                                    disabled={(editInfo) ? true : false}
                                                    // inputProps={(editInfo) ? { readOnly : true } : ""}
                                                    value={formValues.typeOfInputFactor ??
                                                        (data.typeOfInputFactor.find(o=>o.enumId==editInfo?.type) ?? "")}
                                                    renderInput={params => {
                                                        return (
                                                            <TextField required
                                                                {...params}
                                                                helperText={(style && style.typeOfInputFactor) ? "" : "پر کردن این فیلد الزامی است"}
                                                                className={(style && style.typeOfInputFactor) ? classes.formControl : classes.root}
                                                                FormHelperTextProps={{ classes: helperTestClasses }}
                                                                variant="outlined"
                                                                label="نوع عامل ورودی"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <FormControl>
                                                    <FormControlLabel
                                                        control={<Switch
                                                            id="active"
                                                            name="active"
                                                            checked={checkedStatus.defaultValue}
                                                            onChange={switchHandler} 
                                                        />}
                                                        label="فعال" />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField  fullWidth
                                                    variant="outlined" id="version" name="version"
                                                    label="نسخه ی عامل ورودی" type={"number"}
                                                    disabled={true}
                                                    // inputProps={{ readOnly : true }}
                                                    value={(formValues.typeOfInputFactor && currentData?.version) ? currentData?.version : (editInfo?.version ?? "")}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} >
                                                <div>
                                                    <label htmlFor="contentLocation">پیوست</label><br/>
                                                    <input type="file" onChange={(event,inputData)=>{handleChange(event.target.files[0] , "attachedFile")}} onClick={e => (e.target.value = null)} key={handleInputFile} accept=".zip , .rar" id="contentLocation"  name="contentLocation"/>
                                                </div>
                                            </Grid>
                                        </>
                                    }
                                    <Grid item xs={12} md={4}>
                                        <TextField  fullWidth
                                            variant="outlined" id="code1" name="code1"
                                            label=" لیست شرکتها "
                                            value={currentData.companyName}
                                            disabled={true}
                                            // inputProps={{ readOnly: true, }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                            <TextField  fullWidth
                                                    variant="outlined" id="nameAndFamily" name="nameAndFamily"
                                                    label="نام و نام خانوادگی   "
                                                    disabled={true}
                                                    // inputProps={{ readOnly : true }}
                                                    value={currentData.fullName??""}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Autocomplete 
                                            id="creatorEmplPositionId" name="creatorEmplPositionId"
                                            options={currentData.positionsInformation}
                                            getOptionLabel={options => options.positionName}
                                            disabled={(editInfo ) ? true : false}
                                            value={formValues?.positions?? 
                                                (currentData.positionsInformation.find(o=>o.positionId==editInfo?.emplPositionId) ?? "")}
                                            onChange={(event , inputData)=>{handleChange(inputData , "positions")}}
                                            renderInput={params => {
                                                return (
                                                    <TextField required
                                                        {...params}
                                                        helperText={(style && style.positions) ? "" : "پر کردن این فیلد الزامی است"}
                                                        className={(style && style.positions) ? classes.formControl : classes.root}
                                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                                        variant="outlined"
                                                        label="پست سازمانی  "
                                                    />
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DatePicker 
                                            variant="outlined"
                                            id="createDate"
                                            name="createDate"
                                            required
                                            disabled={true}
                                            value={formValues?.createDate ?? (editInfo?.date ?? new Date ())}
                                            setValue={(date)=>{handlDate(date , "createDate")}}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="تاریخ ایجاد"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DatePicker 
                                            variant="outlined"
                                            id="fromDate"
                                            name="fromDate"
                                            disabled={(showFoem) ? true : false}
                                            value={formValues?.fromDate ?? (editInfo?.fromDate ?? null )}
                                            setValue={(date)=>{handlDate(date,"fromDate")}}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="از تاریخ"
                                            fullWidth
                                            helperText={(errorStyle?.overlapFromDate) ? "بازه ی تاریخی انتخابی دارای همپوشانی است" : ""}
                                            error={errorStyle?.overlapFromDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DatePicker 
                                            variant="outlined"
                                            id="thruDate"
                                            name="thruDate"
                                            disabled={(showFoem ) ? true : false}
                                            value={formValues?.thruDate ?? (editInfo?.thruDate ?? null )}
                                            setValue={(date)=>{handlDate(date,"thruDate")}}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="تا تاریخ"
                                            fullWidth
                                            helperText={(errorStyle?.overlapThurDate) ? "بازه ی تاریخی انتخابی دارای همپوشانی است" : (errorStyle?.invThruData) ? "تاریخ وارد شده نامعتبر است" : ""}
                                            error={errorStyle?.overlapThurDate || errorStyle?.invThruData}
                                        />
                                    </Grid>
                                </Grid> 
                                {(!editInfo) && showFoem==false ?   
                                    <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                        <Button variant="contained" color="default" className="mt-5"  onClick={cancel} >لفو</Button>
                                        <Button style={{ maxWidth: '88px', marginRight: "1rem" }} variant="contained" color="secondary" className="mt-5"  startIcon={<Add />} onClick={setDataToTable}>افزودن</Button>                          
                                    </Grid>
                                    :""}
                                {(editInfo)  ? 
                                    <>
                                        {showFoem==false ? 
                                        <Grid style={{ display: 'flex', justifyContent: 'flex-start' , marginTop:'10px'}}>
                                            <span>
                                                    فایل اکسل خود را وارد کنید دقت کنید سطر اول فایل اکسل باید شامل مقادیر کد پرسنلی (pseudoId)  و مقدار  (value) باشد 
                                            </span>
                                        </Grid>
                                        :""}
                                        <Grid item xs={12} md={12} > 
                                            <InlineTable data={editInfo}  excelSituation={currentData.excelSituation} companyId={currentData.companyPartyId}
                                            setHandleInputFile={setHandleInputFile} editSituation={!submit} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData} showFoem={showFoem}
                                            tableContent={inlineTableContent} setTableContent={setInlineTableContent} storeInlineTableContent={storeInlineTableContent} setStoreInlineTableContent={setStoreInlineTableContent} />
                                        </Grid> 
                                    </>
                                    :
                                    <Grid/>
                                }   
                                {
                                    editInfo && submit && showFoem==false ?
                                        <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                            <Button style={{ maxWidth: '88px', marginRight: "1rem" }} variant="contained" color="default" className="mt-5" onClick={editedInformation}>ثبت</Button>
                                        </Grid>
                                    :""}  
                                {
                                    editInfo && !submit && showFoem==false ?
                                        <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                            <Button variant="contained" color="default" className="mt-5"  onClick={cancel} >لفو</Button>
                                            <Button style={{ maxWidth: '88px', marginRight: "1rem" }} variant="contained" color="default" className="mt-5" onClick={editedInformation}>ثبت</Button>
                                        </Grid>
                                    :""}
                                {
                                    showFoem==true ?
                                        <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                            <Button variant="contained" color="default" className="mt-5"  onClick={cancel} >لفو</Button>
                                        </Grid>
                                    :""}    
                            </CardContent>
                    </Card>
                    <Card variant="outlined" >
                        <TablePro
                            title="لیست عوامل ورودی"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            edit="callback"
                            editCallback={informationOfEditedRow}
                            removeCallback={deleteConfirm}
                            loading={loading}
                        />
                    </Card>
                </CardContent>
            </Card>
        </>
    );
};

export default InputFactorsForm;