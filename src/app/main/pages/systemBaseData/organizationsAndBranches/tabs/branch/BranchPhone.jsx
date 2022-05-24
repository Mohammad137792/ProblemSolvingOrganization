import React, {useEffect, useState} from "react";
import TablePro from "../../../../../components/TablePro";
import useListState from "../../../../../reducers/listState";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../../components/CheckPermision";

export default function BranchPhone({parentKey, parentKeyValue}) {
    const primaryKey = "contactMechId"
    const datas = useSelector(({ fadak }) => fadak);
    const dataList = useListState(primaryKey)
    const [telTypes, set_telTypes] = useState([])
    const tableColumns = [{
        name    : "contactMechPurposeId",
        label   : "نوع شماره تماس",
        type    : "select",
        options : telTypes,
        optionIdField : "contactMechPurposeId",
        // style   : {width: "20%"},
    },{
        name    : "contactNumber",
        label   : "شماره تماس",
        type    : "render",
        render  : (row) => row.areaCode ? `${row.areaCode}-${row.contactNumber}` : row.contactNumber
    }]

    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/fadak/deleteBranchTel?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get(`/s1/fadak/allBranchTel?${parentKey}=${parentKeyValue}`).then(res => {
            dataList.set(res.data.allTel)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/fadak/gettelecomenumber").then(res => {
            set_telTypes(res.data.telecomcontactList)
        }).catch(() => {});
    },[])

    return (
        <TablePro
            title="لیست شماره های تماس شعبه"
            columns={tableColumns}
            rows={dataList.list||[]}
            setRows={dataList.set}
            loading={dataList.list===null}
            add={checkPermis("payroll/organsAndBranches/branch/tel/add", datas) && "external"}
            addForm={<TableForm telTypes={telTypes} parent={{[parentKey]: parentKeyValue}} />}
            edit={checkPermis("payroll/organsAndBranches/branch/tel/edit", datas) && "external"}
            editForm={<TableForm editing={true} telTypes={telTypes} parent={{[parentKey]: parentKeyValue}} />}
            removeCallback={checkPermis("payroll/organsAndBranches/branch/tel/delete", datas) ? handle_remove : null}
        />
    )
}

function TableForm({editing=false, telTypes, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const formStructure = [{
        name    : "contactMechPurposeId",
        label   : "نوع شماره تماس",
        type    : "select",
        options : telTypes,
        optionIdField : "contactMechPurposeId",
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
            label   : "شماره تماس",
            type    : "number",
            hideSpin: true,
            required: true,
        }]
    }]

    const handle_add = ()=>{
        let data = {...formValues, ...parent}
        axios.post("/s1/fadak/registerBranchTel", {tel: data}).then((res) => {
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
        axios.put("/s1/fadak/updateBranchTel", {tel: formValues}).then(() => {
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
