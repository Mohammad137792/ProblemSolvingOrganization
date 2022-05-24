import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";



const WorkingHistory = () => {

    const [workHistorytableContent,setWorkHistoryTableContent]=useState([]);
    const [workHistoryLoading, setWorkHistoryLoadingLoading] = useState(true);

    const [showMoreInfo,setShowMoreInfo] = useState(false);

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        if(workHistoryLoading){
            getTableData()
        }
    },[workHistoryLoading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/findWokrHistoryRel?partyId=${partyId}`, axiosKey).then((response)=>{
            setWorkHistoryTableContent(response.data?.workHistory)
            setWorkHistoryLoadingLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const workHistoryTableCols = [
        { name : "companyName", label:"شرکت", type: "text" },
        { name : "unitName", label: "واحد سازمانی", type: "text" , style: {minWidth:"80px"} },
        { name : "emplPosition", label:"پست سازمانی", type: "text" , style: {minWidth:"80px"} },
        { name : "roleType", label: "نقش سازمانی", type: "text", style: {minWidth:"120px"} },
        { name : "agreementThruDate", label: "تاریخ پایان قرارداد", type: "date", style: {minWidth:"120px"} },
        { name : "fromDate", label: "تاریخ استخدام", type: "date", style: {minWidth:"120px"} },
        { name : "thruDate", label: "تاریخ خروج", type: "date", style: {minWidth:"120px"} },
    ]

    return (
        <div>
            {showMoreInfo ? 
                <div>
                    <Card>
                        <CardContent>
                            <InformationForm/>
                        </CardContent>
                    </Card>
                    <Box mb={2}/>
                </div>
            :""}
            <Card>
                <CardContent>
                    <TablePro
                        title="تاریخچه ارتباط کاری با سازمان"
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

export default WorkingHistory;


function InformationForm ({...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading} = restProps;

    const [waiting, set_waiting] = useState(false) 

    const formStructure = [{
        name    : "trackingCodeId",
        label   : "تاریخ خروج",
        type    : "date",
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "تاریخ اطلاع خروج به فرد",
        type    : "date",
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "دلیل خروج",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "تمایل به استخدام مجدد",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "خروج ضررآمیز",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "تعیین جزئیات بیشتر دلیل خروج",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 4
    },{
        name    : "trackingCodeId",
        label   : "توضیحات",
        type    : "textarea",
        rows    : 23 ,
        col     : 6
    },{
        type    : "component",
        component : <Attachment />,
        col     : 6
    },{
        type    : "component",
        component : <CardHeader title="نتایج مصاحبه خروج" />,
        col     : 12
    },{
        name    : "trackingCodeId",
        label   : "انگیزه های خروج",
        type    : "select",
        // options : fieldInfo.contentTypeEnumId,
        // optionLabelField :"description",
        // optionIdField:"enumId",
        // required : true ,
        col     : 4
    },{
        type    : "component",
        component : <div/>,
        col     : 8
    },{
        name    : "trackingCodeId",
        label   : "توضیحات مصاحبه خروج",
        type    : "textarea",
        rows    : 23 ,
        col     : 6
    },{
        type    : "component",
        component : <QuestionsAndAnswers/>,
        col     : 6
    }]

    const closeHandler = () => {

    }

    return(
        <div>
            <CardHeader title="اطلاعات خروج" />
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                submitCallback={closeHandler}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary">بستن</Button>
                </ActionBox>}
            />
        </div>
    )
}

const Attachment = (props) => {

    const datas = useSelector(({ fadak }) => fadak);

    const [tableContent, setTableContent] = React.useState([]);
    const [loading,setLoading]=useState(true)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "observeFile", label: "دانلود فایل" , style: {width:"40%"}}
    ]

    React.useEffect(()=>{
        if (loading){
            getData()
        }
    },[loading])

    const getData = () => {
        // if(contentsName.length > 0){
        //     let tableDataArray = []
        //     contentsName.map((item,index)=>{
        //         if(!confirmation){
        //             let data={
        //                     observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item}
        //                     target="_blank" >  <Image />  </Button> ,
        //                 }
        //             tableDataArray.push(data)
        //         }
        //         if(confirmation){
        //             let data={
        //                     observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item?.contentLocation}
        //                     target="_blank" >  <Image />  </Button> ,
        //                     requistionContentId : item?.requistionContentId
        //                 }
        //             tableDataArray.push(data)
        //         }
        //         if (index== contentsName.length-1){
        //             setTableContent(tableDataArray)
        //             setLoading(false)
        //         }
        //     })
        // }
        // else {
        //     setTableContent([])
        //     setLoading(false)
        // }
    }

    return (
        <TablePro
            title="پیوست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            loading={loading}
            fixedLayout
        />
    )
};

function QuestionsAndAnswers () {

    const [tableContent, setTableContent] = React.useState([]);
    const [loading,setLoading]=useState(true)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "observeFile", label: "سوال" , type : "text" , style: {width:"40%"}},
        {name: "observeFile", label: "پاسخ" , type : "text" , style: {width:"40%"}}
    ]

    return (
        <TablePro
            title="ثبت جواب پرسشنامه مصاحبه خروج"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            loading={loading}
            fixedLayout
        />
    )
}