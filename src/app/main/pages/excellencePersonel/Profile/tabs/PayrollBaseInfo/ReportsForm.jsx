import React, {createRef, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import TablePro from "../../../components/TablePro";
import DetailedAccount from "./tabs/DetailedAccount";
import DetailedAccountGroup from "./tabs/DetailedAccountGroup";
import PersonnelSelection from "./tabs/AccountingDocumentTemplate";
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

    const formStructure = [
        {
            name: "subject",
            label: " کد رهگيري",
            type: "select",
        },{
            name: "subject",
            label: " عنوان برنامه عملیاتی",
            type: "select",
        },
        {
            name: "title",
            label: " اقدام برنامه عملیاتی ",
            type: "select",
        },
        {
            name: "kind",
            label: "نوع برنامه فرهنگی ",
            type: "select",
            options: []
        },
        {
            name: "company",
            label: " عنوان برنامه ",
            type: "text",
        },        
        {
            name: "a",
            label: "اقدام بالاتر ",
            type: "number",
        },        
        {
            name: "b",
            label: " مسئول برگزاری ",
            type: "multiselect",
        },        
        {
            name: "c",
            label: "مکان برگزاري ",
            type: "text",
        },
        {
            label:  "تاریخ شروع ",
            name:   "from date",
            type:   "date",
        },        
        {
            name: "thru date",
            label: " تاریخ پایان ",
            type: "date",
        },
        {
            label:  "ارائه دهنده ",
            name:   "Description",
            type:   "text",
        },
        {
            label:  "حمل و نقل ",
            name:   "Description",
            type:   "select",
        },
        {
            label:  " سهم پرداختي پرسنل ",
            name:   "Description",
            type:   "number",
        },
        {
            label:  " سهم پرداختي خانواده پرسنل ",
            name:   "Description",
            type:   "number",
        },
        {
            label:  "مربی / مربیان اقدام ",
            name:   "Description",
            type:   "multiselect",
        },
        {
            label:  "بارگذاری مستندات لازم",
            name:   "Description",
            type:   "inputFile",
        },{
            label:  "شرح وظایف مسئول",
            name:   "Description",
            type:   "text",
            col : 6
        },
        {
            label:  "توضیحات",
            name:   "Description",
            type:   "text",
            col : 6
        }
    ]
    const [formValues, setFormValues] = useState([])

    const handleSubmit = () => { }
    const handleReset = () => { }

    const myScrollElement = createRef();
    const tabs = [{
        label: "برنامه ها",
        panel: <PersonnelSelection scrollTop={scroll_to_top}/>
    },{
        label: "مخاطبین",
        panel: <DetailedAccount scrollTop={scroll_to_top}/>
    },{
        label: "ساختار هزینه",
        panel: <DetailedAccountGroup scrollTop={scroll_to_top}/>
    }
    ]
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
                <TablePro
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit="callback"
                    editCallback={handle_edit}
                    removeCallback={handle_remove}
                />
            </Card>
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
                        <TabPro tabs={tabs}/>

                        </CardContent>
                    </Card>
                </Box>
             
                   
                   
                   
                   
                   
                   
                   
{/*                    
                   
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

                    <TabPro tabs={tabs}/> */}
                </>
            }
        />
    )
}
