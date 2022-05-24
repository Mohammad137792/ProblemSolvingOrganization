import React from "react";
import TablePro from "../../../../../components/TablePro";

export default function IRPSendDetails({list=[]}) {
    return (
        <TablePro
            rows={list}
            columns={[
                {
                    name    : "id00",
                    label   : "کاربر ثبت کننده",
                    type    : "text",
                },{
                    name    : "id01",
                    label   : "سیستم کنترل کارکرد",
                    type    : "text",
                },{
                    name    : "id02",
                    label   : "تاریخ ایجاد",
                    type    : "date",
                }
            ]}
            showTitleBar={false}
            expandable={true}
            rowDetailsRenderer={row => (
                <TablePro
                    rows={row.integrated||[]}
                    columns={[
                        {
                            name    : "id01",
                            label   : "آیدی",
                            type    : "text",
                        },{
                            name    : "id02",
                            label   : "پرسنل",
                            type    : "text",
                        },{
                            name    : "id03",
                            label   : "عامل کاری",
                            type    : "text",
                        },{
                            name    : "id04",
                            label   : "تاریخ",
                            type    : "date",
                        },{
                            name    : "id05",
                            label   : "مقدار",
                            type    : "text",
                        }
                    ]}
                    showTitleBar={false}
                    lightHeader={true}
                    showRowNumber={false}
                />
            )}
        />
    )
}
