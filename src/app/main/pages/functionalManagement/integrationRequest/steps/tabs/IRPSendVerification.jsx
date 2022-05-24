import React from "react";
import TablePro from "../../../../../components/TablePro";

export default function IRPSendVerification({list=[]}) {
    return (
        <TablePro
            rows={list}
            columns={[
                {
                    name    : "id00",
                    label   : "سمت سازمانی",
                    type    : "text",
                },{
                    name    : "id01",
                    label   : "نام پرسنل",
                    type    : "text",
                },{
                    name    : "id02",
                    label   : "دسترسی",
                    type    : "text",
                }
            ]}
            showTitleBar={false}
        />
    )
}
