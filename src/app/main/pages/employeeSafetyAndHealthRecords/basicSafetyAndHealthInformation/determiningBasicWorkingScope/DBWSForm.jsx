import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TabPro from 'app/main/components/TabPro';
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import TablePro from 'app/main/components/TablePro';
import AreaProcess from "./tabs/AreaProcess"
import ActivePeopleInArea from "./tabs/ActivePeopleInArea"
import UserFullName from "../../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../../components/formControls/UserEmplPosition";
import UserCompany from "../../../../components/formControls/UserCompany";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';




const formDefaultValues = {
    openedDate : new Date(),
}

const DBWSForm = () => {

    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const [waiting, set_waiting] = useState(false) 

    const [formValidation, setFormValidation] = React.useState({});

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);

    const [editing,setEditing] = useState(false) 

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [facilityId, setFacilityId] = useState("") 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/healthAndCare/higherFacilities`, axiosKey).then((info)=>{
            console.log("info" , info.data);
            axios.get(SERVER_URL + "/rest/s1/fadak/getEnums?geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE&enumTypeList=FacilityType" , axiosKey).then((addressInfo)=>{
                setFieldsInfo({...info?.data , ...addressInfo.data?.geos , ...addressInfo.data?.enums})
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
        axios.get(`${SERVER_URL}/rest/s1/healthAndCare/Facility`, axiosKey).then((list)=>{
            if(list.data?.facilities.length > 0){
                let tableData = []
                list.data.facilities.map((item,index)=>{
                    let rowData = {
                        ...item,
                        statusId : item.statusId === "FASActive" ? "Y" : "N"
                    }
                    tableData.push(rowData)
                    if(index === list.data?.facilities.length-1){
                        setTableContent(tableData)
                        setLoading(false)
                    }
                })
            }else{
                setTableContent([])
                setLoading(false)
            }
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }
    console.log("tableContent" , tableContent);
    useEffect(()=>{
        if(formValues?.facilityId && formValues?.facilityId !== ""){
            axios.get(`${SERVER_URL}/rest/s1/healthAndCare/higherFacilities?facilityId=${formValues?.facilityId}`, axiosKey).then((info)=>{
                setFieldsInfo(Object.assign({},fieldsInfo, {...info.data}))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }else{
            axios.get(`${SERVER_URL}/rest/s1/healthAndCare/higherFacilities`, axiosKey).then((info)=>{
                setFieldsInfo(Object.assign({},fieldsInfo))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
    },[formValues?.facilityId])

    const formStructure=[{
        type    : "component",
        component: <UserFullName label="نام و نام خانوادگی تهیه کننده" name3="registerPartyRelationshipId" setValue={setFormValues}/>
    },{
        type    : "component",
        component: <UserEmplPosition label="پست سازمانی تهیه کننده" name="registerEmplPositionId" valueObject={formValues} valueHandler={setFormValues}
                                        getOptionLabel={opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""}/>
    },{
        type    : "component",
        component :  <UserCompany setValue={setFormValues}/> 
    },{
        name    : "openedDate",
        label   : "تاریخ ایجاد",
        type    : "date",
        readOnly : true ,
        col     : 3,
    },{
        type    : "group" ,
        items   : [{
            name    : "pseudoId",
            label   : "کد",
            type    : "number",
            required : true ,
            validator: values => {
                var ind 
                editing ? ind = tableContent.findIndex(i=>i.pseudoId===values.pseudoId && i?.facilityId !== values?.facilityId) : 
                tableContent.findIndex(i=>i.pseudoId===values.pseudoId)
                return new Promise((resolve, reject) => {
                    if(ind>-1){
                        resolve({error: true, helper: "کد وارد شده تکراری می باشد !"})
                    }
                    else{
                        resolve({error: false, helper: ""})
                    }
                })
            },
            style   : {minWidth : "30%"}
        },{
            name    : "facilityName",
            label   : "نام محدوده کاری",
            type    : "text",
            required : true ,
            style   : {minWidth : "70%"}
        }],
        col     : 3
    },{
        name    : "facilityTypeEnumId",
        label   : "نوع محدوده",
        type    : "select",
        required : true ,
        options : fieldsInfo?.FacilityType ,
        col     : 3,
    },{
        name    : "parentFacilityId",
        label   : "محدوده بالاتر",
        type    : "select",
        options : fieldsInfo?.facilities ,
        optionIdField   : "facilityId",
        optionLabelField: "facilityName",
        col     : 3,
    },{
        name    : "statusId",
        label   : "وضعیت محدوده کاری",
        type    : "indicator",
        col     : 3,
    },{
        name    : "fromDate",
        label   : "تاریخ شروع فعالیت",
        type    : "date",
        col     : 3,
    },{
        name    : "thruDate",
        label   : "تاریخ پایان فعالیت",
        type    : "date",
        col     : 3,
    },{
        name    : "description",
        label   : "شرح کلی محدوده کاری",
        type    : "text",
        col     : 6,
    },{
        type    : "component",
        component : <Address formValues={formValues} setFormValues={setFormValues} fieldsInfo={fieldsInfo}/>,
        col     : 12,
    }]

    const tableCols = [
        { name : "pseudoId", label:"کد محدوده", type: "text" },
        { name : "facilityName", label: "عنوان نام محدوده", type: "text" , style: {minWidth:"80px"} },
        { name : "facilityTypeEnumId", label:"نوع محدوده", type: "select" , options : fieldsInfo?.FacilityType , style: {minWidth:"80px"} },
        { name : "statusId", label: "وضعیت محدوده", type: "indicator", style: {minWidth:"120px"} },
        { name : "fromDate", label:"تاریخ شروع ", type: "date" ,  style: {minWidth:"120px"}},
        { name : "thruDate", label:"تاریخ پایان", type: "date" ,  style: {minWidth:"120px"}}
    ]

    const tabs = [{
        label: "افراد فعال در محدوده",
        panel: <ActivePeopleInArea facilityId={facilityId}/>
    },{
        label: "فرایند های محدوده",
        panel: <AreaProcess facilityId={facilityId}/>
    }]

    const handleCreate = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        delete formValues.openedDate
        axios.post(`${SERVER_URL}/rest/s1/healthAndCare/Facility` , {...formValues , statusId : formValues?.statusId == "Y" ? "FASActive" : "FASNotActive"} , axiosKey).then((res)=>{
            setFacilityId(res.data?.facilityId)
            formValues.facilityId = res.data?.facilityId
            formValues.openedDate = new Date()
            setFormValues(Object.assign({},formValues))
            setLoading(true)
            setEditing(true)
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const handleEdit = (rowData) => {
        setEditing(true)
        setFormValues(rowData)
        setFacilityId(rowData?.facilityId)
    }

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/healthAndCare/Facility?facilityId=${rowData?.facilityId}` , axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    const editSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        delete formValues.openedDate
        axios.put(`${SERVER_URL}/rest/s1/healthAndCare/Facility` , {...formValues , statusId : formValues?.statusId == "Y" ? "FASActive" : "FASNotActive"} , axiosKey).then((res)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)
            reset()
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const reset = () => {
        setFacilityId("")
        setEditing(false)
        setFormValues(formDefaultValues)
    }

    return ( 
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <FormPro
                            prepend={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            formDefaultValues={formDefaultValues}
                            formValidation={formValidation}
                            setFormValidation={setFormValidation}
                            submitCallback={()=> editing ? editSubmit() : handleCreate()}
                            resetCallback={reset}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary"
                                        disabled={waiting}
                                        endIcon={waiting?<CircularProgress size={20}/>:null}
                                    >{editing ? "ویرایش" : "افزودن"}</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                        />
                    </CardContent>
                    {(facilityId && facilityId !== "") ?  
                        <CardContent>
                            <TabPro tabs={tabs}/>
                        </CardContent>
                    : ""}
                    <CardContent>
                        <TablePro
                            title="لیست محدوده های کاری"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            edit="callback"
                            editCallback={handleEdit}
                            removeCallback={handleRemove}
                        />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default DBWSForm;

function Address (props) {

    const {formValues, setFormValues, fieldsInfo} = props;

    const [expanded, setExpanded] = React.useState(false);

    const formStructure = [{
        name    : "countryGeoId",
        label   : "کشور",
        type    : "select",
        options : fieldsInfo?.GEOT_COUNTRY ,
        optionIdField   : "geoId",
        optionLabelField: "geoName",
        col     : 3,
    },{
        name    : "stateProvinceGeoId",
        label   : "استان",
        type    : "select",
        options : fieldsInfo?.GEOT_PROVINCE ,
        optionIdField   : "geoId",
        optionLabelField: "geoName",
        col     : 3,
    },{
        name    : "countyGeoId",
        label   : "شهرستان",
        type    : "select",
        options : fieldsInfo?.GEOT_COUNTY ,
        optionIdField   : "geoId",
        optionLabelField: "geoName",
        col     : 3,
    },{
        name    : "street",
        label   : "خیابان",
        type    : "text",
        col     : 3,
    },{
        name    : "district",
        label   : "محله",
        type    : "text",
        col     : 3,
    },{
        name    : "alley",
        label   : "کوچه",
        type    : "text",
        col     : 3,
    },{
        type    : "group" ,
        items   : [{
            name    : "plate",
            label   : "پلاک",
            type    : "number",
            style   : {width : "50%"}
        },{
            name    : "floor",
            label   : "طبقه",
            type    : "number",
            style   : {width : "50%"}
        }],
        col     : 3
    },{
        type    : "group" ,
        items   : [{
            name    : "contactNumber",
            label   : "شماره تماس",
            type    : "number",
            style   : {width : "70%"}
        },{
            name    : "areaCode",
            label   : "پیش شماره",
            type    : "number",
            style   : {width : "30%"}
        }],
        col     : 3
    }]

    return (
        <Card>
            <CardHeader title="آدرس"
                action={
                    <Tooltip title="نمایش ادرس">
                        <ToggleButton
                            value="check"
                            selected={expanded}
                            onChange={() => setExpanded(prevState => !prevState)}
                        >
                            <FilterListRoundedIcon />
                        </ToggleButton>
                    </Tooltip>
                }
            />
            <Collapse in={expanded}>
                <FormPro
                    prepend={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
            </Collapse>
        </Card>
    )
}
