import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import {
  Box,
  CardContent,
  Card,
  Button,
  Divider,
  CardHeader,
  CircularProgress,
} from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import GetCourseInfoForm from "app/main/pages/personnelBaseInformation/custumComponent/getCourseInfo/GetCourseInfoForm";
import moment from "moment-jalaali";

const StudyNeedAssessmentOrganizationForm = ({
  curriculumId,
  display,
  setIsValid,
  isValid,
}) => {
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const dispatch = useDispatch();
  const [waiting, set_waiting] = useState(false);
  const [waiting2, set_waiting2] = useState(false);
  const [formValues, setFormValues] = useState(
    display != undefined
      ? display
        ? { status: JSON.stringify([]) }
        : { status: JSON.stringify(["CCSPlannedInNeeds"]) }
      : {}
  );
  const [formValues2, setFormValues2] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [tableContent1, setTableContent1] = useState([]);
  const [formValidation, setFormValidation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optionLists, setOptionLists] = useState("");
  const [id, setId] = useState("");
  const [newId, setNewId] = useState("");
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const formStructure2 = [
    {
      label: "نوع دوره",
      name: "category",
      type: "text",
      readOnly: true,
      col: 3,
    },
    {
      label: "عنوان دوره",
      name: "course",
      type: "select",
      required: true,
      options: optionLists.course
        ? Array.from(new Set(optionLists.course.map((a) => a.courseId)))
            .map((courseId) => {
              return optionLists.course.find(
                (a) => a.courseId === courseId && a.courseId
              );
            })
            .filter(Boolean)
        : [],
      optionIdField: "courseId",
      optionLabelField: "title",
      col: 3,
    },
    {
      label: "موسسه ارائه دهنده",
      name: "Institute",
      type: "select",
      required: true,
      options: optionLists.institute
        ? Array.from(
            new Set(optionLists.institute.map((a) => a.institutePartyId))
          )
            .map((institutePartyId) => {
              return optionLists.institute.find(
                (a) =>
                  a.institutePartyId === institutePartyId && a.institutePartyId
              );
            })
            .filter(Boolean)
        : [],
      optionIdField: "institutePartyId",
      optionLabelField: "InstituteName",
      col: 3,
    },
    {
      label: "مدرس دوره",
      name: "teacher",
      type: "select",
      required: true,
      options: optionLists.teacher
        ? Array.from(new Set(optionLists.teacher.map((a) => a.teacherId)))
            .map((teacherId) => {
              return optionLists.teacher.find(
                (a) => a.teacherId === teacherId && a.teacherId
              );
            })
            .filter(Boolean)
        : [],
      optionIdField: "teacherId",
      optionLabelField: "teacher",
      col: 3,
    },
    {
      label: "هزینه دوره",
      name: "cost",
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
  ];
  const tableCols = [
    {
      name: "firstName",
      label: "نام",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "personalId",
      label: "شماره پرسنلی",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "organizationName",
      label: "واحد سازمانی",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "toPosition",
      label: "پست سازمانی",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "offer",
      label: "پیشنهاد دهندگان",
      type: "text",
      style: { minWidth: "110px" },
    },
  ];
  function mergeCoursesValidation() {
    set_waiting(true);
    const validCourse = selectedRows.some((row) => row.accepted == true);
    if (validCourse) {
      let coursesId = [];
      selectedRows.forEach((course) => {
        coursesId.push(course.curriculumCourseId);
        console.log(validCourse, "dfghdfghdfghdf");
      });
      axios
        .post(
          SERVER_URL + "/rest/s1/training/getCoursesWithId",
          { data: coursesId },
          axiosKey
        )
        .then((res) => {
          set_waiting(false);
          const category = res.data.category;
          const fromCourse = res.data.fromCourse;
          const categorySet = new Set([...category]);
          // const cidSet = new Set([...result]);
          if (
            categorySet.size >= 2 ||
            fromCourse.length > 0 ||
            selectedRows.some((row) => row.merged == true)
          ) {
            setShow2(false);
            dispatch(
              setAlertContent(
                ALERT_TYPES.WARNING,
                "دوره‌های انتخاب شده قابل ادغام نیستند."
              )
            );
            set_waiting(false);
          } else {
            setShow2(true);
            const ids = {
              cuId: coursesId,
            };
            setId(ids);
            setForm2Options(ids);
          }
        })
        .catch(() => {
          set_waiting(false);
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
      setSelectedRows([]);
    } else {
      dispatch(
        setAlertContent(
          ALERT_TYPES.WARNING,
          "دوره‌های انتخاب شده قابل ادغام نیستند."
        )
      );
      setSelectedRows([]);
      set_waiting(false);
    }
  }
  function setForm2Options(ids) {
    axios
      .post(
        SERVER_URL + "/rest/s1/training/cuCourseOptions",
        { cuId: ids.cuId },
        axiosKey
      )
      .then((res) => {
        let optionLists = {
          institute: res.data.cuCourse ? res.data.cuCourse : [],
          teacher: res.data.cuCourse ? res.data.cuCourse : [],
          course: res.data.courses ? res.data.courses : [],
          category: res.data.category ? res.data.category : "",
        };
        setOptionLists(optionLists);
        const formDefaultValues = {
          // type: optionLists.type[0].type ? optionLists.type[0].type : "",
          // title: optionLists.title[0].title ? optionLists.title[0].title : "",
          category: optionLists.category ? optionLists.category : "",
        };
        setFormValues2(formDefaultValues);
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
  function filter() {
    let data = {
      curriculumId: curriculumId ? curriculumId : null,
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/training/filteredCourses",
        { typeAssessments: "TrainingNeeds", statusCu: "Inreview", data: data },
        axiosKey
      )
      .then((res) => {
        setLoading(false);
        const result = res.data.result;
        for (let i = 0; i < result.length; i++) {
          result[i].fromDate = moment(result[i].fromDate).locale("fa", {
            useGregorianParser: true,
          });
          result[i].thruDate = moment(result[i].thruDate).locale("fa", {
            useGregorianParser: true,
          });
        }
        setTableContent1(result);
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  function mergeCourses() {
    set_waiting2(true);
    if (formValues2.cost < 0) {
      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "هزینه‌ی دوره نباید منفی باشد")
      );
    } else if (formValues2.fromDate > formValues2.thruDate) {
      dispatch(
        setAlertContent(
          ALERT_TYPES.ERROR,
          "تاریخ شروع دوره نباید از تاریخ پایان آن دیرتر باشد. "
        )
      );
    } else {
      const data = {
        cuId: id.cuId,
        courseId: formValues2.course,
        institutePartyId: formValues2.Institute,
        cost: formValues2.cost,
        fromDate: formValues2.fromDate,
        thruDate: formValues2.thruDate,
        teacherId: formValues2.teacher,
      };
      axios
        .post(
          SERVER_URL + "/rest/s1/training/MergeCourses",
          { data: data },
          axiosKey
        )
        .then((res) => {
          set_waiting2(false);
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "دوره‌ها با موفقیت ادغام شدند.لطفا شرکت کنندگان دوره را انتخاب کنید."
            )
          );
          console.log(res.data, "merge");
          setShow3(true);
          setNewId(res.data.newItem.curriculumCourseId);
          filter();
          courseParticipants(res.data.newItem.curriculumCourseId);
        })
        .catch(() => {
          set_waiting2(false);
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در دریافت اطلاعات رخ داده است."
            )
          );
        });
    }
  }

  function courseParticipants(mergedCurriculumCourseId = null, newId = null) {
    if (mergedCurriculumCourseId) {
      setShow3(true);
      setNewId(mergedCurriculumCourseId);
    }
    axios
      .post(
        SERVER_URL + "/rest/s1/training/courseParticipants",
        { newId: mergedCurriculumCourseId ? mergedCurriculumCourseId : newId },
        axiosKey
      )
      .then((res) => {
        console.log(res.data, "courseParticipants");
        setLoading(false);
        setTableContent(res.data.result);
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  function addParticipants() {
    console.log(selectedRows2);
    set_waiting2(true);
    let emps = [];
    selectedRows2.forEach((row) => {
      let emp = {
        toPartyId: row.toPartyId,
        toPositionId: row.toEmplPositionId,
        fromPartyId: row.fromPartyId,
        fromEmplPositionId: row.fromEmplPositionId,
      };
      emps.push(emp);
    });
    console.log(emps, "emps");
    console.log(id.cuId, "cuId");
    axios
      .post(
        SERVER_URL + "/rest/s1/training/addParticipants",
        { emps: emps, newId: newId, cuId: id.cuId },
        axiosKey
      )
      .then((res) => {
        set_waiting2(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "شرکت کننده با موفقیت افزوده شد."
          )
        );
        filter();
        setSelectedRows([]);
        setShow2(false);
        setShow3(false);
        setNewId("");
        console.log(res.data.result, "addParticipants");
      })
      .catch(() => {
        set_waiting2(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
    setSelectedRows2([]);
  }
  function reset() {
    set_waiting2(true);
    setShow2(false);
    setShow3(false);
    set_waiting2(false);
  }

  useEffect(() => {
    if (selectedRows.length > 0) {
      setShow2(false);
      setShow3(false);
    }
    // if (selectedRows.length > 0 && newId !== "") {
    //   axios
    //     .delete(
    //       SERVER_URL +
    //         "/rest/s1/training/removeCourse?curriculumCourseId=" +
    //         newId,
    //       axiosKey
    //     )
    //     .then((res) => {
    //       const updatedTable = tableContent1.filter(
    //         (row) => row.curriculumCourseId != newId
    //       );
    //       setTableContent1(updatedTable);
    //       setNewId("");
    //       setSelectedRows([]);
    //     })

    //     .catch(() => {
    //       dispatch(
    //         setAlertContent(
    //           ALERT_TYPES.WARNING,
    //           "مشکلی در دریافت اطلاعات رخ داده است."
    //         )
    //       );
    //     });
    // }
  });
  useEffect(() => {
    if (typeof isValid !== "undefined") {
      const validCourse = tableContent1.some(
        (row) => row.status == "PlannedInNeeds"
      );
      if (validCourse) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [tableContent1]);

  return (
    <Box>
      <CardContent>
        <GetCourseInfoForm
          setFormValues={setFormValues}
          formValues={formValues}
          tableContent={tableContent1}
          setTableContent={setTableContent1}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          waiting={waiting}
          set_waiting={set_waiting}
          title={"دوره‌های مورد بررسی "}
          statusConfirmd={{
            statusId: "PlannedInNeeds",
            description: "Planned in Needs",
          }}
          statusRejection={{
            statusId: "UnderReview",
            description: "Under Review",
          }}
          typeAssessments="TrainingNeeds "
          statusCu="Inreview "
          curriculumId={curriculumId}
          display={display}
          extrabtn="ادغام"
          submitExtrabtn={mergeCoursesValidation}
          courseParticipants={courseParticipants}
        />
        <Divider />
        {show2 && (
          <Card
            style={{
              marginTop: "2.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <CardHeader title={"مشخصات دوره آموزشی"} />
            <CardContent>
              <FormPro
                append={formStructure2}
                formValues={formValues2}
                setFormValues={setFormValues2}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={mergeCourses}
                actionBox={
                  <ActionBox>
                    <Button
                      type="submit"
                      role="primary"
                      disabled={waiting2}
                      endIcon={waiting2 ? <CircularProgress size={20} /> : null}
                    >
                      ثبت
                    </Button>
                    <Button
                      type="reset"
                      role="secondary"
                      onClick={reset}
                      disabled={waiting2}
                      // endIcon={waiting ? <CircularProgress size={20} /> : null}
                    >
                      لغو
                    </Button>
                  </ActionBox>
                }
              />
            </CardContent>
          </Card>
        )}
        <Divider variant="fullWidth" />
        {show3 && (
          <Card
            variant="outlined"
            style={{
              marginTop: "2.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <CardContent>
              <TablePro
                title="شرکت کنندگان دوره آموزشی"
                columns={tableCols}
                rows={tableContent}
                selectable
                selectedRows={selectedRows2}
                setSelectedRows={setSelectedRows2}
                loading={loading}
              />
              <ActionBox>
                <Button
                  type="button"
                  role="primary"
                  disabled={
                    selectedRows2.length === 0 ? true : false || waiting2
                  }
                  onClick={addParticipants}
                  endIcon={waiting2 ? <CircularProgress size={20} /> : null}
                >
                  افزودن
                </Button>
                <Button
                  type="reset"
                  role="secondary"
                  onClick={reset}
                  disabled={waiting2}
                  // endIcon={waiting ? <CircularProgress size={20} /> : null}
                >
                  لغو
                </Button>
              </ActionBox>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Box>
  );
};

export default StudyNeedAssessmentOrganizationForm;
