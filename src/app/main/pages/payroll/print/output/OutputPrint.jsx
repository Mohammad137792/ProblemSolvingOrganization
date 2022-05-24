import React, {useEffect, useState} from "react";
import QuickBox from "../../../../components/QuickBox";
import axios from "../../../../api/axiosRest";
import OTIListDisc27 from "./OTIListDisc27";
import OTTListDisc10 from "./OTTListDisc10";
import OTBSaderat from "./OTBSaderat";

export default function OutputPrint({version, data, primaryKey, printRef}) {
    const [wholeData, setWholeData] = useState({});
    const [resData, setResData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(primaryKey) {
            setLoading(true)
            axios.get("/s1/payroll/print/output/"+primaryKey).then(res => {
                setResData(res.data)
            }).finally(() => setLoading(false));
        }
    },[primaryKey])

    useEffect(() => {
        setWholeData(prevState => ({...prevState, ...(resData && {...resData}), ...(data && {...data}) }))
    },[resData, data])

    if (loading) return <QuickBox variant="loading"/>

    switch (version) {
        case "OTIListDisc27":
            return <OTIListDisc27 data={wholeData} printRef={printRef}/>
        case "OTTListDisc10":
            return <OTTListDisc10 data={wholeData} printRef={printRef}/>
        case "OTBSaderat":
            return <OTBSaderat data={wholeData} printRef={printRef}/>
        default:
            return <QuickBox variant="error" card title="خطا در نمایش خروجی" description="این نسخه تعریف نشده است!"/>
    }
}
