import React from "react";
import {TextField} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default function FormInputPassword({name, label, value, setValue, setValidation, variant, fullWidth, disabled, readOnly, required, helperText, error, className, ...restProps}) {
    const cx = require('classnames');
    const [visible, set_visible] = React.useState(false)
    function toggle_visibility() {
        set_visible(prevState => !prevState)
    }
    return (
        <TextField
            name={name}
            label={label ?? ""}
            variant={variant}
            fullWidth={fullWidth}
            disabled={disabled === true || readOnly === true}
            required={required}
            value={value}
            onChange={e => {
                if(setValue) {
                    setValue(e.target.value)
                }
                if (e.target.value && setValidation) {
                    setValidation()
                }
            }}
            helperText={helperText}
            error={error}
            inputProps={{
                type: visible ? "text" : "password"
            }}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={toggle_visibility}>
                        {!visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            }}
            {...restProps}
            className={cx(className, readOnly && 'read-only', required && 'required')}
        />
    )
}
