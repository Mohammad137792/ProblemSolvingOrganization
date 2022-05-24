import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import { Box, CardContent, Card, Button,Divider,CardHeader } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { useParams,useHistory } from "react-router-dom";

const StudyneedAssessmentForm = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true);
    const [formValues, setFormValues] = useState([]);
    const [formInitValue, setformInitValue] = useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [teacher, setTeacher] = useState([]);
    const {cuId}=useParams();
    const history=useHistory();
    const axiosKey = {
        headers: {
          api_key: localStorage.getItem("api_key"),
        },
      };
    const formStructure = [
        {
          label: "نوع دوره",
          name: "category",
          type: "text",
          readOnly: true,
          col: 3,
        },
        {
          label: "عنوان دوره",
          name: "title",
          type: "text",
          readOnly: true,
          col: 3,
        },
        {
          label: "وضعیت دوره",
          name: "type",
          type: "text",
          readOnly: true,
          col: 3,
        },
        {
          label: "مدت زمان دوره",
          name: "duration",
          type: "text",
          col: 3,
        },
        {
          label: "نحوه برگذاری دوره",
          name: "holdType",
          type: "text",
          readOnly: true,
          col: 3,
        },
        {
          label: "موسسه ارائه دهنده",
          name: "Institute",
          type: "text",
          readOnly: true,
          col: 3,
        },
        {
          label: "مدرس دوره",
          name: "teacher",
          type: "select",
          options: teacher,
          optionIdField: "partyId",
          optionLabelField: "teacher",
          col: 3,
        },
        {
          label: "هزینه دوره به ازای هر نفر",
          name: "costPerPerson",
          type: "number",
          col: 3,
        },
        {
          label: "هزینه شرکت در دوره",
          name: "appFee",
          type: "number",
          col: 3,
        },
        {
          label: "ظرفیت ثبت نام آزاد",
          name: "capacity",
          type: "number",
          col: 3,
        },
        {
          label: "ظرفیت لیست انتظار",
          name: "waitingList",
          type: "number",
          col: 3,
        },
        {
          label: "تعداد غیبت مجاز",
          name: "absence",
          type: "number",
          col: 3,
        },
        {
          label: "حداقل نمره قبولی",
          name: "minScore",
          type: "number",
          col: 3,
        },
        {
          label: "قبولی مشروط",
          name: "proviScore",
          type: "number",
          col: 3,
        },
        {
          label: "تاریخ شروع دوره",
          name: "fromDate",
          type: "date",
          col: 3,
        },
        {
          label: "تاریخ پایان دوره",
          name: "thruDate",
          type: "date",
          col: 3,
        },
        {
          label: "تاریخ آزمون پایانی",
          name: "examDate",
          type: "date",
          col: 3,
        },
      ];
      function getInstructor(){
        axios
        .get(
          SERVER_URL + "/rest/s1/training/getInstructor",
          axiosKey
        )
        .then((res) => {
            setTeacher(res.data.result)
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
      }
      function setOptionCourse(){
        axios
        .post(
          SERVER_URL + "/rest/s1/training/curriculumCourseOption",
          {cuId:cuId},
          axiosKey
        )
        .then((res) => {
            const formDefaultValues = {
                category:res.data.options.category ? res.data.options.category:"",
                title:res.data.options.title ? res.data.options.title:"",
                type:res.data.options.type?res.data.options.type:"",
                holdType:res.data.options.holdType?res.data.options.holdType:"",
                Institute:res.data.options.Institute?res.data.options.Institute:""
              };
              setFormValues(formDefaultValues);
              setformInitValue(formDefaultValues)
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
      }
      function updateCurriculumCourse(){
        if(formValues.fromDate>formValues.thruDate ||formValues.fromDate>formValues.examDate ){
          dispatch(
            setAlertContent(
              ALERT_TYPES.ERROR,
              "تاریخ شروع دوره نباید از تاریخ پایان یا امتحان آن دیرتر باشد. "
            )
          );
        }
         else if(formValues.thruDate>formValues.examDate ){
          dispatch(
            setAlertContent(
              ALERT_TYPES.ERROR,
              "تاریخ پایان دوره نباید دیرتر از تاریخ امتحان آن باشد. "
            )
          );
        }
        else if(formValues.appFee<0||formValues.capacity<0||formValues.waitingList<0||formValues.absence<0||formValues.minScore<0
          ||formValues.proviScore<0||formValues.costPerPerson<0 ){
            dispatch(
              setAlertContent(
                ALERT_TYPES.ERROR,
                "فیلدهای عددی باید مقدار مثبت داشته باشند."
              )
            );
          }
        else{
          const data={
            curriculumCourseId:cuId,
            duration:formValues.duration,applicationFee:formValues.appFee,capacity:formValues.capacity,waitingList:formValues.waitingList,
            permissibleAbsence:formValues.absence,minScore:formValues.minScore,provisionalScore:formValues.proviScore,
            costPerPerson:formValues.costPerPerson,teacherId:formValues.teacher,
            fromDate:formValues.fromDate,thruDate:formValues.thruDate,examDate:formValues.examDate
          }
          axios
        .put(
          SERVER_URL + "/rest/s1/training/editCurriculumCourse",
          {data:data},
          axiosKey
        )
        .then((res) => {
            if(res.data.editedItem){
                dispatch(
                    setAlertContent(
                      ALERT_TYPES.SUCCESS,
                      "دوره با موفقیت ویرایش شد."
                    )
                  );
                  setFormValues(formInitValue);
            }
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
        }
      }
      function returnBack(){
        history.push(`/RequiredCourses`)
      }
      useEffect(() => {
        setOptionCourse();
        getInstructor();
      },[]);
    return ( 
        <Box>
            <Card>
            <CardHeader title={"مشخصات دوره آموزشی"} />
            <CardContent>
              <FormPro
                append={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                submitCallback={updateCurriculumCourse}
                resetCallback={returnBack}
                actionBox={
                  <ActionBox>
                    <Button type="submit" role="primary">
                      تایید
                    </Button>
                    <Button type="reset" role="secondary">
                      بازگشت
                    </Button>
                  </ActionBox>
                }
              />
            </CardContent>
          </Card>
        </Box>
     );
}
 
export default StudyneedAssessmentForm;