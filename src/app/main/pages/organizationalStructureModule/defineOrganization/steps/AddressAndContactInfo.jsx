import React from 'react';
import {Grid, TextField, MenuItem, Card, CardHeader, CardContent, Button} from '@material-ui/core'
import {Add} from "@material-ui/icons";
import CTable from "../../../../components/CTable";

const AddressAndContactInfo = ({formValues, addFormValue}) => {
    return (
        <>
            <Card className="mt-20">
                <CardHeader title="اطلاعات تماس"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField select variant="outlined" id="contactInfoContactMethod" label="راه ارتباطی"
                                       onChange={addFormValue} fullWidth>
                                <MenuItem value="telephoneNumber">تلفن ثابت</MenuItem>
                                <MenuItem value="fax">فکس</MenuItem>
                                <MenuItem value="emailAddress">آدرس ایمیل</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" label="مقدار" id="contactInfoContactMethodValue"
                                       onChange={addFormValue} fullWidth/>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="secondary" className="mt-5" startIcon={<Add/>}>افزودن</Button>
                    <CTable headers={[{
                        id: "index",
                        label: "ردیف"
                    }, {
                        id: "contactMethod",
                        label: "راه ارتباطی"
                    }, {
                        id: "contactMethodValue",
                        label: "شماره / آدرس"
                    }, {
                        id: "modify",
                        label: "ویرایش / حذف"
                    }]}/>
                </CardContent>
            </Card>
            <Card className="mt-20">
                <CardHeader title="آدرس"/>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField select variant="outlined" id="contactInfoAddressType" label="عنوان آدرس"
                                       onChange={addFormValue} fullWidth>
                                <MenuItem value="permanentAddress">آدرس دائمی</MenuItem>
                                <MenuItem value="temporaryAddress">آدرس موقت</MenuItem>
                                <MenuItem value="centralOffice">دفتر مرکزی</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" label="استان" id="contactInfoAddressProvince"
                                       onChange={addFormValue} fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" label="شهر" id="contactInfoAddressCity"
                                       onChange={addFormValue} fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" label="کد پستی" id="contactInfoAddressZipCode"
                                       onChange={addFormValue} fullWidth/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" label="آدرس" id="contactInfoAddressAddress"
                                       onChange={addFormValue} fullWidth/>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="secondary" className="mt-5" startIcon={<Add/>}>افزودن</Button>
                    <CTable headers={[{
                        id: "index",
                        label: "ردیف"
                    }, {
                        id: "contactInfoAddressType",
                        label: "عنوان آدرس"
                    }, {
                        id: "contactInfoAddressProvince",
                        label: "استان"
                    }, {
                        id: "contactInfoAddressCity",
                        label: "شهر"
                    }, {
                        id: "contactInfoAddressAddress",
                        label: "آدرس"
                    }, {
                        id: "modify",
                        label: "ویرایش / حذف"
                    }, ]}/>
                </CardContent>
            </Card>
        </>
    );
}

export default AddressAndContactInfo;
