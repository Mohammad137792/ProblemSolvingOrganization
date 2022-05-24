import React, {createRef, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import TablePro from "../../../components/TablePro";

import { CardContent, Box, Button, Card } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import useListState from "../../../reducers/listState";




export default function PayrollAccounting() {

    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey);
    const parentDetAccounts = dataList.list || [];
    const defaultAction = {type: "add", payload: ""};
    const primaryKey = "detailedAccountId"
    const [formValues, setFormValues] = useState([])
    const handleSubmit = () => { }
    const handleReset = () => { }
    const myScrollElement = createRef();
    function handle_edit(row) {
        // set_action({type: "edit", payload: row[primaryKey]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            // axios.delete(`/s1/fadak/deleteNotification?${primaryKey}=${row[primaryKey]}`).then( () => {
            resolve()
            // }).catch(()=>{
            //     reject()
            // });
        })
    }

    const registrationFormTop = [
        {
            name: "subject",
            label: "ثبت کننده اطلاعات",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "پست سازمانی",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "کد رهگیری",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ ثبت درخواست",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "شرکت کننده",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "نوع برنامه",
            type    : "multiselect",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "عنوان برنامه",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مکان برگزاري",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مسئول برگزاری",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ شروع",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ پایان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ شروع ثبت نام",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ پایان ثبت نام",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "ارائه دهنده",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "حمل و نقل",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "توضیحات",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            col     : 8
        },
    ]

    const registrationFormDown = [
        {
            name: "subject",
            label: "نحوه ثبت نام",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "همراهان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "مجموع پرداختی سازمان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "مجموع پرداختی پرسنل",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "نحوه پرداخت هزينه",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "نوع فیش کسر از حقوق",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },
    ]

    const registrationPerformance = [
        {
            name: "subject",
            label: "انتخاب زیربرنامه",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مسئول برگزاری",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "ارائه دهنده",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مکان برگزاری",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ شروع",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "تاریخ پایان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "توضیحات زیربرنامه",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "شرکت کنندگان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مجموع پرداختی سازمان",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "مجموع پرداختی پرسنل",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },
    ]


    const ducumentUploadForm = [
        {
            name: "subject",
            label: "نوع مستندات",
            type    : "select",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "بارگذاری فایل",
            type    : "inputFile",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },        {
            name: "subject",
            label: "توضيحات لازم",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },
    ]

    const suggForm = [
        {
            name: "subject",
            label: "عنوان پیشنهاد",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "برنامه مرتبط",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "علت ارائه پیشنهاد",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "تاریخ ثبت پیشنهاد",
            type    : "display",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "بارگذاری فایل پیوست",
            type    : "inputFile",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },{
            name: "subject",
            label: "توضیحات پیشنهاد",
            type    : "textarea",
            // options : "",
            // optionIdField: "",
            // optionLabelField: "",
            // col     : 8
        },
    ]










    const tableColumns = [{
        name    : "accountCode",
        label   : "نوع زیربرنامه",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "عنوان زیربرنامه",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "برنامه بالاتر",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "مسئول برگزاري",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "مربیان",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "مکان برگزاري",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "ارائه دهنده",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "تاریخ شروع",
        type    : "date",
    },{
        name    : "accountCode",
        label   : "تاریخ پایان",
        type    : "date",
    },{
        name    : "accountCode",
        label   : "حمل و نقل",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "بودجه",
        type    : "number",
    },{
        name    : "accountCode",
        label   : "سهم پرداختی پرسنل",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "توضیحات",
        type    : "text",
    }];

   

    
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }
    return (
        <FusePageSimple
            ref={myScrollElement}
            header={< > </>}
            content={
                <>

                <Box p={2}>
                
                    <Card>

                        <CardContent>
                        <CardHeader title="فرم ثبت نام"/>
                            <FormPro
                              prepend={registrationFormTop}
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
                </Box>
                
                <Box m={2}>
                            <Card>
                            <CardContent>
                            <FormPro
                              prepend={registrationFormDown}
                              formValues={formValues}
                              setFormValues={setFormValues}

                            />
                        </CardContent>
                    </Card>
                    
                    <Box m={2} />
                    
                    <Card>
                        <CardContent>
                            <CardHeader title="ثبت نام در زیر برنامه"/>
                        <FormPro
                              prepend={registrationPerformance}
                              formValues={formValues}
                              setFormValues={setFormValues}
                              actionBox={<ActionBox>
                                  <Button type="submit" role="primary">افزودن</Button>
                                  <Button type="reset" role="secondary">لغو</Button>
                              </ActionBox>}
                              submitCallback={handleSubmit}
                              resetCallback={handleReset}
                            />

                    <TablePro
                        columns={tableColumns}
                        rows={dataList.list||[]}
                        setRows={dataList.set}
                        loading={dataList.list===null}
                        edit="callback"
                        editCallback={handle_edit}
                        removeCallback={handle_remove}
                    />
                        </CardContent>
                    </Card>
             
                <Box m={2} />
                    
                    <Card>
                        <CardContent>
                            <CardHeader title="بارگذاری مدارک"/>
                        <FormPro
                              prepend={ducumentUploadForm}
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
                    <Card>
                        <CardContent>
                            <CardHeader title="لیست مستندات"/>
                    <TablePro
                        columns={tableColumns}
                        rows={dataList.list||[]}
                        setRows={dataList.set}
                        loading={dataList.list===null}
                        edit="callback"
                        editCallback={handle_edit}
                        removeCallback={handle_remove}
                    />
                        </CardContent>
                    </Card>

                    <Box m={2} />
                    <Card>
                        <CardContent>
                            <CardHeader title="پیشنهادات برنامه"/>
                        <FormPro
                              prepend={suggForm}
                              formValues={formValues}
                              setFormValues={setFormValues}
                              actionBox={<ActionBox>
                                  <Button type="submit" role="primary">افزودن</Button>
                                  <Button type="reset" role="secondary">لغو</Button>
                              </ActionBox>}
                              submitCallback={handleSubmit}
                              resetCallback={handleReset}
                            />

                    <TablePro
                        columns={tableColumns}
                        rows={dataList.list||[]}
                        setRows={dataList.set}
                        loading={dataList.list===null}
                        edit="callback"
                        editCallback={handle_edit}
                        removeCallback={handle_remove}
                    />
                        </CardContent>
                    </Card>
                </Box>
                   
                </>
            }
        />
    )
}
