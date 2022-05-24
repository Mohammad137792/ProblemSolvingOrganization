
import React from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import Rulings from './FormBuilder/Rulings';
import { Box, Card, Button } from '@material-ui/core'

const RequestCommunicated = (props) => {
    const formStructure = [
        {
            name: "insuranceNumberEnumId",
            label: "عنوان فرم ابلاغ",
            type: "select",
            options: [],

            required: true

        }, {
            name: "insuranceNumberEnumId",
            label: "  وضعیت ",
            type: "select",
            options: [],
        },
        {
            name: "insuranceNumberEnumId",
            label: "  علت  ",
            type: "select",
            options: [],

        },

        {
            name: "insuranceNumberEnumId",
            label: " تاریخ صدور ابلاغ",
            type: "date",

        },
        {
            name: "decription",
            label: "تاریخ شروع ابلاغ ",
            type: "date",   
            required: true,

        },
         {
            name: "decription",
            label: "تاریخ خاتمه  ",
            type: "date",   
        },
        {
            name: "decription",
            label: "اپلود مستندانت ",
            type: "file",
        }

    ]
  
    const [formValues, setFormValues] = React.useState({})
    const [tableContent, setTableContent] = React.useState([])

    return (
        <FusePageSimple
            header={
                <h1>
                    تعریف فرم ابلاغ
                </h1>
            }
            content={
                <>
                    <Box p={2}>
                        <Card variant="outlined">

                            <FormPro formValues={formValues} setFormValues={setFormValues}
                                append={formStructure}
                                filter="external"
                            />
                        </Card>
                        {/* <Card variant="outlined">
                           
                        </Card> */}
                        <Card variant="outlined">
                            <Rulings />
                           </Card>
                    </Box>

                </>
            } />
    )
}



export default RequestCommunicated;