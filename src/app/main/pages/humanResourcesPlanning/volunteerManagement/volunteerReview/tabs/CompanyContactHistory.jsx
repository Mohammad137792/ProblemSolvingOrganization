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

const CompanyContactHistory = () => {

    
    const [workHistorytableContent,setWorkHistoryTableContent]=useState([{}]);
    const [workHistoryLoading, setWorkHistoryLoadingLoading] = useState(false);

    const [neededHistorytableContent,setNeededHistorytableContent]=useState([{}]);
    const [neededHistoryLoading, setNeededHistoryLoading] = useState(false);

    const [waiting, set_waiting] = useState(false) 

    const workHistoryTableCols = [
        { titleofDocumentation: "titleofDocumentation", label:"شرکت", type: "text" },
        { name : "contentDate", label: "واحد سازمانی", type: "text" , style: {minWidth:"80px"} },
        { name : "fileObservation", label:"پست سازمانی", type: "text" , style: {minWidth:"80px"} },
        { name : "contentTypeEnumId", label: "گروه پرسنلی", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "نقش سازمانی", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "علت خروج", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "تاریخ استخدام", type: "date", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "تاریخ خروج", type: "date", style: {minWidth:"120px"} },
    ]

    const neededTableCols = [
        { titleofDocumentation: "titleofDocumentation", label:"کد نیازمندی", type: "number" },
        { name : "contentDate", label: "کد شغل", type: "number" , style: {minWidth:"80px"} },
        { name : "fileObservation", label:"عنوان شغلی", type: "text" , style: {minWidth:"80px"} },
        { name : "contentTypeEnumId", label: "متقاضی جذب", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "کارشناس جذب", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "وضعیت نیازمندی", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "وضعیت داوطلب", type: "text", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "تاریخ پیوستن", type: "date", style: {minWidth:"120px"} },
        { name : "contentTypeEnumId", label: "تاریخ ایجاد نیازمندی", type: "date", style: {minWidth:"120px"} },
    ]

    return (
        <div>
            <Card>
                <CardContent>
                    <TablePro
                        title="تاریخچه نیازمندی های شغلی متقاضی"
                        columns={neededTableCols}
                        rows={neededHistorytableContent}
                        setRows={setNeededHistorytableContent}
                        loading={neededHistoryLoading}
                        add="external"
                        addForm={<AddForm/>}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <TablePro
                        title="تاریخچه ارتباط کاری با هلدینگ"
                        columns={workHistoryTableCols}
                        rows={workHistorytableContent}
                        setRows={setWorkHistoryTableContent}
                        loading={workHistoryLoading}
                    />
                </CardContent>
            </Card>
            
        </div>
    );
};

export default CompanyContactHistory;


function AddForm ({...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading} = restProps;

    const [waiting, set_waiting] = useState(false) 

    const formStructure = [{
        name    : "trackingCodeId",
        label   : "کد نیازمندی",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "عنوان شغلی",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "متقاضی جذب نیرو",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "کارشناس جذب",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "وضعیت نیازمندی",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "تاریخ ایجاد",
        type    : "date",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نیازمندی شغلی",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 3
    }]

    const submit = () => {

    }

    const resetCallback = () => {

    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={submit}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}