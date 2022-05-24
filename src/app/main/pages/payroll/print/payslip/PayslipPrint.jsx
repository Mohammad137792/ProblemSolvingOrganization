import React, {useEffect, useState} from "react";
import QuickBox from "../../../../components/QuickBox";
import axios from "../../../../api/axiosRest";
import PayslipPrintDefault from "./PayslipPrintDefault";
import PayslipPrintSimple from "./PayslipPrintSimple";

export default function PayslipPrint({version="PayslipPrintPreviewDefault", data={}, primaryKey}) {
    const [wholeData, setWholeData] = useState({});
    const [resData, setResData] = useState({});
    const [loading, setLoading] = useState(false);
    

    // useEffect(() => {
    //     if(true) {
    //         setLoading(true)
    //         axios.get("/s1/payroll/print/payslip/"+data.payslipId).then(res => {
    //             setResData(res.data)
    //         }).finally(() => setLoading(false));
    //     }
    // },[])

    // useEffect(() => {
    //     setWholeData({...resData, ...data})
    // },[resData])

    if (loading) return <QuickBox variant="loading"/>

    switch (version) {
        case "PayslipPrintPreviewDefault":
            return <PayslipPrintDefault data={data}/>
        case "PayslipPrintPreviewSimple":
            return <PayslipPrintSimple data={data}/>
        default:
            return <QuickBox variant="error" card title="خطا در نمایش فیش حقوقی" description="این نسخه تعریف نشده است!"/>
    }
}
