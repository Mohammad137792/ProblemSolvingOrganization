import React from 'react';
import TablePro from "../../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {useSelector} from "react-redux";
import {Card, CardContent, CardHeader ,Grid} from "@material-ui/core"

const DependentTable = (props) => {
    const {rowData} = props
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const [skills, setSkills] = React.useState([]);
    const [criteria, setCriteria] = React.useState([]);
    const [edit,setEdit]= React.useState(false);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [EntCourse,setEntCourse]= React.useState([]);
    const [formValues , setFormValues] =React.useState({});
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {name: "pseudoId", label: "شماره پرسنلی", type: "number", style: {minWidth:"60px"}},
        {name: "firstName", label: "نام", type: "text" , style: {minWidth:"80px"}},
        {name: "lastName", label: "نام خانوادگی", type: "text" , style: {minWidth:"60px"}},
        {name: "orgUnit", label: "واحد سازمانی", type: "text" , style: {minWidth:"60px"}},
        {name: "toEmplPosition", label: "سمت", type: "text" , style: {minWidth:"80px"}},
        {name: "fromEmplPosition", label: "پیشنهاد دهنده", type: "text" , style: {minWidth:"60px"}},
    ]
    React.useEffect(()=>{
        if(rowData){
            axios.get(`${SERVER_URL}/rest/s1/training/courseList?pageSize=1000000000&curriculumCourseId=${rowData.curriculumCourseId}`, axiosKey).then(res => {
                console.log("ressssssssssssss" , res.data);
                setTableContent(res.data.info)
                setLoading(false)
            })
        }
    },[rowData?.curriculumCourseId])
    console.log("rowData" , rowData);
    return (
        <Card>
            <CardContent>
                <TablePro
                    title={`لیست شرکت کنندگان در دوره آموزشی ${rowData.title ?? ""}`}
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                />
            </CardContent>
        </Card>
    );
};

export default DependentTable;