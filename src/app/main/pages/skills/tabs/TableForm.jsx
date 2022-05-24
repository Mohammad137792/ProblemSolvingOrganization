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
import {FusePageSimple} from "../../../../../@fuse";
import { Paper } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import {Add} from "@material-ui/icons";
import DatePicker from "../../../components/DatePicker";
import CTable from "../../../components/CTable";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tables from "./Tables"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ModalDeleteTable from "./ModalDeleteTable";
import {makeStyles} from "@material-ui/core/styles";
import InlineTable from "../../../components/inlinetabel";
import Checkbox from '@material-ui/core/Checkbox';

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
                       updateRow,cancelUpdate,idDelete,dataCriteria,setStyle,dataCriteria1,setdataCriteria,competenceModelIdGet,cc1,
                       criterionCode, criterionTitle,criterionRateEnumId, parentCriterionId,setcriterionCode, setcriterionTitle, setcriterionRateEnumId, setparentCriterionId,addrowss,addrowss1,
                       criterionCode1, criterionTitle1, criterionRateEnumId1, parentCriterionId1,setcriterionCode1, setcriterionTitle1,setcriterionRateEnumId1, setparentCriterionId1,addrows1,dataCriteria2,toSkillIds,enablecancel111,skillCode,skillCode1,
                       setskillCode1, setskillCode,  title, title1, settitle, settitle1,dataCriteria3,enablecance22,setdataCriteria3,dataCriteria4,dataCriteria7,partyIdOrg1
                       ,ccc2

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



    const setDataOptions = index =>{
        if( index !== -1) {
            console.log("aakaav" ,index,dataCriteria3)
            let xxx=[];
            if(currentData && currentData.dataCriteria3 && currentData.dataCriteria3.getAllTitles1) {
                console.log("aakaav" ,index,dataCriteria3)
                currentData.dataCriteria3.getAllTitles1.filter((item, index2) => {
                    if (item.title !== (currentData .result[index].title).toString() && item.code !== (currentData .result[index].skillId).toString()) {
                        console.log("aakaav" ,index,dataCriteria3)
                        arry.push({
                            title: item.title,
                            code: item.code
                        })
                    }

                })
            }

            return null
        }
        arry=dataCriteria3
        // if(dataCriteria4 !== false && dataCriteria7 === false){
        //     arry = dataCriteria4;
        // }
        // else if(dataCriteria4 === false && dataCriteria7 === false) {
        //     arry = dataCriteria3
        // }
        // else if(dataCriteria7 !== false){
        //     arry = dataCriteria7
        // }
        console.log("aakaav" ,arry,dataCriteria3)

    }
    // setValidate(currentData.setEdite)
    setDataOptions(competeCriteriaToEdit)
    console.log("asdvavmjakv"  ,currentData.setEdite,competeCriteriaToEdit )

    const [state1, setState1] = React.useState({
        status: ""
    });
    const handleChange = name => event => {
        setState1({ ...state1, [name]: event.target.checked });
        console.log("dcdcdcdcdcd",event.target.checked)
        if(event.target.checked === true){
            formData1.status = event.target.checked;
            formData1.CompetenceCriterion ={...formData1.CompetenceCriterion,["status"]: formData1.status};
            const newFormdata = Object.assign({},formData1);
            setFormData1(newFormdata)
        }else if (event.target.checked === false){
            formData1.status = event.target.checked;
            formData1.CompetenceCriterion ={...formData1.CompetenceCriterion,["status"]: formData1.status};
            const newFormdata = Object.assign({},formData1);
            setFormData1(newFormdata)
        }
    };

    return (
        <>

            <Card >
                <CardContent>
                    <CardHeader title="تعریف مهارت  "/>
                    {display &&
                    <>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="skillCode" name="skillCode"
                                            label="کد مهارت  "
                                            value={formData1.skillCode}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    setskillCode(true)
                                                    setskillCode1(true)
                                                    if(!formData1.skillCode) {
                                                        if (competeCriteriaToEdit !== -1 && currentData.result[competeCriteriaToEdit] && !currentData.result[competeCriteriaToEdit].skillCode) {
                                                            setskillCode(true)
                                                            setskillCode1(true)
                                                        }
                                                        console.log("fffffffffffffffffffffd",4,skillCode,skillCode1)
                                                    }

                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["skillCode"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    setskillCode(false)
                                                    setskillCode1(false)
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["skillCode"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={((  skillCode === true) && addrowss === true) || (addrowss1 === true && skillCode1 === true ) ?  classes.as :classes.formControl }
                                            helperText={((  skillCode ===true) && addrowss === true) || (addrowss1 === true && skillCode1 === true ) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData .result[competeCriteriaToEdit]
                                                && currentData .result[competeCriteriaToEdit].skillCode) ?
                                                currentData .result[competeCriteriaToEdit].skillCode : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField  fullWidth required
                                            variant="outlined" id="title" name="title"
                                            label="عنوان   "
                                            value={formData1.title}
                                            onChange={(e)=>{
                                                if ((e.target.value) === ''){
                                                    settitle(true)
                                                    settitle1(true)
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["title"]: ""};
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                    setStyle(prevState =>({
                                                        ...prevState,
                                                        criterionTitle:false
                                                    }))
                                                } else if((e.target.value) !== ''){
                                                    settitle(false)
                                                    settitle1(false)
                                                    formData1.CompetenceCriterion = {...formData1.CompetenceCriterion,["title"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData1);
                                                    setFormData1(newFormdata)
                                                }
                                                // addFormData("","postalAddress")
                                            }}
                                            className={((  title === true) && addrowss === true) || (addrowss1 === true && title1 === true ) ?  classes.as :classes.formControl }
                                            helperText={(( title ===true) && addrowss === true) ||(addrowss1 === true && title1 === true) ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(competeCriteriaToEdit !== -1 && currentData .result[competeCriteriaToEdit]
                                                && currentData .result[competeCriteriaToEdit].title) ?
                                                currentData .result[competeCriteriaToEdit].title : ''
                                            }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>

                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch name="status"
                                            value={formData1.status}
                                           defaultChecked={(competeCriteriaToEdit !== -1 && currentData.result[competeCriteriaToEdit]
                                               && (currentData.result[competeCriteriaToEdit].status === true))

                                               ? true :(
                                                   (competeCriteriaToEdit !== -1 && currentData .result[competeCriteriaToEdit]
                                                   && currentData .result[competeCriteriaToEdit].status === 'Y' ? (true) : false
                                                   )
                                               )}
                                                           onChange={handleChange('status')}
                                        />}
                                        label="فعال"/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {
                                    currentData && console.log("toSkillIds22",skillCode1,skillCode,addrowss1)
                                }

                                <Autocomplete style={{marginTop:"-13px"}}
                                    multiple={true}
                                              id="code" name="code"
                                              options={dataCriteria3}
                                              getOptionLabel={option => option.title }
                                              disabled={(partyIdOrg1 === true ? false : true)}
                                    value={formData1.CompanyRole}
                                              defaultValue={
                                                  ()=>
                                                  {
                                                      console.log("ffffff7878",enablecancel111,toSkillIds)
                                                      let current = [];
                                                      if(competeCriteriaToEdit !== -1 && currentData .result[competeCriteriaToEdit]
                                                           && currentData.result[competeCriteriaToEdit].toSkillId ){
                                                          // var index21 = toSkillIds.indexOf(enablecancel111.toString())
                                                          // if(index21 > -1)
                                                          // {
                                                          //     toSkillIds[0].splice(index21, 1);
                                                          // }
                                                          console.log("ffffff7878",currentData.result[competeCriteriaToEdit].toSkillId)
                                                          dataCriteria3.map((item, index) => {
                                                              console.log("ffffff78782221111",item,toSkillIds)
                                                              let yyyy=[];
                                                              for(var i=0;i<currentData.result[competeCriteriaToEdit].toSkillId.length ; i++){
                                                                  if(currentData.result[competeCriteriaToEdit].toSkillId.indexOf(currentData.result[competeCriteriaToEdit].toSkillId[i]) > -1){
                                                                      yyyy.push(currentData.result[competeCriteriaToEdit].toSkillId[i])

                                                                  }


                                                              }
                                                              console.log("dfddddddddddddddddd78",yyyy)
                                                              for (var i=0;i<currentData.result[competeCriteriaToEdit].toSkillId.length ; i++){
                                                                  if (currentData.result[competeCriteriaToEdit].toSkillId[i].indexOf(item.code) > -1) {
                                                                      // getUnique(item)
                                                                      current.push(item)
                                                                      console.log("ffffff787811",current)
                                                                  }
                                                              }
                                                          });
                                                      }
                                                      return current;
                                                  }
                                              }
                                              onChange={(e, option, reason,newValue) => {
                                                  let addVals=[]
                                                  if(!formData1.CompetenceCriterion)
                                                  {
                                                      formData1.CompetenceCriterion = {}
                                                  }
                                                  if(!formData1.CompetenceCriterion.CompanyRoleDeleted){
                                                      formData1.CompetenceCriterion.CompanyRoleDeleted = []
                                                  }
                                                  if(!formData1.CompetenceCriterion.CompanyRoleAdded){
                                                      formData1.CompetenceCriterion.CompanyRoleAdded = []
                                                  }
                                                  var index;
                                                  if (reason === "remove-option" ) {
                                                      index = formData1.CompetenceCriterion.CompanyRoleAdded.indexOf(newValue.option.code)
                                                      if(index > -1)
                                                      {
                                                          formData1.CompetenceCriterion.CompanyRoleAdded.splice(index, 1);
                                                      }else{
                                                          formData1.CompetenceCriterion.CompanyRoleDeleted.push(newValue.option.code)
                                                          formData1.CompetenceCriterion = {
                                                              ...formData1.CompetenceCriterion,
                                                              CompanyRoleDeleted: formData1.CompetenceCriterion.CompanyRoleDeleted
                                                          };
                                                          console.log("newValue42343342342",formData1)
                                                          const newFormdata = Object.assign({}, formData1);
                                                          setFormData1(newFormdata)
                                                      }


                                                  }
                                                   if (reason === "select-option" ) {
                                                       console.log("newValue42343342342",newValue,option)
                                                       formData1.CompetenceCriterion.CompanyRoleAdded.push(newValue.option.code)
                                                       formData1.CompetenceCriterion = {
                                                           ...formData1.CompetenceCriterion,
                                                           CompanyRoleAdded: formData1.CompetenceCriterion.CompanyRoleAdded
                                                       };
                                                       console.log("newValue4234334234244444",formData1)

                                                       const newFormdata = Object.assign({}, formData1);
                                                       setFormData1(newFormdata)
                                                       // return;
                                                  }
                                                   else if (reason === "clear") {
                                                       console.log("7778877878787997", option)
                                                       if (competeCriteriaToEdit !== -1) {
                                                           // if (cc1 === true || (ccc2 === true && competeCriteriaToEdit === tableContent1.length) ) {
                                                           //     console.log("7778877878", option)
                                                           //     if (competeCriteriaToEdit !== -1 &&
                                                           //         currentData.result[competeCriteriaToEdit] && currentData.result[competeCriteriaToEdit].toSkillId[0]) {
                                                           //         formData1.CompetenceCriterion.CompanyRoleDeleted = currentData.result[competeCriteriaToEdit].toSkillId[0];
                                                           //     }
                                                           // }
                                                           // else
                                                           //     if(competeCriteriaToEdit !== tableContent1.length){
                                                               if (competeCriteriaToEdit !== -1 &&
                                                                   currentData.result[competeCriteriaToEdit] && currentData.result[competeCriteriaToEdit].toSkillId) {
                                                                   formData1.CompetenceCriterion.CompanyRoleDeleted = currentData.result[competeCriteriaToEdit].toSkillId;
                                                               }
                                                           // }
                                                           console.log("7778877878", formData1)

                                                           // if(currentData.result1222)
                                                           // if(competeCriteriaToEdit !== -1&&
                                                           //     currentData.result[competeCriteriaToEdit] && currentData.result[competeCriteriaToEdit].toSkillId)
                                                           // {
                                                           //     formData1.CompetenceCriterion.CompanyRoleDeleted = currentData.result[competeCriteriaToEdit].toSkillId;
                                                           // }
                                                           formData1.CompetenceCriterion = {
                                                               ...formData1.CompetenceCriterion,
                                                               CompanyRoleDeleted: formData1.CompetenceCriterion.CompanyRoleDeleted,
                                                               CompanyRoleAdded: [],
                                                           };
                                                           console.log("fddddddddddd", formData1)
                                                           const newFormdata = Object.assign({}, formData1);
                                                           setFormData1(newFormdata)
                                                       }
                                                   }

                                              }}

                                              renderInput={params => {
                                                  return (
                                                      <TextField
                                                          // value={formData.contactMechPurposeId}
                                                          {...params}
                                                          variant="outlined"
                                                          label="برچسب مهارت "
                                                          margin="normal"
                                                          fullWidth
                                                      />
                                                  );
                                              }}
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
                                                                         updateRow(currentData &&currentData.result&&
                                                                             currentData .result[competeCriteriaToEdit]&&
                                                                             currentData .result[competeCriteriaToEdit].skillId)
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
                        { title: 'کد مهارت    ', field: 'criterionCode' },
                        { title: ' عنوان ', field: 'criterionTitle' },
                        { title: ' فعال', field: 'criterionWeight' },
                        { title: 'ویرایش/نمایش', field: 'modify',},
                        { title: 'حذف', field: 'delete',}

                    ]} title=" تعریف مهارت  "
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
