import React from 'react';
import {Button, Card, CardContent, Grid, MenuItem, TextField} from "@material-ui/core";
import DatePicker from "../../../../components/DatePicker";
import {Add} from "@material-ui/icons";
import CTable from "../../../../components/CTable";
import {INPUT_TYPES} from "../../../../helpers/setFormDataHelper";

const ContractInformationForm = ({formValues, addFormValue}) => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="contractInformationContractNumber" label="شماره‌قرارداد"
                                   onChange={addFormValue()} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField select variant="outlined" id="contractInformationType"
                                   label="نوع قرارداد" onChange={addFormValue()} fullWidth>
                            <MenuItem value="partTime">پاره‌وقت</MenuItem>
                            <MenuItem value="fullTime">تمام‌وقت</MenuItem>
                            <MenuItem value="intern">کارآموزی</MenuItem>
                            <MenuItem value="consulting">مشاوره‌ای</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DatePicker variant="outlined" id="contractInformationStartDate"
                                    value={formValues.contractInformationStartDate ?? new Date()}
                                    setValue={addFormValue(INPUT_TYPES.PICKER, 'contractInformationStartDate')}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ شروع" fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DatePicker variant="outlined" id="contractInformationEndDate"
                                    value={formValues.contractInformationEndDate ?? new Date()}
                                    setValue={addFormValue(INPUT_TYPES.PICKER, 'contractInformationEndDate')}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ پایان" fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="contractInformationTestCourse" label="دوره آزمایشی"
                                   onChange={addFormValue()} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="contractInformationAfterFiringCourse"
                                   label="دوره بعد از اخراج" onChange={addFormValue()} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="contractInformationAfterResignationCourse"
                                   label="دوره بعد از استعفا" onChange={addFormValue()} fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField select variant="outlined" id="contractInformationContractState"
                                   label=",وضعیت قرارداد" onChange={addFormValue()} fullWidth>
                            <MenuItem value="active">فغال</MenuItem>
                            <MenuItem value="diactive">غیر فعال</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DatePicker variant="outlined" id="contractInformationJoiningOrganizationDate"
                                    value={formValues.contractInformationJoiningOrganizationDate ?? new Date()}
                                    setValue={addFormValue(INPUT_TYPES.PICKER, 'contractInformationJoiningOrganizationDate')}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ پیوستن به سازمان" fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DatePicker variant="outlined" id="contractInformationEnteringOrganizationDate"
                                    value={formValues.contractInformationEnteringOrganizationDate ?? new Date()}
                                    setValue={addFormValue(INPUT_TYPES.PICKER, 'contractInformationEnteringOrganizationDate')}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ ورود به سازمان" fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <label htmlFor="contractInformationAttachment">پیوست</label><br/>
                        <input type="file" id="contractInformationAttachment"/>
                    </Grid>
                </Grid>
                <Button variant="contained" color="secondary" className="mt-5"
                        startIcon={<Add/>}>افزودن</Button>
                <CTable headers={[{
                    id: "contractInformationType",
                    label: "نوع قرارداد"
                }, {
                    id: "contractInformationStartDate",
                    label: "تاریخ شروع"
                }, {
                    id: "contractInformationEndDate",
                    label: "تاریخ پایان"
                }, {
                    id: "contractInformationAttachment",
                    label: "پیوست"
                }, {
                    id: "modify",
                    label: "ویرایش / حذف"
                },]}/>

            </CardContent>
        </Card>
    );
}

export default ContractInformationForm;
