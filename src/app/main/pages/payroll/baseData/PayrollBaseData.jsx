import React, {createRef} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import TimePeriodType from "./tabs/TimePeriodType";
import TimePeriods from "./tabs/TimePeriods";
import AccountingSoftwareSettings from "./tabs/AccountingSoftwareSettings";
import {PayrollCardHeader} from "../Payroll";
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

export default function PayrollBaseData() {
    const datas = useSelector(({ fadak }) => fadak);
    const myScrollElement = createRef();

    const tabs = [
        ...checkPermis("payroll/baseData/timePeriodType", datas) && [{
            label: "نوع دوره زمانی",
            panel: <TimePeriodType scrollTop={scroll_to_top}/>
        }] || [],
        ...checkPermis("payroll/baseData/timePeriodDef", datas) && [{
            label: "دوره های زمانی",
            panel: <TimePeriods scrollTop={scroll_to_top}/>
        }] || [],
        ...checkPermis("payroll/baseData/accountingSoftware", datas) && [{
            label: "ارتباط با نرم افزار حسابداری",
            panel: <AccountingSoftwareSettings scrollTop={scroll_to_top}/>
        }] || [],
    ]

    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }

    return checkPermis("payroll/baseData", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title="اطلاعات پایه حقوق و دستمزد"/>}
            content={<TabPro tabs={tabs}/>}
        />
    )
}
