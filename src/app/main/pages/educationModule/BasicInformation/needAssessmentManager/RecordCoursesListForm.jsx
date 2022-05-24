import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../../configs";
import { useHistory } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import CourseTable from './CourseTable';
import { Grid } from 'react-virtualized';
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from 'app/main/components/ActionBox';

const RecordCoursesListForm = (props) => {
    const { submitCallback, setIsApproved, curriculumId ,managerList,contactsManager,priorities} = props

    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [actionObject, setActionObject] = useState(null);
    const [tableContent, setTableContent] = useState([]);
    const [waiting, set_waiting] = useState(false)
    const [type, setType] = useState('');

    const dispatch = useDispatch()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        { name: "firstName", label: "", type: "text" },
        { name: "lastName", label: " ", type: "text" },
        { name: "parentSkillId", label: " عنوان ", type: "render", render: (row) => (row.parentSkillId ? "   " : "   ") ,style: { maxWidth: "50px" }},
        { name: "parentSkillId", label: " ", type: "render", render: (row) => (row.parentSkillId ? "   " : "   ") },
        { name: "fromDate", label: "زمان شروع", type: "date" },
        { name: "thruDate", label: "زمان پایان", type: "date" },
        // {name: "thruDate", label: " عنوان ", type: type,  render: (row)=>(row.thruDate!==null? setType("date") : setType("text"))},

    ]

    // const tableCols = [
    //     {name: "firstName", label: "نام", type: "text"},
    //     {name: "lastName", label: " نام خانوادگی", type: "text"},
    //     {name: "CourseTypeName", label: "   نوع دوره  ", type: "text",  },

    //     {name: "title", label: "عنوان دوره های درخواستی", type: "yext"},
    // ]

    useEffect(() => {

        axios.get(SERVER_URL + "/rest/s1/training/getRecordCourseLists?curriculumId=" + curriculumId, {
            headers: { 'api_key': localStorage.getItem('api_key') },
        }).then(res => {
            setTableContent(res.data.result)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    }, [])
    const route = () => {
        // history.push(`/needAssessmentManager`);
        setIsApproved(false)
    }
    const finishManager = () => {
        set_waiting(true)

        let parentIds = [contactsManager.organizationPartyId]

        while(parentIds.length > 0){
            let childrens = []
            managerList.map(item=>{
                if(parentIds.indexOf(item.parentId) >= 0 ){
                    priorities[item.organizationPartyId] = true
                    childrens.push(item.organizationPartyId)
                }
            })
            parentIds = childrens
        }

        
        setTimeout(() => {
            const packet = {
                result: "accept",
                managerList:managerList,
                priorities:priorities
            }
            submitCallback(packet)
        }, 500);
    }
    return (
        <Box>
            <Card >
            <CardContent>
                
                    <CourseTable
                        title="لیست دوره های ثبت شده"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        loading={loading}
                    />
                
                <ActionBox>
                    <Button onClick={route} role="secondary" type="submit" >
                        بازگشت
                    </Button>
                    <Button type="submit" role="primary" disabled={waiting} endIcon={waiting ?<CircularProgress size={20}/>:null}  onClick={finishManager}  >
                        تایید نهایی
                    </Button>
                </ActionBox>
            </CardContent>
            </Card>
        </Box>

    )
}


export default RecordCoursesListForm;





