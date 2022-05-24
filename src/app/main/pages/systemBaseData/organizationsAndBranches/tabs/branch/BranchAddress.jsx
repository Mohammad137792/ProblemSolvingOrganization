import React, {useEffect, useState} from "react";
import TablePro from "../../../../../components/TablePro";
import useListState from "../../../../../reducers/listState";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import checkPermis from "../../../../../components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function BranchAddress({parentKey, parentKeyValue}) {
    const primaryKey = "contactMechId"
    const datas = useSelector(({ fadak }) => fadak);
    const dataList = useListState(primaryKey)
    const [addressTypes, set_addressTypes] = useState([])

    const tableColumns = [{
        name    : "contactMechPurposeId",
        label   : "نوع آدرس",
        type    : "select",
        options : addressTypes,
        optionIdField: "contactMechPurposeId",
        style   : {width: "20%"},
    },{
        name    : "address",
        label   : "آدرس",
        type    : "render",
        style   : {width: "50%"},
        render  : (row) => {
            let adr = []
            if(row.district) adr.push(`محله ${row.district}`)
            if(row.street) adr.push(`خیابان ${row.street}`)
            if(row.alley) adr.push(`کوچه ${row.alley}`)
            if(row.plate) adr.push(`پلاک ${row.plate}`)
            if(row.floor) adr.push(`طبقه ${row.floor}`)
            if(row.unitNumber) adr.push(`واحد ${row.unitNumber}`)
            if(row.postalCode) adr.push(`کد پستی ${row.postalCode}`)
            return adr.join("، ")
        }
    },{
        name    : "areaCode",
        label   : "تلفن ثابت",
        type    : "render",
        render  : (row) => `${row.areaCode||''}-${row.contactNumber||''}`
    }]

    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/fadak/deleteBranchAddress?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get(`/s1/fadak/allBranchAddress?${parentKey}=${parentKeyValue}`).then(res => {
            dataList.set(res.data.allAddress)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/fadak/gettypeAddressrest?inValue=true").then(res => {
            set_addressTypes(res.data.typeAddressList)
        }).catch(() => {});
    },[])

    return (
        <TablePro
            title="لیست آدرس های شعبه"
            columns={tableColumns}
            rows={dataList.list||[]}
            setRows={dataList.set}
            loading={dataList.list===null}
            add={checkPermis("payroll/organsAndBranches/branch/adr/add", datas) && "external"}
            addForm={<TableForm addressTypes={addressTypes} parent={{[parentKey]: parentKeyValue}} />}
            edit={checkPermis("payroll/organsAndBranches/branch/adr/edit", datas) && "external"}
            editForm={<TableForm editing={true} addressTypes={addressTypes} parent={{[parentKey]: parentKeyValue}} />}
            removeCallback={checkPermis("payroll/organsAndBranches/branch/adr/delete", datas) ? handle_remove : null}
        />
    )
}

function TableForm({editing=false, addressTypes, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const formStructure = [{
        name    : "contactMechPurposeId",
        label   : "نوع آدرس",
        type    : "select",
        options : addressTypes,
        optionIdField: "contactMechPurposeId",
        required: true,
    },{
        name    : "countryGeoId",
        label   : "کشور",
        type    : "select",
        options : "Country",
        optionIdField: "geoId",
        optionLabelField: "geoName",
        required: true,
    },{
        name    : "stateProvinceGeoId",
        label   : "استان",
        type    : "select",
        options : "Province",
        optionIdField: "geoId",
        optionLabelField: "geoName",
        required: true,
    },{
        name    : "countyGeoId",
        label   : "شهرستان",
        type    : "select",
        options : "County",
        optionIdField: "geoId",
        optionLabelField: "geoName",
    },{
        name    : "district",
        label   : "محله",
        type    : "text",
    },{
        name    : "street",
        label   : "خیابان",
        type    : "text",
        required: true,
    },{
        name    : "alley",
        label   : "کوچه",
        type    : "text",
    },{
        name    : "plate",
        label   : "پلاک",
        type    : "text",
        required: true,
    },{
        name    : "floor",
        label   : "طبقه",
        type    : "number",
    },{
        name    : "unitNumber",
        label   : "واحد",
        type    : "number",
    },{
        name    : "postalCode",
        label   : "کد پستی",
        type    : "number",
        hideSpin: true,
        required: true,
    },{
        type    : "group",
        reverse : true,
        items   : [{
            name    : "areaCode",
            label   : "پیش شماره",
            type    : "number",
            style   : {width: "150px"},
            hideSpin: true,
        },{
            name    : "contactNumber",
            label   : "تلفن ثابت",
            type    : "number",
            hideSpin: true,
        }]
    }]

    const handle_add = ()=>{
        let data = {...formValues, ...parent}
        axios.post("/s1/fadak/registerBranchAddress", {address: data}).then((res) => {
            setFormValues(formDefaultValues)
            successCallback(formValues)
            set_waiting(false)
            successCallback({...data, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/fadak/updateBranchAddress", {address: formValues}).then(() => {
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
