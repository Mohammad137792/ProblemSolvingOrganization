import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {Card, CardContent, CardHeader, Grid, TextField} from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete';
import CTable from './../../../../components/CTable';
import Button from '@material-ui/core/Button'
import DatePicker from './../../../../components/DatePicker';
import InlineTable from "./InlineTable"
import {Add} from "@material-ui/icons";
import { INPUT_TYPES } from "../../../../helpers/setFormDataHelper";
import TablePro from "../../../../components/TablePro"
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
const ConstantValuesForm = (props) => {
    let {data , formValues , setFormData , setDataToTable , setStyle , style , currentData , setCurrentData , editInfo , setEditInfo , updateInlineData , setUpdateInlineData ,
        cancel , confirm , addFormValue , handleInputFile , setHandleInputFile , editSituation , setEditSituation , edit , firstTimeCreate , setFirstTimeCreate , showFoem , setShowForm ,
        tableContent , setTableContent , loading , setLoading , deleteRow , informationOfEditedRow , creatorPosition , setCreatorPosition , handleButton , inlineTableContent, setInlineTableContent ,
        storeInlineTableContent , setStoreInlineTableContent , errorStyle , setErrorStyle} = props

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
    const tableCols = [
        {name: "title", label: "??????????", type: "text" , style: {width:"15%"}},
        {name: "constantTypeEnumId", label: "?????? ???????????? ????????", type: "select" , options : "ConstantType" , style: {width:"15%"}},
        {name: "copy", label: "????????", type: "text",  style: {width:"5%"}},
        {name: "createDate", label: "?????????? ??????????", type: "date" , style: {width:"15%"}},
        {name: "fromDate", label: "???? ??????????", type: "date" , style: {width:"15%"}},
        {name: "thruDate", label: "???? ??????????", type: "date" , style: {width:"15%"}},

    ]
    return (
        <Card>
            <CardContent>
                <Card variant="outlined">
                    <CardHeader title="???????????? ????????   "/>
                        <CardContent>
                            <Grid container spacing={2}>
                                {showFoem ? 
                                    <>
                                        <Grid item xs={12} md={4}>
                                            <TextField  fullWidth
                                            disabled={true}
                                            variant="outlined" id="title" name="title"
                                            label="??????????     " required
                                            onChange={(event)=>{handleChange(event.target.value , "title")}}
                                            value={formValues.title ?? (editInfo?.title ?? "" )}
                                            helperText={(style && style.title) ? "" : "???? ???????? ?????? ???????? ???????????? ??????"}
                                            className={(style && style.title) ? classes.formControl : classes.root}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Autocomplete 
                                                id="constantTypeEnumId" name="constantTypeEnumId"
                                                options={data.typeOfConstantValues}
                                                getOptionLabel={options => options.description}
                                                onChange={(event,inputData)=>{handleChange(inputData , "typeOfConstantValues")}}
                                                disabled={(editInfo) ? true : false}
                                                value={formValues.typeOfConstantValues ??
                                                    (data.typeOfConstantValues.find(o=>o.enumId==editInfo?.constantTypeEnumId) ?? "")}
                                                renderInput={params => {
                                                    return (
                                                        <TextField required
                                                            {...params}
                                                            helperText={(style && style.typeOfConstantValues) ? "" : "???? ???????? ?????? ???????? ???????????? ??????"}
                                                            className={(style && style.typeOfConstantValues) ? classes.formControl : classes.root}
                                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                                            variant="outlined"
                                                            label="?????? ???????????? ????????"
                                                        />
                                                    );
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField  fullWidth
                                                variant="outlined" id="copy" name="copy"
                                                label="???????? ???????????? ????????   " type={"number"}
                                                disabled={true}
                                                value={(formValues.typeOfConstantValues && currentData?.copy) ? currentData.copy : (editInfo?.copy ?? "")}
                                            />
                                        </Grid>
                                    </>
                                 : 
                                    <>
                                        <Grid item xs={12} md={3}>
                                            <TextField  fullWidth
                                            variant="outlined" id="title" name="title"
                                            label="??????????     " required
                                            onChange={(event)=>{handleChange(event.target.value , "title")}}
                                            value={formValues.title ?? (editInfo?.title ?? "" )}
                                            helperText={(style && style.title) ? "" : "???? ???????? ?????? ???????? ???????????? ??????"}
                                            className={(style && style.title) ? classes.formControl : classes.root}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Autocomplete 
                                                id="constantTypeEnumId" name="constantTypeEnumId"
                                                options={data.typeOfConstantValues}
                                                getOptionLabel={options => options.description}
                                                onChange={(event,inputData)=>{handleChange(inputData , "typeOfConstantValues")}}
                                                disabled={(editInfo) ? true : false}
                                                value={formValues.typeOfConstantValues ??
                                                    (data.typeOfConstantValues.find(o=>o.enumId==editInfo?.constantTypeEnumId) ?? "")}
                                                renderInput={params => {
                                                    return (
                                                        <TextField required
                                                            {...params}
                                                            helperText={(style && style.typeOfConstantValues) ? "" : "???? ???????? ?????? ???????? ???????????? ??????"}
                                                            className={(style && style.typeOfConstantValues) ? classes.formControl : classes.root}
                                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                                            variant="outlined"
                                                            label="?????? ???????????? ????????"
                                                        />
                                                    );
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField  fullWidth
                                                variant="outlined" id="copy" name="copy"
                                                label="???????? ???????????? ????????   " type={"number"}
                                                disabled={true}
                                                value={(formValues.typeOfConstantValues && currentData?.copy) ? currentData.copy : (editInfo?.copy ?? "")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <label htmlFor="contentLocation">??????????</label><br/>
                                            <input type="file" id="contentLocation"  name="contentLocation"
                                            onChange={addFormValue(INPUT_TYPES.FILE , 'attachedFile')}
                                            filename={""}
                                            key={handleInputFile}
                                            onClick={e => (e.target.value = null)}
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} md={4}>
                                    <TextField  fullWidth
                                        variant="outlined" id="code1" name="code1"
                                        label=" ???????? ???????????? "
                                        value={currentData.companyName}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField  fullWidth
                                                variant="outlined" id="nameAndFamily" name="nameAndFamily"
                                                label="?????? ?? ?????? ????????????????   "
                                                disabled={true}
                                                value={editInfo ? (currentData.creatorFullName ?? currentData.fullName) : (currentData.fullName??"")}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Autocomplete 
                                        id="creatorEmplPositionId" name="creatorEmplPositionId"
                                        options={currentData.positionsInformation}
                                        getOptionLabel={options => options.positionName || creatorPosition?.positionName}
                                        disabled={(editInfo) ? true : false}
                                        value={ formValues?.creatorEmplPositionId ? formValues?.creatorEmplPositionId :
                                            (editInfo && firstTimeCreate) ? (currentData.positionsInformation.find(o=>o.positionId==editInfo?.creatorEmplPositionId) ?? "") : ( editInfo && !firstTimeCreate) ? creatorPosition?.positionId : ""}
                                        onChange={(event , inputData)=>{handleChange(inputData , "creatorEmplPositionId")}}
                                        renderInput={params => {
                                            return (
                                                <TextField required
                                                    {...params}
                                                    helperText={(style && style.creatorEmplPositionId) ? "" : "???? ???????? ?????? ???????? ???????????? ??????"}
                                                    className={(style && style.creatorEmplPositionId) ? classes.formControl : classes.root}
                                                    FormHelperTextProps={{ classes: helperTestClasses }}
                                                    variant="outlined"
                                                    label="?????? ??????????????  "
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
                                        value={formValues?.createDate ?? (editInfo?.createDate ?? new Date ())}
                                        setValue={(date)=>{handlDate(date,"createDate")}}
                                        format={"jYYYY/jMMMM/jDD"}
                                        label="?????????? ??????????"
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
                                        label="???? ??????????"
                                        fullWidth
                                        helperText={(errorStyle?.overlapFromDate) ? "???????? ?? ???????????? ?????????????? ?????????? ???????????????? ??????" : ""}
                                        error={errorStyle?.overlapFromDate}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <DatePicker 
                                        variant="outlined"
                                        id="thruDate"
                                        name="thruDate"
                                        disabled={(showFoem) ? true : false}
                                        value={formValues?.thruDate ?? (editInfo?.thruDate ?? null )}
                                        setValue={(date)=>{handlDate(date,"thruDate")}}
                                        format={"jYYYY/jMMMM/jDD"}
                                        label="???? ??????????"
                                        fullWidth
                                        helperText={(errorStyle?.overlapThurDate) ? "???????? ?? ???????????? ?????????????? ?????????? ???????????????? ??????" : (errorStyle?.invThruData) ? "?????????? ???????? ?????? ?????????????? ??????" : ""}
                                        error={errorStyle?.overlapThurDate || errorStyle?.invThruData}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} style={{marginBottom:'15px'}}> 
                                    <TextField  fullWidth multiline rows={3}
                                        variant="outlined" id="description" name="description"
                                        disabled={(showFoem) ? true : false}
                                        label=" ?????? "
                                        onChange={(event)=>{handleChange(event.target.value , "description")}}
                                        value={formValues.description ?? (editInfo?.description ?? "")}
                                    />
                                </Grid>
                            </Grid> 
                            {editSituation==false && showFoem==false ?   
                                <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                    <Button variant="contained" color="default" className="mt-5" onClick={cancel}>??????</Button> 
                                    <Button style={{ maxWidth: '88px', marginRight: "1rem" }} variant="contained" color="secondary" className="mt-5" onClick={setDataToTable} startIcon={<Add />}>????????????</Button>                      
                                </Grid>
                            : ""}
                            {(editInfo)  ? 
                                <Grid item xs={12} md={12} style={{margintop:'15px'}}> 
                                    <InlineTable data={editInfo} editSituation = {editSituation} setEditSituation = {setEditSituation} updateInlineData={updateInlineData} setUpdateInlineData={setUpdateInlineData}
                                     updateSituation={!handleButton} showFoem={showFoem} tableContent={inlineTableContent} setTableContent={setInlineTableContent} storeInlineTableContent={storeInlineTableContent} setStoreInlineTableContent={setStoreInlineTableContent}/>
                                </Grid> 
                                :
                                <Grid/>
                            }  
                            { firstTimeCreate && showFoem==false ? 
                                <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                    <Button style={{ maxWidth: '88px', marginRight: "1rem" }} variant="contained" color="default" className="mt-5" onClick={confirm}>??????????</Button> 
                                </Grid>
                                    :""}

                            {editSituation==true && !handleButton && showFoem==false ?
                                <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                    <Button variant="contained" color="default" className="mt-5"  onClick={cancel}>??????</Button> 
                                    <Button variant="contained" color="default" className="mt-5" style={{ marginRight: "1rem" }} onClick={confirm}>??????</Button> 
                                </Grid>
                                    :""
                            }
                            { showFoem==true ?
                                <Grid style={{ display: 'flex', justifyContent: 'flex-end' ,marginBottom:'15px'}}>
                                    <Button variant="contained" color="default" className="mt-5"  onClick={cancel}>??????</Button>  
                                </Grid>
                                    :""
                            }     
                        </CardContent>
                </Card>
                <Card variant="outlined" >
                    <TablePro
                        title="???????? ???????????? ????????"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        edit="callback"
                        editCallback={informationOfEditedRow}
                        removeCallback={deleteRow}
                        loading={loading}
                        />
                </Card>
            </CardContent>
        </Card>
    );
};

export default ConstantValuesForm;