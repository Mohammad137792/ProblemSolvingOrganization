import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';

const ExForm = ({ formStructure }) => {
    const [formValues, setFormValues] = useState([])

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}

            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}

        />
    )
}

export default function WorkingFactorsForm() {
    
    const formStructure = [
        {
            name: "code",
            label: "عنوان برنامه عملیاتی",
            type: "select",
        },
        {
            name: "title",
            label: " اقدام برنامه عملیاتی ",
            type: "select",
        },
        {
            name: "porpose",
            label: "نوع برنامه فرهنگی",
            type: "select",
            // options: []
        },
        {
            name: "company",
            label: " عنوان برنامه ",
            type: "text",
        },        
        {
            name: "a",
            label: "اقدام بالاتر",
            type: "select",
        },        
        {
            name: "b",
            label: " مسئول برگزاری ",
            type: "multiselect",
        },        
        {
            name: "c",
            label: "مکان برگزاري",
            type: "text",
        },
        {
            label:  "تاریخ شروع",
            name:   "RegisteryId",
            type:   "date",
        },{
            label:  "تاریخ پایان",
            name:   "RegisteryId",
            type:   "date",
        },         
        {
            name: "wayRegistery",
            label: " ارائه دهنده",
            type: "text",
        },{
            label:  "حمل و نقل",
            name:   "Description",
            type:   "select",
        },{
            label:  "درصد سهم پرداختي پرسنل",
            name:   "Description",
            type:   "number",
        },{
            label:  "درصد سهم پرداختي خانواده پرسنل",
            name:   "Description",
            type:   "number",
        },{
            label:  "مربی / مربیان اقدام",
            name:   "Description",
            type:   "multiselect",
        },{
            label:  "بارگذاری مستندات لازم",
            name:   "Description",
            type:   "inputFile",
        },{
            label:  "شرح وظایف مسئول",
            name:   "Description",
            type:   "text",
            col: 6,
        },{
            label:  "توضیحات",
            name:   "Description",
            type:   "text",
            col: 6,

        },{
            label:  "ارائه دهنده پيشنهاد",
            name:   "Description",
            type:   "text",
        }
    ]
    const [formValues, setFormValues] = useState([])
    const handleSubmit = () => { }
    const handleReset = () => { }
    /* ##############################################         table          ################################################### */
    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)
    const handleEdit = () => { }
    const handlerRemove = () => { }
 
    /* ##############################################         table     Registration     ################################################### */
    const tableColsRegistration = [
        {
            name: "a",
            label: "عنوان پیشنهاد",
            type: "text",
        },
        {
            name: "b",
            label: " برنامه مرتبط  ",
            type: "text",
        },
        {
            name: "b",
            label: "علت ارائه پيشنهاد",
            type: "text",
        },
        {
            name: "b",
            label: "تاريخ ثبت پيشنهاد",
            type: "date",
        },{
            name: "b",
            label: "توضیح پيشنهادات",
            type: "text",
        }
    ]
    const [tableContentRegistration, setTableContentRegistration] = useState([])
    const [loadingRegistration, setLoadingRegistration] = useState(true)
    const handleEditRegistration = () => { }
    const handlerRemoveRegistration = () => { }
    return (
        <FusePageSimple
            header={
                <Box>
                    <CardHeader title={'تاييد پيشنهادات'} />
                </Box>}
            content={
                <Box p={2}>
                    <Card>

                        <CardContent>

                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                actionBox={<ActionBox>
                                    <Button type="submit" role="primary">افزودن</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>}
                                submitCallback={handleSubmit}
                                resetCallback={handleReset}
                            />

                            
                        </CardContent>
                        
                    </Card>
                    <Box m={2} />

                    <Card>

                        <CardContent>
                            <TablePro
                                title="لیست پيشنهادات"
                                columns={tableColsRegistration}
                                rows={tableContentRegistration}
                                setRows={setTableContentRegistration}
                                loading={loadingRegistration}
                                edit="callback"
                                editCallback={handleEditRegistration}
                                delete="inline"
                                removeCallback={handlerRemoveRegistration}

                              

                            />
                        </CardContent>
                    </Card>
                </Box>
            }
        />
    )
}