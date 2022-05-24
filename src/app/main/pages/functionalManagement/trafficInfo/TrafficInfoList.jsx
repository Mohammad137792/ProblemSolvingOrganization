import React from "react";
import Card from "@material-ui/core/Card";
import TrafficInfoTable from "./TrafficInfoTable";
import EditIcon from "@material-ui/icons/Edit";
import checkPermis from "../../../components/CheckPermision";
import {useSelector} from "react-redux";

export default function TrafficInfoList({dataList, setEditObject, data}) {
    const datas = useSelector(({ fadak }) => fadak);
    const mainColumns = [
        {
        name    : "username",
        label   : "کاربر وارد کننده اطلاعات",
        type    : "text",
    },{
        name    : "attendanceDeviceId",
        label   : "سیستم کنترل کارکرد",
        type    : "select",
        options : data.devices,
        optionIdField: "attendanceDeviceId",
        optionLabelField: "title",
    },{
        name    : "createDate",
        label   : "تاریخ ایجاد",
        type    : "date",
    }]

    const innerColumns = [
        {
        name    : "timeSheetDeviceId",
        label   : "آیدی کارکرد",
        type    : "text",
    },{
        name    : "cardId",
        label   : "پرسنل",
        type    : "render",
        render  : row => `${row.cardNumber} ─ ${row.fullName}`
    },{
        name    : "mainWorkedFactorId",
        label   : "عامل کاری",
        type    : "select",
        options : data.factors,
        optionIdField: "workedFactorTypeId",
        optionLabelField: "mainWorkedFactorDes",
    },{
        name    : "date",
        label   : "تاریخ",
        type    : "date",
    },{
        name    : "amount",
        label   : "مقدار",
        type    : "number",
    },{
        name    : "timeSheetStatusId",
        label   : "وضعیت",
        type    : "select",
        options : data.statuses,
        optionIdField: "statusId"
    }]

    return (
        <Card>
            <TrafficInfoTable
                title="لیست اطلاعات تردد"
                columns={mainColumns}
                innerColumns={innerColumns}
                rows={dataList.list||[]}
                loading={dataList.list === null}
                rowActions={[{
                    title   : "ویرایش",
                    icon    : EditIcon,
                    onClick : setEditObject,
                    display : () => checkPermis("functionalManagement/trafficInfo/edit", datas)
                }]}
            />
        </Card>
    )
}
