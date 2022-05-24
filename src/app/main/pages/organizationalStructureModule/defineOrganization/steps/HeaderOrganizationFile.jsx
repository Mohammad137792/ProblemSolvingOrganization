import React,{useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField, InputLabel, Checkbox, Paper, Tabs, Tab
} from "@material-ui/core";
// import {INPUT_TYPES} from "../helpers/setFormDataHelper";
import axios from "axios";
// import {ALERT_TYPES, setAlertContent, submitPost} from "../../store/actions/fadak";
import {useDispatch, useSelector} from "react-redux";
import {AXIOS_TIMEOUT,SERVER_URL} from "../../../../../../configs";
// import Autocomplete from "../pages/personnelBaseInformation/tabs/BaseInformation/BaseInformationForm";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import progile from "./sample_logo.png"
import TabPane from "../DefineOrganization";
import {makeStyles} from "@material-ui/core/styles";
import HeaderOrganizationFile from "./OrganizationFormHeader";

// import progile from "./sample_avatar.png"
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

const HeaderPersonnelFile = ({addFormData , setFormData, formData, currentData,data,updateImg,updateRow,setorganizationName,
                                 setpseudoId}) => {
    const helperTestClasses = helperTextStyles();
    const classes = useStyles();

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !==null) ? partyIdUser : partyIdLogin

    const [afteraddId, setafteraddId] = React.useState(false);
    const [orgname, setorgname] = React.useState(false);

console.log("apodkdapvjava",currentData)



    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>

                            {console.log("currentDatacurrentData",currentData)}
                            <Grid item xs={12} sm={6}>
                                <TextField  fullWidth  required
                                            variant="outlined" id="pseudoId" name="pseudoId"
                                            label="کد سازمان "
                                            className={( afteraddId === true ) ?  classes.as :classes.formControl }
                                            helperText={( afteraddId === true)  ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(currentData.length) ? currentData[0].pseudoId :''}
                                            value={formData.pseudoId }
                                            onChange={(e)=>{
                                                if ((e.target.value).trim() === ''){
                                                    setafteraddId(true)
                                                    setpseudoId(false)
                                                    formData.org = {...formData.org,["pseudoId"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    setafteraddId(false)
                                                    setpseudoId(true)

                                                    formData.org = {...formData.org,["pseudoId"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                            }}
                                    // onChange={addFormData("","org")}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <TextField  fullWidth  required
                                            variant="outlined" id="organizationName" name="organizationName"
                                            label="عنوان سازمان "
                                            className={( orgname === true ) ?  classes.as :classes.formControl }
                                            helperText={( orgname === true)  ? "پر کردن این فیلد الزامی است" : ""}
                                            FormHelperTextProps={{ classes: helperTestClasses }}
                                            defaultValue={(currentData.length) ? currentData[0].organizationName :''}
                                            value={formData.organizationName }
                                            onChange={(e)=>{
                                                if ((e.target.value).trim() === ''){
                                                    setorgname(true)
                                                    setorganizationName(false)
                                                    formData.org = {...formData.org,["organizationName"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    setorgname(false)
                                                    setorganizationName(true)

                                                    formData.org = {...formData.org,["organizationName"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                            }}
                                    // onChange={addFormData("","org")}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField  fullWidth
                                            variant="outlined" id="EconomicCode" name="EconomicCode"
                                            label="کد اقتصادی "
                                            defaultValue={currentData.EconomicCode}
                                            onChange={(e)=>{
                                                if ((e.target.value).trim() === ''){
                                                    formData.org = {...formData.org,["EconomicCode"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    formData.org = {...formData.org,["EconomicCode"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                            }}
                                    // onChange={addFormData("","org")}
                                    // defaultValue={curr}
                                            value={formData.EconomicCode }

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField  fullWidth
                                            variant="outlined" id="Companyregistrationnumber" name="Companyregistrationnumber"
                                            label="شماره ثبت "
                                            onChange={(e)=>{
                                                if ((e.target.value).trim() === ''){
                                                    formData.org = {...formData.org,["Companyregistrationnumber"]: ""};
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                } else if((e.target.value) !== ''){
                                                    formData.org = {...formData.org,["Companyregistrationnumber"]: e.target.value };
                                                    const newFormdata = Object.assign({},formData);
                                                    setFormData(newFormdata)
                                                }
                                            }}
                                    // onChange={addFormData("","org")}
                                            defaultValue={currentData.Companyregistrationnumber}
                                            value={ formData.Companyregistrationnumber }


                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {
                                    console.log("avkvjavav" , data)
                                }
                                <Autocomplete style={{marginTop:"-13px"}}
                                              multiple={true}
                                              id="CompanyRole" name="CompanyRole"
                                              options={data.orgList}
                                              getOptionLabel={option => option.description }
                                    // value={formData.CompanyRole}
                                              defaultValue={
                                                  ()=>{

                                                      let current = [];
                                                      if(currentData
                                                          && currentData.roleTypeId && currentData.roleTypeId.length !==0){
                                                          data.orgList.map((item, index) => {
                                                              if (currentData.roleTypeId.indexOf(item.roleTypeId) !== -1) {
                                                                  current.push(item)

                                                              }
                                                          });
                                                      }
                                                      return current;
                                                  }
                                              }
                                    // onClose={(event,reason)=>{
                                    //     console.log()
                                    // }}
                                              onChange={(e, option, reason,newValue) => {
                                                  let addVals=[]
                                                  // let deleteVals=[]
                                                  if(!formData.org)
                                                  {
                                                      formData.org = {}
                                                  }
                                                  if(!formData.org.CompanyRoleDeleted){
                                                      formData.org.CompanyRoleDeleted = []
                                                  }
                                                  if(!formData.org.CompanyRoleAdded){
                                                      formData.org.CompanyRoleAdded = []
                                                  }
                                                  var index;

                                                  if (reason === "remove-option" ) {
                                                      index = formData.org.CompanyRoleAdded.indexOf(newValue.option.roleTypeId)
                                                      if(index > -1)
                                                      {
                                                          formData.org.CompanyRoleAdded.splice(index, 1);
                                                      }else{
                                                          formData.org.CompanyRoleDeleted.push(newValue.option.roleTypeId)
                                                          formData.org = {
                                                              ...formData.org,
                                                              CompanyRoleDeleted: formData.org.CompanyRoleDeleted
                                                          };
                                                          const newFormdata = Object.assign({}, formData);
                                                          setFormData(newFormdata)
                                                      }


                                                  }
                                                  else if (reason === "select-option" ) {
                                                      index = formData.org.CompanyRoleDeleted.indexOf(newValue.option.roleTypeId)
                                                      if(index > -1)
                                                      {
                                                          formData.org.CompanyRoleDeleted.splice(index, 1);
                                                      }
                                                      else{
                                                          formData.org.CompanyRoleAdded.push(newValue.option.roleTypeId)
                                                          formData.org = {
                                                              ...formData.org,
                                                              CompanyRoleAdded: formData.org.CompanyRoleAdded
                                                          };
                                                          const newFormdata = Object.assign({}, formData);
                                                          setFormData(newFormdata)
                                                          return;
                                                      }

                                                  }else if (reason === "clear") {
                                                      if(currentData.roleTypeId)
                                                      {
                                                          formData.org.CompanyRoleDeleted = currentData.roleTypeId;
                                                      }
                                                      formData.org = {
                                                          ...formData.org,
                                                          CompanyRoleDeleted: formData.org.CompanyRoleDeleted,
                                                          CompanyRoleAdded: [],
                                                      };
                                                      const newFormdata = Object.assign({}, formData);
                                                      setFormData(newFormdata)
                                                  }

                                              }}


                                    // onChange={(event, newValue) => {
                                    //         console.log("dssddsds",newValue)
                                    //     if(newValue !== null && newValue.length !==0){
                                    //
                                    //         formData.org = {...formData.org,["CompanyRole"]: newValue.enumId};
                                    //         const newFormdata = Object.assign({},formData);
                                    //         setFormData(newFormdata)
                                    //     }
                                    //     // else if(newValue !== null && newValue.length ===0){
                                    //     //       console.log("dssddsds 5",currentData.roleTypeId)
                                    //     //     formData.org = {...formData.org,["CompanyRole"]: ''};
                                    //     //     const newFormdata = Object.assign({},formData);
                                    //     //     setFormData(newFormdata)
                                    //     // }
                                    //     else if(newValue === null){
                                    //
                                    //         formData.org = {...formData.org,["CompanyRole"]: ""};
                                    //         const newFormdata = Object.assign({},formData);
                                    //         setFormData(newFormdata)
                                    //
                                    //     }
                                    // }
                                    // }

                                              renderInput={params => {
                                                  return (
                                                      <TextField
                                                          // value={formData.contactMechPurposeId}
                                                          {...params}
                                                          variant="outlined"
                                                          label="حوزه فعالیت"
                                                          margin="normal"
                                                          fullWidth
                                                      />
                                                  );
                                              }}
                                />

                                {/*<Autocomplete*/}
                                {/*multiple*/}
                                {/*id="tags-standard"*/}
                                {/*options={data.orgList}*/}
                                {/*getOptionLabel={(option) => option.description}*/}
                                {/*renderInput={(params) => (*/}
                                {/*<TextField*/}
                                {/*{...params}*/}
                                {/*variant="standard"*/}
                                {/*label="Multiple values"*/}
                                {/*placeholder="Favorites"*/}
                                {/*/>*/}
                                {/*)}*/}
                                {/*/>*/}

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField  fullWidth
                                            variant="outlined" id="noteText" name="noteText"
                                            rows={3} multiline
                                            label="توضیحات    "
                                            onChange={addFormData("","org")}
                                            defaultValue={ currentData?.[0]?.noteText}
                                            value={ formData.noteText }

                                />

                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div style={{display:"flex", flexDirection :"column"}}>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button
                                    className="mt-5" >
                                    <input type="file" id={"contentLocation"}
                                        // accept="image/*"
                                           accept=".png, .jpeg, .jpg"
                                           style={{height: 130,position: "absolute",display: "block",width: 130,opacity: 0,zIndex: 2}}
                                           onChange={(event) => {

                                               if(event){
                                                   let {id, value, name} = event.target;
                                                   value = event.target.files[0];

                                                   // if(typeof currentData.partyClassificationId != "undefined"){
                                                   formData.partyContent = {...formData.partyContent,["contentLocation"]: value};
                                                   const newFormdata = Object.assign({},formData);
                                                   addFormData(newFormdata)
                                                   // }
                                               }
                                           }}
                                        // onChange={
                                        //     addFormData(INPUT_TYPES.FILE,"partyContents")
                                        //
                                        // }
                                    />
                                    <div style={{display: "block",zIndex: 1}}>
                                        {/*<img src={"assets/images/avatars/sample_avatar.png"} style={{width:"50%"}}/>*/}
                                        {  currentData  &&
                                        currentData?.[0]?.partyContentTypeEnumId

                                            ?
                                            <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" +
                                                currentData?.[0]?.contentLocation)}
                                                 id={"imagePreview-" + "contentLocation"} style={{height: 130}}
                                            />
                                            : <img src={progile} style={{width:"50%"}}/>}
                                            {/*: <img alt={"org"} style={{width:"50%"}}/>}*/}
                                    </div>



                                </Button>
                            </div>
                            <Button  variant="contained" style={{width: "148px", margin: "auto", marginTop: "45px"}}
                                     id="add"
                                     className="mt-5"
                                     onClick={updateImg}
                            >

                                آپلود عکس
                            </Button>
                        </div>


                    </Grid>

                    <Button id="modifydata" variant="contained"
                            className="mt-5" style={{color:"white", backgroundColor: "green"}}
                            onClick={updateRow}
                    >ثبت</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default HeaderPersonnelFile;






