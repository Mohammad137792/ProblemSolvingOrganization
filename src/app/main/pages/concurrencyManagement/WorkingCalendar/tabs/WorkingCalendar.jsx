import React from 'react';
import { CardContent, CardHeader, Box, Button, Card, Typography } from "@material-ui/core";
import BigCalendar from 'jalali-react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import FormPro from "app/main/components/formControls/FormPro";
import ca from 'date-fns/esm/locale/ca/index';



const WorkingCalendar = () => {

    const [formValues, setFormValues] = React.useState({});

    const moment = require('jalali-moment')

    const dispatch = useDispatch();

    const [events, setEvents] = React.useState([]) 

    const [style, setStyle] = React.useState([]) 

    const [calendarEvents, setCalendarEvents] = React.useState([]) 

    const [configCalendarEvents, setConfigCalendarEvents] = React.useState(false) 

    const [calendarList, setCalendarList] = React.useState([])

    const [calendarsDetail, setCalendarsDetail] = React.useState([])

    const [calendar, setCalendar] = React.useState()

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        name    : "calendar",
        label   : "تقویم کاری",
        type    : "select",
        options : calendarList ,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
    }]

    const eventStyle = (event, start, end, isSelected) => {

    }

    const JalaliDate = {
        g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    };
    
    const jalaliToGregorian = (j_y, j_m, j_d) => {
        j_y = parseInt(j_y);
        j_m = parseInt(j_m);
        j_d = parseInt(j_d);
        var jy = j_y - 979;
        var jm = j_m - 1;
        var jd = j_d - 1;
    
        var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
        for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];
    
        j_day_no += jd;
    
        var g_day_no = j_day_no + 79;
    
        var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        g_day_no = g_day_no % 146097;
    
        var leap = true;
        if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
        {
            g_day_no--;
            gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
            g_day_no = g_day_no % 36524;
    
            if (g_day_no >= 365) g_day_no++;
            else leap = false;
        }
    
        gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
        g_day_no %= 1461;
    
        if (g_day_no >= 366) {
            leap = false;
    
            g_day_no--;
            gy += parseInt(g_day_no / 365);
            g_day_no = g_day_no % 365;
        }
    
        for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
        g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
        var gm = i + 1;
        var gd = g_day_no + 1;
    
        gm = gm < 10 ? "0" + gm : gm;
        gd = gd < 10 ? "0" + gd : gd;
    
        return [gy, gm, gd];
    }

    const eventHandler = () => {
        if(events.length > 0){
            let calEvents = []
            events.map((item,index)=>{
                var startGregorian
                var endGregorian 
                if(item?.dateType == "jalali"){
                    let startDate = item?.start
                    let startDateSplitted = startDate.split("-")
                    startGregorian = jalaliToGregorian( startDateSplitted[0], startDateSplitted[1],startDateSplitted[2])
                    let endDate = item?.end
                    let endDateSplitted = endDate.split("-")
                    endGregorian = jalaliToGregorian( endDateSplitted[0], endDateSplitted[1],endDateSplitted[2])
                }
                let event = {
                    ...item,
                    start : (item?.dateType == "gregorian") ? moment(item?.start).format('YYYY-MM-DD') : new Date (startGregorian[0],(startGregorian[1]-1),startGregorian[2]) ,
                    end : (item?.dateType == "gregorian") ? moment(item?.end).format('YYYY-MM-DD') : new Date (endGregorian[0],(endGregorian[1]-1),endGregorian[2])
                }
                calEvents.push(event)
                if(index === events.length-1){
                    setCalendarEvents(calEvents)
                }
            })
        }else{
            setCalendarEvents([])
        }
    }

    const dayStyle = (date) => {
        let dayStyle = {}
        
        style && style.map((item,index)=>{
            console.log("item" , item);
            if(item.dateType == "jalali"){
                if((moment(date).locale('fa', { useGregorianParser: true }).format('jYYYY-jMM-jDD') < item?.end) && (item.start <= moment(date).locale('fa', { useGregorianParser: true }).format('jYYYY-jMM-jDD'))){
                    dayStyle = {
                        backgroundColor : item.backgroundColor
                    }
                }
            }
            if(item.dateType == "gregorian"){
                if((new Date(date) <= new Date (item?.end)) && (new Date (item.start) <= new Date (date))){
                    dayStyle = {
                        backgroundColor : item.backgroundColor
                    }
                }
            }
        })
        return {
            style: dayStyle
        };
    }
    
    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/Calendars`, axiosKey).then((info)=>{
            // setCalendarsDetail(info.data?.calendarInfo?.calendarDetail)
            setCalendarList(info.data?.calendarList)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const getCalendarDetails = (calendar,date) => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/Calendardetails?partyClassificationId=${calendar}&desiredDate=${date}`, axiosKey).then((info)=>{
            
            setEvents(info.data.calendarDetail?.events)
            setStyle(info.data.calendarDetail?.style)
            setConfigCalendarEvents(true)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    React.useEffect(()=>{
        if(configCalendarEvents){
            eventHandler()
            setConfigCalendarEvents(false)
        }
    },[configCalendarEvents])

    React.useEffect(()=>{
        if(formValues?.calendar && formValues?.calendar !== ""){
            
            getCalendarDetails(formValues.calendar)
            setCalendar(formValues.calendar)
        }
    },[formValues?.calendar])

    function onEventClick(input){
        getCalendarDetails(calendar,input)
    }

    return (
        <div>
            <Box mb={2}/>
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
            />
            <Box mb={2}/>
            {(formValues?.calendar && formValues?.calendar !== "") ?
                <BigCalendar
                    views={['month']}
                    rtl={true}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    // eventPropGetter={(eventStyle)}
                    dayPropGetter={dayStyle}
                    onNavigate={onEventClick}
                />
            : ""}
            {(!formValues?.calendar || formValues?.calendar === "") ?
                <Card variant='outlined' style={{display : "flex" , justifyContent : "center" , alignItems : "center" , height : "470px"}}>
                    <Typography>تقویم کاری مورد نظر را انتخاب کنید</Typography>
                </Card>
            : ""}
        </div>
    ); 
};

export default WorkingCalendar;
