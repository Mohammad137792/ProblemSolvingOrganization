import React from 'react';
import {FusePageSimple} from "@fuse";
import {Paper,Button,Card,FormControl,Select,MenuItem,FormControlLabel,Switch,CardContent,TextField, Tabs,Grid, Tab, Typography, CircularProgress} from '@material-ui/core';
import formData from "../../../../store/reducers/fadak/formData.reducers";
import DatePicker from "../../../components/DatePicker";
import Slider from '@material-ui/core/Slider';
import Filter from '@material-ui/icons/Filter';
import CTable from "../../../components/CTable";
import InlineTable from "../../../components/inlinetabel";
import ContactModal from "./contactModal.jsx";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

const ContactReportForm=({contactData,formValues, setFormValues,reloadTable,cancelFilter,addFormValue,orgs,open,handleClose,setDisplay,personContacts,contactType,loading,editHandler,modalHandler,value,setValue,excelData})=>{
const [filterShow,setFilterShow]=React.useState(false);
 const handleStatus=()=>{
        formValues.filter = {
            ...formValues.filter,
            ownerStatus:!value
        }
        const newFormData = Object.assign({}, formValues)
        setFormValues(newFormData)
        setValue(!value)
    }
    return(
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">گزارش اطلاعات تماس</Typography>}
            content={
                <>
            <Card>
                <CardContent>
                   <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField select label="فیلترها" variant="outlined" id="filter" name="filter" fullWidth>
                                <MenuItem value="">---</MenuItem>
                            </TextField>
                        </Grid>
                       <Grid item xs={12} sm={3}>
                           <Tooltip title="فیلتر">
                               <ToggleButton onChange={()=>setFilterShow(!filterShow)}>
                                   <FilterListRoundedIcon/>
                               </ToggleButton>
                           </Tooltip>
                       </Grid>
                    </Grid>
                    {filterShow &&
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        reloadTable(true);
                    }} onReset={function(){
                        cancelFilter();
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <TextField id="pseudoId" variant="outlined" name="pseudoId" label="کد پرسنلی" onChange={addFormValue("","filter")} value={formValues.filter.pseudoId ?? ""}  fullWidth/>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField id="firstName" variant="outlined" name="firstName" label="نام" onChange={addFormValue("","filter")} value={formValues.filter.firstName ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField id="nationalId" variant="outlined" name="nationalId" label="کد ملی" onChange={addFormValue("","filter")} value={formValues.filter.nationalId ?? ""} fullWidth/>
                        </Grid>
                            <Grid item xs={3}>
                                <FormControl>
                                    <FormControlLabel
                                        control={<Switch name="ownerStatus" checked={value}  onChange={()=>{
                                            handleStatus();
                                        }
                                        }/>}
                                        label="وضعیت پرسنل" name="ownerStatus"/>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        <TextField select id="ownerPartyId" variant="outlined" name="ownerPartyId" label="شرکت" fullWidth inputProps={{multiple: true}}
                        onChange={addFormValue("","filter")}  value={formValues.filter.ownerPartyId ?? []}>
                            <MenuItem value="" style={{display:'none'}}> </MenuItem>
                            {orgs.map((opt,i)=>(
                                <MenuItem key={i} value={opt.partyId}>{opt.organizationName}</MenuItem>
                            ))}
                        </TextField>
                        </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField select id="contactMechPurposeId" variant="outlined" name="contactMechPurposeId" label=" نوع تماس" fullWidth
                                           onChange={addFormValue("","filter")}  value={formValues.filter.contactMechPurposeId ?? ""}>
                                    <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                    {contactType?.map((opt,i)=>(
                                        <MenuItem  value={opt.contactMechPurposeId}>{opt.description}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        <Grid item xs={12} sm={3}>
                        <TextField variant="outlined" label="اطلاعات تماس" id="contact" name="contact" onChange={addFormValue("","filter")} value={formValues.filter.contact ?? ""} fullWidth/>
                        </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField variant="outlined" label="بیش شماره تماس" id="areaCode" name="areaCode" onChange={addFormValue("","filter")} value={formValues.filter.areaCode ?? ""} fullWidth/>
                            </Grid>
                         <Grid item xs={12} sm={3}>
                         <TextField select id="InCompletePurposeId" variant="outlined" name="InCompletePurposeId" label=" ناقصی نوع تماس" fullWidth
                                        onChange={addFormValue("","filter")}  value={formValues.filter.InCompletePurposeId ?? ""}>
                                 <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                 {contactType?.map((opt,i)=>(
                                     <MenuItem  value={opt.contactMechPurposeId}>{opt.description}</MenuItem>
                                 ))}
                         </TextField>
                         </Grid>   
                        </Grid>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        </Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={3}>
                        <Button variant="contained"color="primary" type="reset" className="mt-5" >لغو</Button>&nbsp;&nbsp;&nbsp;
                        <Button variant="contained"color="primary" type="submit" className="mt-5" >اعمال فیلتر</Button>&nbsp;&nbsp;&nbsp;
                         <Button variant="contained"color="primary" className="mt-5" >ذخیره فیلتر</Button>&nbsp;&nbsp;&nbsp;
                        </Grid>
                        </Grid>
                    </form>
                    }
                 </CardContent>
             </Card>
                    <Card>
                        <CardContent>
                                <InlineTable  columns={[
                                { title: 'ردیف', field: 'index',width:10 },
                                { title: 'کد پرسنلی', field: 'pseudoId' },
                                { title: 'نام پرسنل', field: 'name' },
                                { title: 'شرکت', field: 'organizationName' },
                                { title: 'اطلاعات تماس همراه', field: 'mobile' },
                                { title: 'اطلاعات تماس ثابت', field: "contact"}]}   title="لیست پرسنل"
                                 grouping={true} exportButton={true} data={contactData} loading={loading} count={contactData.length} editHandler={editHandler} modalHandler={modalHandler} excelData={excelData} excelFileName="شماره تماس پرسنل">
                            </InlineTable>
                        </CardContent>
                    </Card>
                    <ContactModal open={open} handleClose={handleClose} setDisplay={setDisplay} personContacts={personContacts}/>
              </>
            }/>
    )
};

export default ContactReportForm;
                