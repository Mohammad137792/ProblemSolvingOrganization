import React, { useEffect, useState } from "react";
import TablePro from "../../../../../../components/TablePro";

export default function PersonnelsData({personList}) {


  const tableColumns = [
    {
      name: "Nationality",
      label: "نوع تابعیت",
      type: "text",
      readOnly: true,
    },
    {
      name: "informationType",
      label: "نوع اطلاعات",
      type: "text",
      readOnly: true,
    },
    {
      name: "nationalId",
      label: "کد ملی/ کد فراگیر",
      type: "text",
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
      readOnly: true,
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      disabaled: true,
    },
    {
      name: "CountryGeo",
      label: "کشور",
      type: "text",
    },
    {
      name: "pseudoId",
      label: "شناسه کارمند",
      type: "text",
    },
    {
      name: "partyEducation",
      label: "مدرک تحصیلی",
      type: "text",
    },{
      name: "partyEmplPosition",
      label: "سمت",
      type: "text",
    },{
      name: "baseInsuranceTypeEnumId",
      label: "نوع بیمه",
      type: "text",
    },{
      name: "baseInsurancenumber",
      label: "شماره بیمه",
      type: "text",
    },{
      name: "postalCode",
      label: "کدپستی محل سکونت",
      type: "text",
      value: "postalList?.postalCode",
    },{
      name: "address",
      label: "نشانی محل سکونت",
      type: "text",
    },{
      name: "PartyRelFromDate",
      label: "تاریخ استخدام",
      type: "date",
    },{
      name: "id8",
      label: "نوع استخدام",
      type: "text",
    },{
      name: "id8",
      label: "محل خدمت",
      type: "text",
    },{
      name: "serviceLocationCondition",
      label: "وضعیت محل خدمت",
      type: "text",
    },{
      name: "id8",
      label: "نوع قرارداد",
      type: "text",
    },{
      name: "PartyRelThruDate",
      label: "تاریخ پایان کار",
      type: "text",
    },{
      name: "id8",
      label: "وضعیت کارمند",
      type: "text",
    },{
      name: "id8",
      label: "شماره تلفن همراه",
      type: "text",
    },{
      name: "id8",
      label: "پست الکترونیک",
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
