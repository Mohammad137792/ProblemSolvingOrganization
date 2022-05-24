import React from 'react';
import {Card, CardContent, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import DatePicker from "../../../../components/DatePicker";
import translate from "../../../../helpers/translate";
import {INPUT_TYPES} from "../../../../helpers/setFormDataHelper";

const LeavingOrganizationForm = ({formValues, addFormValue}) => {
    return (
        <Card className="mt-20">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <DatePicker variant="outlined" id="leavingOrganizationDate"
                                    value={formValues.leavingOrganizationDate ?? new Date()}
                                    setValue={addFormValue(INPUT_TYPES.PICKER, 'leavingOrganizationDate')}
                                    format={"jYYYY/jMMMM/jDD"}
                                    label="تاریخ ترک سازمان" fullWidth/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl variant="outlined" id="leavingOrganizationReason" fullWidth>
                            <InputLabel id="leavingOrganizationReason-label">دلیل ترک سازمان</InputLabel>
                            <Select
                                label="دلیل ترک سازمان"
                                labelId="leavingOrganizationReason-label"
                                id="leavingOrganizationReason"
                                name="leavingOrganizationReason"
                                multiple
                                value={formValues.leavingOrganizationReason ? formValues.leavingOrganizationReason : []}
                                onChange={addFormValue(INPUT_TYPES.MULTI_SELECT)}
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={translate(value)}/>
                                        ))}
                                    </div>
                                )}>
                                <MenuItem value="highLoadPressure">بار کاری زیاد</MenuItem>
                                <MenuItem value="contractDisagreement">عدم توافق سر قرارداد</MenuItem>
                                <MenuItem value="illness">بیماری</MenuItem>
                                <MenuItem value="retired">بازنشستگی</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="leavingOrganizationOthers" label="سایر"
                                   onChange={addFormValue()} fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField multiline rows={3} variant="outlined" id="leavingOrganizationDescription"
                                   label="توضیجات" onChange={addFormValue()} fullWidth/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default LeavingOrganizationForm;