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
import useListState from "../../../../reducers/listState";
import TransferList from "../../../../components/TransferList";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TablePro from 'app/main/components/TablePro';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ErrorIcon from '@material-ui/icons/Error';


const SpecialExaminationReportsForm = () => {

    const [formValues, setFormValues] = React.useState();

    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        name    : "jobRequistionId",
        label   : "نوع معاینه",
        type    : "select",
        // options : fieldsInfo?.CreditInfo ,
        // optionIdField   : "paymentMethodId",
        // optionLabelField: "bankName",
        // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
        col     : 4 ,
    },{
        name    : "partyId",
        label   : "از تاریخ",
        type    : "date",
        col     : 4,
    },{
        name    : "partyId",
        label   : "تا تاریخ",
        type    : "date",
        col     : 4,
    }]

    const tableCols = [
        { name : "contentTypeEnumId", label: "تاریخ مراجعه", type: "date", style: {minWidth:"120px"} },
        { name : "description", label:"متخصص", type: "text" ,  style: {minWidth:"120px"}},
    ]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {

    }

    const medicalDocument = () => {

    }

    const points = () => {

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
                        />
                    </CardContent>
                    <CardContent>
                        <TablePro
                            title="لیست معاینات خاص"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            rowActions={[{
                                title: "پرونده پزشکی",
                                icon: AssignmentIndIcon,
                                onClick: (row) => {
                                    medicalDocument(row);
                                },
                            },{
                                title: "ملاحظات",
                                icon: ErrorIcon,
                                onClick: (row) => {
                                    points(row);
                                },
                            }]}
                        />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default SpecialExaminationReportsForm;
