import GetCourseInfoForm from "./GetCourseInfoForm";
import React, { useState, useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Box, Button, Card, Grid, CardContent } from "@material-ui/core";
import ModalPro from "../../../components/ModalPro";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import DeterminationResponsibleForm from "./DeterminationResponsibleForm";
import CancelNeedAssementForm from "./CancelNeedAssementForm";
import HoldingCourses from "./HoldingCourses";

const EducationCoursesForm = (props) => {
  const [btnBg, setBtnBg] = useState("#dddddd")
  const [formValues, setFormValues] = useState([]);
  const [bgColorCancel, setbgColorCancel] = useState("#dddddd")
  const [bgColorDelay, setbgColorDelay] = useState("#dddddd")
  const [FormValuesCancle, setFormValuesCancle] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalTitle, setModalTitle] = useState("")
  const [showModalManager, setShowModalManager] = useState(false)
  const [showModalCancel, setShowModalCancle] = useState(false)
  const [showModalMHoldingCourses, setShowModalMHoldingCourses] = useState(false)
  const [clearForm, setClearForm] = useState(false)
  const [personeFormValues, setPersoneFormValues] = useState([]);
  const [companyFormValues, setCompanyFormValues] = useState([]);
  const [deisable, setdeisable] = useState(true)
  const [showDependentTable, setShowDependentTable] = useState(false);
  const [checkDelay, setCheckDelay] = useState("N")
  const [checkCancle, setCheckCancle] = useState("N")
  const [btnDisable, setbtnDisable] = useState(true)
  const [cursorValue, setCursorValue] = useState("")
  const [btnColor, setbtnColor] = useState("#ddd")
  const [curriculumCourseIdValue, setCurriculumCourseIdValue] = useState([])
  const [checkPerson, setCheckPerson] = useState("N")
  const [checkCompany, setCheckCompany] = useState("N")

  const myElement = createRef(0);

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const dispatch = useDispatch();

  const showModal = () => {
    setClearForm(!clearForm)
    setShowModalManager(true)
    setShowModalCancle(false)
    setShowModalMHoldingCourses(false)

    setModalTitle("  تعیین مسئول دوره آموزشی")
    setShowDependentTable(true)
  }

  const showCancelModal = () => {
    setShowDependentTable(true)

    setShowModalCancle(true)
    setShowModalManager(false)
    setShowModalMHoldingCourses(false)
    setShowDependentTable(true)

    setModalTitle("  لغو یا تعویق دوره آموزشی")

  }
  const showModalHoldingCourse = () => {
    setShowModalMHoldingCourses(true)
    setShowDependentTable(true)

    setShowModalManager(false)
    setShowModalCancle(false)
    setModalTitle("    برگزاری دوره آموزشی")

  }
  const saveDetarmination = () => {
    const data = {
      curriculumCourseId: selectedRows[0]?.curriculumCourseId,
      courseId: selectedRows[0]?.courseId,
      pseudoId: personeFormValues?.pseudoId,
      emplPositionId: companyFormValues?.empPosition,
      partyId: companyFormValues?.personel,

    }
    if ((companyFormValues?.personel !== undefined && companyFormValues?.personel !== null) && (companyFormValues?.empPosition !== undefined && companyFormValues?.empPosition !== null) && checkCompany === "Y") {

      axios.put(SERVER_URL + "/rest/s1/training/saveDeterminationResponsible", { data: data }, axiosKey)
        .then((res) => {
          dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));

        }).catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات ذخیره نشد!'));
        });
      setPersoneFormValues([])
      setCompanyFormValues([])
      setCheckCompany("N")
      setCheckPerson("N")
    }

    else if (checkCompany === "Y") {
      myElement.current.click();

      dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فیلدهای ضروری را پر کنید'));

    }
    if (checkPerson === "Y") {

      axios.put(SERVER_URL + "/rest/s1/training/saveDeterminationResponsible", { data: data }, axiosKey)
        .then((res) => {
          dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));

        }).catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات ذخیره نشد!'));
        });
      setPersoneFormValues([])
      setCompanyFormValues([])
      setCheckCompany("N")
      setCheckPerson("N")

    }

  }
  useEffect(() => {
    if (selectedRows.length > 0) {
      setCurriculumCourseIdValue(selectedRows)

      // setdeisable(false)
      setCursorValue("pointer")
      setbtnColor("#FFF")
    }
    if (selectedRows.length == 0) {
      setdeisable(true)
    }
  }, [selectedRows]);


  const saveCancleNeedAssesment = () => {
    const cancleData = {
      curriculumCourseId: selectedRows[0]?.curriculumCourseId,
      courseId: selectedRows[0]?.courseId,
      fromDate: FormValuesCancle.fromDate,
      thruDate: FormValuesCancle.thruDate,
      fromTime: FormValuesCancle.fromTime,
      truTime: FormValuesCancle.truTime,
      // discription:FormValuesCancle.discription,
      status: checkCancle == "Y" && checkDelay == "N" ? "Cancelled" : "Postpone",

    }

    axios.post(SERVER_URL + "/rest/s1/training/saveCancelNeedAsessment", { data: cancleData }, axiosKey)
      .then((res) => {
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));

      }).catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, '   اطلاعات ذخیره نشد!'));
      });
    setFormValuesCancle([])

  }

  useEffect(() => {
    if (checkCancle === "Y" || checkDelay === "Y") {
      setBtnBg("#24a0ed")
      setbtnDisable(false)
    }
    else {
      setbtnDisable(true)
      setBtnBg("#dddddd")
    }


  }, [checkDelay, checkCancle]);

  useEffect(() => {

    setPersoneFormValues([])
    setCompanyFormValues([])

  }, [showModalManager, clearForm]);

  const cancle = () => {
    setFormValuesCancle([])


    if (checkCancle == "N") {
      setbgColorCancel("#FFF")
      setbgColorDelay("#dddddd")

      setCheckCancle('Y')
      setCheckDelay('N')

    }
    else {
      setbgColorCancel("#dddddd")

      setCheckCancle('N')
    }
  }

  const delaiy = () => {


    setbtnDisable(true)
    if (checkDelay == "N") {
      setbgColorDelay("#FFF")
      setbgColorCancel("#dddddd")

      setCheckDelay('Y')
      setCheckCancle('N')


    }
    else {
      setbgColorDelay("#dddddd")

      setCheckDelay('N')
    }
  }
  const styles = {
    btn: {
      margin: 10, height: 40, borderRadius: 5, width: 120, borderWidth: 0, boxShadow: "0 3px 5px 2px #cbd1ce", color: btnColor, cursor: cursorValue,

    },


  }

  const classAssessment = () => {

  }

  const courseAssessment = () => {

  }

  return (
    <Box>
      {/* <Grid direction="row" style={{ marginRight: 10 }}>
        <button style={{ ...styles['btn'], backgroundColor: "#CB2027" }} disabled={deisable} onClick={showCancelModal}>لغو با تعویق</button>
        <button style={{ ...styles['btn'], backgroundColor: "#95D03A" }} onClick={showModal} disabled={true}>  تعیین مسئول دوره </button>
        <button style={{ ...styles['btn'], backgroundColor: "#55acee" }} disabled={deisable} onClick={showModalHoldingCourse} > برگزاری دوره </button>
        <button style={{ ...styles['btn'], backgroundColor: "#4267B2" }} disabled={deisable}> ارزیابی کلاس </button>
        <button style={{ ...styles['btn'], backgroundColor: "orange" }} disabled={deisable}> ارزیابی دوره </button>

      </Grid> */}
      <CardContent>
        <GetCourseInfoForm
          singleSelect={true}
          setFormValues={setFormValues}
          formValues={formValues}
          title={"لیست دوره های سازمان"}
          // typeAssessments="Approved"
          typeAssessments="Curriculum"
          // statusCu="Inreview "
          statusCu="Approved "
          reject={false}
          confirm={false}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          showCancelModal={() => showCancelModal()}
          showModal={() => showModal()}
          showModalHoldingCourse={() => showModalHoldingCourse()}
          classAssessment={() => classAssessment()}
          courseAssessment={() => courseAssessment()}
        />

      </CardContent>
      <ModalPro
        title={modalTitle}
        titleBgColor={"#3C4252"}
        titleColor={"#dddddd"}
        open={showDependentTable}
        setOpen={setShowDependentTable}
        content={
          <Box>
            {showModalCancel == true ? <Box>
              <CancelNeedAssementForm
                btnBg={btnBg}
                setbgColorCancel={setbgColorCancel}
                bgColorDelay={bgColorDelay}
                bgColorCancel={bgColorCancel}
                saveCancleNeedAssesment={saveCancleNeedAssesment}
                FormValuesCancle={FormValuesCancle}
                handleCheckCancle={cancle}
                setFormValuesCancle={setFormValuesCancle}
                checkCancle={checkCancle}
                setCheckCancle={setCheckCancle}
                checkDelay={checkDelay}
                setCheckDelay={setCheckDelay}
                handleCheckDelay={delaiy}
                btnDisable={btnDisable} />
            </Box> : ""}
            {showModalManager ?
              <Box p={5}>
                <DeterminationResponsibleForm
                  myElement={myElement}
                  checkPerson={checkPerson}
                  setCheckPerson={setCheckPerson}
                  checkCompany={checkCompany}
                  setCheckCompany={setCheckCompany}
                  saveDetarmination={saveDetarmination}
                  setCompanyFormValues={setCompanyFormValues}
                  companyFormValues={companyFormValues}
                  personeFormValues={personeFormValues}
                  setPersoneFormValues={setPersoneFormValues} />
              </Box> : ""}
            {showModalMHoldingCourses == true ?
              <Box p={5}>
                <HoldingCourses selectedRows={selectedRows}
                  curriculumCourseIdValue={curriculumCourseIdValue}
                />
              </Box> : ""}
          </Box>
        }
      />
    </Box>
  );
};
export default EducationCoursesForm;
