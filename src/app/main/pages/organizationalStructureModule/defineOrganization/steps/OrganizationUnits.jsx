import React from 'react';
import {Card, CardContent, Grid, TextField, MenuItem, Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import CTable from "../../../../components/CTable";

const OrganizationUnits = ({formValues, addFormValue}) => {
    return (
        <Card className="mt-20">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" id="organizationUnitOrganizationId" label="کد سازمان"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" id="organizationUnitOrganizationName" label="نام سازمان"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select variant="outlined" id="organizationUnitOrganizationUnit" label="نام واحد"
                                   onChange={addFormValue} fullWidth>
                            <MenuItem value="humanResource">منابع انسانی</MenuItem>
                            <MenuItem value="financialDepartment">امور مالی</MenuItem>
                            <MenuItem value="technicalDepartment">فنی و مهندسی</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select variant="outlined" id="organizationUnitOrganizationPost" label="نام سمت"
                                   onChange={addFormValue} fullWidth>
                            <MenuItem value="ceo">مدیرعامل</MenuItem>
                            <MenuItem value="financialMinister">معاول مالی</MenuItem>
                            <MenuItem value="financialManager">مدیر مالی</MenuItem>
                            <MenuItem value="marketingMinister">معاون بازرگانی</MenuItem>
                            <MenuItem value="marketingExpert">کارشناس بازرگانی</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <Button variant="contained" color="secondary" startIcon={<Add/>} className="mt-5">افزودن</Button>
                <CTable headers={[{
                    id: "index",
                    label: "ردیف"
                }, {
                    id: "organizationUnitOrganizationUnit",
                    label: "نام واحد"
                }, {
                    id: "organizationUnitOrganizationPost",
                    label: "نام سمت"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                }]}/>
            </CardContent>
        </Card>
    );
}

export default OrganizationUnits;