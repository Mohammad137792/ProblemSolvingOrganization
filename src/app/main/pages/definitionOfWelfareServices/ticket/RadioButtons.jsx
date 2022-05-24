import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {Grid} from "@material-ui/core"

const RadioButtons = () => {
    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
      setValue(event.target.value);
    };
    return (
        <Grid>
            <FormControl component="fieldset">
                <FormLabel component="legend">نحوه پرداخت هزینه</FormLabel>
                    <RadioGroup  aria-label="gender" name="gender1" value={value} onChange={handleChange} row>
                        <FormControlLabel value="female" control={<Radio />} label="کسر از حقوق" />
                        <FormControlLabel value="male" control={<Radio />} label=" از طریق درگاه پرداخت آنلاین" />
                    </RadioGroup>
            </FormControl>
        </Grid>
    );
};

export default RadioButtons;