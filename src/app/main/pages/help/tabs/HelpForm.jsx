import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import ActionBox from "../../../components/ActionBox";
import Box from "@material-ui/core/Box";
import FormPro from "../../../components/formControls/FormPro";

export default function HelpForm() {
    return(
        <React.Fragment>
            <Card>
                <CardHeader title="ساخت فرم"/>
                <CardContent>
                    <FormExample1/>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <CardHeader title="اعتبارسنجی فرم"/>
                <CardContent>
                    <FormExampleValidation/>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

function FormExample1() {
    const [formValues, setFormValues] = useState({});
    const [jobTitles, setJobTitles] = useState([]);
    const formStructure = [
        {
            name    : "insuranceNumberEnumId",
            label   : "عنوان طبقه شغل",
            type    : "select",
            options : jobTitles,
            long    : true,
            urlLong : "/rest/s1/fadak/long",
            changeCallback: (newOption) => setJobTitles([newOption])
        },{
            name    : "insuranceNumberEnumId",
            label   : "کد بیمه شغل",
            type    : "select",
            options : jobTitles,
            // optionLabelField: "enumCode",
            long    : true,
            urlLong : "/rest/s1/fadak/long",
            changeCallback: (newOption) => setJobTitles([newOption])
        },{
            name:   "insuranceNumberEnumId",
            label:  "شناسه طبقه شغل",
            type:   "text"
        },
        {
            name:   "text1",
            label:  "ورودی متن",
            type:   "text"
        },{
            name:   "number1",
            label:  "ورودی عدد",
            type:   "number",
        },{
            name:   "range1",
            label:  "ورودی محدوده اعداد",
            type:   "range",
        },{
            name    : "switch1",
            label   : "سوئیچ یک",
            type    : "switch",
        },{
            name    : "switch2",
            label   : "سوئیچ دو",
            type    : "indicator",
        },{
            name    : "switch3",
            label   : "سوئیچ سه",
            type    : "indicator",
            indicator   : {'true': 'Yes','false':'No'}
        },{
            name    : "date1",
            label   : "تاریخ",
            type    : "date",
        },{
            name    : "date1",
            label   : "تاریخ",
            type    : "display",
            options : "Date"
        },{
            name    : "select1",
            label   : "لیست انتخاب",
            type    : "select",
            options : "Test1"
        },{
            name    : "select1b",
            label   : "لیست وابسته",
            type    : "select",
            options : "Test2",
            filterOptions: options => options.filter(o=>o["parentEnumId"]===formValues["select1"])
        },{
            name:   "select2",
            label:  "لیست انتخاب غیر قابل حذف",
            type:   "select",
            options:"Gender",
            disableClearable: true
        },{
            name:   "select3",
            label:  "لیست چند انتخابی",
            type:   "multiselect",
            options:"MaritalStatus",
        }]
    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    // React.useEffect(() => {
    //
    // },[formValues.insuranceNumberEnumId])
    return(
        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={handleSubmit}
            append={formStructure}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">تایید</Button>
                <Button type="reset" role="secondary">لغو</Button>
                <Button type="button" role="tertiary" onClick={()=>{
                    console.log("formValues:",formValues)
                }}>لاگ مقادیر</Button>
            </ActionBox>}
        />
    )
}

function FormExampleValidation() {
    const [formValues, setFormValues] = useState({});
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [
        {
            name:   "name",
            label:  "نام",
            type:   "text",
            required: true
        },{
            name:   "nationalId",
            label:  "کد ملی",
            type:   "number",
            required: true
        },{
            name:   "gender",
            label:  "جنسیت",
            type:   "select",
            options:"Gender",
            required: true
        },{
            name    : "hour1",
            label   : "ساعت",
            type    : "hour",
            required: true
        },{
            name:   "decription",
            label:  "توضیحات",
            type:   "textarea",
            col:    12,
            required: true
        }]

    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    return (
        <FormPro formValues={formValues} setFormValues={setFormValues}
                 formValidation={formValidation} setFormValidation={setFormValidation}
                 submitCallback={handleSubmit}
                 append={formStructure}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">تایید</Button>
                     {/*<Button type="reset" role="secondary">لغو</Button>*/}
                 </ActionBox>}
        />
    )
}
