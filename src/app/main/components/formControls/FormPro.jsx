import React from "react";
import FormInput from "./FormInput";
import { Grid } from "@material-ui/core";
import { ALERT_TYPES, setAlertContent } from "../../../store/actions/fadak";
import { useDispatch } from "react-redux";

export const requiredHelper = "تعیین این فیلد الزامی است!";
export const requiredAlert = "باید تمام فیلدهای ضروری وارد شوند!";
const validatorAlert = "برخی از مقادیر اشتباه وارد شده اند!";

export default function FormPro({
  submitCallback = () => {},
  resetCallback = () => {},
  formDefaultValues = {},
  formValues = {},
  setFormValues = () => {},
  formValidation = {},
  setFormValidation = () => {},
  prepend = null,
  append = null,
  actionBox = null,
  children,
  ...restProps
}) {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let requiredError = false;
    let validatorError = false;
    let validationBuffer = {};
    const buffer = (group, name, value) => {
      if (group) {
        validationBuffer[group][name] = value;
      } else {
        validationBuffer[name] = value;
      }
    };
    const isEmpty = (input) => {
      const value = formValues[input.name];
      if (!value) return true;
      if (["text", "textarea"].indexOf(input.type) > -1)
        return value.replaceAll(" ", "").length === 0;
      return false;
    };
    const validateForm = async (input) => {
      if (input.required && isEmpty(input)) {
        buffer(input.group, input.name, {
          helper: requiredHelper,
          error: true,
        });
        requiredError = true;
      } else if (input.validator) {
        const inputValidation = await input.validator(formValues);
        buffer(input.group, input.name, inputValidation);
        validatorError = validatorError || inputValidation.error;
      }
    };
    if (prepend) {
      for (let i in prepend) {
        if (prepend[i].type === "group") {
          for (let j in prepend[i].items) {
            await validateForm(prepend[i].items[j]);
          }
        }
        await validateForm(prepend[i]);
      }
    }
    if (append) {
      for (let i in append) {
        if (append[i].type === "group") {
          for (let j in append[i].items) {
            await validateForm(append[i].items[j]);
          }
        }
        await validateForm(append[i]);
      }
    }
    setFormValidation(validationBuffer);
    if (requiredError) {
      dispatch(setAlertContent(ALERT_TYPES.ERROR, requiredAlert));
    } else if (validatorError) {
      dispatch(setAlertContent(ALERT_TYPES.ERROR, validatorAlert));
    } else {
      submitCallback();
    }
  };
  const handleReset = () => {
    setFormValues(formDefaultValues);
    setFormValidation({});
    resetCallback();
  };
  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      noValidate
      autoComplete="off"
      {...restProps}
    >
      <Grid container spacing={2}>
        {prepend &&
          prepend.map(({ validator, ...input }, index) => (
            <FormInput
              key={index}
              {...input}
              valueObject={formValues}
              valueHandler={setFormValues}
              validationObject={formValidation}
              validationHandler={setFormValidation}
            />
          ))}

        {children}

        {append &&
          append.map(({ validator, ...input }, index) => (
            <FormInput
              key={index}
              {...input}
              valueObject={formValues}
              valueHandler={setFormValues}
              validationObject={formValidation}
              validationHandler={setFormValidation}
            />
          ))}

        {actionBox && (
          <Grid item xs={12}>
            {actionBox}
          </Grid>
        )}
      </Grid>
    </form>
  );
}
