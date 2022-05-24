import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Box, Button, Card, CircularProgress } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from "app/main/components/ActionBox";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import moment from "moment-jalaali";
import EditIcon from "@material-ui/icons/Edit";

const GetCourseInfoForm = (props) => {
  const {
    waiting,
    set_waiting,
    singleSelect,
    statusRejection = null,
    statusConfirmd = null,
    curriculumId = null,
    display = true,
    title,
    setSelectedRows,
    selectedRows,
    tableContent,
    setTableContent,
    formValues,
    setFormValues,
    typeAssessments,
    statusCu,
    reject = true,
    confirm = true,
    extrabtn = null,
    submitExtrabtn = () => {},
    courseParticipants = () => {},
  } = props;

  const selectable = display ? true : false;

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchWaiting, setSearchWaiting] = useState(false);
  // const [tableContent, setTableContent] = useState([]);
  const [optionLists, setOptionLists] = useState([]);
  const [organizationUnit, setOrganizationUnit] = useState([]);
  const [course, setCourse] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [operation, setOperation] = useState("");
  const [statusOperation, setStatusOperation] = useState([]);

  const courseTable = [...tableContent];
  //========================================   structurs =========================================
  const formStructure = [
    {
      label: "کد دوره",
      name: "courseCode",
      options: course,
      optionIdField: "courseId",
      optionLabelField: "courseCode",
      type: "multiselect",
      filterOptions: (options) => options.filter((o) => o.courseCode),
      col: 3,
    },
    {
      label: "عنوان دوره",
      name: "title",
      type: "multiselect",
      options: course,
      optionIdField: "courseId",
      optionLabelField: "title",
      filterOptions: (options) => options.filter((o) => o.title),
      col: 3,
    },
    {
      label: "نوع دوره",
      name: "category",
      options: optionLists.courseCategory,
      type: "multiselect",
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "عنوان نیازسنجی",
      name: "titleAssessments",
      type: "multiselect",
      options: curriculum,
      optionIdField: "curriculumId",
      optionLabelField: "title",
      col: 3,
    },
    {
      label: "نحوه برگذاری",
      name: "holdType",
      type: "multiselect",
      options: optionLists.holdType,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "وضعیت دوره",
      name: "type",
      type: "multiselect",
      options: optionLists.courseType,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "  واحد سازمانی ",
      name: "organizationUnit",
      type: "multiselect",
      options: organizationUnit.units,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      filterOptions: (options) =>
        formValues["companyName"]
          ? options.filter((o) => o["parentOrgId"] == formValues["companyName"])
          : options,
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
    {
      label: "شرکت",
      name: "companyName",
      type: "select",
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      options: organizationUnit.subOrgans,
      col: 3,
    },
    {
      label: "وضعیت بررسی",
      name: "status",
      type: "multiselect",
      options: statusOperation,
      optionLabelField: "description",
      optionIdField: "statusId",
      col: 3,
    },
  ];
  const tableCols = [
    {
      name: "courseCode",
      label: "کد دوره",
      type: "number",
      style: { minWidth: "110px" },
    },
    {
      name: "priority",
      label: "الویت",
      type: "number",
      style: { minWidth: "110px" },
    },
    {
      name: "enumCategory",
      label: "نوع دوره",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "title",
      label: "عنوان دوره",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "enumType",
      label: "وضعیت دوره",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "fromDate",
      label: "تاریخ شروع",
      type: "date",
      style: { minWidth: "110px" },
    },
    {
      name: "thruDate",
      label: "تاریخ پایان",
      type: "date",
      style: { minWidth: "110px" },
    },
    {
      name: "InstituteName",
      label: "موسسه ارائه دهنده",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "teacher",
      label: "مدرس دوره",
      type: "render",
      render: (row) => {
        return `${row.firstName || ""} ${row.lastName || ""}`;
      },
      style: { minWidth: "110px" },
    },
    {
      name: "cost",
      label: "هزینه دوره",
      type: "number",
      style: { minWidth: "110px" },
    },
    {
      name: "offer",
      label: "پیشنهاد دهندگان",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "status",
      label: "وضعیت بررسی",
      type: "select",
      options: statusOperation,
      optionLabelField: "description",
      optionIdField: "statusId",
      style: { minWidth: "110px" },
    },
  ];
  //========================================   functions =========================================
  function getEnums() {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=CourseCategory,HoldType,CourseType",
        axiosKey
      )
      .then((res) => {
        let enums = res.data.enums;
        let optionLists = {
          holdType: enums.HoldType ? enums.HoldType : [],
          courseCategory: enums.CourseCategory ? enums.CourseCategory : [],
          courseType: enums.CourseType ? enums.CourseType : [],
        };
        setOptionLists(optionLists);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });

    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/StatusItem?statusTypeId=CurriculumCourseStatus",
        axiosKey
      )
      .then((res) => {
        setStatusOperation(res.data.status);
      })
      .catch((err) => {});
  }
  function getCourse() {
    axios
      .get(SERVER_URL + "/rest/s1/training/coursesInfo", axiosKey)
      .then((res) => {
        setCourse(res.data.courseTitles);
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
  function getCurriculum() {
    axios
      .get(SERVER_URL + "/rest/s1/training/entity/Curriculum", axiosKey)
      .then((res) => {
        setCurriculum(res.data);
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
  function getOrgUnit() {
    let listMap = ["unit"];
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap,
        axiosKey
      )

      .then((res) => {
        const orgMap = {
          units: res.data.contacts.unit,
          subOrgans: res.data.contacts.orgs,
        };
        setOrganizationUnit(orgMap);
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
    setSearchWaiting(true);
    let data = {
      companyName:
        formValues.companyName && formValues.companyName.length != 0
          ? formValues.companyName
          : null,
      curriculumId: curriculumId ? curriculumId : null,
      title:
        formValues.title && formValues.title.length != 0
          ? formValues.title
          : null,
      category:
        formValues.category && formValues.category.length != 0
          ? formValues.category
          : null,
      fromDate:
        formValues.fromDate && formValues.fromDate.length != 0
          ? formValues.fromDate
          : null,
      thruDate:
        formValues.thruDate && formValues.thruDate.length != 0
          ? formValues.thruDate
          : null,
      courseCode:
        formValues.courseCode && formValues.courseCode.length != 0
          ? formValues.courseCode
          : null,
      type:
        formValues.type && formValues.type.length != 0 ? formValues.type : null,
      titleAssessments:
        formValues.titleAssessments && formValues.titleAssessments.length != 0
          ? formValues.titleAssessments
          : null,
      holdType:
        formValues.holdType && formValues.holdType.length != 0
          ? formValues.holdType
          : null,
      organizationUnit:
        formValues.organizationUnit && formValues.organizationUnit.length != 0
          ? formValues.organizationUnit
          : null,
      examDate:
        formValues.examDate && formValues.examDate.length != 0
          ? formValues.examDate
          : null,
      status:
        formValues.status && formValues.status.length != 0
          ? formValues.status
          : null,
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/training/filteredCourses",
        { typeAssessments: typeAssessments, statusCu: statusCu, data: data },
        axiosKey
      )
      .then((res) => {
        setSearchWaiting(false);
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
        setTableContent(result);
      })
      .catch(() => {
        setSearchWaiting(false);
        setLoading(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }

  function triggerBtn(operation) {
    setOperation(operation);
    courseStateUpdate(operation);
  }
  function removeCourse(curriculumCourseId) {
    axios
      .delete(
        SERVER_URL +
          "/rest/s1/training/removeCourse?curriculumCourseId=" +
          curriculumCourseId,
        axiosKey
      )
      .then((res) => {
        const updatedTable = tableContent.filter(
          (row) => row.curriculumCourseId != curriculumCourseId
        );
        setSelectedRows([]);
        setTableContent(updatedTable);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "دوره با موفقیت حذف شد.")
        );
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

  function courseStateUpdate(operation) {
    let courses = [];
    let courseIds = [];
    let status;
    let desc;

    switch (operation) {
      case "rej":
        status = statusRejection.statusId;
        desc = statusRejection.description;
        break;
      case "conf":
        status = statusConfirmd.statusId;
        desc = statusConfirmd.description;
        break;
      default:
    }
    selectedRows.forEach((course) => {
      if (
        (status == "PlannedInNeeds" || status == "UnderReview") &&
        (course.type == "temporarily" || course.accepted == false)
      ) {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            `وضعیت دوره با نام ${course.title} را نمیتوان تغییر داد.`
          )
        );
      } else {
        let curriculumCourse = {
          curriculumCourseId: course.curriculumCourseId,
          status: status,
        };
        courseIds.push(course.curriculumCourseId);
        courses.push(curriculumCourse);
      }
    });
    if (courses.length > 0) {
      axios
        .put(
          SERVER_URL + "/rest/s1/training/entity/CurriculumCourse",
          courses,
          axiosKey
        )
        .then((res) => {
          for (let i = 0; i < courseIds.length; i++) {
            courseTable.forEach((course) => {
              if (course.curriculumCourseId == courseIds[i]) {
                course.statusDescription = desc;
                course.status = status;
              }
            });
          }
          setTableContent(courseTable);
          setSelectedRows([]);
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "وضعیت با موفقیت آپدیت شد.")
          );
        })

        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.WARNING, "مشکلی در حذف رخ داده است.")
          );
        });
    }
  }
  //========================================   useEffect =========================================
  useEffect(() => {
    getEnums();
    getOrgUnit();
    getCurriculum();
    getCourse();
    filter();
  }, []);
  // useEffect(() => {
  //   if (operation != "") courseStateUpdate(operation);
  // }, [operation]);
  return (
    <Box>
      <Card variant="outlined">
        <TablePro
          rowNumberWidth="40px"
          title={title}
          columns={tableCols}
          rows={tableContent}
          selectable={selectable}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          singleSelect={singleSelect}
          loading={loading}
          rowCondition={(row) => {
            if (row.merged == true) return "success";
          }}
          rowActions={[
            {
              title: "حذف دوره",
              icon: DeleteIcon,
              onClick: (row) => removeCourse(row?.curriculumCourseId),
              display: (row) => row.merged == true,
            },
            {
              title: "انتخاب شرکت کنندگان",
              icon: EditIcon,
              onClick: (row) => {
                courseParticipants(row?.curriculumCourseId);
              },
              display: (row) => row.merged == true,
            },
          ]}
          filter="external"
          filterForm={
            <FormPro
              append={formStructure}
              formValues={formValues}
              setFormValues={setFormValues}
              submitCallback={filter}
              actionBox={
                <ActionBox>
                  <Button
                    type="submit"
                    role="primary"
                    disabled={waiting}
                    endIcon={
                      searchWaiting ? <CircularProgress size={20} /> : null
                    }
                  >
                    جستجو
                  </Button>
                </ActionBox>
              }
            />
          }
        />
        {display && (
          <ActionBox>
            <Button
              type="button"
              role="primary"
              style={{
                color: "white",
                display: confirm ? "block" : "none",
              }}
              disabled={selectedRows.length === 0 ? true : false || waiting}
              onClick={() => triggerBtn("conf")}
              // endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              تایید
            </Button>
            <Button
              type="button"
              style={{
                display: reject ? "block" : "none",
              }}
              role="secondary"
              disabled={selectedRows.length === 0 ? true : false || waiting}
              onClick={() => triggerBtn("rej")}
              // endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              رد
            </Button>
            <Button
              type="button"
              role="primary"
              style={{
                backgroundColor:
                  selectedRows.length < 2 ? "#ffcc80" : "#ff9900",
                color: "white",
                display: extrabtn ? "block" : "none",
              }}
              disabled={selectedRows.length < 2 ? true : false || waiting}
              onClick={submitExtrabtn}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              {extrabtn}
            </Button>
          </ActionBox>
        )}
      </Card>
    </Box>
  );
};

export default GetCourseInfoForm;
