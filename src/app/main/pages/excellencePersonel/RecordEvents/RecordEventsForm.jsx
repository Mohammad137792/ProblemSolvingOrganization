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
   

    const formStructure = [{
        name    : "accountCode",
        label   : "مسئول برگزاری",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "عنوان برنامه",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "کد رهگیری",
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
        label   : "شرح وظایف مسئول",
        type    : "text",
        col     :9,

    }]
    const [formValues, setFormValues] = useState([])

    const handleSubmit = () => { }
    const handleReset = () => { }

    const myScrollElement = createRef();
    const tabs = [{
        label: "ثبت اطلاعات برنامه",
        panel: <PersonnelSelection scrollTop={scroll_to_top}/>
    },{
        label: "بارگذاری مستندات",
        panel: <DetailedAccount scrollTop={scroll_to_top}/>
    },{
        label: "ارزیابی برنامه",
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

                        <CardContent>

                            <FormPro
                              prepend={formStructure}
                              formValues={formValues}
                              setFormValues={setFormValues}
                            //   actionBox={<ActionBox>
                            //       <Button type="submit" role="primary">افزودن</Button>
                            //       <Button type="reset" role="secondary">لغو</Button>
                            //   </ActionBox>}
                            //   submitCallback={handleSubmit}
                            //   resetCallback={handleReset}
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
