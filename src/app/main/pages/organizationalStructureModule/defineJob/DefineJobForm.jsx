import React, { useState } from "react";
import { Button } from "@material-ui/core";
import UserFullName from "../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../components/formControls/UserEmplPosition";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import { useDispatch } from "react-redux";
import UserCompany from "../../../components/formControls/UserCompany";

const DefineJobForm = ({
  actionObject,
  setActionObject,
  tableContent,
  setTableContent,
  data,
}) => {
  const dispatch = useDispatch();
  let moment = require("moment-jalaali");
  const formDefaultValues = {
    createDate: moment().format("Y-MM-DD"),
  };
  const [formValues, setFormValues] = React.useState(formDefaultValues);
  const [formValidation, setFormValidation] = useState({});

  React.useEffect(() => {
    if (!formValues["jobCategoryEnumId"]) {
      setFormValues((prevState) => ({
        ...prevState,
        jobSubCategoryEnumId: null,
      }));
    }
  }, [formValues["jobCategoryEnumId"]]);

  React.useEffect(() => {
    if (actionObject) {
      getJob(actionObject);
    } else {
      setFormValues(formDefaultValues);
      // resetFormValues()
    }
  }, [actionObject]);

  const formStructure = [
    {
      label: "تاریخ ایجاد",
      name: "createDate",
      type: "display",
      options: "Date",
    },
    {
      type: "component",
      component: <UserCompany />,
    },
    {
      type: "component",
      component: <UserFullName label="نام و نام خانوادگی تهیه کننده" />,
    },
    {
      label: "پست سازمانی تهیه کننده",
      name: "producerEmplPositionId",
      type: actionObject ? "display" : "select",
      options: actionObject ? "EmplPosition" : "UserEmplPosition",
      optionIdField: "emplPositionId",
      required: true,
    },
    {
      label: "کد شغل",
      name: "jobCode",
      type: "text",
      required: true,
    },
    {
      label: "عنوان شغل",
      name: "jobTitle",
      type: "text",
      required: true,
    },
    {
      label: "رسته شغلی",
      name: "jobCategoryEnumId",
      type: "select",
      options: "JobCategory",
      filterOptions: (options) => options.filter((o) => !o["parentEnumId"]),
    },
    {
      label: "رسته فرعی شغلی",
      name: "jobSubCategoryEnumId",
      type: "select",
      options: "JobCategory",
      filterOptions: (options) =>
        options.filter(
          (o) =>
            formValues["jobCategoryEnumId"] &&
            o["parentEnumId"] === formValues["jobCategoryEnumId"]
        ),
    },
    {
      label: "جنسیت",
      name: "gender",
      type: "select",
      options: "Gender",
      appendOptions: [{ enumId: "B", description: "هر دو" }],
    },
    {
      label: "میزان تجربه کاری (سال)",
      name: "workExperience",
      type: "number",
      // min:    0,
      // max:    99,
    },
    {
      label: "محدوده سنی",
      name: "age",
      type: "range",
      min: 18,
      max: 80,
      col: { sm: 8, md: 6 },
    },
    //     {
    //     type:   "component",
    //     component: <Grid item xs={false} sm={8} md={6}/>,
    //     grid:   false
    // },
    {
      label: "شرح شغل",
      name: "jobDescription",
      type: "textarea",
      col: 6,
    },
    {
      label: "هدف شغل",
      name: "jobTarget",
      type: "textarea",
      col: 6,
    },
  ];

  function getJob(jobId) {
    axios
      .get(SERVER_URL + "/rest/s1/orgStructure/job?jobId=" + jobId, {
        headers: { api_key: localStorage.getItem("api_key") },
      })
      .then((res) => {
        let job = res.data.jobs[0];
        job.age = JSON.stringify([job.minAge, job.maxAge]);
        setFormValues(job);
      })
      .catch((err) => {
        console.log("get job error..", err);
      });
  }
  function handleSubmit() {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    const age = JSON.parse(formValues.age);
    let packet = Object.assign({}, formValues, {
      minAge: age[0],
      maxAge: age[1],
    });
    if (actionObject) {
      putJob(packet);
    } else {
      packet.producerPartyId = data.user.producerPartyId;
      packet.companyPartyId = data.user.companyPartyId;
      postJob(packet);
    }
  }
  function postJob(packet) {
    // console.log('postJob..',packet)
    axios
      .post(SERVER_URL + "/rest/s1/orgStructure/entity/Job", packet, {
        headers: { api_key: localStorage.getItem("api_key") },
      })
      .then((res) => {
        const newRow = {
          ...packet,
          jobId: res.data.jobId,
        };
        console.log("newRow..", newRow);
        setTableContent(tableContent.concat(newRow));
        setActionObject(newRow.jobId);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت  ثبت شد")
        );
      })
      .catch((err) => {
        console.log("post jobs error..", err);
      });
  }
  function putJob(packet) {
    // console.log('putJob..',actionObject,packet)
    axios
      .put(SERVER_URL + "/rest/s1/orgStructure/entity/Job", packet, {
        headers: { api_key: localStorage.getItem("api_key") },
      })
      .then(() => {
        const index = tableContent.findIndex((e) => e.jobId === packet.jobId);
        let newData = Object.assign([], tableContent);
        newData[index] = packet;
        // console.log('newData',newData)
        setTableContent(newData);
        setActionObject(null);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت  ثبت شد")
        );
      })
      .catch((err) => {
        console.log("post jobs error..", err);
      });
  }
  function handleReset() {
    setActionObject(null);
  }
  return (
    <FormPro
      append={formStructure}
      formValues={formValues}
      formDefaultValues={formDefaultValues}
      setFormValues={setFormValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={handleSubmit}
      resetCallback={handleReset}
      actionBox={
        <ActionBox>
          <Button type="submit" role="primary">
            {actionObject ? "ویرایش" : "افزودن"}
          </Button>
          <Button type="reset" role="secondary">
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
};

export default DefineJobForm;
