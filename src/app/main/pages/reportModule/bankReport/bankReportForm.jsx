import React from 'react';
import {FusePageSimple} from "@fuse";
import {Paper,Button,Card,FormControl,Select,MenuItem,FormControlLabel,Switch,CardContent,TextField, Tabs,Grid, Tab, Typography, CircularProgress} from '@material-ui/core';
import formData from "../../../../store/reducers/fadak/formData.reducers";
import DatePicker from "../../../components/DatePicker";
import Slider from '@material-ui/core/Slider';
import Filter from '@material-ui/icons/Filter';
import CTable from "../../../components/CTable";
import InlineTable from "../../../components/inlinetabel";
import BankModal from "./bankModal";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';


const BankReportForm=({addFormValue,formValues,orgs,bankData,rowBank,open,handleClose,setDisplay,reloadTable,cancelFilter,enumData,loading,editHandler,modalHandler,value,setValue,excelData})=>{
const [filterShow,setFilterShow]=React.useState(false);
const handleStatus=()=>{

        formValues.filter = {
            ...formValues.filter,
            ownerStatus:!value
        }
        const newFormData = Object.assign({}, formValues)
        addFormValue(newFormData)
        setValue(!value)
    }
    return(
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">گزارش اطلاعات بانکی</Typography>}
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
                            <Tooltip title="فیلتر" >
                                <ToggleButton onChange={()=>setFilterShow(!filterShow)}>
                                    <FilterListRoundedIcon />
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
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.pseudoId ?? ""} name="pseudoId" label="کد پرسنلی" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.firstName ?? ""} name="firstName"  label="نام" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.nationalId ?? ""} name="nationalId" label="کد ملی" fullWidth/>
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
                        <Grid item xs={12}  sm={3}>
                            <TextField select id="ownerPartyId" variant="outlined" name="ownerPartyId" label="شرکت" fullWidth inputProps={{multiple: true}}
                                       onChange={addFormValue("","filter")}  value={formValues.filter.ownerPartyId ?? []}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {orgs.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.partyId}>{opt.organizationName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField select id="purposeEnumId" variant="outlined" name="purposeEnumId" label=" نوع اطلاعات بانک" fullWidth inputProps={{multiple: true}}
                                       onChange={addFormValue("","filter")}  value={formValues.filter.purposeEnumId ?? []}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {enumData?.enums?.PaymentMethodPurpose?.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.bankName ?? ""} name="bankName" label="عنوان بانک" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.routingNumber ?? ""} name="routingNumber" label="کد شعبه" fullWidth/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.firstNameOnAccount ?? ""} name="firstNameOnAccount" label="نام مالک حساب" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.lastNameOnAccount ?? ""} name="lastNameOnAccount" label="نام خانوادگی مالک حساب" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.accountNumber ?? ""} name="accountNumber" label="شماره حساب" fullWidth/>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField variant="outlined" onChange={addFormValue("","filter")}  value={formValues.filter.shebaNumber ?? ""} name="shebaNumber" label="شماره شبا" fullWidth/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <TextField select variant="outlined" id="InCompleteItem" name="InCompleteItem" label="اطلاعات ناقص" onChange={addFormValue("","filter")} value={formValues.filter.InCompleteItem??""} fullWidth>
                                <MenuItem value="">---</MenuItem>
                                <MenuItem value="bankName">عنوان بانک</MenuItem>
                                <MenuItem value="routingNumber">کد شعبه</MenuItem>
                                <MenuItem value="firstNameOnAccount">نام مالک حساب</MenuItem>
                                <MenuItem value="lastNameOnAccount">نام خانوادگی مالک حساب</MenuItem>
                                <MenuItem value="shebaNumber">شماره شبا</MenuItem>
                                <MenuItem value="accountNumber">شماره حساب</MenuItem>
                                <MenuItem value="cardNumber">شماره کارت</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}  sm={3}>
                            <TextField select id="InCompletePurposeId" variant="outlined" name="InCompletePurposeId" label=" ناقصی نوع حساب" fullWidth
                                       onChange={addFormValue("","filter")}  value={formValues.filter.InCompletePurposeId ?? ""}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {enumData?.enums?.PaymentMethodPurpose?.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.enumId}>{opt.description}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={3}>
                            <Button variant="contained"color="primary" className="mt-5" type="reset">لغو</Button>&nbsp;&nbsp;&nbsp;
                            <Button variant="contained"color="primary" className="mt-5" type="submit" >اعمال فیلتر</Button>&nbsp;&nbsp;&nbsp;
                            <Button variant="contained"color="primary" className="mt-5" >ذخیره فیلتر</Button>&nbsp;&nbsp;&nbsp;
                        </Grid>
                    </Grid>
                    </form>}
                 </CardContent>
             </Card>
                    <Card>
                        <CardContent>
                        <InlineTable columns={[
                            { title: 'ردیف', field: 'index',width:10 },
                            { title: 'کد پرسنلی', field: "pseudoId" },
                            { title: ' پرسنل', field: 'name' },
                            { title: 'شرکت', field: 'organizationName' },
                            { title: 'مالک حساب', field: 'acountOwner' },
                            { title: 'بانک', field: 'bankName' },
                            { title: 'کد شعبه', field: 'routingNumber' },
                            { title: 'شماره حساب', field: 'accountNumber' },
                            { title: 'شماره شبا', field: 'shebaNumber' },
                            { title: 'شماره کارت', field: 'cardNumber' }]}
                            title="لیست پرسنل" grouping={true} exportButton={true} data={bankData} loading={loading} modalHandler={modalHandler} editHandler={editHandler} count={bankData.length} excelData={excelData} excelFileName="گزارش اطلاعات بانکی"/>
                        </CardContent>
                    </Card>
                    <BankModal open={open} handleClose={handleClose} setDisplay={setDisplay} rowBank={rowBank}/>

                </>
            }/>
    )
};

export default BankReportForm;
                