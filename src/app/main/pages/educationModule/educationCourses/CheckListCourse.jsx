
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../configs";
import { Box, Button, Card, Grid ,CardHeader,Dialog} from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormPro from 'app/main/components/formControls/FormPro';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';


const CheckListCourse = (props) => {
    const { curriculumCourseId } = props
    const [formValuesCheckList, setFormValuesCheckList] = useState({});
    const [FormValidation, setFormValidation] =React.useState({});

    // const [checkDelay, setCheckDelay] = useState("N")
    // const [checkCancle, setCheckCancle] = useState("N")
    const [personel, setPersonel] = useState([])
    const [unit, setUnit] = useState([])
    const [Position, setEmpPosition] = useState([])
    const dispatch = useDispatch()
    const [opendialog, setOpenDialog] = useState(true)



    const FormStructureCheckList = [
 

        {
            label: "  کد دوره",
            name: "courseCode",
            type: "text",
            col: 4,
            readOnly:true
        },
   
        {
            label: "  عنوان دوره",
            name: "title",
            type: "text",
            col: 4,
            readOnly:true

        },
    
        {
            label: "  وضعیت دوره",
            name: "status",
            type: "text",
            col: 4,
            readOnly:true

        },
     
        {
            label: "   نحوه بر گزاری",
            name: "holdType",
            type: "text",
            col: 4,
            readOnly:true

        },
   
        {
            label: "   موسسه ارایه دهنده",
            name: "institutePartyId",
            type: "text",
            col: 4,
            readOnly:true

        },
        {
            label: "     مدرس دوره",
            name: "InstructorPartyId",
            type: "text",
            col: 4,
            readOnly:true

        },
        {
            label: "      تاریخ شروع",
            name: "fromDate",
            type: "date",
            col: 4,
            readOnly:true

        },
        {
            label: "      تاریخ پایان",
            name: "thruDate",
            type: "date",
            col: 4,
            readOnly:true
            
        },
        {
            label: "       مدت زمان",
            name: "duration",
            type: "number",
            col: 4,
            readOnly:true

        },
        {
            label: "  هزینه دوره",
            name: "cost",
            type: "number",
            col: 4,
            readOnly:true

        },
        {
            label: "   وضعیت برگزاری",
            name: "holdType",
            type: "text",
            col: 4,
            readOnly:true
            
        },
        {
            label: " تاریخ آزمون پایانی",
            name: "examDate",
            type: "date",
            readOnly:true,
            col: 4
        },
    ]





      let data = {
        curriculumCourseId: curriculumCourseId[0]?.curriculumCourseId

    }
    useEffect(() => {
        axios.post(SERVER_URL + "/rest/s1/training/getCurriculumCourseInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

       console.log(res.data,"etet3")
    //    setFormValuesCheckList(res.data.result)
    setFormValuesCheckList(prevstate => ({ ...prevstate, courseCode: res.data.result[0]?.courseCode }))
    setOpenDialog(false)


const result=res.data.result[0]
    
    setFormValuesCheckList(prevState => ({
        ...prevState,
        courseCode:result?.courseCode,
        title:result?.title,
        status:result?.status,
        cost:result?.cost,
        fromDate: result?.fromDate,
        thruDate: result?.thruDate,
        institutePartyId: result?.institutePartyId,
        InstructorPartyId:JSON.stringify(result?.InstructorPartyId?.toString()),
        duration: result?.duration,
        holdType: result?.holdType,
        examDate:result?.examDate
        
    }))

        }).catch(() => {
        });

    }, [curriculumCourseId]);




    return (
        <Box >

    
            <CardHeader title={"  مشخصات دوره آموزشی"} />

      

                  <FormPro
                            append={FormStructureCheckList}
                            formValues={formValuesCheckList}
                            setFormValues={setFormValuesCheckList}
                            setFormValidation={setFormValidation}
                            formValidation={FormValidation}
                    

                        />
                            <Dialog open={opendialog} PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: 100,
                    height: 100,
                    borderWidth: 0
                },
            }} >
                <CircularProgress />
            </Dialog>


        </Box>
    )
}


export default CheckListCourse;


