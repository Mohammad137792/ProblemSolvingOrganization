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
            label   : "?????????????? ??????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ??????????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???? ????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????? ??????????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ???????????? ????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ???????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ???????????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????? ???????????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ?????? ??????",
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
            label   : "???????????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????? ??????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 2 ,
        },{
            name    : "jobRequistionId",
            label   : "???????? ???????? ???????????? ????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :2 ,
        },{
            name    : "jobRequistionId",
            label   : "???????? ???????? ???????????? ??????????????",
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
            label   : "???? ???????? ???????? ????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???? ?????????? ?? ????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 3 ,
        },{
            name    : "jobRequistionId",
            label   : "???? ?????????? ?? ????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :3 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????????? ???? ??????????",
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
        { name : "contentTypeEnumId", label: "????????", type: "text"},
        { name : "description", label:"?????? ?? ?????? ????????????????", type: "text" },
        { name : "description", label:"???? ??????", type: "text" },
        { name : "description", label:"?????????? ????????", type: "text" },
        { name : "description", label:"?????????? ????????", type: "text" },
        { name : "description", label:"?????????? ????????????", type: "text" },
        { name : "description", label:"?????????? ??????????????", type: "text" },
        { name : "description", label:"???????? ???????? ???????????? ????????????", type: "text" },
        { name : "description", label:"???????? ???????? ???????????? ??????????????", type: "text" },
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
                  <Typography color="textSecondary">?????????? ??????????</Typography>
                  <KeyboardArrowLeftIcon color="disabled" />
                  <Typography color="textSecondary">???????? ?????????? ??????????</Typography>
                  <KeyboardArrowLeftIcon color="disabled" />
                  ?????????????? ?????????? ??????????
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
                                    ?????????????? ?????????? ??????????
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
                                    ?????????????? ??????????????
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
                                            ????????????
                                          </Button>
                                        </ActionBox>
                                      }
                                    submitCallback={() =>
                                       addPerson()
                                    }
                                />
                                <Card mt={2}>
                                <TablePro
                                    title="?????????????? ??????????"
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
                                        ?????? ??????????????
                                    </Button>
                                    <Button type="reset" role="secondary" >
                                        ??????
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