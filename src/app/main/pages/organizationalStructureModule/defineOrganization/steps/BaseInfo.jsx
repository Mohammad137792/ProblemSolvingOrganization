import React from 'react';
import {Grid, TextField, Card, CardContent, MenuItem} from "@material-ui/core";
import MultipleSelect from "../../../../components/MultipleSelect";

const BaseInfo = ({formValues, addFormValue}) => {
    return (
        <Card className="mt-20">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" label="کد سازمان" id="baseInfoOrganizationId" onChange={addFormValue}
                                   fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" label="نام سازمان" id="baseInfoOrganizationName" onChange={addFormValue}
                                   fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" label="کد اقتصاری" id="baseInfoEconomicId" onChange={addFormValue}
                                   fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" label="پرتال" id="baseInfoPortal" onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MultipleSelect value={formValues.baseInfoOrganizationActivity} id="baseInfoOrganizationActivity"
                                        label="حوزه فعالیت" onChange={addFormValue}>
                            <MenuItem value="distributor">توزیع کننده</MenuItem>
                            <MenuItem value="supplier">تامین کننده</MenuItem>
                            <MenuItem value="manufacturer">تولید کننده</MenuItem>
                            <MenuItem value="serviceProvider">خمات فنی مهندسی</MenuItem>
                        </MultipleSelect>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" label="توضیحات" id="baseInfoDescription" fullWidth/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default BaseInfo;