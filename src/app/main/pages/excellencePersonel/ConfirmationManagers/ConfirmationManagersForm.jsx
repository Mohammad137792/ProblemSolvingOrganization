import React, {createRef, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import TabPro from "../../../components/TabPro";
import AuxiliaryAccount from "./tabs/AuxiliaryAccount";
import DetailedAccount from "./tabs/DetailedAccount";
import DetailedAccountGroup from "./tabs/DetailedAccountGroup";
import AccountingDocumentTemplate from "./tabs/AccountingDocumentTemplate";
import { CardContent, Box, Button, Card } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';


export default function PayrollAccounting() {

    
  
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
        },{
            label:  "تاریخ شروع ثبت نام ",
            name:   "from date",
            type:   "date",
        },        
        {
            name: "thru date",
            label: "تاریخ پایان ثبت نام",
            type: "date",
        },
        {
            label:  "نحوه پرداخت هزینه",
            name:   "Description",
            type:   "select",
        },
        {
            label:  "انتخاب فیش کسر از حقوق ",
            name:   "Description",
            type:   "select",
        },
        {
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
        label: "زیربرنامه‌ها",
        panel: <AuxiliaryAccount scrollTop={scroll_to_top}/>
    },{
        label: "مخاطبین",
        panel: <DetailedAccount scrollTop={scroll_to_top}/>
    },{
        label: "ساختار هزینه",
        panel: <DetailedAccountGroup scrollTop={scroll_to_top}/>
    }]
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
