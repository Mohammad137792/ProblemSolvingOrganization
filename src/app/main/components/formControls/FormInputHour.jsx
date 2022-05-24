import React, {useEffect, useState} from "react";
import {InputAdornment, TextField} from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

export default function FormInputHour({name, label="", variant, fullWidth, disabled, readOnly, required, helperText, error, value, setValue, setValidation, className, ...restProps}) {
    const cx = require('classnames');
    const [hour, set_hour] = useState("");

    const onChange = (e) => {
        let str = e.target.value.replace(/[^0-9]/gi, "")
        if(str.length > 2) {
            str = str.substr(0,2) + ":" + str.substr(2,2)
        }
        set_hour(str)
        if (str) {
            setValidation()
        }
    }

    const onBlur = () => {
        let str = hour.replace(/[^0-9]/gi, "")
        const h = Number(str.substr(0,2))
        const m = Number(str.substr(2,2))
        if(m > 59) {
            setValidation("ساعت وارد شده معتبر نیست!", true)
            return
        }
        setValue(m + h*60)
    }

    useEffect(() => {
        if(value) {
            const h = Math.floor(value / 60)
            const m = value - h * 60
            const hh = h < 10 ? "0" + h : h.toString()
            const mm = m < 10 ? "0" + m : m.toString()
            set_hour(`${hh}:${mm}`)
        } else {
            set_hour("")
        }
    },[value])

    return (
        <TextField
            name={name}
            label={label}
            variant={variant}
            fullWidth={fullWidth}
            disabled={disabled === true || readOnly === true}
            required={required}
            value={hour}
            onChange={onChange}
            onBlur={onBlur}
            helperText={helperText}
            error={error}
            placeholder="__:__"
            inputProps={{ maxLength: 5 }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <AccessTimeIcon style={{ color: "#979797"}} />
                    </InputAdornment>
                )
            }}
            {...restProps}
            className={cx(className, readOnly && 'read-only', required && 'required')}
        />
    )
}
