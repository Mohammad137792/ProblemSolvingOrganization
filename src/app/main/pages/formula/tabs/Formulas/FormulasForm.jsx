import React, { useEffect } from 'react';
import FormPro from "../../../../components/formControls/FormPro";
import {FuseScrollbars} from '@fuse';
import {Button, Card, Paper, Tab, Tabs} from "@material-ui/core";
import TabPane from "../../../../components/TabPane";
import {useTheme} from "@material-ui/core/styles";
import Constant from './tabs/Constant';
import FunctionList from './tabs/FunctionList';
import InputFactor from "./tabs/InputFactor";
import OrderParam from "./tabs/OrderParam";
import Param from "./tabs/Param";
import SystemParam from "./tabs/SystemParam";
import Statement from "./tabs/Statement";
import FuncInput from "./tabs/FuncInput";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SERVER_URL} from "../../../../../../configs";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import "ace-builds/src-noconflict/ext-language_tools"


const FormulasForm = (props) => {

    let isValid
    const dispatch = useDispatch();
    const theme = useTheme();
    const useStyles = makeStyles((theme) => ({
        tabPane: {
            height:"450px",
            overflow: "auto",
            position:"relative",
            '& li':{
                listStyleType: "none"
            }
            
        }
    }));
    const classes = useStyles();
    const main=[
        {
            name:"firstName",
            label:"نام و نام خانوادگی",
            type:"text",
            readOnly: true
        },
        {
          name:"emplPositionId",
          label:"سمت سازمانی",
          type:"select",
          options:"UserEmplPosition",
          optionIdField: "emplPositionId",
        },
        {
            name:"variation",
            label:"علت تغییر",
            type:"text"
        },
        {
            name:"version",
            label:"ورژن",
            type:"text"
        },
        {
            name:"title",
            label:"عنوان فرمول",
            type:"text",
            required:true
        },
        {
            name:"formulaTypeEnumId",
            label:"نوع فرمول",
            type:"select",
            options:"FormulaType",
            required:true
        },
        {
            name:"date",
            label:"تاریخ ایجاد",
            type:   "date",
            readOnly: true
            
        },
        {
            name:"description",
            label:"شرح فرمول",
            type:   "textarea",
            col:3
        }
    ]
    const [formValidation, setFormValidation] = React.useState({});

    const [value, setValue] = React.useState(0);
    const [caretPosition, setCaretPosition] = React.useState(null);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleLangChange=(event,newValue)=>{
        props.setLangValue(newValue)
    }
    const changeFormula=(formula)=>{

        let text = props.formulaText,
            line = caretPosition ? caretPosition.row : 0,
            col  = caretPosition ? caretPosition?.column : 0
        let mText = text.split("\n")
        for(let i=0;i<mText.length;i++){
            if(i == line)
                mText[i] = [mText[i].slice(0, col), formula, mText[i].slice(col)].join('')
        }
        mText.join("\n")
        let newFormulaText = mText.join("\n")
        props.setFormulaText(newFormulaText)
        props.setLangValue(0)
    }
    const createFormula=(data)=> {
        let text = props.formulaText.split('return')
        if(text[0].trim() == ''){
            isValid = [false]
        }

        if(!isValid || isValid.length == 0){
            if(props.formulaText.toString().indexOf('return') >= 0) {
                data.text = props.formulaText.replaceAll('<','@lt')//.toString()
                data.companyPartyId = props.userOrganization;
                let postData = {}
                postData.data = data;
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));

                axios.post(SERVER_URL + "/rest/s1/rule/create", postData, {headers: {"api_key": localStorage.getItem("api_key")}}).then(res => {
                    data.formulaId = res.data.formulaId;
                    data["mantle.humanres.employment.FormulaDetail"] = {}
                    data["mantle.humanres.employment.FormulaDetail"]["args"] = res.data?.args
                    props.setTableContent(rows => [...rows, data]);
                    resetForm();
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فرمول با موفقیت ثبت شد.'));

                })
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول مقدار خروجی ندارد.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول صحیح نیست.'));
        }
    }
    const editFormula=(data)=>{
        if(!isValid || isValid.length == 0){
            if(props.formulaText.toString().indexOf('return') >= 0) {
                data.text=props.formulaText.replaceAll('<','@lt')
                data.companyPartyId=props.userOrganization
                let postData={};
                postData.data=data;
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));

                axios.put(SERVER_URL+"/rest/s1/rule/edit",postData,{headers:{"api_key":localStorage.getItem("api_key")}}).then(res=> {
                    props.setTableContent(prevState => prevState.filter(value => value.formulaId !== data.formulaId))
                    data["mantle.humanres.employment.FormulaDetail"]={}
                    data["mantle.humanres.employment.FormulaDetail"]["args"]=res.data?.args
                    data["mantle.humanres.employment.FormulaDetail"]["output"]=res.data?.result
                    props.setTableContent(rows => [...rows, data]);
                    resetForm();
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فرمول با موفقیت ویرایش شد.'));

                })
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول مقدار خروجی ندارد.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول صحیح نیست.'));
        }
    }
    const resetForm=()=>{
        props.setFormValues(props.defaultFormValue)
        props.setFormulaText("")
        props.setAddForm(true)
    }

    const checkFormula=()=>{
        let text = props.formulaText.split('return')
        if(text[0].trim() == ''){
            isValid = [false]
        }
        if(!isValid || isValid.length == 0){
            if(props.formulaText.toString().indexOf('return') >= 0) {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'فرمول صحیح است.'));
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول مقدار خروجی ندارد.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرمول صحیح نیست.'));

        }
    }
    const annotations = [
        {
            row: 3, // must be 0 based
            column: 4, // must be 0 based
            text: "error.message", // text to show in tooltip
            type: "error"
        }
    ];

    function onChange(newValue) {
        props.setFormulaText(newValue)
    }

    function onValidate(newValue) {
        if(newValue && newValue.length > 0){
            newValue = newValue.filter(x => x.type !== "info");
        }

        isValid = newValue
    }

    

    function onCursorChange(selection) {
        setCaretPosition(selection.getCursor())
    }
   

    return (
        <>
        <FormPro prepend={main} submitCallback={() => {
            if (props.addForm) createFormula(props.formValues)
            else editFormula(props.formValues)
        }
        }
                 formValues={props.formValues} setFormValues={props.setFormValues}
                 resetCallback={()=>resetForm()}

                 formValidation={formValidation}
                 setFormValidation={setFormValidation}
                 actionBox={
            <ActionBox>
                {props.addForm?<Button type="submit" role="primary">افزودن</Button>:
                    <Button type="submit" role="primary">ویرایش</Button>
                }
                <Button type="reset" role="secondary">لغو</Button>
                <Button role="primary" role="secondary" onClick={checkFormula}>صحت فرمول</Button>
            </ActionBox>
        }>
            <Grid container>
                <Grid item xs={6}>
                     <Paper>
            <Tabs
                indicatorColor="secondary"
                textColor="primary"
                onChange={handleChange}
                variant="scrollable"
                value={value}
                scrollButtons="auto"
            >
                <Tab label="عوامل ورودی"/>
                <Tab label="مقادیر ثابت" />
                <Tab label="مقادیر سیستمی" />
                <Tab label="توابع" />
                <Tab label="عبارتها" />
                <Tab label="پارامترها" />
                <Tab label="عوامل حکمی" />
            </Tabs>
            <TabPane value={value}  index={0} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <InputFactor  inputFactor={props.inputFactor} changeFormula={changeFormula} />
                </FuseScrollbars>
            </TabPane>
            <TabPane value={value}  index={1} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <Constant constant={props.constant} changeFormula={changeFormula}/>
                </FuseScrollbars>
            </TabPane>
            <TabPane  value={value}  index={2} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <SystemParam changeFormula={changeFormula} params={props.systemParam} />
                </FuseScrollbars>
            </TabPane>
            <TabPane value={value}  index={5} dir={theme.direction}  >
                <FuseScrollbars className={classes.tabPane} >
                <Param changeFormula={changeFormula} />
                </FuseScrollbars>
            </TabPane>
            <TabPane value={value}  index={3} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <FunctionList  changeFormula={changeFormula}/>
                </FuseScrollbars>
            </TabPane>
            <TabPane  value={value} index={4} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <Statement changeFormula={changeFormula}/>
                </FuseScrollbars>
            </TabPane>
          
            <TabPane value={value}  index={6} dir={theme.direction} >
                <FuseScrollbars className={classes.tabPane} >
                <OrderParam payrollFactor={props.payrollFactor} changeFormula={changeFormula}/>
                </FuseScrollbars>
            </TabPane>
            </Paper>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
            <Paper>
            <Tabs
                indicatorColor="secondary"
                textColor="primary"
                onChange={handleLangChange}
                variant="scrollable"
                value={props.langValue}
                scrollButtons="auto"
            >
                <Tab label="فرمول" />
            </Tabs>
            <TabPane value={props.langValue}  index={0} dir={theme.direction} >
                <AceEditor
                    placeholder="type your Formula"
                    mode="javascript"
                    theme="github"
                    name="Formula Editor"
                    onLoad={editorInstance => {
                        editorInstance.container.style.width = "";
                        editorInstance.container.style.height = "450px";
                       
                      }}
                    wrapEnabled={true}
                    onChange={onChange}
                    onValidate={onValidate}
                    fontSize={14}
                    onCursorChange={onCursorChange}
                    showGutter={true}
                    annotations={annotations}
                    highlightActiveLine={true}
                    value={props.formulaText}
                    setOptions={{
                        useWorker:true,
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}/>
            </TabPane>
            </Paper>
                </Grid>
            </Grid>
        </FormPro>

        </>
    );

}

export default FormulasForm;
