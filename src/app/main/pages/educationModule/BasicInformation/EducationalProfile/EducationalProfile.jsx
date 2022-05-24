import React, {useState,useEffect} from 'react';
import {FusePageSimple} from "@fuse";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {CardContent, Divider,Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardHeader from '@material-ui/core/CardHeader';
import TablePro from "../../../../components/TablePro";
import EducationalProfileForm from "./EducationalProfileForm";
import moment from "moment-jalaali";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";

export default function EducationalProfile(){
    var courseTitles = [];
    const tableCols = [
        {name: "title", label: "عنوان دوره ", type: "text"},
        {name: "institute", label: "موسسه برگزارکننده دوره", type: "text"   },
        {name: "teacher", label: "مدرس برگزارکننده", type: "text"},
        {name: "fromDate", label: "تاریخ شروع", type: "text"},
        {name: "thruDate", label: "تاریخ پایان", type: "text"},
        {name: "applicationFee", label: "هزینه دوره(ریال)", type: "text"},
        {name: "certificate", label: "گواهینامه", type: "text"},
        {name: "duration", label: "مدت دوره(ساعت)", type: "text"},
    ]
    const [loading, setLoading] = useState(true);
    const [initData, setInitData] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [data, setData] = React.useState(false);
    const [actionObject, setActionObject] = useState(null);
    const dispatch = useDispatch();

    function getCoursesInfo(){
        axios.get(SERVER_URL + "/rest/s1/training/getCoursesInfo", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setInitData(res.data)
            setLoading(false)
            let courses = res.data.courses
            console.log('initData',res.data)
            if(courses){
                for(let i = 0 ; i < courses.length ; i++){
                    let courseId = courses[i].courseId,
                        crs = courseId ? res.data.courseTitles.find( x => x.courseId == courseId) : false
                    courses[i].fromDate = moment(courses[i].fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD')
                    courses[i].thruDate = moment(courses[i].thruDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD')
                    courses[i].title = crs ? crs.title : ''
                    courses[i].certificate = courses[i].Url && courses[i].Url != '' ? <Button variant="outlined" color="secondary" ><a href={SERVER_URL+courses[i].Url} download>دانلود</a></Button> : '-'
                    if(i==courses.length-1){
                        setTableContent(courses)
                    }
                }
            }

        }).catch((err) => {
             setLoading(false)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }

    function deleteCourse(course){
        return axios.post(SERVER_URL + "/rest/s1/training/deleteCourse", {course:course} ,{
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(res => {

            }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
            });
    }

    useEffect(()=>{
        getCoursesInfo()
    },[data]);


    return (
        <FusePageSimple
            // header={<CardHeader title={"شناسنامه آموزشی کارمندان"}/>}
            content={
                <Box p={0}>
                    <Card >
                        <CardHeader title={"ثبت دوره آموزشی"}/>
                        <CardContent>
                            <EducationalProfileForm initData={initData} tableContent={tableContent} data={data} setData={setData}/>
                        </CardContent>
                    </Card>

                    <Card >
                        <TablePro
                            title="شناسنامه آموزشی"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            removeCallback={deleteCourse}
                        />
                    </Card>
                </Box>
            }
        />
    );
}
