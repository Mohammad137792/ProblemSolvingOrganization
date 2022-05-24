import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import {Image, Visibility, Wallpaper} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import FuseHighlight from "../../../../../@fuse/components/FuseHighlight/FuseHighlight";
import UserFullName from "../../../components/formControls/UserFullName";
import UserCompany from "../../../components/formControls/UserCompany";
import UserEmplPosition from "../../../components/formControls/UserEmplPosition";
import FormInput from "../../../components/formControls/FormInput";
import ActionBox from "../../../components/ActionBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import FormPro from "../../../components/formControls/FormPro";
import TablePro from "../../../components/TablePro";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CloudUpload from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import {SERVER_URL} from "../../../../../configs";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function HelpComponents() {
    const [formValues, setFormValues] = useState({});
    return(
        <React.Fragment>
            <Card>
                <CardHeader title="المان های ورودی عمومی"/>
                <CardContent>
                    <FormInputExample/>
                    <Box pt={2} pb={2}>
                        <Divider/>
                    </Box>
                    <FormInputTest1/>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <CardHeader title="المان های اختصاصی"/>
                <CardContent>
                    <FrameA title="نام کاربر"
                            description="المانی برای نمایش نام کاربر است. پیش فرض برچسب المان برابر 'نام و نام خانوادگی کاربر' بوده و قابل تغییر است. در صورت نیاز به partyId کاربر می توان از تابع setValue و مشخصه name استفاده کرد."
                            attrsTable={[
                                {name: "label", type: "string", default: "'نام و نام خانوادگی کاربر'", description: "عنوان فیلد"},
                                {name: "variant", type: "'standard' | 'outlined'", default: "'outlined'", description: ""},
                                {name: "name", type: "string", default: "'userPartyId'", description: "نام فیلد خروجی"},
                                {name: "setValue", type: "func", default: "", description: "تابع خروجی گرفتن partyId کاربر"},
                            ]}
                            js={`const [ formValues, setFormValues ] = useState( {} );`}
                            html={`<UserFullName
    label="نام و نام خانوادگی تنظیم کننده" 
    setValue={setFormValues} />`}
                    >
                        <UserFullName label="نام و نام خانوادگی تنظیم کننده" setValue={setFormValues}/>
                    </FrameA>
                    <Box my={2}>
                        <Divider variant="fullWidth"/>
                    </Box>

                    <FrameA title="شرکت کاربر"
                            description="المانی برای نمایش نام شرکت کاربر است. برچسب المان نیز قابل تنظیم است. امکان خروجی گرفتن partyId شرکت نیز توسط تابع setValue وجود دارد."
                            attrsTable={[
                                {name: "label", type: "string", default: "'شرکت'", description: "عنوان فیلد"},
                                {name: "variant", type: "'standard' | 'outlined'", default: "'outlined'", description: ""},
                                {name: "name", type: "string", default: "'userCompanyId'", description: "نام فیلد خروجی"},
                                {name: "setValue", type: "func", default: "", description: "تابع خروجی گرفتن partyId شرکت"},
                            ]}
                            html={`<UserCompany 
    name="orgPartyId" 
    setValue={setFormValues} />`}
                    >
                        <UserCompany name="orgPartyId" setValue={setFormValues}/>
                    </FrameA>
                    <Box my={2}>
                        <Divider variant="fullWidth"/>
                    </Box>
                    <ActionBox>
                        <Button role="primary" onClick={()=>console.log('formValues',formValues)}>لاگ مقادیر</Button>
                    </ActionBox>
                    {/*<FrameA title="پست های سازمانی کاربر"*/}
                    {/*        description="المانی برای انتخاب پست کاربر است. در پارامتر valueObject شیء شامل مقدار فیلد باید قرار گیرد. مقدار پیش فرض نام فیلد برابر 'userEmplPositionId' بوده و قابل تغییر است."*/}
                    {/*        attrs={['label','variant','name','valueObject', 'valueHandler']}*/}
                    {/*        js={`const [formValues, setFormValues] = useState({})`}*/}
                    {/*        html={`<UserEmplPosition valueObject={formValues} valueHandler={setFormValues}/>`}*/}
                    {/*>*/}
                    {/*    <UserEmplPosition valueObject={formValues} valueHandler={setFormValues}/>*/}
                    {/*</FrameA>*/}
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

function FrameA ({title, subtitle, description, attrs, attrsTable, html='', js='',children}) {
    const tableCols = [
        {name: "name", label: "نام مشخصه", type: "text"},
        {name: "type", label: "نوع", type: "text"},
        {name: "default", label: "مقدار پیش فرض", type: "text"},
        {name: "description", label: "توضیحات", type: "text"},
    ]
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="subtitle1">{title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                {subtitle && <Typography variant="body1">{subtitle}</Typography>}
                <Box my={2}>
                    {children}
                </Box>
                {description && <Typography variant="body2">{description}</Typography>}
                {attrs &&
                <Typography variant="body2">{"پارامترهای المان: " + attrs.join(', ')}</Typography>
                }
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper variant="outlined" style={{backgroundColor:'#263238',direction:'ltr'}}>
                    {js && <FuseHighlight component="pre" className="language-js">
                        {js}
                    </FuseHighlight>}
                    <FuseHighlight component="pre" className="language-html">
                        {html}
                    </FuseHighlight>
                </Paper>
            </Grid>
            {attrsTable &&
            <Grid item xs={12}>
                <TablePro
                    columns={tableCols}
                    rows={attrsTable}
                    showTitleBar={false}
                    pagination={false}
                />
            </Grid>
            }
        </Grid>
    )
}

function FormInputTest1() {
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [formValues, setFormValues] = useState({switch1: false});
    const formStructure = [{
        name    : "switch1",
        label   : "سوئیچ یک",
        type    : "switch",
    },{
        name    : "select1",
        label   : "لیست انتخاب",
        type    : "select",
        options : options,
        loading : loading
    },{
        name    : "select2",
        label   : "لیست انتخاب",
        type    : "select",
        options : "EmplPosition",
    }]

    React.useEffect(()=>{
        setLoading(formValues.switch1)
        if(formValues.switch1){
            setOptions([])
        }else{
            setOptions([{enumId: 1, description: "گزینه یک"}])
        }
    },[formValues.switch1])

    return(
        <FormPro
            append={formStructure}
            formValues={formValues} setFormValues={setFormValues}
            actionBox={<ActionBox>
                <Button type="button" role="primary" onClick={()=>{
                    console.log("formValues:",formValues)
                }}>لاگ مقادیر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

function FormInputExample() {
    const [formValues, setFormValues] = useState({select3:JSON.stringify(["MarsSingle","MarsMarried"])});
    const formStructure = [{
        name:   "text1",
        label:  "ورودی متن",
        type:   "text"
    },{
        name:   "text1",
        label:  "ورودی متن غیرفعال",
        type:   "text",
        disabled: true
    },{
        name:   "text1",
        label:  "ورودی متن نمایشی",
        type:   "text",
        readOnly: true
    },{
        name:   "number1",
        label:  "ورودی عدد",
        type:   "number",
    },{
        name:   "range1",
        label:  "ورودی محدوده اعداد",
        type:   "range",
        unit:   "واحد"
    },{
        name    : "range2",
        label   : "ورودی محدوده اعداد",
        type    : "range",
        min     : 10,
        max     : 20,
        check   : true,
    },{
        name    : "date1",
        label   : "تاریخ",
        type    : "date",
    },{
        name    : "date1",
        label   : "تاریخ نمایشی",
        type    : "display",
        options : "Date"
    },{
        name    : "hour1",
        label   : "ساعت",
        type    : "hour",
    },{
        name    : "hour1",
        label   : "ساعت",
        type    : "display",
        options : "Hour"
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
        name    : "select2",
        label   : "لیست انتخاب غیر قابل حذف",
        type    : "select",
        options : "Gender",
        disableClearable: true
    },{
        name    : "select3",
        label   : "لیست چند انتخابی",
        type    : "multiselect",
        options : "MaritalStatus",
    },{
        name    : "select4",
        label   : "لیست انتخاب با چند خروجی",
        type    : "select",
        options : "Test1",
        otherOutputs: [{name: "select4title", optionIdField: "description"}]
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
        name    : "textarea1",
        label   : "متن بلند",
        type    : "textarea",
        col     : 6
    },{
        name    : "textarea1",
        label   : "متن بلند نمایشی",
        type    : "textarea",
        col     : 6,
        readOnly: true
    },{
        type    : "group",
        items   : [{
            name    : "deadTime",
            label   : "مهلت ارسال درخواست",
            type    : "number"
        },{
            label   : "روز قبل از تاریخ سفر",
            type    : "text",
            disabled: true,
            fullWidth: false,
            style:  {minWidth:"137px"}
        }],
        col     : 4
    },{
        type    : "group",
        items   : [{
            name    : "value",
            label   : "هزینه",
            type    : "number",
            group   : "cost"
        },{
            name    : "unit",
            type    : "select",
            options : [{enumId:"irs",description:"ریال"},{enumId:"prc",description:"%"}],
            disableClearable: true,
            group   : "cost"
        }]
    },{
        type    : "component",
        col     : {sm: 8, md: 6},
        component   : (
            <Box display="flex" className="outlined-input" >
                <Box flexGrow={1} style={{padding:"18px 14px"}}>
                    <Typography color="textSecondary">پیوست</Typography>
                </Box>
                <Box style={{padding:"3px 14px"}}>
                    <input type="file" style={{display: "none"}}/>
                    <Tooltip title="آپلود فایل" >
                        <IconButton >
                            <CloudUpload/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف فایل پیوست شده" >
                        <IconButton>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="دانلود فایل پیوست شده" >
                        <IconButton>
                            <Visibility/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        )
    }]
    return(
        <FormPro
            append={formStructure}
            formValues={formValues} setFormValues={setFormValues}
            actionBox={<ActionBox>
                <Button type="button" role="primary" onClick={()=>{
                    console.log("formValues:",formValues)
                }}>لاگ مقادیر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

