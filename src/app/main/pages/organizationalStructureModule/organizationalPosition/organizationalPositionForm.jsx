import React from 'react';
import {FusePageSimple} from "@fuse";
import {Paper,Button,Card,FormControl,Select,MenuItem,FormControlLabel,Switch,CardContent,TextField, Tabs,Grid, Tab, Typography, CircularProgress} from '@material-ui/core';
import {Add} from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import CTable from "../../../components/CTable";
import InlineTable from "../../../components/inlinetabel";
import {useDispatch} from "react-redux";
import {INPUT_TYPES,setFormDataHelper} from "../../../helpers/setFormDataHelper";
import {submitDelete,submitPost} from "../../../../store/actions/fadak";
import formData from "../../../../store/reducers/fadak/formData.reducers";
import DatePicker from "../../../components/DatePicker";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import Autocomplete,{createFilterOptions} from "@material-ui/lab/Autocomplete";
import { makeStyles} from '@material-ui/core/styles';
import DeleteModal from './deleteModal'
const OrganizationalPositionForm=({tableContent,Edit,enumData,roleData,setTableContent,prepareForm,
                                      dispatch,currentData,setCurrentData,cancelUpdate,formValues,setFormValues,
                                      addFormData,enableDisableCreate,setEnableDisableCreate,editPosition,setEdit,
                                      setPerson,personData,addPosition,addRow,searchPersonel,setDefaultValue,value,setValue,dateValue,setDateValue,dateHandler,organization,jobData,searchJob,positionJob,payGrade,changeJob,positionJobGrade,changeGrade,jobIns,positionJobGradeEnum,personChange,roleChange,validError,setValidError,handleClose,open,rowDelete,loading,editHandler,deleteHandler,excelData,setExcelData,setValidErrorParty,validErrorParty,setValidErrorJob,validErrorJob})=>{


    const filterOptions = createFilterOptions({
        stringify: ({ firstName, lastName, pseudoId }) => `${firstName} ${lastName} ${pseudoId}`
    });
    const useStyles = makeStyles((theme) => ({
        readOnly: {
            backgroundColor: "#fbfcfd",
            '& input': {
                color: 'rgba(0, 0, 0, 0.87);',
            },
        },
        required: {
            // width: "100%",
            "& label span": {
                color: "red"
            }
        }
    }));
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
        rootAutoComplete:{
            color: "red",
            borderWidth: "1px",
            "&  .MuiOutlinedInput-notchedOutline": {
                borderColor: "red"
            },
        },
        formControl: {
            width: "100%",
            "& label span": {
                color: "red"
            }
        },
        error: {
            "&.MuiFormHelperText-root.Mui-error": {
                color: theme.palette.common.white
            }
        }
    }));
    const classes = useStyles();
    const helperTestClasses = helperTextStyles();

    return(
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">پست سازمانی</Typography>}
            content={
                <>
              <Card>
                <CardContent>
                 <Grid container  spacing={2}>
                <Grid item xs={12} sm={3}>
                    <TextField variant="outlined" id="pseudoId" name="pseudoId" label="کد پست سازمانی"
                               onChange={(event)=>{
                                   if(event.target.value!="")setValidError(false)
                                   formValues.position = {
                                       ...formValues.position,
                                       pseudoId: event.target.value
                                   }
                                   const newFormData = Object.assign({}, formValues)
                                   setFormValues(newFormData)
                               }}
                               FormHelperTextProps={{classes: helperTestClasses}}
                               className={validError && !formValues.position.pseudoId  ? helperTestClasses.root:helperTestClasses.formControl }
                               helperText={validError && !formValues.position.pseudoId ? "پر کردن این فیلد الزامی است" : ""}
                                  required
                    value={formValues.position.pseudoId??""}  fullWidth/>
                </Grid>
                <Grid item xs={12} sm={3}>
                        <TextField variant="outlined" value={formValues.position.description??""} id="description" name="description"
                             onChange={(event)=>{
                            if(event.target.value!="")setValidError(false)
                            formValues.position = {
                                     ...formValues.position,
                                     description: event.target.value
                                 }
                           const newFormData = Object.assign({}, formValues)
                           setFormValues(newFormData)
                             }}
                           label="عنوان پست سازمانی" fullWidth FormHelperTextProps={{classes: helperTestClasses}}
                           helperText={validError && !formValues.position.description ? "پر کردن این فیلد الزامی است" : ""} required
                           className={validError && !formValues.position.description ? helperTestClasses.root:helperTestClasses.formControl }
                        />
                    </Grid>
                <Grid item xs={12} sm={3}>
                    <DatePicker variant="outlined" id="fromDate" name="fromDate"
                                value={formValues.position?formValues.position.fromDate : new Date()}
                                setValue={dateHandler}
                                format={"jYYYY/jMMMM/jDD"}
                                label="تاریخ ایجاد" fullWidth />
                    </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl>
                        <FormControlLabel
                            control={<Switch name="status" checked={value}  onChange={()=>{
                                addFormData(INPUT_TYPES.CHECKBOX,"position");
                                setValue(!value);
                                }
                            }/>}
                            label="فعال" name="status"/>
                    </FormControl>
                </Grid>
                </Grid>
                 <Grid container  spacing={2}>
                     <Grid item xs={12} sm={3}>
                         <TextField select variant="outlined" name="jobId" label="شغل" id="jobId" value={formValues.position.jobId??""} onChange={changeJob} fullWidth>
                             <MenuItem value="">---</MenuItem>
                             {jobData && jobData?.map((opt,i)=>(
                                 <MenuItem key={i} value={opt.jobId}>{opt?.jobTitle}</MenuItem>
                             ))}
                         </TextField>
                     </Grid>
                     <Grid item xs={12} sm={6}>
                         <TextField multiline rows="4" id="jobDescription" name="jobDescription"  value={formValues?.position?.jobDescription??""} disabled label="شرح شغل" variant="outlined" fullWidth className={classes.readOnly} />
                     </Grid>
                     <Grid item xs={12} sm={3}>
                         <TextField select variant="outlined"  name="jobGradeInsuranceEnumId" label="عنوان طبقه شغلی" value={formValues.position.jobGradeInsuranceEnumId??"" } onChange={changeGrade}
                                      FormHelperTextProps={{classes: helperTestClasses}}
                                    helperText={validErrorJob && formValues.position.jobId && !formValues.position.jobGradeInsuranceEnumId ? "پر کردن این فیلد الزامی است" : ""} required
                                    className={validErrorJob && formValues.position.jobId && !formValues.position.jobGradeInsuranceEnumId ? helperTestClasses.root:helperTestClasses.formControl }
                                    id="jobGradeInsuranceEnumId" fullWidth>
                             {positionJobGrade && positionJobGrade?.map((opt,i)=>(
                                 <MenuItem key={i} value={opt?.enumId}>{opt?.description}</MenuItem>
                             ))}
                         </TextField>
                     </Grid>
                 </Grid>
                 <Grid container  spacing={2}>
                     <Grid item xs={12} sm={3}>
                         <TextField variant="outlined" id="jobGradeEnumId" name="jobGradeEnumId" disabled label="طبقه" value={positionJobGradeEnum?.jobGradeEnumId?enumData?.enums?.JobGrade?.find(ele=>ele.enumId==positionJobGradeEnum?.jobGradeEnumId)?.description:""} onChange={addFormData("","position")} className={classes.readOnly}  fullWidth>
                         </TextField>
                     </Grid>
                      <Grid item xs={12} sm={3}>
                          <TextField select variant="outlined" label="رتبه شغلی" name="payGradeId" id="payGradeId" value={formValues.position.payGradeId??""} onChange={addFormData("","position")} fullWidth>
                              <MenuItem value="">---</MenuItem>
                              {payGrade && payGrade?.map((opt,i)=>(
                                  <MenuItem key={i} value={opt.payGradeId}>{opt.description}</MenuItem>
                              ))}
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <TextField select variant="outlined" label="نوع پست" id="positionTypeEnumId" name="positionTypeEnumId" value={formValues.position.positionTypeEnumId??"" } onChange={addFormData("","position")} fullWidth>
                              <MenuItem value="">---</MenuItem>
                              {enumData?.enums && enumData?.enums?.PositionType?.map((opt,i)=>(
                                  <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                              ))}
                          </TextField>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <TextField select variant="outlined" label="رده سازمانی" value={formValues.position.gradeTypeEnumId??""} id="gradeTypeEnumId" name="gradeTypeEnumId" onChange={addFormData("","position")} fullWidth>
                              <MenuItem value="">---</MenuItem>
                              {enumData?.enums && enumData?.enums?.GradeType?.map((opt,i)=>(
                                  <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                              ))}
                          </TextField>
                      </Grid>
                  </Grid>
                 <Grid container  spacing={2}>
                     <Grid item xs={12} sm={3}>
                         <TextField select variant="outlined" FormHelperTextProps={{classes: helperTestClasses}}
                                    label="واحد سازمانی" id="organizationPartyId" name="organizationPartyId" value={formValues.position.organizationPartyId??""}
                                    onChange={(event)=>{
                                        if(event.target.value!="")setValidError(false)
                                        formValues.position = {
                                            ...formValues.position,
                                            organizationPartyId: event.target.value
                                        }
                                        const newFormData = Object.assign({}, formValues)
                                        setFormValues(newFormData)
                                    }}
                                    fullWidth required
                                    helperText={validError && !formValues.position.organizationPartyId ? "پر کردن این فیلد الزامی است" : ""}
                                    className={validError && !formValues.position.organizationPartyId ? helperTestClasses.root:helperTestClasses.formControl }>
                             <MenuItem value="">---</MenuItem>
                             {organization &&  organization?.organizationUnit?.map((opt,i)=>(
                                 <MenuItem key={i} value={opt.partyId}>{opt.organizationName}</MenuItem>
                             ))}
                         </TextField>
                     </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete id="personPartyId" name="personPartyId" style={{marginTop:-16}} disableClearable
                                          options={personData?.party} getOptionLabel={option => option?.firstName+" "+option?.lastName || "" }
                                          onChange={(event,newValue)=>personChange(event,newValue)}
                                          value={formValues?.position?.positionParty?personData?.party?.find(ele=>ele?.partyId==formValues?.position?.positionParty?.partyId):null}
                                          filterOptions={filterOptions}
                                          filterSelectedOptions
                                          renderOption={
                                              ({ firstName, lastName, pseudoId }) => {
                                              return (
                                                  <div>
                                                      <div>
                                                          {`${firstName} `}
                                                          {lastName}
                                                      </div>
                                                  </div>
                                              );
                                          }}
                                          renderInput={params => {
                                              return <TextField {...params} variant="outlined" label="پرسنل" margin="normal" fullWidth
                                                                FormHelperTextProps={{classes: helperTestClasses}}
                                                                helperText={validErrorParty &&!formValues?.position?.positionParty?.partyId  ? "پر کردن این فیلد الزامی است" : ""}
                                                                className={validErrorParty && !formValues?.position?.positionParty?.partyId  ? helperTestClasses.rootAutoComplete:helperTestClasses.formControl }/>
                                          }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete id="role" name="role" style={{marginTop:-16}} disableClearable
                                          options={roleData} getOptionLabel={option => option.description || "" }
                                          onChange={(event,newValue)=>roleChange(event,newValue)}
                                          value={formValues?.position?.positionParty?roleData.find(ele=>ele.roleTypeId==formValues.position.positionParty.roleTypeId):null}
                                          renderInput={params => {
                                              return <TextField {...params} variant="outlined" label="نقش در واحد سازمانی" margin="normal" fullWidth
                                                                FormHelperTextProps={{classes: helperTestClasses}}
                                                                helperText={validErrorParty &&!formValues?.position?.positionParty?.roleTypeId  ? "پر کردن این فیلد الزامی است" : ""}
                                                                className={validErrorParty && !formValues?.position?.positionParty?.roleTypeId  ? helperTestClasses.rootAutoComplete:helperTestClasses.formControl }
                                              />
                                          }}

                            />
                        </Grid>
                     <Grid item xs={12} sm={3}>
                         <TextField
                             select variant="outlined" id="tag" name="tag" label="برچسب ها" onChange={addFormData("","position")} fullWidth>
                             <MenuItem value="">---</MenuItem>
                         </TextField>
                     </Grid>
                    </Grid>
                 <Grid container  spacing={2}>
                     <Grid item xs={12} sm={3}/>
                      <Grid item xs={12} sm={3}/>
                      <Grid item xs={12} sm={3}/>
                      <Grid item xs={12} sm={3} className="mt-5">
                          <Button variant="contained"color="primary" className="mt-5" onClick={cancelUpdate}>لغو</Button> &nbsp;&nbsp;&nbsp;
                          {!enableDisableCreate?<Button variant="contained" className="mt-5" color="green" onClick={addPosition} startIcon={<Add/>}>افزودن</Button>:null}
                          {enableDisableCreate ?<Button variant="contained" className="mt-5" color="green" onClick={editPosition} startIcon={<EditIcon/>}>ویرایش</Button>:null}
                      </Grid>
                  </Grid>
                </CardContent>
            </Card>
             <Card>
                 <CardContent>
                 <InlineTable  columns={[
                     { title: 'کد پست سازمانی', field: 'pseudoId' },
                     { title: 'عنوان پست سازمانی', field: 'description' },
                     { title: 'عنوان طبقه شغلی', field: 'jobGradeInsuranceEnum' },
                     { title: 'واحد سازمانی', field: 'organizationParty' },
                     { title: 'کد پرسنلی', field: 'personelId' },
                     { title: 'نوع', field: "positionTypeEnum"},
                     { title: 'نام پرسنل', field: "personelName"},
                     { title: 'وضعیت', field: "active"}]}   title="پست های سازمانی"
                               grouping={true} exportButton={true} data={tableContent} count={tableContent.length} hideDetail={true} showDelete={true} deleteHandler={deleteHandler} loading={loading} editHandler={editHandler} excelData={excelData} excelFileName="پست های سازمانی">
                 </InlineTable>
                 </CardContent>
             </Card>
                    <DeleteModal   open={open} handleClose={handleClose} rowDelete={rowDelete} dispatch={dispatch} setTableContent={setTableContent} setExcelData={setExcelData} />
                </>
            }/>
    )
};

export default OrganizationalPositionForm;
                