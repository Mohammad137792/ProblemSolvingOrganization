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

const ActivePeopleInArea = (props) => {

    const {facilityId} = props

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        { name : "fullName", label:"نام و نام خانوادگی", type: "text" },
        // { name : "facilityName", label: "مسئولیت", type: "text" , style: {minWidth:"80px"} },
        { name : "fromDate", label:"از تاریخ", type: "date" , style: {minWidth:"80px"} },
        { name : "thruDate", label: "تا تاریخ", type: "date", style: {minWidth:"120px"} },
        { name : "description", label:"توضیحات", type: "text" ,  style: {minWidth:"120px"}},
    ]

    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/companyInfo`, axiosKey).then((pos)=>{
            axios.post(`${SERVER_URL}/rest/s1/fadak/searchUsers` , {data : {}} , axiosKey).then((emp)=>{
                setFieldsInfo({...pos.data , ...emp.data})
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    useEffect(()=>{
        if(loading && fieldsInfo){
            getTableData()
        }
    },[loading,fieldsInfo])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/healthAndCare/FacilityParty?facilityId=${facilityId}`, axiosKey).then((list)=>{
            setTableContent(list.data?.facilityParties)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/healthAndCare/FacilityParty?facilityId=${rowData?.facilityId}&partyRelationshipId=${rowData?.partyRelationshipId}&fromDate=${rowData?.fromDate}` , axiosKey).then((response)=>{
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
                    title="لیست افراد مسئول در محدوده کاری"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<SkillsForm fieldsInfo={fieldsInfo} setLoading={setLoading} facilityId={facilityId} />}
                    edit="external"
                    editForm={<SkillsForm editing={true} fieldsInfo={fieldsInfo} setLoading={setLoading} facilityId={facilityId} />}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>
    );
};

export default ActivePeopleInArea;


function SkillsForm ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, facilityId} = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name    : "skillType",
        label   : "پست سازمانی",
        type    : "select",
        options : fieldsInfo?.emplPosition,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        // required : true ,
        col     : 3
    },{
        name    : "partyRelationshipId",
        label   : "نام و نام خانوادگی",
        type    : "select",
        options : fieldsInfo?.result?.filter(o => o.partyRelationshipId),
        optionLabelField :"fullName",
        optionIdField:"partyRelationshipId",
        required : true ,
        col     : 3
    },{
        name    : "fromDate",
        label   : "تاریخ شروع فعالیت",
        type    : "date",
        required : true ,
        col     : 3
    },{
        name    : "thruDate",
        label   : "تاریخ پایان فعالیت",
        type    : "date",
        col     : 3
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/healthAndCare/FacilityParty` , formValues , axiosKey).then((res)=>{
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
        axios.post(`${SERVER_URL}/rest/s1/healthAndCare/FacilityParty` , {...formValues , facilityId : facilityId} , axiosKey).then((res)=>{
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