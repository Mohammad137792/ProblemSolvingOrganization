import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from "app/main/components/ActionBox";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import moment from "moment-jalaali";
import CancelIcon from '@material-ui/icons/Cancel';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

const GetCourseInfoForm = (props) => {
  const {
    singleSelect,
    statusRejection = null,
    statusConfirmd = null,
    curriculumId = null,
    display = true,
    title,
    setSelectedRows,
    selectedRows,
    formValues,
    setFormValues,
    typeAssessments,
    statusCu,
    reject = true,
    confirm = true,
    extrabtn = null,
    submitExtrabtn = () => {},
    showCancelModal,
    showModal,
    showModalHoldingCourse,
    classAssessment,
    courseAssessment
  } = props;

  const selectable = display ? true : false;

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [tableContent, setTableContent] = useState([]);
  const [optionLists, setOptionLists] = useState([]);
  const [organizationUnit, setOrganizationUnit] = useState([]);
  const [course, setCourse] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [operation, setOperation] = useState("");
  const [storeSelectedRow,setStoreSelectedRow] = useState([]);
  const [reset,setReset] = useState(true);

  const courseTable = [...tableContent];
  //========================================   structurs =========================================
  const formStructure = [
    {
      label: "???? ????????",
      name: "courseCode",
      options: course,
      optionIdField: "courseId",
      optionLabelField: "courseCode",
      type: "multiselect",
      col: 3,
    },
    {
      label: "?????????? ????????",
      name: "title",
      type: "multiselect",
      options: course,
      optionIdField: "courseId",
      optionLabelField: "title",
      col: 3,
    },
    {
      label: "?????? ????????",
      name: "category",
      options: optionLists.courseCategory,
      type: "multiselect",
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "?????????? ????????????????",
      name: "titleAssessments",
      type: "multiselect",
      options: curriculum,
      optionIdField: "curriculumId",
      optionLabelField: "title",
      col: 3,
    },
    {
      label: "???????? ??????????????",
      name: "holdType",
      type: "multiselect",
      options: optionLists.holdType,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "?????????? ????????",
      name: "type",
      type: "multiselect",
      options: optionLists.courseType,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 3,
    },
    {
      label: "  ???????? ?????????????? ",
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
      label: "?????????? ???????? ????????",
      name: "fromDate",
      type: "date",
      col: 3,
    },
    {
      label: "?????????? ?????????? ????????",
      name: "thruDate",
      type: "date",
      col: 3,
    },
    {
      label: "?????????? ?????????? ????????????",
      name: "examDate",
      type: "date",
      col: 3,
    },
    {
      label: "????????",
      name: "companyName",
      type: "select",
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      options: organizationUnit.subOrgans,
      col: 3,
    },
  ];
  const tableCols = [
    {
      name: "courseCode",
      label: "???? ????????",
      type: "number",
      style: { minWidth: "110px" },
    },
    // {
    //   name: "priority",
    //   label: "??????????",
    //   type: "number",
    //   style: { minWidth: "110px" },
    // },
    {
      name: "enumCategory",
      label: "?????? ????????",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "title",
      label: "?????????? ????????",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "enumType",
      label: "?????????? ????????",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "fromDate",
      label: "?????????? ????????",
      type: "date",
      style: { minWidth: "110px" },
    },
    {
      name: "thruDate",
      label: "?????????? ??????????",
      type: "date",
      style: { minWidth: "110px" },
    },
    {
      name: "InstituteName",
      label: "?????????? ?????????? ??????????",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name: "teacher",
      label: "???????? ????????",
      type: "render",
      render: (row) => {
        return `${row.firstName || ""} ${row.lastName || ""}`;
      },
      style: { minWidth: "110px" },
    },
    {
      name: "cost",
      label: "?????????? ????????",
      type: "number",
      style: { minWidth: "110px" },
    },
    // {
    //   name: "offer",
    //   label: "?????????????? ??????????????",
    //   type: "text",
    //   style: { minWidth: "110px" },
    // },
    {
      name: "implementationStatus",
      label: "?????????? ??????????????",
      type: "text",
      style: { minWidth: "110px" },
    },
    {
      name : "cancel" ,
      label: "?????? ???? ??????????",
      type: "text",
      style: { width: "fit-content"},
    },
    {
      name : "determineCourseManager" ,
      label: "?????????? ?????????? ????????",
      type: "text",
      style: { width: "fit-content"},
    },
    {
      name : "courseImplementation" ,
      label: "?????????????? ????????",
      type: "text",
      style: { width: "fit-content"},
    },
    {
      name : "courseEvaluation" ,
      label: "?????????????? ????????",
      type: "text",
      style: { width: "fit-content"},
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
          courseType: enums.CourseType ? enums.CourseType.filter(o=>o.enumId != "temporarily") : [],
        };
        setOptionLists(optionLists);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
          )
        );
      });
  }
  function getCourse() {
    axios
      .get(SERVER_URL + "/rest/s1/training/entity/Course?pageSize=10000000", axiosKey)
      .then((res) => {
        setCourse(  res.data.filter((o) => o.title && (organizationUnit.subOrgansPartyIdArray.indexOf(o.companyPartyId) >= 0) && o.type != "temporarily"));
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
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
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
          )
        );
      });
  }
  function getOrgUnit() {
    let listMap = ["unit" , "orgs"];
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap,
        axiosKey
      )

      .then((res) => {
        if(res.data.contacts.orgs.length != 0){
          let partyArray = []
          res.data.contacts.orgs.map((e,i)=>{
            partyArray.push(e.partyId)
            if(i === res.data.contacts.orgs.length-1){
              const orgMap = {
                units: res.data.contacts.unit,
                subOrgans: res.data.contacts.orgs,
                subOrgansPartyIdArray: partyArray
              };
              setOrganizationUnit(orgMap);
            }
          })
        }
        else{
          const orgMap = {
            units: res.data.contacts.unit,
            subOrgans: res.data.contacts.orgs,
            subOrgansPartyIdArray:[]
          };
          setOrganizationUnit(orgMap);
        }
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
          )
        );
      });
  }
  function filter() {
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
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/training/filteredCourses",
        { typeAssessments: typeAssessments, statusCu: statusCu, data: data, getCompanyInfo: reset ? true : false },
        axiosKey
      )
      .then((res) => {
        setLoading(false);
        setReset(false)
        const result = res.data.result;
        if(result.length != 0){
          let tableData = []
          result.map((ele,ind) => {
            ele.cancel = ""
            ele.determineCourseManager = ""
            ele.courseImplementation = ""
            ele.courseEvaluation = ""
            ele.implementationStatus = res.data.implementationStatus[ind]
            tableData.push(ele)
            if (ind == result.length-1){
              setTableContent(result);
            }
          })
        }
        else{
          setTableContent(result);
        }
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
          )
        );
      });
  }

  function triggerBtn(operation) {
    setOperation(operation);
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
      let curriculumCourse = {
        curriculumCourseId: course.curriculumCourseId,
        status: status,
      };
      courseIds.push(course.curriculumCourseId);
      courses.push(curriculumCourse);
    });
    axios
      .put(
        SERVER_URL + "/rest/s1/training/entity/CurriculumCourse",
        courses,
        axiosKey
      )
      .then((res) => {
        for (let i = 0; i < courseIds.length; i++) {
          courseTable.forEach((course) =>
            course.curriculumCourseId == courseIds[i]
              ? (course.statusDescription = desc)
              : course.statusDescription
          );
        }
        setTableContent(courseTable);
        setSelectedRows([]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "?????????? ???? ???????????? ?????????? ????.")
        );
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "?????????? ???? ???????????? ?????????????? ???? ???????? ??????."
          )
        );
      });
  }

  //========================================   useEffect =========================================
  useEffect(() => {
    getEnums();
    getOrgUnit();
    getCurriculum();
    filter();
  }, []);
  useEffect(() => {
    if(organizationUnit?.subOrgansPartyIdArray){
      console.log("organizationUnit.subOrgansPartyIdArray" , organizationUnit.subOrgansPartyIdArray);
      getCourse();
    }
  }, [organizationUnit?.subOrgansPartyIdArray]);
  useEffect(() => {
    if (operation != "") courseStateUpdate(operation);
  }, [operation]);
  useEffect(() => {
    if(selectedRows.length != 0 && storeSelectedRow.length !=0 ){
      if(selectedRows[0] == storeSelectedRow[0]){
        setSelectedRows([])
        setStoreSelectedRow([])
      }
      else{
        setStoreSelectedRow(selectedRows)
      }
    }
    else{
      setStoreSelectedRow(selectedRows)
    }
  }, [selectedRows]);
  useEffect(() => {
    if (reset) filter();
  }, [reset]);
  const handleReset = () => {
    setFormValues({})
    setReset(true)

  }
  return (
    <Box>
      <Card variant="outlined">
        <TablePro
          title={title}
          columns={tableCols}
          rows={tableContent}
          selectable={selectable}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          singleSelect={singleSelect}
          selectable
          loading={loading}
          filter="external"
          filterForm={
            <FormPro
              append={formStructure}
              formValues={formValues}
              setFormValues={setFormValues}
              submitCallback={filter}
              resetCallback={handleReset}
              actionBox={
                <ActionBox>
                  <Button type="submit" role="primary">
                    ??????????
                  </Button>
                  <Button type="reset" role="secondary" >??????</Button>
                </ActionBox>
              }
            />
          }
          rowActions={[
            {
              title: "?????? ???? ??????????",
              icon: CancelIcon,
              onClick: (row) => {
                showCancelModal(row);
              },
              style : {width : "135px"}
            },
            {
              title: "?????????? ?????????? ????????",
              icon: PersonAddIcon,
              onClick: (row) => {
                showModal(row);
              },
              style : {width : "140px"}
            },
            {
              title: "?????????????? ????????",
              icon: CastForEducationIcon,
              onClick: (row) => {
                showModalHoldingCourse(row);
              },
              display: (row) => row.status !== "Approved", 
              style : {width : "125px"}
            },
            // {
            //   title: "?????????????? ????????",
            //   icon: AssessmentIcon,
            //   onClick: (row) => {
            //     classAssessment(row);
            //   },
            // },
            {
              title: "?????????????? ????????",
              icon: PlaylistAddCheckIcon,
              onClick: (row) => {
                courseAssessment(row);
              },
              style : {width : "75px"}
            },
            
          ]}
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
              disabled={selectedRows.length === 0 ? true : false}
              onClick={() => triggerBtn("conf")}
            >
              ??????????
            </Button>
            <Button
              type="button"
              style={{
                display: reject ? "block" : "none",
              }}
              role="secondary"
              disabled={selectedRows.length === 0 ? true : false}
              onClick={() => triggerBtn("rej")}
            >
              ????
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
              disabled={selectedRows.length < 2 ? true : false}
              onClick={submitExtrabtn}
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
