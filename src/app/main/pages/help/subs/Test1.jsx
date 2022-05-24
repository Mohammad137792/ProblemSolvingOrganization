import React, {useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent} from "@material-ui/core";
import EmplOrderNotice from "../../tasks/forms/EmplOrder/notice/EmplOrderNotice";
import ActionBox from "../../../components/ActionBox";
import FilterHistory from "../../../components/FilterHistory";
import FormPro from "../../../components/formControls/FormPro";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {CSVLink} from "react-csv";
import {useHistory} from "react-router-dom";
import CallMadeIcon from '@material-ui/icons/CallMade';
import {useSelector} from "react-redux";
import TabPro from "../../../components/TabPro";
import ListSubheader from "@material-ui/core/ListSubheader";
import GeneralBaseData from "../../systemBaseData/generalBaseData/GeneralBaseData";
import QuestionnaireResponder from "../../questionnaire/responder/QuestionnaireResponder";
import FormInput from "../../../components/formControls/FormInput";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";

export default function Test1() {
    const history = useHistory();
    // return <GeneralBaseData/>
    return <FusePageSimple
        header={
            <CardHeader title="تست یک" style={{width:"100%"}}
                        action={
                            <Button type="button" color="secondary" variant="outlined"
                                    startIcon={<CallMadeIcon/>}
                                    onClick={()=>history.push(`/help/test2`)}
                            >تست دو</Button>
                        }
            />
        }
        content={
            <Box p={2}>
                <Responder/>
                {/*<TabExp/>*/}
            </Box>
        }
    />
}

function Responder() {
    const [formValues, setFormValues] = React.useState({})
    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <FormInput label="answerId" type="text" name="answerId" valueObject={formValues} valueHandler={setFormValues}/>
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <QuestionnaireResponder answerId={formValues.answerId}/>
            </Card>
        </React.Fragment>
    )
}

function TabExp() {
    const tabs = [
        {label: "فرم یک", panel: <Form1/>},
        {label: "فرم دو", panel: <Form2/>},
        {label: "فرم سه", panel: <Form3/>},
    ]
    return(
        <Card>
            <TabPro tabs={tabs} initialValue={1}/>
        </Card>
    )
}

const renderGroup = (params) => [
    <ListSubheader key={params.key} component="div">
        {params.group}
    </ListSubheader>,
    params.children,
];
const group = {
    groupBy: (option) => option.description[0].toUpperCase(),
    renderGroup: renderGroup
}
function Form1() {
    const lists = useSelector(({fadak}) => fadak.constData.list);
    const [formValues, setFormValues] = useState({});
    const formStructure = [{
        name    : "name",
        label   : "نام",
        type    : "text"
    },{
        name    : "jobGradeId",
        label   : "طبقه شغلی",
        type    : "select",
        options : "JobGrade"
    },{
        name: "insuranceNumberEnumId",
        label: "عنوان طبقه شغل",
        type: "select",
        options: "JobTitle",
        hasTooManyOptions: true,
        // ...group
    },{
        name: "insuranceNumberEnumId",
        label: "کد بیمه شغل",
        type: "select",
        options: "JobTitle",
        optionLabelField: "enumCode",
        hasTooManyOptions: true
    },
    ]
    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    return (
        <Card>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={handleSubmit}
                    append={formStructure}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">تایید</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                        <Button type="button" role="tertiary" onClick={()=>{
                            console.log("lists:",lists)
                        }}>لاگ لیست ها</Button>
                    </ActionBox>}
                />
            </CardContent>
        </Card>
    )
}
function Form2() {
    const lists = useSelector(({fadak}) => fadak.constData.list);
    const [formValues, setFormValues] = useState({});
    const formStructure = [{
        name    : "name",
        label   : "نام",
        type    : "text"
    },{
        name    : "personnelGroup",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
    }]
    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    return (
        <Card>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={handleSubmit}
                    append={formStructure}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">تایید</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                        <Button type="button" role="tertiary" onClick={()=>{
                            console.log("lists:",lists)
                        }}>لاگ لیست ها</Button>
                        <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_personnel"}/>
                    </ActionBox>}
                />
            </CardContent>
        </Card>
    )
}
function Form3() {
    const lists = useSelector(({fadak}) => fadak.constData.list);
    const [formValues, setFormValues] = useState({});
    const formStructure = [{
        name    : "name",
        label   : "نام",
        type    : "text"
    },{
        name    : "jobGradeId",
        label   : "طبقه شغلی",
        type    : "select",
        options : "JobGrade"
    },{
        name    : "personnelGroup",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
    }]
    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    return (
        <Card>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={handleSubmit}
                    append={formStructure}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">تایید</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                        <Button type="button" role="tertiary" onClick={()=>{
                            console.log("lists:",lists)
                        }}>لاگ لیست ها</Button>
                    </ActionBox>}
                />
            </CardContent>
        </Card>
    )
}
function SimpleForm() {
    const lists = useSelector(({fadak}) => fadak.constData.list);
    const [formValues, setFormValues] = useState({});
    const [EntPayGrade,setEntPayGrade]= useState([]);
    const formStructure = [{
        name    : "name",
        label   : "نام",
        type    : "text"
    },{
        name    : "jobId",
        label   : "شغل",
        type    : "select",
        options : "Job",
        optionIdField       : "jobId",
        optionLabelField    : "jobTitle"
    },{
        name    : "jobGradeId",
        label   : "طبقه شغلی",
        type    : "select",
        options : "JobGrade"
    },{
        name    : "personnelArea",
        label   : "منطقه فعالیت",
        type    : "select",
        options : "ActivityArea",
        optionIdField   : "partyClassificationId",
    },{
        name    : "personnelSubArea",
        label   : "حوزه کاری",
        type    : "select",
        options : "ExpertiseArea",
        optionIdField   : "partyClassificationId",
    },{
        name    : "personnelGroup",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
    },{
        name    : "personnelSubGroup",
        label   : "زیرگروه پرسنلی",
        type    : "select",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroup)
    },{
        name    : "payGradeId",
        label   : "رتبه شغلی",
        type    : "select",
        options : EntPayGrade ,
        optionIdField   : "payGradeId",
    }]

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayGrade`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setEntPayGrade(res.data.result)
        }).catch(() => {
        });
    },[])

    const handleSubmit = ()=>{
        console.log("submit:",formValues)
    }
    return (
        <Card>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={handleSubmit}
                    append={formStructure}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">تایید</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                        <Button type="button" role="tertiary" onClick={()=>{
                            console.log("lists:",lists)
                        }}>لاگ لیست ها</Button>
                    </ActionBox>}
                />
            </CardContent>
        </Card>
    )
}
