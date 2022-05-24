import React, {useEffect, useState} from "react";
import TablePro from "../../../components/TablePro";
import Card from "@material-ui/core/Card";
import useListState from "../../../reducers/listState";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function PayrollOutputTypeSettings({parentKey, parentKeyValue, data}) {
    const primaryKey = "partySettingTypeId"
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "partySettingTypeId",
        label   : "نوع تنظیمات",
        type    : "select",
        options : data.partySettingTypes,
        optionIdField: "partySettingTypeId"
    },{
        name    : "value",
        label   : "مقدار",
        type    : "render",
        render  : row => {
            if(["OPTPayFor", "OPTTaxPaymentMethod"].indexOf(row["partySettingTypeId"])>-1) {
                const option = [...data.PayFor,...data.TaxPaymentMethod].find(opt => opt.enumId === row.value)
                return option?.description || "؟"
            }
            return row.value
        }
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/entity/outputSetting?${parentKey}=${parentKeyValue}&${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get(`/s1/payroll/outputSettingList?${parentKey}=${parentKeyValue}`).then(res => {
            dataList.set(res.data.outputSettingList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    return (
        <Card variant="outlined">
            <TablePro
                title="تنظیمات خروجی"
                columns={tableColumns}
                rows={dataList.list||[]}
                setRows={dataList.set}
                loading={dataList.list===null}
                add="external"
                addForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}}/>}
                edit="external"
                editForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}} editing={true}/>}
                removeCallback={handle_remove}
            />
        </Card>
    )
}

function TableForm({editing=false, dataList, data, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const get_type = () => {
        // if(["OPTDiskBankSerial", "OPTNumberInsurList"].indexOf(formValues["partySettingTypeId"])>-1)
        //     return "number"
        if(["OPTPayFor", "OPTTaxPaymentMethod"].indexOf(formValues["partySettingTypeId"])>-1)
            return "select"
        return "text"
    }
    const formStructure = [{
        name    : "partySettingTypeId",
        label   : "نوع تنظیمات",
        type    : "select",
        options : data.partySettingTypes,
        optionIdField: "partySettingTypeId",
        required: true,
        otherOutputs: [{name: "enumTypeId", optionIdField: "enumTypeId"},
            {name: "validRegexp", optionIdField: "validRegexp"}],
        changeCallback: () => setFormValues(prevState => ({...prevState, value: ""})),
        filterOptions: options => options.filter(opt => dataList.list.findIndex(item => item["partySettingTypeId"] === opt["partySettingTypeId"])===-1),
    },{
        name    : "value",
        label   : "مقدار",
        type    : get_type(),
        options : formValues["enumTypeId"]||[],
        required: true,
        hideSpin: true,
    }]

    const handle_add = ()=>{
        let packet = {...formValues,...parent}
        axios.put("/s1/payroll/entity/outputSetting", packet).then((res) => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback({...packet, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/payroll/entity/outputSetting", formValues).then(() => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback(formValues)
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }

    // useEffect(()=>{
    //     if(!editing){
    //         setFormValues(prevState=>({
    //             ...prevState,
    //             ...formDefaultValues
    //         }))
    //     }
    // },[])

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                set_waiting(true)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
                if(editing){
                    handle_edit()
                }else{
                    handle_add()
                }
            }}
            resetCallback={()=>{handleClose()}}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
            </ActionBox>}
        />
    )
}
