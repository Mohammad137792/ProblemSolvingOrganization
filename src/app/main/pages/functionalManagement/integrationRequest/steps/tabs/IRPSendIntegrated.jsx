import React from "react";
import TablePro from "../../../../../components/TablePro";

export default function IRPSendIntegrated({personnel=[]}) {
    return (
        <TablePro
            rows={personnel}
            columns={[
                {
                    name    : "fullName",
                    label   : "نام پرسنل",
                    type    : "text",
                },{
                    name    : "id01",
                    label   : "تقویم کاری",
                    type    : "text",
                },{
                    name    : "id02",
                    label   : "مسئول تقویم",
                    type    : "text",
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
                            label   : "عامل کاری",
                            type    : "text",
                        },{
                            name    : "id02",
                            label   : "نوع عامل",
                            type    : "text",
                        },{
                            name    : "id03",
                            label   : "عامل کاری مرتبط",
                            type    : "text",
                        },{
                            name    : "id04",
                            label   : "شیف کاری",
                            type    : "text",
                        },{
                            name    : "id05",
                            label   : "مقدار مجاز",
                            type    : "text",
                        },{
                            name    : "id06",
                            label   : "مقدار کل",
                            type    : "text",
                        }
                    ]}
                    showTitleBar={false}
                    lightHeader={true}
                />
            )}
        />
    )
}
