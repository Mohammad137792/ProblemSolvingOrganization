import React, {useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import IRPGeneralSettings from "./components/IRPGeneralSettings";
import Divider from "@material-ui/core/Divider";
import FormPro from "../../../../components/formControls/FormPro";
import TabPro from "../../../../components/TabPro";
import TablePro from "../../../../components/TablePro";
import IRPSendDetails from "./tabs/IRPSendDetails";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function IRPCheckingByPersonnel({values={}, onSubmit}) {
    const [waiting, set_waiting] = useState(null)

    const formStructure = [
        {
            name    : "id",
            label   : "کد پرسنلی",
            type    : "display",
        },{
            name    : "id",
            label   : "نام و نام خانوادگی",
            type    : "display",
        },{
            name    : "id",
            label   : "تقویم",
            type    : "display",
        },{
            name    : "id",
            label   : "مسئول تقویم",
            type    : "display",
        }
    ]

    const handle_submit = (action) => () => {
        set_waiting(action)
        onSubmit(action).finally(()=>{
            set_waiting(null)
        })
    }

    return (
        <React.Fragment>
            <CardHeader title={`بررسی کارکرد ${" "}`}/>
            <CardContent>
                <IRPGeneralSettings formValues={values.formValues}/>
            </CardContent>
            <Divider variant="fullWidth"/>
            <CardHeader title="مشخصات پرسنل"/>
            <CardContent>
                <FormPro
                    formValues={values.personnel||{}}
                    prepend={formStructure}
                />
            </CardContent>
            <Divider variant="fullWidth"/>
            <TabPro tabs={[
                {
                    label: "کارکرد تجمیعی",
                    panel: <TablePro
                        rows={values.integrated||[]}
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
                    />
                },{
                    label: "جزئیات کارکرد",
                    panel: <IRPSendDetails list={values.details}/>
                }
            ]}/>
            <Divider variant="fullWidth"/>
            <Box p={2}>
                <ActionBox>
                    <Button role="primary" disabled={!!waiting} onClick={handle_submit("confirmed")} endIcon={waiting==="confirmed"?<CircularProgress size={20}/>:null}>
                        تایید
                    </Button>
                    <Button role="secondary" disabled={!!waiting} onClick={handle_submit("correction")} endIcon={waiting==="correction"?<CircularProgress size={20}/>:null} >
                        اصلاح کارکرد
                    </Button>
                </ActionBox>
            </Box>
        </React.Fragment>
    )
}
