import React from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader, Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem, Select,
    TextField, Typography
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import {FusePageSimple} from "@fuse";
import { Paper } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import {Add} from "@material-ui/icons";
import DatePicker from "../../../../../components/DatePicker";
import CTable from "../../../../../components/CTable";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tables from "./Tables"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ModalDeleteTable from "./ModalDeleteTable";
import {makeStyles} from "@material-ui/core/styles";
import InlineTable from "../../../../../components/inlinetabel";

const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red"
    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        }
    }
}));
const useStyles = makeStyles((theme,theme1) => ({
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
    as:{
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
    div: {
        // "&:hover .MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        //     color: theme.palette.text.primary
        // },
        // "&.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
        "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
            // display : "none"
        }
    }
}));


const TableForm = ({addFormData1,  setFormData1, formData1,tableContent1,data,enableDisableCreate,
                       addRow,cancelAdd,currentData,competeCriteriaToEdit,setCurrentData,handleClose,setTableContent1,setDisplay,open,display,enablecancel,
                       updateRow,cancelUpdate,idDelete,dataCriteria,setStyle,dataCriteria1,setdataCriteria,competenceModelIdGet,
                       criterionCode, criterionTitle,criterionRateEnumId, parentCriterionId,
                       setcriterionCode, setcriterionTitle, setcriterionRateEnumId, setparentCriterionId,addrowss,addrowss1,
                       criterionCode1, criterionTitle1,
                       criterionRateEnumId1, parentCriterionId1,
                       setcriterionCode1, setcriterionTitle1,
                       setcriterionRateEnumId1, setparentCriterionId1,addrows1

                   }) =>
{

    const [afteraddId, setafteraddId] = React.useState(false);
    const [afteraddId1, setafteraddId1] = React.useState(false);
    const [afteraddId2, setafteraddId2] = React.useState(false);
    const [afteraddId3, setafteraddId3] = React.useState(false);

    const helperTestClasses = helperTextStyles();
    const classes = useStyles();

    const handleDateChangecreateDate = (date1)=>{
        if( date1 !== null) {
            formData1.createDate = date1.format("Y-MM-DD");
            formData1.CompetenceModel = {...formData1.CompetenceModel, ["createDate"]: formData1.createDate};
            const newFormdata = Object.assign({}, formData1);
            setFormData1(newFormdata)
        }
        else if(date1 === null){
            formData1.CompetenceModel ={...formData1.CompetenceModel,["createDate"]: ""}
            const newFormdata = Object.assign({},formData1)
            setFormData1(newFormdata)
        }
    };

    const [methodCriteria, setmethodCriteria] = React.useState([]);


    var arry = []
    console.log('[dakvpakvadv' ,data.enums.CriterionRate)

    const getAllTitles = [].concat({ criterionTitle: "ریشه", competenceCriterionId: "0" });

    const setValidate = index =>{
        console.log(";aadvavav" , index)
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
    // setValidate(currentData.setEdite)
    setValidate(competeCriteriaToEdit)
    console.log("asdvavmjakv"  ,currentData.setEdite,competeCriteriaToEdit )
    return (
        <>

            <Card >
                <CardContent>
                    <CardHeader title="معیارهای مدل شایستگی"/>
                    {display &&
                    <>
                        <Grid container spacing={2}>
                            {console.log("cdcdcdcdcd787878",criterionCode)}

                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="criterionCode" name="criterionCode"
                                            label="کد معیار  "
                                            value={formData1.criterionCode}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    setcriterionCode1(true)
                                                    setafteraddId(true)
                                                    setcriterionCode(true)
                                                    setStyle(prevState =>({
                                                        ...prevState,
                                                        criterionCode:false
                                                    }))

                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionCode"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    setcriterionCode1(false)
                                                    setafteraddId(false)
                                                    setcriterionCode(false)

                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionCode"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={(( afteraddId === true || criterionCode === true) && addrowss === true) || (addrowss1 === true && criterionCode1 === true ) ?  classes.as :classes.formControl }
                                            helperText={(( afteraddId === true || criterionCode ===true) && addrowss === true) || (addrowss1 === true && criterionCode1 === true ) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                                && currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode) ?
                                                currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionCode : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="criterionTitle" name="criterionTitle"
                                            label="عنوان معیار  "
                                            value={formData1.criterionTitle}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    setcriterionTitle1(true)
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionTitle"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                    setafteraddId1(true)
                                                    setcriterionTitle(true)
                                                    console.log("fddfdpostal_fileds798789",criterionTitle,parentCriterionId)
                                                    setStyle(prevState =>({
                                                        ...prevState,
                                                        criterionTitle:false
                                                    }))
                                                } else if((e.target.value) !== ''){
                                                    setcriterionTitle1(false)
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionTitle"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                    setafteraddId1(false)
                                                    setcriterionTitle(false)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={(( afteraddId1 === true || criterionTitle === true) && addrowss === true) || (addrowss1 === true && criterionTitle1 === true ) ?  classes.as :classes.formControl }
                                            helperText={(( afteraddId1 === true || criterionTitle ===true) && addrowss === true) ||(addrowss1 === true && criterionTitle1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                                && currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle) ?
                                                currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionTitle : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth
                                            variant="outlined" id="criterionWeight" name="criterionWeight"
                                            label="وزن   " type={"number"}
                                            value={formData1.criterionWeight}
                                            inputProps={{ min: "0",
                                                // max: "10",
                                                step: "0.1" }}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionWeight"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionWeight"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                                && currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionWeight) ?
                                                currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionWeight : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Autocomplete style={{marginTop:-16}}
                                              id="criterionRateEnumId" name="criterionRateEnumId"
                                              options={data.enums.CriterionRate}
                                              getOptionLabel={option => option.description || '' }
                                              onChange={(event, newValue,reason) => {
                                                  if(newValue !== null){
                                                      setcriterionRateEnumId1(false)
                                                      console.log("fddfdpostal_fileds798789",newValue,criterionRateEnumId)
                                                      setafteraddId2(false)
                                                      setcriterionRateEnumId(false)
                                                      console.log("FDDFFDFDF",newValue)
                                                      formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,
                                                          ["criterionRateEnumId"]: newValue.enumId};
                                                      const newFormdata = Object.assign({},formData1);
                                                      setFormData1(newFormdata)
                                                      // setStyle(prevState =>({
                                                      //     ...prevState,
                                                      //     criterionRateEnumId:false
                                                      // }))
                                                  }
                                                  else if(newValue === null){
                                                      setcriterionRateEnumId1(true)
                                                      setafteraddId2(true)
                                                      setcriterionRateEnumId(true)
                                                      console.log("fddfdpostal_fileds798789",newValue,criterionRateEnumId)
                                                      if(typeof formData1 != "undefined"){
                                                          if(typeof formData1.criterionRateEnumId != "undefined"){
                                                              formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["criterionRateEnumId"]: ""};
                                                              const newFormdata = Object.assign({},formData1);
                                                              setFormData1(newFormdata)
                                                          }
                                                      }
                                                  }
                                              }}
                                              defaultValue={
                                                  ()=>{
                                                      let current = null;
                                                      if(competeCriteriaToEdit !== -1
                                                          && currentData.setCompetenceCriterion[competeCriteriaToEdit] &&
                                                          currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId
                                                      ){
                                                          console.log("fdfdffdfd",798789,currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId)
                                                          data.enums.CriterionRate.map((item, index) => {
                                                              if (item.description === currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId) {
                                                                  console.log("fdfdffdfd",currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId)
                                                                  console.log("fdfdffdfd",item)
                                                                  // setafteradd(true)
                                                                  current = item
                                                              }
                                                              //     else{
                                                              //         current = currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId;
                                                              //     }
                                                              //     // setafteradd(false)
                                                          });
                                                          // return currentData.postalList[addressToEdit].contactMechPurposeId
                                                          // current=currentData.postalList[addressToEdit].contactMechPurposeId
                                                          // return currentData.setCompetenceCriterion[competeCriteriaToEdit].criterionRateEnumId;
                                                      }
                                                      return current;

                                                  }
                                              }
                                              renderInput={params => {
                                                  return (
                                                      <TextField
                                                          {...params}
                                                          required
                                                          className={(( afteraddId2 === true || criterionRateEnumId === true) && addrowss === true)   || (addrowss1 === true && criterionRateEnumId1 === true) ?  classes.as :classes.formControl }
                                                          helperText={(( afteraddId2 === true || criterionRateEnumId ===true) && addrowss === true)  || (addrowss1 === true && criterionRateEnumId1 === true)  ? "پر کردن این فیلد الزامی است" : ""}
                                                          FormHelperTextProps={{ classes: helperTestClasses }}
                                                          variant="outlined"
                                                          label="نوع نمره دهی"
                                                          margin="normal"
                                                          fullWidth
                                                      />
                                                  );
                                              }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                {
                                    console.log("dataCriteriadataCriteria",dataCriteria)
                                }
                                <Autocomplete style={{marginTop:-16}}
                                              id="parentCriterionId" name="parentCriterionId"
                                              options={arry}
                                              getOptionLabel={option => option.criterionTitle || '' }
                                              onChange={(event, newValue) => {
                                                  if(newValue !== null){
                                                      setparentCriterionId1(false)
                                                      console.log("parentCriterionIdparentCriterionId",afteraddId3,parentCriterionId1,parentCriterionId)
                                                      setafteraddId3(false)
                                                      setparentCriterionId(false)
                                                      formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["parentCriterionId"]:
                                                          newValue.competenceCriterionId};
                                                      const newFormdata = Object.assign({},formData1);
                                                      setFormData1(newFormdata)
                                                      setStyle(prevState =>({
                                                          ...prevState,
                                                          parentCriterionId:false
                                                      }))
                                                  }
                                                  else if(newValue === null){
                                                      setparentCriterionId1(true)
                                                      setafteraddId3(true)
                                                      setparentCriterionId(true)
                                                      console.log("fddfdpostal_fileds798789",newValue,parentCriterionId)
                                                      console.log("parentCriterionIdparentCriterionId",afteraddId3,parentCriterionId1,parentCriterionId,addrowss)

                                                      if(typeof formData1 != "undefined"){
                                                          if(typeof formData1.parentCriterionId != "undefined"){
                                                              formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["parentCriterionId"]: ""};
                                                              const newFormdata = Object.assign({},formData1);
                                                              setFormData1(newFormdata)
                                                          }
                                                      }
                                                  }
                                              }}
                                              defaultValue={
                                                  ()=>{
                                                      let current = null;
                                                      if(competeCriteriaToEdit !== -1
                                                          && currentData.setCompetenceCriterion[competeCriteriaToEdit] &&
                                                          ! currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId){
                                                          current = dataCriteria[0]
                                                      }
                                                      else if(competeCriteriaToEdit !== -1
                                                          && currentData.setCompetenceCriterion[competeCriteriaToEdit] &&
                                                          currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId
                                                      ){
                                                          dataCriteria.map((item, index) => {
                                                              if (item.criterionTitle === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId) {
                                                                  // setafteradd(true)
                                                                  current = item
                                                              }
                                                              else if(item.competenceCriterionId === currentData.setCompetenceCriterion[competeCriteriaToEdit].parentCriterionId){
                                                                  current = item;
                                                              }
                                                          });
                                                      }
                                                      return current;

                                                  }
                                              }
                                              renderInput={params => {
                                                  return (
                                                      <TextField
                                                          {...params}
                                                          required
                                                          className={(( afteraddId3 === true || parentCriterionId === true) && addrowss === true)  || (addrowss1 === true && parentCriterionId1 === true) ?  classes.as :classes.formControl }
                                                          helperText={(( afteraddId3 === true || parentCriterionId ===true) && addrowss === true)  || (addrowss1 === true && parentCriterionId1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                                          FormHelperTextProps={{ classes: helperTestClasses }}
                                                          variant="outlined"
                                                          label="معیار بالاتر  "
                                                          margin="normal"
                                                          fullWidth
                                                      />
                                                  );
                                              }}
                                />

                            </Grid>


                            <Grid item xs={12} md={8}>
                                <TextField  fullWidth
                                            variant="outlined" id="description" name="description"
                                            label="توضیحات   "
                                            rows={3} multiline
                                            value={formData1.description}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["description"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["description"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                                && currentData.setCompetenceCriterion[competeCriteriaToEdit].description) ?
                                                currentData.setCompetenceCriterion[competeCriteriaToEdit].description : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>

                                <ModalDeleteTable currentData={currentData}
                                                  setCurrentData={setCurrentData} open={open} id={idDelete} handleClose={handleClose}
                                                  setTableContent={setTableContent1} competeCriteriaToEdit={competeCriteriaToEdit} setDisplay={setDisplay}
                                                  dataCriteria={dataCriteria} setdataCriteria={setdataCriteria} competenceModelIdGet={competenceModelIdGet}/>
                                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                                    { !enableDisableCreate ? <Button variant="outlined"  id="add" variant="contained" color="primary" startIcon={<Add/>}
                                                                     className="mt-5"
                                                                     onClick={addRow}
                                    >افزودن</Button> : null }
                                    { !enableDisableCreate ? <Button variant="outlined" style={{marginLeft : "20px"}} variant="contained"
                                                                     className="mt-5"
                                                                     onClick={cancelAdd}
                                    >لغو</Button> : null }
                                </Grid>
                                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                                    { enableDisableCreate ?  <Button id="modify" variant="contained"
                                                                     className="mt-5"   disabled={(!enableDisableCreate) }
                                                                     style={{color:"white",backgroundColor:"green"}}
                                        // onClick={() =>
                                        //     updateRow(currentData && currentData.setCompetenceCriterion
                                        //         && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                        //         && currentData.setCompetenceCriterion[competeCriteriaToEdit].competenceCriterionId)
                                        // }
                                                                     onClick={() =>
                                                                         updateRow(currentData && currentData.setCompetenceCriterion
                                                                             && currentData.setCompetenceCriterion[competeCriteriaToEdit]
                                                                             && currentData.setCompetenceCriterion[competeCriteriaToEdit].competenceCriterionId)
                                                                     }

                                    >ثبت</Button> : null}
                                    { (enableDisableCreate ) ?  <Button id="modify" variant="contained" disabled={enablecancel}
                                                                        className="mt-5" style={{marginLeft : "20px"}}
                                                                        onClick={cancelUpdate}
                                    >لغو</Button> : null }
                                </Grid>
                            </Grid>

                            {/*<CTable headers={[*/}
                            {/*{*/}
                            {/*id: "criterionRow",*/}
                            {/*label: "ردیف   "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "criterionCode",*/}
                            {/*label: "کد معیار  "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "criterionTitle",*/}
                            {/*label: "عنوان معیار "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "criterionWeight",*/}
                            {/*label: "وزن  "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "criterionRateEnumId",*/}
                            {/*label: "نوع نمره دهی  "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "parentCriterionId",*/}
                            {/*label: "معیار بالاتر    "*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "delete",*/}
                            {/*label: " حذف"*/}
                            {/*},*/}
                            {/*{*/}
                            {/*id: "modify",*/}
                            {/*label: " ویرایش"*/}
                            {/*},*/}
                            {/*]} rows={tableContent1}/>*/}
                        </Grid>

                    </>}
                </CardContent>
            </Card>
            <Card style={{margin:"auto"}}>
                <CardContent>
                    {/*<Grid style={{margin:"auto"}}>*/}
                    <InlineTable  columns={[
                        { title: 'ردیف ', field: 'criterionRow' },
                        { title: 'کد معیار    ', field: 'criterionCode' },
                        { title: ' عنوان معیار', field: 'criterionTitle' },
                        { title: ' وزن', field: 'criterionWeight' },
                        { title: ' نوع نمره دهی', field: 'criterionRateEnumId' },
                        { title: '   معیار بالاتر', field: 'parentCriterionId' },
                        { title: 'ویرایش/نمایش', field: 'modify',},
                        { title: 'حذف', field: 'delete',}

                    ]} title="معیارهای مدل شایستگی "
                                  grouping={true} exportButton={true}
                        // title="لیست پرسنل"
                        // grouping={true}
                        // exportButton={true}
                                  data={tableContent1}
                    >
                    </InlineTable>
                    {/*</Grid>*/}

                </CardContent>
            </Card>
        </>
    );
}


export default TableForm;
