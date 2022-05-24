import React, { useEffect, createRef } from "react";
import { TextField } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DatePicker from "../DatePicker";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import FormInputSelect from "./FormInputSelect";
import DisplayField from "../DisplayField";
import FormInputRange from "./FormInputRange";
import FormInputFile from "./FormInputFile";
import FormInputDropFile from "./FormInputDropFile";
import FormInputPassword from "./FormInputPassword";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormInputHour from "./FormInputHour";

function CreateInput({ valueObject = {}, ...input }) {
  const {
    variant = "outlined",
    validationObject = {},
    validationHandler = () => {},
    valueHandler,
    ...restInput
  } = input;
  const cx = require("classnames");
  // const textInputRef = React.useRef(null);
  const numberInputRef = createRef(0);
  const floatInputRef = createRef(0);
  // console.log('CreateInput',input)
  let value = input.group
    ? valueObject[input.group]
      ? valueObject[input.group][input.name] ?? ""
      : ""
    : valueObject[input.name] ?? "";
  let validation = input.group
    ? validationObject[input.group]
      ? validationObject[input.group][input.name]
      : ""
    : validationObject[input.name];

  function setValue(newValue) {
    // if (input.type === "number")
    //     newValue = Number(newValue)
    if (input.group) {
      input.valueHandler((prevState) => ({
        ...prevState,
        [input.group]: {
          ...prevState[input.group],
          [input.name]: newValue,
        },
      }));
    } else {
      input.valueHandler((prevState) => ({
        ...prevState,
        [input.name]: newValue,
      }));
    }
  }
  function setDate(date) {
    if (date !== null) {
      if (input.withTime)
        // setValue(date.format("Y-MM-DD hh:mm a"))
        setValue(date);
      else setValue(date.format("Y-MM-DD"));
      setValidation();
    }
    if (date == null) {
      setValue(null);
    }
  }

  function setValidation(helper = "", error = false) {
    const newValue = { helper, error };
    if (input.group) {
      validationHandler((prevState) => ({
        ...prevState,
        [input.group]: {
          ...prevState[input.group],
          [input.name]: newValue,
        },
      }));
    } else {
      validationHandler((prevState) => ({
        ...prevState,
        [input.name]: newValue,
      }));
    }
  }

  function setInputFilter(textbox, inputFilter) {
    [
      "input",
      "keydown",
      "keyup",
      "mousedown",
      "mouseup",
      "select",
      "contextmenu",
      "drop",
    ].forEach(function (event) {
      textbox.addEventListener(event, function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }

  useEffect(() => {
    let inputElement = numberInputRef?.current?.querySelector("input");
    if (inputElement) {
      setInputFilter(inputElement, function (value) {
        return /^\d*$/.test(value);
      });
    }
  }, [numberInputRef]);

  useEffect(() => {
    let inputElement = floatInputRef?.current?.querySelector("input");
    if (inputElement) {
      setInputFilter(inputElement, function (value) {
        return /^(|(0|([1-9][0-9]*))(.([0-9]+)?)?)$/.test(value);
      });
    }
  }, [floatInputRef]);

  switch (input.type) {
    case "render":
      value = input.render(valueObject);
    case "textarea":
    case "text":
      return (
        <TextField
          type={input.type}
          name={input.name}
          label={input.label ?? ""}
          variant={variant}
          fullWidth
          multiline={input.type === "textarea"}
          rows={input.rows ?? 4}
          disabled={input.disabled === true || input.readOnly === true}
          required={input.required}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value) {
              setValidation();
            }
          }} //onKeyUp={event => {if(event.key === 'Enter') textInputRef.current}}
          helperText={validation?.helper}
          error={validation?.error}
          {...restInput}
          className={cx(
            input.className,
            input.readOnly && "read-only",
            input.required && "required",
            input.hideSpin && "hide-spin-button"
          )}
          // ref={textInputRef}
        />
      );
    case "password":
      return (
        <FormInputPassword
          variant={variant}
          fullWidth
          value={value}
          setValue={setValue}
          setValidation={setValidation}
          helperText={validation?.helper}
          error={validation?.error}
          {...restInput}
        />
      );
    case "hour":
      return (
        <FormInputHour
          variant={variant}
          fullWidth
          value={value}
          setValue={setValue}
          setValidation={setValidation}
          helperText={validation?.helper}
          error={validation?.error}
          {...restInput}
        />
      );
    case "number":
      return (
        <TextField
          {...restInput}
          type={"text"}
          name={input.name}
          label={input.label ?? ""}
          variant={variant}
          fullWidth
          disabled={input.disabled === true || input.readOnly === true}
          required={input.required}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value) {
              setValidation();
            }
          }}
          helperText={validation?.helper}
          error={validation?.error}
          className={cx(
            input.className,
            input.readOnly && "read-only",
            input.required && "required",
            input.hideSpin && "hide-spin-button"
          )}
          ref={numberInputRef}
        />
      );
    case "float":
      return (
        <TextField
          type={"text"}
          name={input.name}
          label={input.label ?? ""}
          variant={variant}
          fullWidth
          disabled={input.disabled === true || input.readOnly === true}
          required={input.required}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value) {
              setValidation();
            }
          }}
          helperText={validation?.helper}
          error={validation?.error}
          className={cx(
            input.className,
            input.readOnly && "read-only",
            input.required && "required",
            input.hideSpin && "hide-spin-button"
          )}
          ref={floatInputRef}
        />
      );
    case "select":
      return (
        <FormInputSelect
          value={value}
          variant={variant}
          {...restInput}
          valueHandler={input.valueHandler}
          helperText={validation?.helper}
          error={validation?.error}
          setValidation={setValidation}
        />
      );
    case "multiselect":
      return (
        <FormInputSelect
          value={value}
          variant={variant}
          multiple
          {...restInput}
          valueHandler={input.valueHandler}
          helperText={validation?.helper}
          error={validation?.error}
          setValidation={setValidation}
        />
      );
    case "multiselectCategory":
      return (
        <FormInputSelect
          id="grouped-demo"
          value={value}
          variant={variant}
          multiple
          {...restInput}
          valueHandler={input.valueHandler}
          helperText={validation?.helper}
          error={validation?.error}
          setValidation={setValidation}
        />
      );
    case "check":
      return (
        <FormControlLabel
          label={input.label}
          control={
            <Checkbox
              name={input.name}
              disabled={input.disabled}
              checked={value === true}
              onChange={(e) => setValue(e.target.checked)}
            />
          }
        />
      );
    case "time":
      return (
        <TextField
          id="time"
          disabled={input.disabled}
          label={input.label}
          value={value}
          variant="outlined"
          style={{ width: "100%" }}
          type="time"
          name={input.name}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value) {
              setValidation();
            }
          }} //onKeyUp={event => {if(event.key === 'Enter') textInputRef.current}}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case "indicator":
    case "switch":
      const inferenceRule = {
        true: input.indicator ? input.indicator.true : "Y",
        false: input.indicator ? input.indicator.false : "N",
      };
      function putSwitchValue(value) {
        if (input.type === "indicator") return value === inferenceRule["true"];
        return value === true;
      }
      function getSwitchValue(e) {
        const val = e.target.checked;
        if (input.type === "indicator")
          return val ? inferenceRule["true"] : inferenceRule["false"];
        return val;
      }
      if (input.label) {
        return (
          <FormControlLabel
            label={input.label}
            style={{ padding: "8px 4px 0 0" }}
            control={
              <Switch
                name={input.name}
                checked={putSwitchValue(value)}
                onChange={(e) => setValue(getSwitchValue(e))}
                size={restInput.size ?? "medium"}
                disabled={input.disabled === true || input.readOnly === true}
              />
            }
          />
        );
      }
      return (
        <Switch
          name={input.name}
          checked={putSwitchValue(value)}
          onChange={(e) => setValue(getSwitchValue(e))}
          size={restInput.size ?? "medium"}
          disabled={input.disabled === true || input.readOnly === true}
        />
      );
    case "date":
      return (
        <DatePicker
          name={input.name}
          withTime={input.withTime}
          label={input.label ?? ""}
          variant={variant}
          fullWidth
          value={value ? value : null}
          setValue={setDate}
          inputStyle={{
            borderColor: input.borderColor,
            backgroundColor: "red",
          }}
          format={input.withTime ? "jD jMMMM jYYYY HH:mm" : "jD jMMMM jYYYY"}
          disabled={input.disabled === true || input.readOnly === true}
          helperText={validation?.helper}
          error={validation?.error}
          maxDate={input.maxDate}
          minDate={input.minDate}
          readOnly={input?.readOnly}
          hideSpin={input?.hideSpin}
          // className={cx(input.readOnly && 'read-only',input.required && 'required')}
          {...restInput}
        />
      );
    case "range":
      return (
        <FormInputRange value={value} setValue={setValue} {...restInput} />
      );
    case "display":
      return (
        <DisplayField
          value={value}
          valueObject={valueObject}
          {...restInput}
          variant={variant}
        />
      );
    case "component":
      return input.component;
    case "inputFile":
      return (
        <FormInputFile
          value={value}
          disabled={input.disabled}
          setValue={setValue}
          {...restInput}
        />
      );
    case "file":
      return (
        <FormControl error={validation?.error} fullWidth>
          <FormInputDropFile
            setValue={setValue}
            error={validation?.error}
            variant={variant}
            setValidation={setValidation}
            {...restInput}
          />
          <FormHelperText style={{ margin: "3px 14px 0" }}>
            {validation?.helper}
          </FormHelperText>
        </FormControl>
      );
    case "group":
      return (
        <>
          {input.items.map((itemInput, ind) => (
            <CreateInput
              key={ind}
              className="form-group-item"
              valueObject={valueObject}
              valueHandler={input.valueHandler}
              validationObject={input.validationObject}
              validationHandler={input.validationHandler}
              {...itemInput}
            />
          ))}
        </>
      );
    default:
      return (
        <TextField
          name={input.name}
          label={input.label ?? ""}
          defaultValue="???"
          variant={variant}
          fullWidth
        />
      );
  }
}

export default function FormInput({ grid = true, ...input }) {
  const cx = require("classnames");
  if (grid === false) return <CreateInput {...input} />;
  let col = { xs: 12, sm: 4, md: 3 };
  if (typeof input.col === "number") {
    col.md = input.col;
    if (col.md > col.sm) {
      col.sm = col.md;
    }
  } else if (typeof input.col === "object") {
    col = Object.assign({}, col, input.col);
  }
  return (
    <Grid
      item
      xs={col.xs}
      sm={col.sm}
      md={col.md}
      className={cx(
        input.type === "group" && input.display !== false && "form-group",
        input.type === "group" &&
          input.reverse === true &&
          "form-group-reverse",
        input.display === false && "hidden"
      )}
    >
      <CreateInput {...input} />
    </Grid>
  );
}
