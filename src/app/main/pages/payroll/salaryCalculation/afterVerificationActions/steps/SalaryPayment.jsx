import React, {useState,useEffect} from "react";
import {Box, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import useListState from "../../../../../reducers/listState";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../../components/TablePro";


export default function SalaryPayment({formVariables}) {

    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const personnel = useListState("userId",[])
 

    console.log('personnel',formVariables)
    console.log('personnel',personnel)
    const comments = useListState("id",[])

    const formStructure = [{
        name    : "createDate",
        label   : "تاریخ پرداخت",
        type    : "display",
        options : "Date",
    },{
        name    : "producerFullName",
        label   : "شماره سریال",
        type    : "display",
    },{
        name    : "producerFullName",
        label   : "نام و نام خانوادگی دارنده حساب",
        type    : "display",
    },{
        name    : "shebaNumber",
        label   : "شماره شبا",
        type    : "display",
    },{
        name    : "totalSalary",
        label   : "تعداد ردیف ها",
        type    : "display",
    },{
        name    : "totalSalary",
        label   : "جمع ردیف ها",
        type    : "display",
    }]
    
    const tableColumns = [
        {
        name: "shebaNumber",
        label: "شماره شبا",
        type: "text",
        readOnly: true,
        },
        {
        name: "fullName",
        label: "نام و نام خانوادگی دارنده حساب",
        type: "text",
        readOnly: true,
        },
        {
        name: "FinalPayroll",
        label: "مقدار (ریال)",
        type: "text",
        readOnly: true,
        },
        {
        name: "paymentFor",
        label: "بابت",
        type: "text",
        disabaled: true,
        },
        {
        name: "paymentDescription",
        label: "شرح تراکنش",
        type: "text",
        value: formVariables?.paymentDescription
        },
        {
        name: "nationalId",
        label: "کدملی",
        type: "text",
        },
    ];

    useEffect(()=>{
        if(formVariables?.personnel){
            setTableContent(formVariables?.personnel)
            setLoading(false)
        }
        
    },[formVariables])



    return (
        <React.Fragment>
            <CardHeader title="پیش نویس بانک"/>
            <CardContent>
                <FormPro
                    formValues={formVariables}
                    prepend={formStructure}
                />
                <Box my={2}>
                    <Card variant="outlined">
                        <TablePro
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            columns={tableColumns}
                            showTitleBar={false}
                            />
                    </Card>
                </Box>
              
            </CardContent>
        </React.Fragment>
    )
}
