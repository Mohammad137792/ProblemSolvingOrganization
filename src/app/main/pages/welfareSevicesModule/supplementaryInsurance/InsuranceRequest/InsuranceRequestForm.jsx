import React, { useState, useEffect } from 'react';
import axios from "axios";
import { SERVER_URL } from 'configs';
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader,Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { useHistory } from 'react-router-dom';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from "@material-ui/icons/Delete";


const InsuranceRequestForm = (props) => {
    const history = useHistory();
    const [formValues, setFormValues] = useState([]);
    const [formValues2, setFormValues2] = useState([]);
    const [formValues3, setFormValues3] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});
    const [tableContent, setTableContent] = React.useState([]);
    const [expanded, setExpanded] = useState(false);
    const [suggestionStatus ,setSuggestionStatus] = useState([])
    const [tableLoading, serTableLoading] = useState(true)
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch()

    const tableCols = [
        { name: "suggestionCode", label: " نسبت ", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionCode", label: " نام و نام خانوادگی ", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionCode", label: " کد ملی ", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionCode", label: " تاریخ تولد ", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionTitle", label: " وضعیت تاهل", type: "text", style: { minWidth: "130px" } },
        { name: "suggestionStatusId", label: "  وضعیت اشتغال ", type: "select", style: { minWidth: "130px" }, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId", },
        { name: "suggestionStatusId", label: "  حق بیمه ", type: "select", style: { minWidth: "130px" }, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId", },
        { name: "suggestionStatusId", label: "  سهم قابل پرداخت کارمند ", type: "select", style: { minWidth: "130px" }, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId", },
        { name: "suggestionStatusId", label: "  سهم قابل پرداخت کافرما ", type: "select", style: { minWidth: "130px" }, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId", },
        { name: "suggestionCreationDate", label: "  وضعیت عضویت ", type: "date", style: { minWidth: "130px" } },

    ]


    const formStructure = [{
            label: "درخواست دهنده",
            name: "suggestionCode",
            type: "text",
            col: 3
        }, 
        {
            label: "پست سازمانی ",
            name: "position",
            options: [
                {
                    description: "کارشناس تحلیل",
                    statusId: 1
                },
                {
                    description: "کارشناس توسعه ",
                    statusId: 2
                },
                {
                    description: "مدیر عامل",
                    statusId: 3
                },
            ],
            optionLabelField: "description",
            optionIdField: "statusId",
            type: "select",
            required: true,
            col: 3
        }, 
        {
            label: "  کد رهگیری ",
            name: "suggestionStatusId",
            type: "text",
            options: suggestionStatus,
            optionLabelField: "description",
            optionIdField: "statusId",
            col: 3

        },
        {
            label: " تاریخ ایجاد درخواست ",
            name: "suggestionCreationDateStart",
            type: "date",
            col: 3

        },
        {
            label: "نوع درخواست ",
            name: "suggestionTitle",
            required: true,
            options: [
                {
                    description: "عضویت",
                    statusId: 1
                },
                {
                    description: "تغییر افراد تحت پوشش",
                    statusId: 2
                },
                {
                    description: "انصراف",
                    statusId: 3
                },
            ],
            optionLabelField: "description",
            optionIdField: "statusId",
            type: "select",
            col: 3
        },
        {
            label: "انتخاب قرارداد بیمه ",
            name: "selectContract",
            options: [
                {
                    description: "خودم",
                    statusId: 1
                },
                {
                    description: "همسر - نسرین فریدی ",
                    statusId: 2
                },
                {
                    description: "فرزند دختر - شیما نصیری",
                    statusId: 3
                },
                {
                    description: "پدر - امید نصیری",
                    statusId: 4
                },
            ],
            optionLabelField: "description",
            optionIdField: "statusId",
            type: "select",
            col: 3
        },
        {
            label: " شرکت بیمه گر ",
            name: "suggestionCreationDateEnd",
            type: "text",
            col: 6

        },
        {
            label: "نحوه پرداخت هزینه ",
            name: "test2",
            options: [
                {
                    description: "کسر از حقوق به صورت خودکار",
                    statusId: 1
                },
            ],
            optionLabelField: "description",
            optionIdField: "statusId",
            type: "select",
            col: 3
        },
        {
            label: "نوع فیش",
            name: "test1",
            options: [
                {
                    description: "فیش یک",
                    statusId: 1
                },
            ],
            optionLabelField: "description",
            optionIdField: "statusId",
            required: true,
            type: "select",
            col: 3
        },
        {
            label: "تعداد سهم های بیمه ",
            name: "tst6",
            type: "text",
            col: 3
        },
        {
            label: "فاصله پرداخت سهم بیمه (ماه) ",
            name: "test8",
            type: "text",
            col: 3
        },
        {
            type    : "group",
            items   : [{
                name    : "estimatedExecutionCost",
                label   : "حق بیمه",
                type    : "number",
            },{
                type    : "text",
                label   : "ریال",
                disableClearable: true,
                style:  {width:"30%"}
            }],
            col     : 3
        },
        {
            label: "تاریخ پایان قرارداد بیمه ",
            name: "test9",
            type: "date",
            col: 3
        },
    ]

    const formStructure2 = [{
        label: "انتخاب بیمه شده",
        name: "suggestionCode",
        options: [
            {
                description: "پرسنل",
                statusId: 1
            },
            {
                description: "همسر - سمانه نویدی",
                statusId: 2
            },
            {
                description: "فرزند دختر - ندا قنبریان",
                statusId: 3
            },
        ],
        optionLabelField: "description",
        optionIdField: "statusId",  
        type: "select",
        col: 3
    }, 
    {
        type    : "group",
        items   : [{
            name    : "estimatedExecutionCost",
            label   : "سهم قابل پرداخت کارمند",
            type    : "number",
        },{
            type    : "text",
            label   : "ریال",
            disableClearable: true,
            style:  {width:"30%"}
        }],
        col     : 3
    },
    {
        type    : "group",
        items   : [{
            name    : "estimatedExecutionCost",
            label   : "سهم قابل پرداخت کارفرما",
            type    : "number",
        },{
            type    : "text",
            label   : "ریال",
            disableClearable: true,
            style:  {width:"30%"}
        }],
        col     : 3
    }
]

const formStructure3 = [
    {
        type    : "group",
        items   : [{
            name    : "estimatedExecutionCost",
            label   : "کل مبلغ قابل پرداخت",
            type    : "number",
        },{
            type    : "text",
            label   : "ریال",
            disableClearable: true,
            style:  {width:"30%"}
        }],
        col: 6
    },
    {
        label: "توضیحات درخواست",
        name: "suggestionCode",
        type: "textarea",
        col: 6
    }
]

    function getSuggestions(filterParam){
        axios.get(SERVER_URL + "/rest/s1/Suggestion/mySuggestionList", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: filterParam
        }).then(res => {
            setTableContent(res.data.list)
            serTableLoading(false)
        }).catch(err => {

        });
    }


    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionStatus(res.data.status)
        }).catch(err => {
        });

    }

    const submit = () => {
        getSuggestions(formValues)
    }

    const handleSubmit = () => {
        history.push("./InsuranceRequestCheck")
    }

                                                                                                                                                                                                       
    const handleReset = () => {
        setFormValues([])   
    }

    useEffect(() =>{
        getEnum()
        getSuggestions([])
    }, [])

    


    return (
        <Box>
            <Card >
                <CardContent>
                    <Card style={{padding: "2%" }}>
                        <CardHeader title="درخواست بیمه"/>
                        <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                            submitCallback={submit}
                            resetCallback={handleReset}               
                        />
                    </Card>

                    <Card style={{padding: "2%" , marginTop: "2%"}}>
                        <CardHeader title=" لیست بیمه شدگان"/>
                        <FormPro
                            append={formStructure2}
                            formValues={formValues2}
                            setFormValues={setFormValues2}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                            submitCallback={submit}
                            resetCallback={handleReset}    
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">افزودن</Button>
                            </ActionBox>}           
                        />
                        <TablePro
                            columns={tableCols}
                            rows={tableContent}
                            setTableContent={setTableContent}
                            loading={tableLoading}
                            
                            rowActions={
                                [
                                      {
                                        title: "لغو عضویت",
                                        icon:VisibilityIcon,
                                        onClick: (row) => {
                                            
                                        }
                                    },
                                    {
                                        title: "حذف",
                                        icon:DeleteIcon,
                                        onClick: (row) => {
                                            
                                        }
                                    }
                                ]
                            }
                        />
                        <FormPro
                            append={formStructure3}
                            formValues={formValues3}
                            setFormValues={setFormValues3}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                            submitCallback={submit}
                            resetCallback={handleReset}              
                        />
                    </Card>
                    <Box style={{marginTop: "2%"}}>
                        <FormPro
                            formValidation={formValidation}
                            submitCallback={handleSubmit}
                            resetCallback={handleReset}   
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">ثبت درخواست</Button>
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}            
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}


export default InsuranceRequestForm;











