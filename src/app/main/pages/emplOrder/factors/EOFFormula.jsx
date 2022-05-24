import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import PostAddIcon from '@material-ui/icons/PostAdd';
import {useHistory} from "react-router-dom";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";

const formDefaultValues = {
    payrollForm: 'N',
    emplPayrollForm: 'N',
    score: 'N'
}

export default function EOFFormula({actionObject,userCompany}) {
    const history = useHistory();
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agreements, setAgreements] = useState([]);
    const [scoreFormulas, setScoreFormulas] = useState([]);
    const [currencyFormulas, setCurrencyFormulas] = useState([]);
    const [formValues, setFormValues] = React.useState(formDefaultValues)

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/emplOrder/agreement/type`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setAgreements(res.data.agreementTypes)
        }).catch(() => {
            setAgreements([])
        });
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/Formula?companyPartyId=${userCompany.userCompanyId}`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setScoreFormulas(res.data.result.filter(i => i.formulaTypeEnumId === "FrmlScore" && !i.thruDate))
                setCurrencyFormulas(res.data.result.filter(i => i.formulaTypeEnumId === "FrmlCurrency" && !i.thruDate))
            }).catch(err => {
                console.log('get error..', err);
            });
        }
    },[userCompany.userCompanyId])
    const renderDate = (name) => (row) => {
        let moment = require('moment-jalaali')
        const date = row[name]
        return date ? moment(date).format('jYYYY/jM/jD') : "00/00/00"
    }
    const tableCols = [
        {name: "agreementId", label: "نوع قرارداد", type: "select", options: agreements, optionIdField: "agreementId", style: {width:"150px"}},
        {name: "scoreFormulaId", label: "فرمول امتیاز", type: "select", options: scoreFormulas, optionIdField: "formulaId", optionLabelField: "title" },
        {name: "currencyFormulaId", label: "فرمول مقدار ریالی", type: "select", options: currencyFormulas, optionIdField: "formulaId", optionLabelField: "title" },
        {name: "fromDate", label: "از تاریخ", type: "render", render: renderDate("fromDate")},
        {name: "thruDate", label: "تا تاریخ", type: "render", render: renderDate("thruDate")},
        {name: "description", label: "شرح", type: "text", style: {width:"150px"}},
        {name: "statusId", label: "فعال", type: "indicator", style: {width:"80px"}},
    ]
    function handleGet(id){
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/AgreementFormula?payrollFactorId=${id}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setTableContent(res.data.result)
            setLoading(false)
        }).catch(err => {
            setTableContent([])
            setLoading(false)
            console.log('get error..', err);
        });
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayrollFactor?payrollFactorId=${id}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setFormValues(res.data.result[0])
        }).catch(err => {
            console.log('get error..', err);
        });
    }
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + `/rest/s1/fadak/entity/AgreementFormula?agreementFormulaId=${oldData.agreementFormulaId}` ,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    React.useEffect(()=>{
        if(actionObject){
            handleGet(actionObject.payrollFactorId)
        }else{
            setTableContent([])
        }
    },[actionObject]);
    return(
        <Card variant="outlined">
            <TablePro
                title="فرمول محاسبه عامل حکمی"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                fixedLayout={true}
                rowNumberWidth="40px"
                add="external"
                addForm={<TableForm actionObject={actionObject} tableContent={tableContent} agreements={agreements} scoreFormulas={scoreFormulas} currencyFormulas={currencyFormulas} score={formValues?.score==='Y'}/>}
                edit="external"
                editForm={<TableForm editing={true} actionObject={actionObject} tableContent={tableContent} agreements={agreements} scoreFormulas={scoreFormulas} currencyFormulas={currencyFormulas} score={formValues?.score==='Y'}/>}
                removeCallback={handleRemove}
                actions={[{
                    title: "تعریف فرمول جدید",
                    icon: PostAddIcon,
                    onClick: ()=> {
                        history.push(`/formula`);
                    }
                }]}
            />
        </Card>
    )
}

function TableForm({editing=false, score, tableContent, actionObject, agreements, scoreFormulas, currencyFormulas,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const dispatch = useDispatch();
    const formDefaultValues = {
        statusId: 'Y'
    }
    const formStructure = [
        {name: "agreementId", label: "نوع قرارداد", type: "select", options: agreements, optionIdField: "agreementId",
            filterOptions: options => options.filter(o=>o.statusId==='ActiveAgr'), required: true},
        {name: "scoreFormulaId", label: "فرمول امتیاز", type: "select", options: scoreFormulas, optionIdField: "formulaId", optionLabelField: "title", required: score, display: score},
        {name: "currencyFormulaId", label: "فرمول مقدار ریالی", type: "select", options: currencyFormulas, optionIdField: "formulaId", optionLabelField: "title" , required: true},
        {name: "fromDate", label: "از تاریخ", type: "date"},
        {name: "thruDate", label: "تا تاریخ", type: "date"},
        {name: "statusId", label: "فعال", type: "indicator"},
        {name: "description", label: "شرح", type: "textarea", col: 12},
    ]

    const handleAdd = ()=>{
        let data = {...formValues , payrollFactorId: actionObject.payrollFactorId }
        axios.post(SERVER_URL + "/rest/s1/fadak/entity/AgreementFormula", { data : data} , {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then((res) => {
            setFormValues(formDefaultValues)
            successCallback({...formValues, ...res.data.agreementFormulaId})
        }).catch(() => {
            failedCallback()
        });
    }
    const handleEdit = ()=>{
        axios.put(SERVER_URL + "/rest/s1/fadak/entity/AgreementFormula", { data : formValues } , {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            setFormValues(formDefaultValues)
            successCallback(formValues)
        }).catch(() => {
            failedCallback()
        });
    }
    const checkDatesAreInvalid = ()=>{
        if(formValues.fromDate && formValues.fromDate > formValues.thruDate){
            setFormValidation({thruDate: {error: true, helper: ""}, fromDate: {error: true, helper: ""}})
            return true
        }
        setFormValidation({thruDate: {error: false, helper: ""}, fromDate: {error: false, helper: ""}})
        return false
    }
    const hasOverlap = (fromDate1, thruDate1, fromDate2, thruDate2) => {
        let moment = require('moment-jalaali')
        if(typeof fromDate2 !== 'string'){
            fromDate2 = moment(fromDate2).format('YYYY-MM-DD')
            thruDate2 = moment(thruDate2).format('YYYY-MM-DD')
        }
        return !((fromDate1 && thruDate2 && fromDate1>thruDate2) || (fromDate2 && thruDate1 && fromDate2>thruDate1))
    }
    const checkDatesHaveOverlap = ()=>{
        let checkList = tableContent.filter(i=>i.agreementId===formValues.agreementId)
        console.log("formValues",formValues)
        for(let i in checkList){
            const row = checkList[i]
            console.log("row",row)
            console.log("hasOverlap",hasOverlap(formValues.fromDate,formValues.thruDate,row.fromDate,row.thruDate))
            if(formValues.agreementFormulaId!==row.agreementFormulaId && hasOverlap(formValues.fromDate,formValues.thruDate,row.fromDate,row.thruDate)) {
                setFormValidation({thruDate: {error: true, helper: ""}, fromDate: {error: true, helper: ""}})
                return true
            }
        }
        setFormValidation({thruDate: {error: false, helper: ""}, fromDate: {error: false, helper: ""}})
        return false
    }
    React.useEffect(()=>{
        if(!editing){
            setFormValues(prevState=>({
                ...prevState, statusId: 'Y'
            }))
        }
    },[])
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(checkDatesAreInvalid()){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'محدوده تاریخ به درستی تعیین نشده است!'));
                    return
                }
                if(checkDatesHaveOverlap()){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'محدوده تاریخ وارد شده با ردیف دیگری دارای همپوشانی است!'));
                    return
                }
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
                if(editing){
                    handleEdit()
                }else{
                    handleAdd()
                }
            }}
            resetCallback={()=>{
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
