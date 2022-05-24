import React from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Card,
    CardContent,
    MenuItem,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel
} from "@material-ui/core";
import translate from "../../../../helpers/translate";

const SubOrganizations = ({formValues, addFormValue}) => {
    return (
        <Card className="mt-20">
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" id="subOrganizationOrganizationId" label="کد سازمان"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField variant="outlined" id="subOrganizationOrganizationName" label="نام سازمان"
                                   onChange={addFormValue} fullWidth/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" id="subOrganizationSubOrganizations" fullWidth>
                            <InputLabel id="subOrganizationSubOrganizations-label">سازمان‌های زیرمجموعه</InputLabel>
                            <Select
                                label="سازمان‌های زیرمجموعه"
                                labelId="subOrganizationSubOrganizations-label"
                                id="subOrganizationSubOrganizations"
                                name="subOrganizationSubOrganizations"
                                multiple
                                value={formValues.subOrganizationSubOrganizations ? formValues.subOrganizationSubOrganizations : []}
                                onChange={addFormValue}
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={translate(value)}/>
                                        ))}
                                    </div>
                                )}>
                                <MenuItem value="railParzadSeir">ریل پرداز سیر</MenuItem>
                                <MenuItem value="noAfarin">نو آفرین</MenuItem>
                                <MenuItem value="duta">کترینگ دوتا</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <RadioGroup name="subOrganizationOrganizationName"
                                    value={formValues.subOrganizationOrganizationName} onChange={addFormValue}>
                            <FormControlLabel value="motherOrganization" control={<Radio/>} label="سازمان مادر"/>
                            <FormControlLabel value="singleOrganization" control={<Radio/>} label="سازمان منفرد"/>
                        </RadioGroup>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default SubOrganizations;