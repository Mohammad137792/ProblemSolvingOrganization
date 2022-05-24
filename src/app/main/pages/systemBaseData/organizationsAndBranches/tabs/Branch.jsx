import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader, Divider} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import TabPro from "../../../../components/TabPro";
import BranchAddress from "./branch/BranchAddress";
import BranchPhone from "./branch/BranchPhone";
import checkPermis from "../../../../components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";

const formDefaultValues = {}
const primaryKey = "partyId"
const defaultAction = {type: "add", payload: ""}

export default function Branch({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [organizations, set_organizations] = useState([])
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)
    const formStructure = [{
        name    : "pseudoId",
        label   : "کد شعبه",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve, reject) => {
            if( /[^a-z0-9]/i.test(values.pseudoId) ) {
                resolve({error: true, helper: "کد شعبه فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            axios.get(`/s1/fadak/isDuplicateBranch?pseudoId=${values.pseudoId}&ownerPartyId=${values.ownerPartyId}`).then(res => {
                const targetPartyId = res.data.partyId
                if(targetPartyId.length>0 && targetPartyId!==values.partyId){
                    resolve({error: true, helper: "این کد قبلا مورد استفاده قرار گرفته است."})
                }
                resolve({error: false, helper: ""})
            }).catch(() => {
                reject({error: true, helper: ""})
            })
        })
    },{
        name    : "organizationName",
        label   : "عنوان شعبه",
        type    : "text",
        required: true
    },{
        name    : "ownerPartyId",
        label   : "سازمان",
        type    : "select",
        options : organizations,
        optionIdField : "partyId",
        optionLabelField : "organizationName",
        required: true
    }]
    const tableColumns = [{
        name    : "pseudoId",
        label   : "کد شعبه",
        type    : "text",
        style   : {width: "20%"}
    },{
        name    : "organizationName",
        label   : "عنوان شعبه",
        type    : "text",
        style   : {width: "40%"}
    },{
        name    : "ownerPartyId",
        label   : "سازمان",
        type    : "select",
        options : organizations,
        optionIdField : "partyId",
        optionLabelField : "organizationName",
    }]

    function get_dataList() {
        axios.get("/s1/fadak/branchList").then(res => {
            dataList.set(res.data.branches)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/fadak/registerBranch", {newBranch: formValues}).then(res=>{
            const newBranch = {
                ...formValues,
                ...res.data
            }
            dataList.add(newBranch)
            set_action({type: "edit", payload: newBranch[primaryKey]})
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "شعبه جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/fadak/updateBranch", {editedBranch: formValues}).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش شعبه با موفقیت انجام شد."))
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
            axios.delete(`/s1/fadak/deleteBranch?${primaryKey}=${row[primaryKey]}`).then( (res) => {
                if(res.data.status === true)
                    resolve()
                else if(res.data.status === "parentPartyRelationship")
                    reject("این شعبه دارای حوزه مالیاتی یا حوزه بیمه است و حذف آن ممکن نیست!")
                else
                    reject()
            }).catch(()=>{
                reject()
            });
        })
    }

    useEffect(()=>{
        get_dataList()
        axios.get("/s1/fadak/organList").then(res => {
            set_organizations(res.data.orgnizations)
        }).catch(() => {});
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    const tabs = [
        ...checkPermis("payroll/organsAndBranches/branch/adr", datas) && [{
            label   : "آدرس",
            panel   : <BranchAddress parentKey={primaryKey} parentKeyValue={action.payload} />,
        }] || [],
        ...checkPermis("payroll/organsAndBranches/branch/tel", datas) && [{
            label   : "شماره تماس",
            panel   : <BranchPhone parentKey={primaryKey} parentKeyValue={action.payload} />,
        }] || []
    ]

    return (
        <Box p={2}>
            {(checkPermis("payroll/organsAndBranches/branch/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف شعبه"/>
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
                            {(action.type==="edit" && (checkPermis("payroll/organsAndBranches/branch/adr", datas) || checkPermis("payroll/organsAndBranches/branch/tel", datas))) &&
                            <React.Fragment>
                                <Box my={2}>
                                    <Divider/>
                                </Box>
                                <Card variant="outlined">
                                    <TabPro tabs={tabs}/>
                                </Card>
                            </React.Fragment>
                            }
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                </React.Fragment>
            )}
            <Card>
                <TablePro
                    title="لیست شعب"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/organsAndBranches/branch/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/organsAndBranches/branch/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
