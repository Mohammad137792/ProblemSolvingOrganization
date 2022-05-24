import FormPro from "../../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";

const AreaProcess = (props) => {

    const {facilityId} = props

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/healthAndCare/FacilityProcess?facilityId=${facilityId}`, axiosKey).then((list)=>{
            setTableContent(list.data?.facilityProcess)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const tableCols = [
        { name : "facilityProcessName", label:"نام فرآیند", type: "text" },
        { name : "priority", label: "ترتیب انجام آن", type: "number" , style: {minWidth:"80px"} },
        { name : "description", label:"توضیحات", type: "text" , style: {minWidth:"80px"} },
    ]

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/healthAndCare/FacilityProcess?facilityProcessId=${rowData?.facilityProcessId}&facilityId=${rowData?.facilityId}` , axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    return (
        <Card>
            <CardContent>
                <TablePro
                    title="لیست فرآیند های محدوده"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<AddForm facilityId={facilityId} setLoading={setLoading} tableContent={tableContent} />}
                    edit="external"
                    editForm={<AddForm editing={true} facilityId={facilityId} setLoading={setLoading} tableContent={tableContent} />}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>
    );
};

export default AreaProcess;


function AddForm ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, facilityId, tableContent} = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name    : "facilityProcessName",
        label   : "نام فرآیند",
        type    : "text",
        required : true,
        col     : 3
    },{
        name    : "priority",
        label   : "ترتیب فرآیند",
        type    : "number",
        validator: values=>{
            const ind = tableContent.findIndex(i=>i.priority == values.priority && i?.facilityProcessId !== values?.facilityProcessId) 
            return new Promise(resolve => {
                if(ind > -1){
                    resolve ({error: true, helper: "ترتیب وارد شده تکراری است ."})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : true,
        col     : 3
    },{
        name    : "fromDate",
        label   : "تاریخ شروع",
        type    : "date",
        required : true,
        col     : 3
    },{
        name    : "thruDate",
        label   : "تاریخ پایان",
        type    : "date",
        col     : 3
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12 ,
    }]

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/healthAndCare/FacilityProcess` , formValues , axiosKey).then((res)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)
            resetCallback()
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/healthAndCare/FacilityProcess` , {...formValues , facilityId : facilityId } , axiosKey).then((res)=>{
            setLoading(true)
            set_waiting(false)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
        set_waiting(false)
    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    handleSubmit()
                }
            }}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}