/**
 * @author Ali Sarmadi <mr.snaros@gmail.com>
 * Used to simplify datePicker and dateTimePicker components. it holds almost all datePicker component props with an
 * additional property called withTime which determines if you want to render a dateTimePicker or a simple datePicker.
 * the props of KeyboardDate[Time]Picker which you can modify is mentioned below. Checkout each of them's usage in
 * https://material-ui-pickers.dev/
 * @param variant, id, label, format, value, setValue, fullWidth
 * @param withTime: is described above.
 */

import React from 'react';
import { KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import JalaaliUtils from "@date-io/jalaali";
import IRLocale from "date-fns/locale/fa-IR";
import jalaaliMoment from "moment-jalaali";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
    root: {
        margin:"0",
        "& label span": {
            color: "red"
        },




    },

});

const DatePicker = ({ variant, id, label, format, value, setValue, fullWidth, withTime, required, defaultValue, disabled, helperText, FormHelperTextProps, error,maxDate,minDate,disablePast,disableFuture, readOnly, hideSpin }) => {
    jalaaliMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

    const classes = useStyles();

    const cx = require('classnames');

    return (
        <MuiPickersUtilsProvider utils={JalaaliUtils} locale={IRLocale}>
            {withTime ? (
                <KeyboardDateTimePicker
                    required={required}
                    ampm={false}
                    okLabel="تایید"
                    cancelLabel="لغو"
                    maxDate={maxDate}
                    minDate={minDate}
                    inputVariant={variant}
                    margin="normal"
                    id={id}
                    defaultValue={defaultValue}
                    label={label}
                    disabled={disabled}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    format={format}
                    value={value}
                    helperText={helperText}
                    FormHelperTextProps={FormHelperTextProps}
                    error={error}
                    className={classes.root}
                    onChange={setValue}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    fullWidth={fullWidth}
                />
            ) : (
                    <KeyboardDatePicker
                        required={required}
                        maxDate={maxDate}
                        minDate={minDate}
                        okLabel="تایید"
                        cancelLabel="لغو"
                        inputVariant={variant}
                        margin="normal"
                        id={id}
                        disabled={disabled}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        label={label}
                        format={format}
                        value={value}
                        helperText={helperText}
                        FormHelperTextProps={FormHelperTextProps}
                        defaultValue={defaultValue}
                        error={error}
                        className={cx(classes.root, readOnly && 'read-only', required && 'required', hideSpin && 'hide-spin-button')}
                        onChange={setValue}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        fullWidth={fullWidth}
                    />
                )}
        </MuiPickersUtilsProvider>
    );
}

export default DatePicker;
