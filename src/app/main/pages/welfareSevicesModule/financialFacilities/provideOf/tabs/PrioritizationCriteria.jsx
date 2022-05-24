import React, { useState } from 'react'
import TablePro from "app/main/components/TablePro";
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import { Button } from '@material-ui/core';
export default function PrioritizationCriteria() {
    const [tableContent, setTableContent] = useState([])
    const tablecls = [
        {
            name: "number3",
            label: "معیار",
            type: "select",
            options: "Test1",
            required: true,

        },
        {
            name: "text3",
            label: "واحد",
            type: "select",
            options: "Test1",
            required: true,

        },
        {
            name: "text4",
            label: "امتیاز",
            type: "number",
            required: true,
        },
        {
            name: "text4",
            label: "سقف امتیاز",
            type: "number",

        },
    ]
    return (
        <>
            <TablePro
                title=" معیار های اولویت بندی "
                columns={tablecls}
                rows={tableContent}
                setRows={setTableContent}
                add="external"
                addForm={<AddEx formStructure={tablecls} />}
            />

        </>
    )
}

function AddEx({ editing = false, formStructure, ...restProps }) {
    const { formValues, setFormValues, oldData, successCallback, failedCallback, handleClose } = restProps;
    return (
        <FormPro
            append={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary" >ثبت </Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />
    )
}