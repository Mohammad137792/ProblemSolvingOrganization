import React, {createRef} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import TabPro from "../../../components/TabPro";
import AuxiliaryAccount from "./tabs/AuxiliaryAccount";
import DetailedAccount from "./tabs/DetailedAccount";
import DetailedAccountGroup from "./tabs/DetailedAccountGroup";
import AccountingDocumentTemplate from "./tabs/AccountingDocumentTemplate";
import {PayrollCardHeader} from "../Payroll";
import {useSelector} from "react-redux";
import checkPermis from "../../../components/CheckPermision";

export default function PayrollAccounting() {
    const datas = useSelector(({ fadak }) => fadak);
    const myScrollElement = createRef();
    const tabs = [{
        label: "حساب معین",
        panel: <AuxiliaryAccount scrollTop={scroll_to_top}/>,
        display: checkPermis("payroll/accounting/glAccount", datas)
    },{
        label: "حساب تفصیلی",
        panel: <DetailedAccount scrollTop={scroll_to_top}/>,
        display: checkPermis("payroll/accounting/detailedAccount", datas)
    },{
        label: "گروه حساب تفصیلی",
        panel: <DetailedAccountGroup scrollTop={scroll_to_top}/>,
        display: checkPermis("payroll/accounting/groupDetailedAccount", datas)
    },{
        label: "الگوی سند حسابداری",
        panel: <AccountingDocumentTemplate scrollTop={scroll_to_top}/>,
        display: checkPermis("payroll/accounting/voucherTemplate", datas)
    }]
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }
    return checkPermis("payroll/accounting", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title="حسابداری حقوق و دستمزد"/>}
            content={<TabPro tabs={tabs}/>}
        />
    )
}
