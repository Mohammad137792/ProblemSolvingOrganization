import React from "react";
import Card from "@material-ui/core/Card";
import {Button, CardContent} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import TablePro from "../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import TabPro from "../../../components/TabPro";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormInput from "../../../components/formControls/FormInput";
import FormButton from "../../../components/formControls/FormButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ActionBox from "../../../components/ActionBox";
import FormPro from "../../../components/formControls/FormPro";

export default function HelpTable() {
    const tabs = [{
        label: "جدول ساده",
        panel: <TableExampleSimple/>
    },{
        label: "جدول انتخابی",
        panel: <TableExampleSelectable/>
    },{
        label: "جدول با فیلتر",
        panel: <TableExampleFilter/>
    },{
        label: "ویرایش سطری",
        panel: <TableExampleInline/>
    },{
        label: "ویرایش خارجی",
        panel: <TableExampleExternal/>
    }]
    return(
        <React.Fragment>
            <Card>
                <CardHeader title="راهنمای پیاده سازی جداول"/>
                <CardContent>
                    <Box mb={2}>
                        <Typography variant="body1">برای پیاده سازی جدول از المان TablePro واقع در پوشه components استفاده شود.</Typography>
                    </Box>
                    <Card variant="outlined">
                        <TabPro tabs={tabs}/>
                    </Card>
                    <Box m={2}/>
                    <Card variant="outlined">
                        <TableProps/>
                    </Card>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

function TableProps() {
    const tableCols = [
        {name: "name", label: "نام مشخصه", type: "text"},
        {name: "type", label: "نوع", type: "text"},
        {name: "default", label: "مقدار پیش فرض", type: "text"},
        {name: "description", label: "توضیحات", type: "text"},
    ]
    const tableProps = [
        {name: "title", type: "string", default: "", description: "عنوان جدول"},
        {name: "defaultOrderBy", type: "string", default: "", description: "نام پیش فرض ستون برای مرتب سازی"},
        {name: "columns", type: "object", default: "[ ]", description: "آرایه ای حاوی تعریف ستون های جدول که مشابه تعریف فرم است."},
        {name: "rows", type: "object", default: "[ ]", description: "آرایه ای از داده های جدول"},
        {name: "setRows", type: "func", default: "null", description: "تابعی برای تعیین مقدار متغیر مربوط به داده های جدول"},
        {name: "loading", type: "bool", default: "false", description: ""},
        {name: "selectable", type: "bool", default: "false", description: ""},
        {name: "selectedRows", type: "object", default: "[ ]", description: "سطرهای انتخاب شده"},
        {name: "setSelectedRows", type: "func", default: "()=>{return false}", description: ""},
        {name: "isSelected", type: "func", default: "(row,selectedRows)=>selectedRows.indexOf(row)!==-1", description: ""},
        {name: "showTitleBar", type: "bool", default: "true", description: ""},
        {name: "showRowNumber", type: "bool", default: "true", description: ""},
        {name: "rowNumberWidth", type: "string", default: "fixedLayout?'35px':'1%'", description: ""},
        {name: "fixedLayout", type: "bool", default: "false", description: ""},
        {name: "showPagination", type: "bool", default: "true", description: ""},
        {name: "actions", type: "object", default: "[ ]", description: ""},
        {name: "rowActions", type: "object", default: "[ ]", description: ""},
        {name: "filter", type: "false | 'external'", default: "false", description: ""},
        {name: "filterForm", type: "node", default: "null", description: ""},
        {name: "add", type: "false | 'external' | 'inline'", default: "false", description: ""},
        {name: "addForm", type: "node", default: "null", description: ""},
        {name: "addCallback", type: "func", default: "null", description: ""},
        {name: "edit", type: "false | 'external' | 'inline' | 'callback'", default: "false", description: ""},
        {name: "editForm", type: "node", default: "null", description: ""},
        {name: "editCallback", type: "func", default: "null", description: ""},
        {name: "removeCallback", type: "func", default: "null", description: ""},
        {name: "exportCsv", type: "string", default: "", description: "نام فایل خروجی اکسل"},
        {name: "csvRenderer", type: "func", default: "null", description: "تابع دلخواه در صورت لزوم برای تولید داده های خروجی اکسل"},
    ]
    return (
        <React.Fragment>
            <TablePro
                title="لیست مشخصه های جدول"
                columns={tableCols}
                rows={tableProps}
                pagination={false}
            />
        </React.Fragment>
    )
}

function PersonForm({formStructure, editing=false,...restProps}) {
    const {formValues, setFormValues, oldData, successCallback, failedCallback, handleClose} = restProps;
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={()=>{
                successCallback(formValues)
                if(editing){
                    console.log('table edited to:',formValues)
                }else{
                    console.log('table added:',formValues)
                }
            }}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
function TableExampleExternal() {
    const [tableContent, setTableContent] = React.useState([
        {name: "Mohammad"},{name: "Ali",score: 5},{name: "Reza", gender: "Y"}
    ]);
    const tableCols = [
        {name: "name", label: "نام", type: "text", style: {minWidth:"170px"}},
        {name: "score", label: "امتیاز", type: "number" , style: {minWidth:"90px"}},
        {name: "date", label: "تاریخ عضویت", type: "date", style: {minWidth:"90px"}},
        {name: "gender", label: "جنسیت", type: "select", options: "Gender"},
        {name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus"},
    ]
    const handleRemove = (oldData)=>{
        console.log('table removed:',oldData)
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            },200)
        })
    }
    return(
        <TablePro
            title="اسامی افراد"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="external"
            addForm={<PersonForm formStructure={tableCols}/>}
            edit="external"
            editForm={<PersonForm formStructure={tableCols} editing={true}/>}
            removeCallback={handleRemove}
        />
    )
}

function TableExampleInline() {
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        {name: "name", label: "نام", type: "text", style: {minWidth:"170px"}},
        {name: "score", label: "امتیاز", type: "number" , style: {minWidth:"90px"}},
        {name: "date", label: "تاریخ عضویت", type: "date", style: {minWidth:"90px"}},
        {name: "status", label: "وضعیت", type: "indicator"},
        {name: "gender", label: "جنسیت", type: "select", options: "Gender"},
        {name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus"},
    ]
    const handleAdd = (newData)=>{
        console.log('table added:',newData)
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                const id = Math.floor(Math.random()*1000)
                resolve({...newData,...id})
            },200)
        })
    }
    const handleEdit = (newData, oldData)=>{
        console.log('table edited:',newData)
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            },200)
        })
    }
    const handleRemove = (oldData)=>{
        console.log('table removed:',oldData)
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            },200)
        })
    }
    return(
        <TablePro
            title="اسامی افراد"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            rowCondition={row => {
                if(!row.name) return "error"
                if(row.status==="N") return "disabled"
                if(!row.score) return "default"
                if(row.score>0) return "success"
                if(row.score<=0) return "warning"
                // if(row.maritalStatusEnumId==="MarsSingle") return "info"
            }}
        />
        // <Button onClick={()=>console.log('')}>Log</Button>
    )
}

function FilterForm({getPersonnel}) {
    const [formValues, setFormValues] = React.useState({});
    const [moreFilter, setMoreFilter] = React.useState(false);
    const formStructure = [{
        name    : "pseudoId",
        label   : "کد پرسنلی",
        type    : "text",
    },{
        name    : "firstName",
        label   : "نام",
        type    : "text",
    },{
        name    : "lastName",
        label   : "نام خانوادگی",
        type    : "text",
    },{
        name    : "ownerPartyId",
        label   : "شرکت",
        type    : "select",
        options : "Test1",
    },{
        name    : "maritalStatusEnumId",
        label   : "وضعیت تاهل",
        type    : "select",
        options : "MaritalStatus",
        display : moreFilter
    },{
        name    : "residenceStatusEnumId",
        label   : "وضعیت سکونت",
        type    : "select",
        options : "ResidenceStatus",
        display : moreFilter
    },{
        name    : "nationalId",
        label   : "کد ملی",
        type    : "text",
        display : moreFilter
    }]
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={()=>getPersonnel(formValues)}
            resetCallback={()=>getPersonnel()}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        >
            <FormButton onClick={()=>setMoreFilter(!moreFilter)}
                        startIcon={moreFilter && <ChevronRightIcon/>}
                        endIcon={!moreFilter &&<ChevronLeftIcon/>} >
                {moreFilter?"فیلترهای کمتر":"فیلترهای بیشتر"}
            </FormButton>
        </FormPro>
    )
}
function TableExampleFilter() {
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {minWidth:"80px"}},
        {name: "fullName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {minWidth:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text" , style: {minWidth:"90px"}},
        {name: "birthDate", label: "تاریخ تولد", type: "date", style: {minWidth:"90px"}},
        {name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus"},
        {name: "residenceStatusEnumId", label: "وضعیت سکونت", type: "select", options: "ResidenceStatus"},
        {name: "organizationName", label: "شرکت", type: "text"},
    ]
    function getPersonnel(filter={}){
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=addressInfo", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: filter
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.party)
        }).catch(() => {
            setLoading(false)
        });
    }
    React.useEffect(()=>{
        getPersonnel()
    },[])

    return(
        <TablePro
            title="لیست پرسنل"
            columns={tableCols}
            rows={tableContent}
            loading={loading}
            filter="external"
            filterForm={<FilterForm getPersonnel={getPersonnel}/>}
        />
    )
}

function TableExampleSelectable() {
    const [loading, setLoading] = React.useState(true);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {minWidth:"80px"}},
        {name: "fullName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {minWidth:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text" , style: {minWidth:"90px"}},
        {name: "birthDate", label: "تاریخ تولد", type: "date", style: {minWidth:"90px"}},
        {name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus"},
        {name: "residenceStatusEnumId", label: "وضعیت سکونت", type: "select", options: "ResidenceStatus"},
    ]
    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=addressInfo", {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.party)
        }).catch(() => {
            setLoading(false)
        });
    },[])
    return(
        <TablePro
            columns={tableCols}
            rows={tableContent}
            selectable
            singleSelect
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            loading={loading}
            showTitleBar={false}
        />
    )
}

function TableExampleSimple() {
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {minWidth:"80px"}},
        {name: "fullName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {minWidth:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text" , style: {minWidth:"90px"}},
        {name: "birthDate", label: "تاریخ تولد", type: "date", style: {minWidth:"90px"}},
        {name: "maritalStatusEnumId", label: "وضعیت تاهل", type: "select", options: "MaritalStatus"},
        {name: "residenceStatusEnumId", label: "وضعیت سکونت", type: "select", options: "ResidenceStatus"},
        {name: "organizationName", label: "شرکت", type: "text"},
    ]
    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/party/search?addressInfo=addressInfo", {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setLoading(false)
            setTableContent(res.data.party)
        }).catch(() => {
            setLoading(false)
        });
    },[])
    return(
        <TablePro
            columns={tableCols}
            rows={tableContent}
            loading={loading}
            showTitleBar={false}
        />
    )
}
