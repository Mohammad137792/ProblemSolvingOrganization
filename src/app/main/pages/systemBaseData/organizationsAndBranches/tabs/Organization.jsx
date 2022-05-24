import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const formDefaultValues = {}
const primaryKey = "partyId"
const defaultAction = {type: "add", payload: ""}

export default function Organization({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [organTypes, set_organTypes] = useState([]);
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)

    const formStructure = [{
        name    : "pseudoId",
        label   : "کد سازمان",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve, reject) => {
            if( /[^a-z0-9]/i.test(values.pseudoId) ) {
                resolve({error: true, helper: "کد سازمان فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            axios.get("/s1/fadak/isDuplicateOrgan?pseudoId="+values.pseudoId).then(res => {
                const targetPartyId = res.data.partyId
                if(targetPartyId.length>0 && targetPartyId!==values.partyId){
                    resolve({error: true, helper: "این کد قبلا برای سازمان دیگر مورد استفاده قرار گرفته است."})
                }
                resolve({error: false, helper: ""})
            }).catch(() => {
                reject({error: true, helper: ""})
            })
        })
    },{
        name    : "organizationName",
        label   : "نام سازمان",
        type    : "text",
        required: true
    },{
        name    : "roleTypeId",
        label   : "نوع سازمان",
        type    : "select",
        options : organTypes,
        optionIdField : "roleTypeId",
        required: true
    }]
    const tableColumns = [{
        name    : "pseudoId",
        label   : "کد سازمان",
        type    : "text",
        style   : {width: "20%"}
    },{
        name    : "organizationName",
        label   : "نام سازمان",
        type    : "text",
        style   : {width: "40%"}
    },{
        name    : "roleTypeId",
        label   : "نوع سازمان",
        type    : "select",
        options : organTypes,
        optionIdField : "roleTypeId"
    }]

    function get_dataList() {
        axios.get("/s1/fadak/organList").then(res => {
            dataList.set(res.data.orgnizations)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/fadak/registerOrgan", {newOrg: formValues}).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "سازمان جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/fadak/updateOrgan", {editedOrg: formValues}).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش سازمان با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(action.type==="add") {
            create_object()
        } else if(action.type==="edit") {
            update_object()
        }
    }
    function handle_cancel() {
        set_action({type: "add", payload: ""})
    }
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKey]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/fadak/deleteOrgan?${primaryKey}=${row[primaryKey]}`).then( (res) => {
                if(res.data.status === true)
                    resolve()
                else if(res.data.status === "branchOwner")
                    reject("این سازمان دارای شعبه است و حذف آن ممکن نیست!")
                else
                    reject()
            }).catch(()=>{
                reject()
            });
        })
    }

    useEffect(()=>{
        get_dataList()
        axios.get("/s1/fadak/organTypes").then(res => {
            set_organTypes(res.data.orgnizationType)
        }).catch(() => {});
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    return (
        <Box p={2}>
            {(checkPermis("payroll/organsAndBranches/organ/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف سازمان"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                                     </ActionBox>}
                                     submitCallback={handle_submit} resetCallback={handle_cancel}
                            />
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                </React.Fragment>
            )}
            <Card>
                <TablePro
                    title="لیست سازمان ها"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/organsAndBranches/organ/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/organsAndBranches/organ/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
