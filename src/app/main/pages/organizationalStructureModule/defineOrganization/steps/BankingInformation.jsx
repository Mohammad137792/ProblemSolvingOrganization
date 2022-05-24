import React from 'react';
import {Card, CardContent, TextField, Grid, Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import CTable from "../../../../components/CTable";

const BankingInformation = ({formValues, addFormValue}) => {
    return (
        <Card className="mt-20">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoBankName" label="نام بانک"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoBranchId" label="کد شعبه"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoCardNumber" label="شماره کارت"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoAccountNumber" label="شماره حساب"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoSHEBANumber" label="شماره شبا"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField variant="outlined" id="bankInfoAccountOwner" label="نام صاحب حساب"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                </Grid>
                <Button variant="contained" color="secondary" startIcon={<Add/>} className="mt-5">افزودن</Button>
                <CTable headers={[{
                    id: "index",
                    label: "ردیف"
                }, {
                    id: "bankInfoBankName",
                    label: "نام بانک"
                }, {
                    id: "bankInfoBranchId",
                    label: "کد شعبه"
                }, {
                    id: "bankInfoCardNumber",
                    label: "شماره کارت"
                }, {
                    id: "bankInfoAccountNumber",
                    label: "شماره حساب"
                }, {
                    id: "bankInfoSHEBANumber",
                    label: "شماره شبا"
                }, {
                    id: "bankInfoAccountOwner",
                    label: "نام صاحب حساب"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                }, ]}/>
            </CardContent>
        </Card>
    );
}

export default BankingInformation;