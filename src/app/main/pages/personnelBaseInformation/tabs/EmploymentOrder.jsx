import React from 'react';
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import CTable from "../../../components/CTable";

const EmploymentOrder = ({formValues, addFormValue}) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="employmentOrderTitle"
                                   label="عنوان حکم" onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField select variant="outlined" id="employmentOrderType"
                                   label="نوع حکم کارگزینی" onChange={addFormValue} fullWidth>
                            <MenuItem value="recruitment">حکم استخدام</MenuItem>
                            <MenuItem value="salaryIncrement">حکم افزایش حقوق</MenuItem>
                            <MenuItem value="retirement">حکم بازنشستگی</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <label htmlFor="employmentOrderAttach">حکم کارگزینی</label><br/>
                        <input type="file" id="employmentOrderAttach"/>
                    </Grid>
                </Grid>
                <Button variant="contained" color="secondary" startIcon={<Add/>}
                        className="mt-5">افزودن</Button>
                <CTable headers={[{
                    id: "employmentOrderTitle",
                    label: "عنوان حکم"
                }, {
                    id: "employmentOrderType",
                    label: "نوع حکم"
                }, {
                    id: "employmentOrderAttachUploadDate",
                    label: "تاریخ آپلود"
                }, {
                    id: "employmentOrderAttach",
                    label: "فایل"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                }]}/>
            </CardContent>
        </Card>
    );
}

export default EmploymentOrder;