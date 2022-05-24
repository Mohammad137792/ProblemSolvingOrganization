import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TabPro from 'app/main/components/TabPro';
import ActionBox from "../../../../components/ActionBox";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider,Typography } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import useListState from "../../../../reducers/listState";
import TransferList from "../../../../components/TransferList";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TablePro from 'app/main/components/TablePro';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ErrorIcon from '@material-ui/icons/Error';
import Attachment from "./Attachment";
import Checking from "./checking/Checking";

import { FusePageSimple } from "@fuse";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    headerTitle: {
      display: "flex",
      alignItems: "center",
    },
  }));

export default function WelfareRequest() {
    
    const classes = useStyles();
    const [formValues, setFormValues] = React.useState();
    const [attachments, setAttachments] = useState(formValues?.attachments || []);

    const [personsContent,setPersonsContent]=useState([]);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);

    const history = useHistory();

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    
    const formStructure=[
        {
            name    : "jobRequistionId",
            label   : "درخواست دهنده",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "پست سازمانی",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "کد رهگیری",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "تاریخ درخواست",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "متقاضی خدمت",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "پست متقاضی خدمت",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "انتخاب خدمت رفاهی",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "انتخاب رویداد رفاهی",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "نحوه پرداخت هزینه",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "نوع فیش کسر",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        }
    ]

    const infoFirstFormStructure=[
        {
            name    : "jobRequistionId",
            label   : "انتخاب همراه",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "هزینه استفاده",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 2 ,
        },{
            name    : "jobRequistionId",
            label   : "مبلغ قابل پرداخت کارمند",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :2 ,
        },{
            name    : "jobRequistionId",
            label   : "مبلغ قابل پرداخت کارفرما",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 2 ,
        }
    ]

    const infoSecondFormStructure=[
        {
            name    : "jobRequistionId",
            label   : "کل مبلغ قابل پرداخت",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "از تاریخ و ساعت",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 3 ,
        },{
            name    : "jobRequistionId",
            label   : "تا تاریخ و ساعت",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :3 ,
        },{
            name    : "jobRequistionId",
            label   : "توضیحات در خواست",
            type    : "textarea",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 6 ,
        },
        {
          type: "component",
          component: (
            <Attachment
              attachments={attachments}
              setAttachments={setAttachments}
              partyContentType={formValues?.partyContentType}
            />
          ),
          col: 12,
        },
    ]




    const personsCols = [
        { name : "contentTypeEnumId", label: "نسبت", type: "text"},
        { name : "description", label:"نام و نام خانوادگی", type: "text" },
        { name : "description", label:"کد ملی", type: "text" },
        { name : "description", label:"تاریخ تولد", type: "text" },
        { name : "description", label:"وضعیت تاهل", type: "text" },
        { name : "description", label:"وضعیت اشتغال", type: "text" },
        { name : "description", label:"هزینه استفاده", type: "text" },
        { name : "description", label:"مبلغ قابل پرداخت کارمند", type: "text" },
        { name : "description", label:"مبلغ قابل پرداخت کارفرما", type: "text" },
    ]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {

    }

    const medicalDocument = () => {

    }

    const addPerson = () => {

    }

    const nextPage = () => {
        setChecking(true)
    }

    return ( 
        <FusePageSimple
        header={
            <CardHeader
              title={
                <Box className={classes.headerTitle}>
                  <Typography color="textSecondary">خدمات رفاهی</Typography>
                  <KeyboardArrowLeftIcon color="disabled" />
                  <Typography color="textSecondary">سایر خدمات رفاهی</Typography>
                  <KeyboardArrowLeftIcon color="disabled" />
                  درخواست خدمات رفاهی
                </Box>
              }
            />
          }
        content={
            <>
                <Card>
                    {checking ? 
                    <>
                        <Checking/>
                    </>
                    :
                    <CardContent>
                        <Card>
                            <CardHeader
                                title={
                                    <Box className={classes.headerTitle}>
                                    درخواست خدمات رفاهی
                                    </Box>
                                }
                            />
                            <CardContent>
                                <FormPro
                                    prepend={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader
                                title={
                                    <Box className={classes.headerTitle}>
                                    اطلاعات درخواست
                                    </Box>
                                }
                            />
                            <CardContent>
                                <FormPro
                                    prepend={infoFirstFormStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    actionBox={
                                        <ActionBox>
                                          <Button
                                            type="submit"
                                            role="primary"
                                          >
                                            افزودن
                                          </Button>
                                        </ActionBox>
                                      }
                                    submitCallback={() =>
                                       addPerson()
                                    }
                                />
                                <Card mt={2}>
                                <TablePro
                                    title="همراهان پرسنل"
                                    loading={loading}
                                    columns={personsCols}
                                    rows={personsContent}
                                    setRows={setPersonsContent}
                                />
                                </Card>
                                <Box p={2} />
                                 <FormPro
                                    prepend={infoSecondFormStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                />
                                <Box p={2} />
                                <ActionBox>
                                    <Button
                                        type="submit"
                                        role="primary"
                                        onClick={nextPage}
                                        >
                                        ثبت درخواست
                                    </Button>
                                    <Button type="reset" role="secondary" >
                                        لغو
                                    </Button>
                                </ActionBox>
                            </CardContent>
                        </Card>
                    </CardContent>}
                </Card>
            </>
        }
        />
            
    );
};