import React from 'react';import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';

import Link from '@material-ui/core/Link';
import {Dialog, DialogContent, DialogTitle, Paper, Slide, Typography, useMediaQuery, useTheme} from "@material-ui/core";
// import DbCheckbox2 from "./DbCheckbox2";
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    TextField,
    MenuItem,
    Button, FormControl, FormControlLabel, Switch
} from "@material-ui/core";
import {Add, DeleteOutlined, Image} from "@material-ui/icons";
import DatePicker from "../../../../components/DatePicker";
import CTable from "../../../../components/CTable";
// import {INPUT_TYPES} from "../../../helpers/setFormDataHelper";
// import {setFormDataHelper} from "../../../helpers/setFormDataHelper";

import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import {INPUT_TYPES} from "../../../../helpers/setFormDataHelper";

import axios from "axios";
import {AXIOS_TIMEOUT, SERVER_URL} from "../../../../../../configs";
// import InputAdornment from "../BaseInformation/BaseInformationForm";

import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import {makeStyles} from "@material-ui/core/styles";
import {ALERT_TYPES, fetchFailed, fetchSucceed, setAlertContent, submitPost} from "../../../../../store/actions/fadak";
import {useDispatch, useSelector} from "react-redux";
import ModalDelete from "../InternalInformation/ModalDelete";

import clsx from "clsx";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
// import DatePicker from "../../../../components/DatePicker";
// import moment from "moment-jalaali";


const useStyles = makeStyles((theme) => ({
    logo: {
        maxWidth: 160,
    },
    label: {
        display: 'block',
    },
    input: {
        width: 1000,
    },
    listbox: {
        width:1000,
        margin: 0,
        padding: 0,
        zIndex: 1,
        position: 'absolute',
        listStyle: 'none',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        maxHeight: 200,
        border: '1px solid rgba(0,0,0,.25)',
        '& li[data-focus="true"]': {
            backgroundColor: '#4a8df6',
            color: 'white',
            cursor: 'pointer',
        },
        '& li:active': {
            backgroundColor: '#2977f5',
            color: 'white',
        },
    },
    theme1:{

    },
//     &.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary {
//   display : "none"
// },
    adornedStart : {
        // paddingRight:0,
        display : "none"
    },
    buttonStyle: {
        disabled: true
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    // textField: {
    //     width: 200,
    //     "&:hover .MuiInputLabel-root": {
    //         color: theme.palette.text.primary
    //     },
    //     "& .Mui-focused.MuiInputLabel-root": {
    //         color: theme.palette.primary.main
    //     }
    // },
    div: {
        // "&:hover .MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        //     color: theme.palette.text.primary
        // },
        // "&.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
            // display : "none"
        }
    },
    checkedIcon: {
        backgroundColor: "#137cbd",
        backgroundImage: "blue",
        "&:before": {
            display: "block",
            width: 16,
            height: 16,
            backgroundColor: "gray"
        },
        "input:hover ~ &": {
            backgroundColor: "#106ba3"
        }
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        backgroundColor: "#ebf1f5",
        "input:hover ~ &": {
            backgroundColor: "#ebf1f5"
        },
        "input:disabled ~ &": {
            boxShadow: "none"
        }
    },
}));

const InternalInformationForm = ({addFormData,  setFormData, formData,data, tableContent, setTableContent,currentData, setCurrentData,display,familyToEdit,getFile,
    setOpen, setId, idDelete, open, handleClose, enableDisableCreate, updateRow ,addRow, enablecancel,cancelUpdate, handleChange,handleChangeNumbr,
                                     EmergencyCalls,addRow1,handleChange1,telecomNumbers, facilityNameRoomState,facilityNameState}) => {


    const handleChangeAutoComplete = (newValue,field,tableName,filedName) => {
        if(newValue !== null){
            formData[tableName] = {...formData[tableName],[filedName]: newValue[field]};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)
        }

    };
    const partyId = useSelector(({auth}) => auth.user.data.partyId);

    const handleDateChangDate = (date1)=>{
        if( date1 !== null){
            formData.fromDate = date1._d;
            formData.asset ={...formData.asset,["fromDate"]: Math.round(new Date(formData.fromDate).getTime())   };
            // formData.asset ={...formData.asset,["fromDate"]: Math.round(new Date(date1._d).getTime())};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)


        }
        else if(date1 === null){
            formData.asset ={...formData.asset,["fromDate"]: ""}
            const newFormdata = Object.assign({},formData)
            setFormData(newFormdata)
        }
    };
    const handleDateChangDatethruDate = (date1)=>{
        if( date1 !== null){
            formData.thruDate = date1._d;
            formData.asset ={...formData.asset,["thruDate"]: Math.round(new Date(formData.thruDate).getTime())};
            const newFormdata = Object.assign({},formData);
            setFormData(newFormdata)
        }
        else if(date1 === null){
            formData.asset ={...formData.asset,["thruDate"]: ""}
            const newFormdata = Object.assign({},formData)
            setFormData(newFormdata)
        }
    };

    return (
        <>
            <Card variant="outlined" className="mt-20">
                <CardHeader title="اطلاعات دفتر کار"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField  fullWidth
                            variant="outlined" id="pseudoId" name="pseudoId"
                            label="شماره ساختمان"
                            value={formData.pseudoId}
                            // onChange={addFormDataInternalInfo()}
                            // defaultValue={formvalues.pseudoId}
                            // InputProps={{
                            //     startAdornment: <InputAdornment position="start">
                            //     </InputAdornment>,
                            // }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField   fullWidth
                                         variant="outlined" id="facilityName" name="facilityName"
                                         select
                                         label="نام ساختمان"
                                         value={formData.facilityName}
                                         onChange={handleChange(formData.facilityName)}

                            >
                                {facilityNameState.map(function(party, index){
                                    return (
                                        <MenuItem value={party.pseudoId} key={index}>{party.facilityName}</MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper></Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete style={{marginTop:-16}}
                                          id="facilityNameRoom" name="facilityNameRoom"
                                          options={facilityNameRoomState}
                                          getOptionLabel={option => option.facilityName || "" }
                                          onChange={(event, newValue) => {
                                             handleChange1(newValue)
                                          }}

                                          renderInput={params => {
                                              return (
                                                  <TextField
                                                      {...params}
                                                      variant="outlined"
                                                      label="شماره اتاق  "
                                                      margin="normal"
                                                      fullWidth
                                                  />
                                              );
                                          }}
                            />

                            {/*<TextField   fullWidth*/}
                                         {/*variant="outlined" id="facilityNameRoom" name="facilityNameRoom"*/}
                                         {/*select*/}
                                         {/*label="شماره اتاق"*/}
                                         {/*value={formData.facilityNameRoom}*/}
                                         {/*onChange={handleChange1(formData.facilityNameRoom)}*/}
                            {/*>*/}

                                {/*{ facilityNameRoomState.map(function(key, index)  {*/}
                                    {/*return (<MenuItem value={key.pseudoId} key={index}>{key.facilityName}</MenuItem>);*/}
                            {/*})}*/}

                            {/*</TextField>*/}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete style={{marginTop:-16}}
                              id="telecomNumberRoom" name="telecomNumberRoom"
                              options={telecomNumbers}
                              getOptionLabel={option => option.contactNumber || "" }
                              onChange={(event, newValue) => {
                                  handleChangeNumbr(newValue)
                              }}

                              renderInput={params => {
                                  return (
                                      <TextField
                                          {...params}
                                          variant="outlined"
                                          label="شماره تلفن اتاق  "
                                          margin="normal"
                                          fullWidth
                                      />
                                  );
                              }}
                            />


                            {/*<TextField  fullWidth*/}
                                       {/*variant="outlined" id="telecomNumberRoom" name="telecomNumberRoom"*/}
                                       {/*select*/}
                                       {/*label="شماره تلفن اتاق"*/}
                                       {/*value={formData.telecomNumberRoom}*/}
                                        {/*onChange={handleChangeNumbr}*/}

                            {/*>*/}
                                {/*{telecomNumbers.map(function (party, index) {*/}
                                    {/*return (<MenuItem value={party.contactMechId} key={index}>{party.contactNumber}</MenuItem>);*/}
                                {/*})}*/}
                            {/*</TextField>*/}
                        </Grid>

                    </Grid>
                    <Card variant="outlined" className="mt-20">
                        <CardHeader title="تجهیزات و دارایی های در اختیار"/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                       <Autocomplete style={{marginTop:-16}}
                         id="assetTypeEnumId" name="assetTypeEnumId"
                         options={data.Asset.AssetTypeList}
                         getOptionLabel={option => option.description || option }
                         // value={assetTypeEnumId}
                         onChange={(event, newValue) => {
                             handleChangeAutoComplete(newValue,"enumId","asset","assetTypeEnumId")
                             // if(newValue === null){
                             //     if(familyToEdit !== -1 && display !== false){
                             //         if(typeof currentData.result[familyToEdit].PartyList != "undefined"){
                             //             if(typeof currentData.result[familyToEdit].PartyList[0].personalTitle != "undefined"){
                             //                 formData.person = {...formData.person,["personalTitle"]: ""};
                             //                 const newFormdata = Object.assign({},formData);
                             //                 setFormData(newFormdata)
                             //             }
                             //         }
                             //     }
                             // }
                         }}
                                     defaultValue={currentData !== false && display !== false
                                     && typeof currentData.assetTypeEnumId != "undefined" ? currentData.assetTypeEnumId : ""}
                         renderInput={params => {
                             return (
                                 <TextField
                                     {...params}
                                     variant="outlined"
                                     label="نوع دارایی  "
                                     margin="normal"
                                     fullWidth
                                 />
                             );
                         }}
                                />

                            </Grid>
                            <Grid item xs={12} md={4}>

                     <Autocomplete style={{marginTop:-16}}
                     id="assetName" name="assetName"
                     options={data.AssetTitle.AssetTitleList}
                     getOptionLabel={option => option.assetName || option }
                       onChange={(event, newValue) => {
                           handleChangeAutoComplete(newValue,"assetId","asset","assetName")
                           // if(newValue === null){
                           //     if(familyToEdit !== -1 && display !== false){
                           //         if(typeof currentData.result[familyToEdit].PartyList != "undefined"){
                           //             if(typeof currentData.result[familyToEdit].PartyList[0].personalTitle != "undefined"){
                           //                 formData.person = {...formData.person,["personalTitle"]: ""};
                           //                 const newFormdata = Object.assign({},formData);
                           //                 setFormData(newFormdata)
                           //             }
                           //         }
                           //     }
                           // }

                       }}
                                   defaultValue={currentData !== false && display !== false
                                   && typeof currentData.assetName != "undefined" ? currentData.assetName : ""}
                     renderInput={params => {
                         return (
                             <TextField
                                 {...params}
                                 variant="outlined"
                                 label="عنوان دارایی  "
                                 margin="normal"
                                 fullWidth
                             />
                         );
                     }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField  fullWidth
                                            variant="outlined" id="serialNumber" name="serialNumber"
                                            label="شماره دارایی"
                                            value={formData.serialNumber}
                                            onChange={addFormData("","asset")}
                                            defaultValue={currentData !== false && display !== false
                                            && typeof currentData.serialNumber != "undefined" ? currentData.serialNumber : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField  fullWidth
                                            variant="outlined" id="capacity" name="capacity"
                                            label="تعداد "
                                            value={formData.capacity}
                                            onChange={addFormData("","asset")}
                                            defaultValue={currentData !== false && display !== false
                                            && typeof currentData.capacity != "undefined" ? currentData.capacity : ""}

                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DatePicker  variant="outlined" id="fromDate"
                                            //  defaultValue={formvalues.fromDate ?? ""}
                                             value = {formData.fromDate  ?? ((display !== false && currentData !== false) && typeof currentData.fromDate != "undefined" ? currentData.fromDate : new Date())}
                                             // value = {formData.fromDate}
                                             setValue={handleDateChangDate}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="تاریخ شروع  " fullWidth/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DatePicker variant="outlined" id="thruDate"
                                            value = {formData.thruDate  ?? ((display !== false && currentData !== false) && typeof currentData.thruDate != "undefined" ? currentData.thruDate : new Date())}
                                            setValue={handleDateChangDatethruDate}
                                            // defaultValue={formvalues.thruDate}
                                            format={"jYYYY/jMMMM/jDD"}
                                            label="تاریخ پایان  " fullWidth/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                 <Autocomplete style={{marginTop:-16}}
                             id="UseTypeEnumId" name="UseTypeEnumId"
                             options={data.UseTypeEnumIdAsset.UseTypeEnumIdList}
                                   getOptionLabel={option => option.enumId || option }
                           onChange={(event, newValue) => {
                               handleChangeAutoComplete(newValue,"enumId","asset","UseTypeEnumId")
                               // if(newValue === null){
                               //     if(familyToEdit !== -1 && display !== false){
                               //         if(typeof currentData.result[familyToEdit].PartyList != "undefined"){
                               //             if(typeof currentData.result[familyToEdit].PartyList[0].personalTitle != "undefined"){
                               //                 formData.person = {...formData.person,["personalTitle"]: ""};
                               //                 const newFormdata = Object.assign({},formData);
                               //                 setFormData(newFormdata)
                               //             }
                               //         }
                               //     }
                               // }

                           }}
                               defaultValue={currentData !== false && display !== false
                               && typeof currentData.UseTypeEnumId != "undefined" ? currentData.UseTypeEnumId : ""}
                             renderInput={params => {
                                 return (
                                     <TextField
                                         {...params}
                                         variant="outlined"
                                         label="نحوه استفاده  "
                                         margin="normal"
                                         fullWidth
                                     />
                                 );
                             }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  fullWidth
                                            variant="outlined" id="comments" name="comments"
                                            label="توضیحات"
                                            value={formData.comments }
                                            defaultValue={currentData !== false && display !== false
                                            && typeof currentData.comments != "undefined" ? currentData.comments : ""}
                                            onChange={addFormData("","asset")}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                    <ModalDelete open={open} id={idDelete} handleClose={handleClose} setTableContent={setTableContent}/>
                    { !enableDisableCreate ? <Button variant="outlined" id="add" variant="contained" color="primary" startIcon={<Add/>}
                                                         className="mt-5"  onClick={addRow} >افزودن</Button> : null }
                    <br/>
                        { enableDisableCreate ?  <Button id="modify" variant="contained" color="red" style={{backgroundColor:"red"}}
                                     className="mt-5"   disabled={(!enableDisableCreate) }
                                     onClick={() => updateRow(currentData.assetId)}
                        >ویرایش</Button> : null }
                        { (enableDisableCreate ) ?  <Button id="modify" variant="contained" disabled={enablecancel}
                                                            className="mt-5"
                                                            onClick={cancelUpdate}>لغو</Button> : null }
                    <CTable headers={[{
                        id: "assetName",
                        label: "عنوان دارایی "
                    }, {
                        id: "serialNumber",
                        label: "شماره دارایی"
                    }, {
                        id: "assetTypeEnumId",
                        label: "نوع دارایی"
                    },{
                        id: "fromDate",
                        label: "تاریخ شروع "
                    },{
                        id: "thruDate",
                        label: "تاریخ پایان "
                    }, {
                        id: "delete",
                        label: "حذف"
                    },
                        {
                            id: "modify",
                            label: "ویرایش"
                        }
                    ]} rows={tableContent}/>
                    <Button variant="contained" className="mx-0 mt-5" color="primary" id="submitForm"
                            onClick={addRow1}

                    >ثبت این صفحه</Button>
                </CardContent>
            </Card>
        </>
    );
}

export default InternalInformationForm;
