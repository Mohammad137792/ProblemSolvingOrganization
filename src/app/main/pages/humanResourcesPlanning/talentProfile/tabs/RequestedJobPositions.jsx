import React, {useEffect, useState, createRef} from "react";
import {SERVER_URL} from 'configs';
import FormPro from "../../../../components/formControls/FormPro";
import TablePro from "../../../../components/TablePro";
import ActionBox from "../../../../components/ActionBox";
import {Button, CardContent, CardHeader, Grid,Box, Card} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";


const RequestedJobPositions = () => {

    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(true);

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

    // React.useEffect(()=>{
    //     getData()
    // },[])

    // const getData = () => {
    //     axios.get(`${SERVER_URL}/rest/s1/humanres/JobApplicant`, axiosKey).then((response)=>{
    //         console.log("response" , response.data);
    //     });
    // }

    React.useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/JobApplicant?partyId=${partyId}`, axiosKey).then((response)=>{
            console.log("responsesssssssssss" , response.data);
            setTableContent(response.data?.JobReqInfo)
            setLoading(false)
        });
    }

    const tableCols = [{
        name    : "requistionTitle",
        label   : "عنوان نیازمندی شغلی",
        type    : "text",
        style   : {minWidth : "80px"}
    },{
        name    : "companyName",
        label   : "شرکت",
        type    : "text",
        style   : {minWidth : "80px"}
    },{
        name    : "unitName",
        label   : "واحد سازمانی",
        type    : "text",
        style   : {minWidth : "80px"}
    },{
        name    : "workForceName",
        label   : "متقاضی جذب",
        type    : "text",
        style   : {minWidth : "80px"}
    },{
        name    : "recruiters",
        label   : "کارشناس جذب",
        type    : "text",
        style   : {minWidth : "80px"}
    },{
        name    : "AdFromDate",
        label   : "تاریخ آگهی شغل",
        type    : "date",
        style   : {minWidth : "80px"}
    },{
        name    : "fromDate",
        label   : "تاریخ پیوستن",
        type    : "date",
        style   : {minWidth : "80px"}
    },{
        name    : "status",
        label   : "وضعیت داوطلب",
        type    : "text",
        style   : {minWidth : "120px"}
    }]

    const handleCancel = (rowData) => {
        console.log("rowData?.jobApplicantId" , rowData?.jobApplicantId);
        axios.put(`${SERVER_URL}/rest/s1/humanres/JobApplicant`, {jobApplicantId : rowData?.jobApplicantId } , axiosKey).then((response)=>{
            setLoading(true)
        });
    }

    return (
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <TablePro
                            title="موقعیت های  شغلی درخواست داده شده"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            rowActions={[{
                                title: "انصراف",
                                icon: CloseIcon,
                                onClick: (row) => {
                                handleCancel(row);
                                },
                                display : (row) => partyId == partyIdLogin ,
                                waiting : waiting
                            }]}
                        />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default RequestedJobPositions;