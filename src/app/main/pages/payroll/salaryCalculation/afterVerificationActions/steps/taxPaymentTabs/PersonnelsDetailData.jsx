import React, { useEffect, useState } from "react";
import TablePro from "../../../../../../components/TablePro";
import { SERVER_URL } from "configs";
import axios from "../../../../../../api/axiosRest";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import { useSelector, useDispatch } from "react-redux";

export default function PersonnelsDetailData({personList}) {

  const tableColumns = [
    {
      name: "nationalId",
      label: "کد ملی / کد فراگیر",
      type: "text",
      readOnly: true,
    },
    {
      name: "paymentType",
      label: "نوع پرداخت",
      type: "text",
      readOnly: true,
    },
    {
      name: "isDeduct",
      label: "تعداد ماه های کارکرد واقعی در سال جاری",
      type: "text",
    },
    {
      name: "calcTypeDescription",
      label: "آیا این ماه آخرین ماه فعالیت کاری حقوق بگیر می باشد؟",
      type: "text",
      readOnly: true,
    },
    {
      name: "currencyTypeId",
      label: "نوع ارز",
      type: "select",
      disabaled: true,
      options: [{description:"Rial",enumId:85}]    },
    {
      name: "currencyValue",
      label: "نوع تسعیر ارز",
      type: "text",
    },
    {
      name: "PartyRelFromDate",
      label: "تاریخ شروع به کار",
      type: "date",
    },
    {
      name: "PartyRelThruDate",
      label: "تاریخ پایان کار",
      type: "date",
    },{
      name: "employmentCondition",
      label: "وضعیت کارمند",
      type: "text",
    },{
      name: "serviceLocationCondition",
      label: "وضعیت محل خدمت",
      type: "text",
    },{
      name: "FinalPayroll",
      label: "ناخالص حقوق و دستمزد مستمر نقدی ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "پرداختهای مستمر معوق که مالیاتی برای آنها محاسبه نشده است- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "مسکن",
      type: "text",
    },{
      name: "id8",
      label: "مبلغ کسر شده از حقوق کارمند بابت مسکن ماه جاری - ریالی",
      type: "date",
    },{
      name: "id8",
      label: "وسیله نقلیه",
      type: "text",
    },{
      name: "id8",
      label: "مبلغ کسر شده از حقوق کارمند بابت وسیله نقلیه ماه جاری - ریالی",
      type: "text",
    },{
      name: "id8",
      label: "پرداخت مزایای مستمر غیر نقدی ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "هزینه های درمانی موضوع ماده 7۳0 ق.م.م",
      type: "text",
    },{
      name: "id8",
      label: "حق بیمه پرداختی موضوع ماده 7۳0 ق.م.م.",
      type: "text",
    },{
      name: "id8",
      label: "تسهیالت اعتباری مسکن از بانکها (موضوع بند الف ماده ۱۳0 قانون برنامه سوم)",
      type: "text",
    },{
      name: "id8",
      label: "سایر معافیتها",
      type: "text",
    },{
      name: "id8",
      label: "ناخالص اضافه کاری ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "سایر پرداختهای غیر مستمر نقدی ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "پاداشهای موردی ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "پرداختهای غیر مستمر نقدی معوقه ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "کسر میشود: معافیتهای غیر مستمر نقدی (شامل بند 6 ماده 0۱)",
      type: "text",
    },{
      name: "id8",
      label: "پرداخت مزایای غیر مستمر غیر نقدی ماه جاری- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "عیدی و مزایای پایان سال- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "بازخرید مرخصی و بازخرید سنوات- ریالی",
      type: "text",
    },{
      name: "id8",
      label: "کسر میشود: معافیت (فقط برای بند 0 ماده 0۱)",
      type: "text",
    },{
      name: "id8",
      label: "معافیت مربوط به مناطق آزاد تجاری",
      type: "text",
    },{
      name: "id8",
      label: "معافیت موضوع قانون اجتناب از اخذ مالیات مضاعف",
      type: "text",
    },{
      name: "id8",
      label: "جمع خالص مالیات متعلّقه ماه جاری",
      type: "text",
    },
  ];

  return (
    <TablePro
      rows={personList}
      columns={tableColumns}
      showTitleBar={false}
    />
  );
}
