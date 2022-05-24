import React from 'react';
import TablePro from "../../../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {useSelector , useDispatch} from "react-redux";
import FormFields from './FormFields';
import {Card, CardContent, CardHeader ,Grid} from "@material-ui/core"
import FilterForm from './FilterForm';
import Box from "@material-ui/core/Box";

const DefinitionOfEducationalTable = () => {
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);

    const [edit,setEdit]= React.useState(false);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [formValues , setFormValues] =React.useState({});
    const [confirmForm,setConfirmForm]=React.useState(false);
    const [storeFormValues,setStoreFormValues] = React.useState([]);
    const [editable,setEditable] = React.useState(true);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "courseCode", label: "کد دوره", type: "text", style: {maxWidth:"40px"}},
        {name: "category", label: "نوع دوره", type: "select", options: "CourseCategory", style: {maxWidth:"60px"}},
        {name: "title", label: "عنوان دوره", type: "text" , style: {maxWidth:"80px"}},
        {name: "type", label: "وضعیت دوره", type: "select" , options: "CourseType", style: {maxWidth:"60px"}},
        {name: "preRequisite", label: "پیش نیاز", type: "select", options: "Existence",optionLabelField : "description",optionIdField : "enumId", style: {maxWidth:"40px"}},
        {name: "preRequisiteTitle", label: "عناوین پیش نیاز", type: "text", style: {maxWidth:"90px"}} ,
        {name: "skillTitle", label: "مهارت ها ", type: "text" ,style: {maxWidth:"90px"} },
        {name: "competenceTitle", label: "شایستگی ها", type: "text" ,style: {minWidth:"140px",maxWidth:"140px"}},
    ]

    React.useEffect(()=>{
        if(partyRelationshipId && loading){
            axios.get(SERVER_URL + `/rest/s1/training/defineEducationTitle?partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
                setTableContent(res.data.courseInformation)
                setLoading(false)
            })
        }
    },[loading , partyRelationshipId ])
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            oldData = {...oldData , preId : oldData.preRequisiteId}
            axios.post(SERVER_URL + "/rest/s1/training/dropCourse" , {removeData : oldData}  , axiosKey).then(() => {
                resolve()
                setEdit(false)
                setConfirmForm(false)
                setFormValues({})
            }).catch(() => {
                reject("امکان حذف این ردیف وجود ندارد!")
            });
        })
    }
    const handleEdit =(rowData)=>{
        setConfirmForm(false)
        setEdit(true)
        let preId = []
        if(rowData.preRequisiteId.length > 0){
            rowData.preRequisiteId.map((item,index)=>{
                preId.push(item.preRequisiteId)
                if (index == rowData.preRequisiteId.length-1){
                    rowData = {...rowData , prerequisiteCoursesTitle : JSON.stringify(preId)}
                    setFormValues(rowData)
                    setStoreFormValues(rowData)
                }
            })
        }
        if(rowData.preRequisiteId.length == 0){
            setFormValues(rowData)
            setStoreFormValues(rowData)
        }
        rowData = {...rowData , preId : rowData.preRequisiteId}
        if(rowData.type == "temporarily"){setEditable(true)}
        if(rowData.type != "temporarily"){
            axios.post(SERVER_URL + "/rest/s1/training/checkEditDefineCourse" , {data : rowData}  , axiosKey).then((res) => {
                setEditable(true)
            }).catch(()=>{
                setEditable(false)
            })
        }
    }

    return(
        <>
            <Card>
                <CardContent>
                    <FormFields loading={loading} setLoading={setLoading}  edit={edit} setEdit={setEdit} formValues={formValues} setFormValues={setFormValues}
                    confirmForm={confirmForm} setConfirmForm={setConfirmForm} 
                    storeFormValues={storeFormValues}  setStoreFormValues={setStoreFormValues} editable={editable} setEditable={setEditable} />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <CardContent>
                    <TablePro
                        title="دوره های آموزشی"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        edit="callback"
                        editCallback={handleEdit}
                        filter="external"
                        filterForm={<FilterForm setTableContent={setTableContent} setLoading={setLoading} />}
                        removeCallback={handleRemove}
                        loading={loading}
                    />
                </CardContent>
            </Card>
        </>
    )
};
export default DefinitionOfEducationalTable;
