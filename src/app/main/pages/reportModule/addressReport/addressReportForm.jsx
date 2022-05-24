import React from 'react';
import {FusePageSimple} from "@fuse";
import {Paper,Button,Card,FormControl,Select,MenuItem,FormControlLabel,Switch,CardContent,TextField, Tabs,Grid, Tab, Typography, CircularProgress} from '@material-ui/core';
import InlineTable from "../../../components/inlinetabel";
import AddressModal from "./addressModal";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';


const AddressReportForm=({addressData,enumData,formValues, setFormValues,reloadTable,cancelFilter,addFormValue,orgs,open,handleClose,setDisplay,personAddress,loading,editHandler,modalHandler,value,setValue,excelData})=>{
    
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
const unknownOption = {label: "هیچ کدام", value: "NA"}
    return(
        <FusePageSimple
            header={<Typography variant="h6" className="p-10">گزارش آدرس</Typography>}
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
                               <ToggleButton onClick={()=>setFilterShow(!filterShow)}>
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
                            <TextField select id="contactMechPurposeId" variant="outlined" name="contactMechPurposeId" label="نوع آدرس" fullWidth inputProps={{multiple: true}}
                                       onChange={addFormValue("","filter")}  value={formValues.filter.contactMechPurposeId ?? []}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {enumData?.typeAddress?.CmtPostalAddress.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.contactMechPurposeId}>{opt.description}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                         <Grid item xs={12} sm={3}>
                                <TextField select id="countryGeoId" variant="outlined" name="countryGeoId" label="کشور" fullWidth inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.countryGeoId ?? []}>
                                    <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                    {enumData?.geos?.GEOT_COUNTRY.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.geoId}>{opt.geoName}</MenuItem>
                                    ))}
                                </TextField>
                         </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField select id="stateProvinceGeoId" variant="outlined" name="stateProvinceGeoId" label="استان" fullWidth inputProps={{multiple: true}}
                                           onChange={addFormValue("","filter")}  value={formValues.filter.stateProvinceGeoId ?? []}>
                                    <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                    {enumData?.geos?.GEOT_PROVINCE.map((opt,i)=>(
                                        <MenuItem key={i} value={opt.geoId}>{opt.geoName}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField select id="countyGeoId" variant="outlined" name="countyGeoId" label="شهرستان" fullWidth inputProps={{multiple: true}}
                                       onChange={addFormValue("","filter")}  value={formValues.filter.countyGeoId ?? []}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {enumData?.geos?.GEOT_COUNTY.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.geoId}>{opt.geoName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="district" variant="outlined" name="district" label="محله" onChange={addFormValue("","filter")} value={formValues.filter.district ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="street" variant="outlined" name="street" label="خیابان" onChange={addFormValue("","filter")} value={formValues.filter.street ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="alley" variant="outlined" name="alley" label="کوچه" onChange={addFormValue("","filter")} value={formValues.filter.alley ?? ""} fullWidth />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField id="floor" variant="outlined" name="floor" label="طبقه" onChange={addFormValue("","filter")} value={formValues.filter.floor ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="unitNumber" variant="outlined" name="unitNumber" label="واحد" onChange={addFormValue("","filter")} value={formValues.filter.unitNumber ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="postalCode" variant="outlined" name="postalCode" label="کد پستی" onChange={addFormValue("","filter")} value={formValues.filter.postalCode ?? ""} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="contactNumber" variant="outlined" name="contactNumber" label="شماره تماس" onChange={addFormValue("","filter")} value={formValues.filter.contactNumber ?? ""} fullWidth />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField id="areaCode" variant="outlined" name="areaCode" label="پیش شماره" onChange={addFormValue("","filter")} value={formValues.filter.areaCode ?? ""} fullWidth />
                        </Grid>
                        <Grid item sm={3}>
                            <TextField select id="InCompletePurposeId" variant="outlined" name="InCompletePurposeId" label=" ناقصی نوع آدرس" fullWidth
                                       onChange={addFormValue("","filter")}  value={formValues.filter.InCompletePurposeId ?? ""}>
                                <MenuItem value="" style={{display:'none'}}> </MenuItem>
                                {enumData?.typeAddress?.CmtPostalAddress.map((opt,i)=>(
                                    <MenuItem key={i} value={opt.contactMechPurposeId}>{opt.description}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item sm={3}>
                            <TextField select variant="outlined" id="InCompleteItem" name="InCompleteItem" label="اطلاعات ناقص" onChange={addFormValue("","filter")} value={formValues.filter.InCompleteItem??""} fullWidth>
                                <MenuItem value="">---</MenuItem>
                                <MenuItem value="countryGeoId">کشور</MenuItem>
                                <MenuItem value="countyGeoId">شهرستان</MenuItem>
                                <MenuItem value="stateProvinceGeoId">استان</MenuItem>
                                <MenuItem value="street">خیابان</MenuItem>
                                <MenuItem value="district">محله</MenuItem>
                                <MenuItem value="floor">طبقه</MenuItem>
                                <MenuItem value="unitNumber">واحد</MenuItem>
                                <MenuItem value="alley">کوچه</MenuItem>
                                <MenuItem value="postalCode">کد پستی</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        </Grid>
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
                                { title: 'ردیف',width:10, field: 'index'},
                                { title: 'کد پرسنلی', field: 'pseudoId' },
                                { title: 'نام پرسنل', field: 'name' },
                                { title: 'شرکت', field: 'organizationName' },
                                { title: 'آدرس محل سکونت',width:600, field: 'address' },
                                { title: 'شماره تماس محل سکونت', field: "addressTelecomeNumber"}]}   title="لیست پرسنل" data={addressData}
                                 grouping={true}  loading={loading} exportButton={true} editHandler={editHandler} modalHandler={modalHandler} count={addressData.length} excelData={excelData} excelFileName="آدرس پرسنل">
                            </InlineTable>
                        </CardContent>
                    </Card>
                    <AddressModal open={open} handleClose={handleClose} setDisplay={setDisplay} personAddress={personAddress}/>
              </>
            }/>
    )
};

export default AddressReportForm;
                