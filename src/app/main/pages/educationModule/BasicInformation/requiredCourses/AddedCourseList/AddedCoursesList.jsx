import React, { useState, useEffect } from 'react'
import TablePro from "../../../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {useSelector} from "react-redux";
import {Card, CardContent, CardHeader ,Grid} from "@material-ui/core"
import { FusePageSimple } from '@fuse'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import ActionBox from '../../../../../components/ActionBox'
import FormPro from 'app/main/components/formControls/FormPro';
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";

const AddedCoursesList = ({curriculumId,setShowCurriculum,planningTableContent,setPlanningTableContent}) => {

    const [loading, setLoading] = React.useState(true);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const history = useHistory()
    // const curriculumId = useParams();
    const dispatch = useDispatch();



    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "category", label: "نوع دوره", type: "select", options: "CourseCategory", style: {minWidth:"60px"}},
        {name: "title", label: "عنوان دوره", type: "text" , style: {minWidth:"80px"}},
        {name: "type", label: "وضعیت دوره", type: "select" , options: "CourseType", style: {minWidth:"60px"}},
        {name: "holdType", label: "نحوه ی برگزاری", type: "select", options: "HoldType", style: {minWidth:"60px"}},
        {name: "fromDate", label: "تاریخ شروع", type: "date" , style: {minWidth:"60px"}},
        {name: "thruDate", label: "تاریخ پایان", type: "date", style: {minWidth:"60px"}},
        {name: "duration", label: "مدت ساعت", type: "number" , style: {minWidth:"60px"}},
        {name: "organizationName", label: "موسسه ارائه دهنده", type: "text" , style: {minWidth:"60px"}},
        {name: "instructor", label: "مدرس دوره", type: "text" , style: {minWidth:"80px"}},
        {name: "cost", label: "هزینه دوره", type: "number" , style: {minWidth:"60px"}},
        {name: "applicationFee", label: "هزینه شرکت در دوره", type: "number", style: {minWidth:"60px"}},
        {name: "status", label: "وضعیت بررسی", type: "text" , style: {minWidth:"120px"}},
    ]

    React.useEffect(()=>{
        axios.get(`${SERVER_URL}/rest/s1/training/filterRequiredCourse?pageSize=100000&partyRelationshipId=${partyRelationshipId}&requirement=${curriculumId}&status=PlacedInCurriculum`, axiosKey).then(filter => {
            setPlanningTableContent(filter.data.filter)
            setLoading(false)
        })
    },[partyRelationshipId])

    const handleRemove = (removeData) => {
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + `/rest/s1/training/dropCoursePlan` , {data :removeData } , axiosKey ).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    const handleGoBack = () => {
        setShowCurriculum(false)
        // history.push(`/RequiredCourses/${curriculumId.params}`);
    }


    return (
        <React.Fragment>
            <FusePageSimple
                header={
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <Typography variant="h6" className="p-10">برنامه آموزشی</Typography>
                        <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={handleGoBack}
                                startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button> 
                    </div>
                }
                content={<>
                    <Card variant="outlined">
                        <CardContent>
                            <TablePro
                                columns={tableCols}
                                rows={planningTableContent}
                                setRows={setPlanningTableContent}
                                loading={loading}
                                removeCallback={handleRemove}
                            />
                        </CardContent>
                    </Card>
                </>}

            />

         </React.Fragment>
    );
};

export default AddedCoursesList;