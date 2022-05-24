import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import useListState from "../../../../../reducers/listState";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import ModalPro from "../../../../../components/ModalPro";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import TablePro from "../../../../../components/TablePro";
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from "@material-ui/core/Tooltip";

export default function InsurancePayment({formVariables, submitCallback, taskId , step}) {

    const [waiting, set_waiting] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fieldsInfo, setFieldsInfo] = useState({});
    const dispatch = useDispatch();
    const [personList, setPersonList] = useState([]);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const personnel = useListState("userId",[])
 
    const comments = useListState("id",[])

    const formStructure = [
        {
          name    : "trackingCode",
          label   : "شماره لیست",
          type    : "display",
      },{
          name    : "pseudoId",
          label   : "شماره کارگاه",
          type    : "display",
      },{
          name    : "contractNumber",
          label   : "ردیف پیمان",
          type    : "display",
      },{
          name    : "employerName",
          label   : "نام کارفرما",
          type    : "display",

      },{
          name    : "address",
          label   : "آدرس شرکت",
          type    : "display",
          col     : 12
      }]

    
  const tableColumns = [
    {
      name: "baseInsurancenumber",
      label: "شماره بیمه",
      type: "text",
      readOnly: true,
    },
    {
      name: "fullName",
      label: "نام و نام خانوادگی",
      type: "text",
      readOnly: true,
    },
    {
      name: "job",
      label: "شغل",
      type: "text",
    },
    {
      name: "nationalId",
      label: "کد ملی",
      type: "text",
      readOnly: true,
    },
    {
      name: "identificationNumber",
      label: "شماره شناسنامه",
      type: "text",
      disabaled: true,
    },
    {
      name: "FatherName",
      label: "نام پدر",
      type: "text",
    },
    {
      name: "PartyRelFromDate",
      label: "تاریخ شروع به کار",
      type: "text",
    },
    {
      name: "PartyRelThruDate",
      label: "تاریخ ترک کار",
      type: "text",
    },{
      name: "id8",
      label: "کارکرد",
      type: "text",
    },{
      name: "id8",
      label: "دستمزد روزانه",
      type: "text",
    },{
      name: "id8",
      label: "دستمزد ماهانه ",
      type: "text",
    },{
      name: "id8",
      label: "دستمزد و مزایا ماهانه مشمول",
      type: "text",
    },{
      name: "id8",
      label: "مشمول و غیر مشمول",
      type: "text",
    },{
      name: "id8",
      label: "حق بیمه سهم بیمه شده",
      type: "date",
    },{
      name: "id8",
      label: "ملاحظات",
      type: "text",
    }];

    const handleOpenModal = (rowData)=>{
        setDataModal(rowData)
        setOpenModal(true)
    }

    function handle_accept() {
        set_waiting("accept")
        setTimeout(()=>set_waiting(null),2000)
    }

    function handle_rerun() {
        set_waiting("rerun")
        setTimeout(()=>set_waiting(null),2000)
    }

    function submitForm(type){

        let submitData = step == "Voucher" ? {
            "VoucherCalculationStep":type
        } : 
        {
            "calculationStep":type
        }
        submitCallback(submitData)

    }
    
    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
      if(formVariables?.personnel){
          setPersonList(formVariables?.personnel)
      }
  },[formVariables])

  function getInsDisket(){
    axios.get(SERVER_URL + '/rest/s1/payroll/getPayrollFile?taxFileName='+formVariables?.taxDisketName, axiosKey).then(res => { /* todo: rest? */
    }).catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
    });
}

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/getInsuranceData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data.insuranceData)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }


    return (
        <React.Fragment>
            <CardHeader title="دیسکت بیمه"
             action={
               <>
                {formVariables?.taxDisketName && <Tooltip title="دانلود دیکست">
                  <SaveIcon fontSize="large" onClick={getInsDisket}/>
              </Tooltip>
              }
                </>
              
            }/>
            <CardContent>
                <Box p={5}>
                    <Typography variant="h5" align="center" color="textSecondary">{fieldsInfo.companyName}</Typography>
                    <Typography variant="h5" align="center" color="textSecondary">صورت دستمزد و حقوق و مزایا در ماه 02 سال 1400</Typography>
                </Box>
                <FormPro
                    formValues={fieldsInfo}
                    prepend={formStructure}
                />
                <Box my={2}>
                    <Card variant="outlined">
                        <TablePro
                            rows={personList}
                            setRows={setTableContent}
                            columns={tableColumns}
                            showTitleBar={false}
                            />
                    </Card>
                </Box>
              
            </CardContent>
            <ModalPro
                title={`پیش نمایش فیش حقوقی ${dataModal.fullName}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <Typography align="center" color="textSecondary">پیش نمایش فیش حقوقی</Typography>
                        <Typography align="center" color="textSecondary">به زودی...</Typography>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
