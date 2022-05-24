import React, {createRef} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import Branch from "./tabs/Branch";
import Organization from "./tabs/Organization";
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

export default function OrgsAndBranches() {
    const datas = useSelector(({ fadak }) => fadak);
    const myScrollElement = createRef();

    const tabs = [
        ...checkPermis("payroll/organsAndBranches/organ", datas) && [{
            label: "سازمان ها",
            panel: <Organization scrollTop={scroll_to_top}/>
        }] || [],
        ...checkPermis("payroll/organsAndBranches/branch", datas) && [{
            label: "شعب و نمایندگی ها",
            panel: <Branch scrollTop={scroll_to_top}/>
        }] || [],
    ]

    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }

    return checkPermis("payroll/organsAndBranches", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<CardHeader title="سازمان ها و شعب"/>}
            content={<TabPro tabs={tabs}/>}
        />
    )
}
