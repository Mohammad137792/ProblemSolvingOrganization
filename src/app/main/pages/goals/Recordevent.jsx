import React, { useState } from 'react';
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import TablePro from "../../components/TablePro";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";

const Recordevent=()=>{
    const [formValues, setFormValues] = useState({});
    const [SelectCompany,SetSelectCompany]=useState([
        {
            SelectCompany:'هلدلینگ',
            SelectCompanyId:204
        },{
            SelectCompany:'ریل پرداز سیر',
            SelectCompanyId:205
        },{
            SelectCompany:'ریل پرداز سیستم',
            SelectCompanyId:206
        },{
            SelectCompany:'ریل پردازنوآفرین',
            SelectCompanyId:207
        },{
            SelectCompany:'کترینگ دوتا',
            SelectCompanyId:208
        }
    ])
    const [SelectTypeofevent,SetSelectTypeofevent]=useState([
        {
            SelectTypeofevent:'مثبت',
            SelectTypeofeventId:228
        },{
            SelectTypeofevent:'منفی',
            SelectTypeofeventId:229
        }
    ])
    const [Selectorganizationpost,SetSelectorganizationpost]=useState(
        [
            {
                Selectorganizationpost:'کارشناس تحلیل',
                SelectorganizationpostId:208
            },{
                Selectorganizationpost:'کارشناس تحقیق وتوسعه',
                SelectorganizationpostId:209
            },{
                Selectorganizationpost:'مدیرتحقیق وتوسعه',
                SelectorganizationpostId:210
            }
        ]
    )
    const [SelectEmployee,SetSelectEmployee]=useState([
        {
            SelectEmployeeId :120,
            SelectEmployeeValue:'پرسنل1'
        },{
            SelectEmployeeId :121,
            SelectEmployeeValue:'پرسنل2'
        },{
            SelectEmployeeId :122,
            SelectEmployeeValue:'پرسنل3'
        }
    ])
    const [OrganzitionPart,SetOrganzitionPart]=useState([
        {
            OrganzitionPart:'واحدسازمانی1',
            OrganzitionPartId:150        
        },{
            OrganzitionPart:'واحدسازمانی 2',
            OrganzitionPartId:151        
        },{
            OrganzitionPart:'واحدسازمانی3',
            OrganzitionPartId:152        
        }
    ])
    const [OrganzitionParts,SetOrganzitionParts]=useState([
        {
            OrganzitionParts:'مدیرمنابع انسانی',
            OrganzitionPartsId:150        
        },{
            OrganzitionParts:'مدیرغیرمستقیم',
            OrganzitionPartsId:151        
        }
    ])
    const [OrganzitionPost,SetOrganzitionPost]=useState([
         {
            OrganzitionPost:'پست1',
            OrganzitionPostId:153        
        },{
            OrganzitionPost:'پست2',
            OrganzitionPostId:154        
        },{
            OrganzitionPost:'پست3',
            OrganzitionPostId:155        
        }
    ])
    const [Selectcourese,SetSetSelectcourese]=useState([
        {
            Selectcourese:'پست1',
            SelectcoureseId:253        
       },{
            Selectcourese:'پست2',
           SelectcoureseId:254        
       },{
            Selectcourese:'پست3',
           SelectcoureseId:255        
       }
   ])
   const [SelectGroupingevent,SetSelectGroupingeventId]=useState([
    {
        SelectGroupingevent:'پست1',
        SelectGroupingeventId:263        
   },{
        SelectGroupingevent:'پست2',
        SelectGroupingeventId:264        
   },{
        SelectGroupingevent:'پست3',
        SelectGroupingeventId:265        
   }
])
    const formStructure = [
        {
            name    : "DateofRecord",
            label   : "تاریخ ثبت",
            type    : "date",
        },{
            name    : "Company",
            label   : "شرکت",
            type    : "select",
            options : SelectCompany,
            optionLabelField :"SelectCompany",
            optionIdField:"SelectCompanyId"
        },{
            name    : "nameofEmploye",
            label   : "نام پرسنل ثبت کننده",
            type    : "text",
        },{
            name:   "organizationpost",
            label:  "پست سازمانی ثبت کننده",
            type:   "select",
            options : Selectorganizationpost,
            optionLabelField :"Selectorganizationpost",
            optionIdField:"SelectorganizationpostId"
        },{
            name    : "Company",
            label   : "شرکت",
            type    : "select",
            options : SelectCompany,
            optionLabelField :"SelectCompany",
            optionIdField:"SelectCompanyId"
        },{
            name: "OrganzitionPart",
            label:"واحدسازمانی",
            type: "select",
            options : OrganzitionParts,
            optionLabelField :"OrganzitionParts",
            optionIdField:"OrganzitionPartsId"
        },{
            name:   "organizationpost",
            label:  "پست سازمانی",
            type:   "select",
            options : Selectorganizationpost,
            optionLabelField :"Selectorganizationpost",
            optionIdField:"SelectorganizationpostId"
        },{
            name: "Employee",
            label: "پرسنل",
            type: "select",
            options : SelectEmployee,
            optionLabelField :"SelectEmployeeValue",
            optionIdField:"SelectEmployeeId"
        }]
        const formStructure1 = [
            {
                name    : "event",
                label   : "موضوع واقعه حساس",
                type    : "text",
                col     :5
            },{
                name    : "Typeofevent",
                label   : "نوع واقعه",
                type    : "select",
                options :SelectTypeofevent,
                optionLabelField :"ُSelectTypeofevent",
                optionIdField:"ُSelectTypeofeventId"
            },{
                name    : "Groupingevent",
                label   : "دسته بندی وقایع",
                type    : "select",
                options :SelectGroupingevent,
                optionLabelField :"SelectGroupingevent",
                optionIdField:"SelectGroupingeventId"
            },{
                name:   "dateofevent",
                label:  "تاریخ واقعه",
                type:   "date",
            },{
                name    : "courese",
                label   : "دوره ارزیابی متوسط",
                type    : "select",
                options : Selectcourese,
                optionLabelField :"Selectcourese",
                optionIdField:"SelectcoureseId"
            },{
                name: "description",
                label:"توضیحات",
                type: "text",
            }]
    

        return(
        <Box>
            <CardContent>
                <Card>
                <CardHeader title="ثبت وقایع حساس"/>
                    <CardContent>
                        <FormPro
                        formValues={formValues}
                        setFormValues={setFormValues}
                        append={formStructure}
                        />
                    </CardContent>
                <CardHeader title="ثبت وقایع"/>
                    <CardContent>
                        <FormPro
                        formValues={formValues}
                        setFormValues={setFormValues}
                        append={formStructure1}
                        />
                        <hr/>
                    </CardContent>
                </Card>
                </CardContent>
                </Box>
                )
    
}
export default Recordevent