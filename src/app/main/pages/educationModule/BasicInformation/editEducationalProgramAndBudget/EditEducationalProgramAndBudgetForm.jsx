import React, { useState, createRef } from "react";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import FormPro from "../../../../components/formControls/FormPro";
import VerificationLevelPanel from "./VerificationLevelPanel";
import { Button, CardContent } from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import { SERVER_URL } from "../../../../../../configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { useDispatch } from "react-redux";
import TablePro from "app/main/components/TablePro";
import { useHistory } from "react-router-dom";
import CastForEducationIcon from "@material-ui/icons/CastForEducation";
import moment from "moment-jalaali";
import CircularProgress from "@material-ui/core/CircularProgress";



const EditEducationalProgramAndBudgetForm = (props) => {
  const { myScrollElement } = props;
  const pageHistory = useHistory();
  //$&$&$&$&$&$&...........................متغیرهایی که از طریف استیت مقداردهی خواهند شد....................................$&$&$&$&$&$&
  const [formValues, setFormValues] = useState({});
  // const [formValues1, setFormValues1] = useState({});

  const [verificationId, setVerificationId] = useState("");
  const [curriculumId, setCurriculumId] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableContent, setTableContent] = React.useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [formValidation, setFormValidation] = React.useState({});
  const [ownerPartyId, setOwnerPartyId] = useState("");
  const [clicked, setClicked] = useState(0);
  const [cancelClicked, setCancelClicked] = useState(0);
  const [verificationTableContent, setVerificationTableContent] = React.useState([]);

  const [waiting, set_waiting] = useState(false) 
  const [processWaiting,setProcessWaiting] = useState(false) 

  const dispatch = useDispatch();
  const submitRef = createRef(0);
  const cancelRef = createRef(0);

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  //$&$&$&$&$&$&.......................متغیر ها............................$&$&$&$&$&$&
  const formStructure = [
    {
      name: "code",
      label: "کد برنامه آموزشی",
      type: "text",
      required: true,
      col: 2,
      validator: values=>{
        const ind = tableContent.findIndex(i=>i.code == values.code && i.curriculumId != values.curriculumId ) 
        return new Promise(resolve => {
            if(ind > -1){
                resolve ({error: true, helper: "کد وارد شده تکراری است."})
            }else{
                resolve({error: false, helper: ""})
            }
        })
      }
    },
    {
      name: "title",
      label: "عنوان برنامه آموزشی",
      type: "text",
      required: true,
      col: 3,
    },
    {
      name: "emplPositionId",
      label: "مسئول تدوین برنامه آموزشی",
      type: "select",
      options: responsibles,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      required: true,
      col: 3,
    },
    {
      name: "fromDate",
      label: "تاریخ شروع",
      type: "date",
      required: true,
      col: 2,
    },
    {
      name: "thruDate",
      label: "تاریخ پایان",
      type: "date",
      required: true,
      col: 2,
    },
  ];
  const tableCols = [
    { name: "code", label: "کد برنامه", type: "text" },
    { name: "title", label: "عنوان برنامه", type: "text" },
    { name: "fromDate", label: "تاریخ شروع", type: "date" },
    { name: "thruDate", label: "تاریخ پایان", type: "date" },
    { name: "emplPositionId", label: "مسئول تدوین برنامه", type: "text" },
    { name: "status", label: "وضعیت برنامه", type: "text" },
  ];
  const scrollToTop = () => {
    myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
  };

  //$&$&$&$&$&$&......................._____  useEffect  _____. ...........................$&$&$&$&$&$&

  React.useEffect(() => {
    if(loading){
      getAssessments();
      addRow();
      setVerificationId("")
      setEdit(false)
    }
  }, [loading]);

  React.useEffect(() => {
    if((formValues?.code && formValues?.code != "") && (formValues?.title && formValues?.title != "") && (formValues?.emplPositionId && formValues?.emplPositionId != "") && (formValues?.fromDate && formValues?.fromDate != "") && (formValues?.thruDate && formValues?.thruDate != "") && !edit){
      getVerificationId()
    }
  }, [formValues]);

  React.useEffect(() => {
    if(verificationId && submitRef.current && clicked > 0 && verificationTableContent.length == 0){
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "لطفا سلسله مراتب تایید را تعیین کنید !"))
    }
    // if (submitRef.current && clicked > 0 &&  verificationTableContent.length != 0) {
    //   submitRef.current.click();
    // }
  }, [clicked]);

  React.useEffect(() => {
    if (cancelRef.current && cancelClicked > 0) {
      cancelRef.current.click();
    }
  }, [cancelClicked]);

  //$&$&$&$&$&$&.................................._____  functions  _____.......................................$&$&$&$&$&$&

  function curriculumAdd() {
    if(verificationTableContent.length == 0){
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "لطفا سلسله مراتب تایید را تعیین کنید !"))
    }
    else{
    set_waiting(true)
    dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
    axios
      .post(
        SERVER_URL + "/rest/s1/training/entity/Curriculum",
        {
          emplPositionId: formValues.emplPositionId,
          fromDate: formValues.fromDate,
          thruDate: formValues.thruDate,
          code: formValues.code,
          title: formValues.title,
          type: "Curriculum",
          verificationId: verificationId,
          companyPartyId: ownerPartyId,
          status : "Created"
        },
        axiosKey
      )
      .then((res) => {
        axios.post(`${SERVER_URL}/rest/s1/training/handleVerification?verificationId=${verificationId}` , {data : verificationTableContent }, axiosKey).then(res => {
            dispatch(
              setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت  ثبت شد")
            );
            setLoading(true)
            setFormValues([]);
            set_waiting(false)
          })
          .catch((res) => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
          });
        }).catch((res) => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
          set_waiting(false)
        });
      }
  }
  // ============================================================
  function curriculumEdit() {
    if(verificationTableContent.length == 0){
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "لطفا سلسله مراتب تایید را تعیین کنید !"))
    }
    else{
      set_waiting(true)
      dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
      axios
        .put(
          SERVER_URL +
            "/rest/s1/training/entity/Curriculum?curriculumId=" +
            curriculumId,
          {
            emplPositionId: formValues.emplPositionId,
            fromDate: formValues.fromDate,
            thruDate: formValues.thruDate,
            code: formValues.code,
            title: formValues.title,
          },
          axiosKey
        )
        .then((res) => {
          axios.post(`${SERVER_URL}/rest/s1/training/handleVerification?verificationId=${verificationId}` , {data : verificationTableContent }, axiosKey).then(res => {
              setFormValues([]);
              dispatch(
                setAlertContent(ALERT_TYPES.SUCCESS, "دوره با موفقیت  ویرایش شد")
              );
              setLoading(true)
              set_waiting(false)
          }).catch((res) => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
          });
        })
        .catch((res) => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
          set_waiting(false)
        });
    }
   
  }
  function handleRemove(row) {
    return new Promise((resolve, reject) => {
      let config = {
        method: "delete",
        url: `${SERVER_URL}/rest/s1/training/entity/Curriculum?curriculumId=${row.curriculumId}`,
        headers: { api_key: localStorage.getItem("api_key") },
      };
      axios(config)
        .then((response) => {
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "دوره با موفقیت  حذف شد")
          );
          setLoading(true);

          resolve();
        })
        .catch((erro) => {
          reject("حذف دوره با خطا مواجه شد.");
        });
    });
  }
  // ============================================================
  function handleEdit(row) {
    if(row.status == "Created"){
      let config = {
        method: "get",
        url: `${SERVER_URL}/rest/s1/training/entity/Curriculum?curriculumId=${row.curriculumId}`,
        headers: { api_key: localStorage.getItem("api_key") },
      };
      axios(config).then((response) => {
        setEdit(true);
        setCurriculumId(row.curriculumId);
        const editRow = { ...row };
        if(editRow.emplPositionId){
          editRow.emplPositionId = editRow.emplPositionId.split(" ")[0];
        }
        setFormValues(editRow);
        setVerificationId(row.verificationId);
        scrollToTop();
      });
    }
    else{
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "امکان ویرایش این ردیف وجود ندارد !"))
      return null
    }
  }
  // ============================================================
  function getAssessments() {
    axios
      .get(
        SERVER_URL + "/rest/s1/training/getEmplPositionForOrganizationType",
        { headers: { api_key: localStorage.getItem("api_key") } }
      )
      .then((res) => {
        setResponsibles(res.data.responsibles);
        setOwnerPartyId(res.data.ownerPartyId);
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
  // ============================================================
  function addRow() {
    axios
      .get(SERVER_URL + "/rest/s1/training/getCurriculum", {
        headers: { api_key: localStorage.getItem("api_key") },
      })
      .then((res) => {
        if (res.data) {
          let assessments = res.data.assessments;
          for (let i = 0; i < assessments; i++) {
            assessments[i].fromDate = moment(assessments[i].fromDate)
              .locale("fa", { useGregorianParser: true })
              .format("jYYYY/jMM/jDD");
            assessments[i].thruDate = moment(assessments[i].thruDate)
              .locale("fa", { useGregorianParser: true })
              .format("jYYYY/jMM/jDD");
          }
          setTableContent(assessments);
          setLoading(false);
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
  // ============================================================
  function getVerificationId() {
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/entity/Verification",
        { type: "CurriculumVerification" },
        axiosKey
      )
      .then((res) => {
        setVerificationId(res.data.verificationId);
      })
      .catch((res) => {});
  }

  function trigerHiddenSubmitBtn() {
    submitRef.current.click();
    setClicked(clicked + 1);
  }
  
  function trigerHiddenCancelBtn() {
    setCancelClicked(cancelClicked + 1);
  }

  function initiateProcess(row) {
    if(row.status == "Created"){
      setProcessWaiting(true)
      const editRow = { ...row };
      editRow.emplPositionDescription = editRow.emplPositionId
      editRow.emplPositionId = editRow.emplPositionId.split(" ")[0];
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات..."));
      axios
        .post(
          SERVER_URL + "/rest/s1/training/initiateApproval",
          {
            processType: "ProgramAndBudget",
            assessment: editRow,
          },
          axiosKey
        )
        .then((res) => {
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "عملیات با موفقیت انجام شد.")
          );
          addRow();
          setProcessWaiting(false)
        })
        .catch((res) => {
          setProcessWaiting(false)
        });
    }
    else{
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "امکان شروع فرایند برای این ردیف وجود ندارد !"))
      return null
    }
  }

  function handleReset() {
    setLoading(true)
    set_waiting(false)
  }

  //$&$&$&$&$&$&................................نمایش صفحه ........................................$&$&$&$&$&$&
  return (
      <Card>
        <CardContent>
          <Card>
            <CardHeader title="تعریف برنامه آموزشی" />
            <CardContent>
              <FormPro
                id="top"
                formValues={formValues}
                setFormValues={setFormValues}
                append={formStructure}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={edit ? curriculumEdit : curriculumAdd}
                resetCallback={handleReset}
                actionBox={
                  <ActionBox>
                    <Button
                      ref={submitRef}
                      type="submit"
                      role="primary"
                      style={{ display: "none" }}
                    />
                    <Button
                     ref={cancelRef}
                     type="reset"
                     role="secondary"
                     style={{ display: "none" }} 
                     />
                  </ActionBox>
                }
              />
            </CardContent>
            {formValues.code &&
            formValues.title &&
            formValues.emplPositionId &&
            formValues.fromDate &&
            formValues.thruDate ? (
              <CardContent>
                <VerificationLevelPanel verificationId={verificationId} title={"لیست مراتب تایید"} verificationTableContent={verificationTableContent} setVerificationTableContent={setVerificationTableContent} />
              </CardContent>
            ) : null}
            <CardContent>
              <div
                style={{display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  style={{
                    width: "70px",
                    color: "secondary",
                  }}
                  variant="outlined"
                  type="reset"
                  role="secondary"
                  onClick={trigerHiddenCancelBtn}
                >
                  {" "}لغو{" "}
                </Button>
                <Button
                  style={{
                    width: 120,
                    color: "white",
                    backgroundColor: "#039be5",
                    marginRight: "8px",
                  }}
                  variant="outlined"
                  type="submit"
                  role="primary"
                  onClick={trigerHiddenSubmitBtn}
                  disabled={waiting}
                  endIcon={waiting?<CircularProgress size={20}/>:null}
                >
                  {" "}
                  {edit ? "ویرایش" : "افزودن"}{" "}
                </Button>
              </div>
            </CardContent>
          </Card> 
          <Box m={2}/>
          <Card>
            <CardContent>
              <TablePro
                title=" برنامه های ایجاد شده "
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                removeCondition={(row) => row.status === "Created"}
                editCondition ={(row) => row.status === "Created"}
                editCallback={handleEdit}
                edit={"callback"}
                removeCallback={handleRemove}
                rowActions={[
                  {
                    title: "شروع فرآیند",
                    icon: CastForEducationIcon,
                    display: (row) => row.status === "Created",
                    onClick: (row) => {
                      initiateProcess(row);
                    },
                    waiting : processWaiting
                  },
                ]}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
  );
};
export default EditEducationalProgramAndBudgetForm;
