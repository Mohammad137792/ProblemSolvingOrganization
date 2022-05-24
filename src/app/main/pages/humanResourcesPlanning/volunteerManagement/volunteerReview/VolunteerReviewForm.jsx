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
import CompanyContactHistory from "./tabs/CompanyContactHistory"
import RecordResultsOfVolunteerSurvey from "./tabs/RecordResultsOfVolunteerSurvey"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ListAltIcon from '@material-ui/icons/ListAlt';


const VolunteerReviewForm = (props) => {

    const [formValues, setFormValues] = React.useState();

    const dispatch = useDispatch();

    const history = useHistory();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {

    }

    const formStructure = [{
        name    : "trackingCodeId",
        label   : "کد نیازمندی شغلی",
        type    : "number",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "عنوان نیازمندی شغلی",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "تاریخ ایجاد نیازمندی",
        type    : "date",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "وضعیت نیازمندی",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "مدیر متقاضی جذب",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "پست مدیر متقاضی جذب",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "علت جذب",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "تعداد مورد نیاز",
        type    : "number",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "منبع جذب",
        type    : "text",
        col     : 3
    }]

    const applicantInformationStructure = [{
        name    : "trackingCodeId",
        label   : "نام",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نام خانوادگی",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "شماره تماس",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "آدرس ایمیل",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نوع ارتباط",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "فاز",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "مرحله فعلی",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "وضعیت مرحله",
        type    : "text",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "تاریخ پیوستن به موقعیت شغلی",
        type    : "date",
        col     : 3
    },{
        name    : "trackingCodeId",
        label   : "نحوه پیوستن",
        type    : "text",
        col     : 3
    }]

    const tabs = [{
        label: "تاریخچه ارتباط با شرکت",
        panel: <CompanyContactHistory />
    },{
        label: "ثبت نتایج بررسی های داوطلب",
        panel: <RecordResultsOfVolunteerSurvey />
    }]

    const goList = () => {
        history.push('/volunteerManagement')
    }

    const next = () => {

    }

    const previous = () => {

    }

    return ( 
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <CardHeader title="داوطلب نیازمندی شغلی"
                            action={
                                <ToggleButtonGroup size="small" >
                                    <Tooltip title="داوطلب قبلی">
                                        <ToggleButton
                                            size={"small"}
                                            onClick={previous}
                                        >
                                            <NavigateNextIcon/>
                                        </ToggleButton>
                                    </Tooltip>
                                    <Tooltip title="داوطلب بعدی">
                                        <ToggleButton
                                            size={"small"}
                                            onClick={next}
                                        >
                                            <KeyboardArrowLeftIcon/>
                                        </ToggleButton>
                                    </Tooltip>
                                    <Tooltip title="بازگشت به لیست داوطلبان">
                                        <ToggleButton
                                            size={"small"}
                                            onClick={goList}
                                        >
                                            <ListAltIcon/>
                                        </ToggleButton>
                                    </Tooltip>
                                </ToggleButtonGroup>
                            }
                        />
                        <FormPro
                            prepend={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardHeader title="اطلاعات متقاضی"/>
                        <FormPro
                            prepend={applicantInformationStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                        />
                    </CardContent>
                </Card>
                <Box mb={2}/>
                <Card>
                    <CardContent>
                        <TabPro tabs={tabs}/>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default VolunteerReviewForm;
