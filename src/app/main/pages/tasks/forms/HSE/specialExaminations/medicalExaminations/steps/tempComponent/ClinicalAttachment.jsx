import React, { useState, useEffect } from "react";
import { Card, Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../../store/actions/fadak";
import { SERVER_URL, AXIOS_TIMEOUT } from "configs";
import axios from "axios";
import { Image } from "@material-ui/icons";
import { useDispatch } from "react-redux";

const ClinicalAttachment = ({
  datas,
  setMedicalAttachment,
  medicalAttachment,
  tableTitle,
}) => {
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableCols = [
    {
      name: "observeFile",
      label: "دانلود فایل",
      style: { width: "50%" },
    },
  ];

  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);

  const getData = () => {
    if (medicalAttachment?.recommendation?.length > 0) {
      let tableDataArray = [];
      [...medicalAttachment?.recommendation].map((item, index) => {
        let data = {
          ...item,
          observeFile: (
            <Button
              variant="outlined"
              color="primary"
              href={
                SERVER_URL +
                "/rest/s1/fadak/getpersonnelfile1?name=" +
                item?.contentLocation
              }
              target="_blank"
            >
              {" "}
              <Image />{" "}
            </Button>
          ),
        };
        tableDataArray.push(data);
        if (index == medicalAttachment?.recommendation?.length - 1) {
          setTableContent(tableDataArray);
          setLoading(false);
        }
      });
    } else {
      setTableContent([]);
      setLoading(false);
    }
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      const filteredAttach = medicalAttachment?.recommendation.filter(
        (attach) => attach.contentLocation != row.contentLocation
      );
      setMedicalAttachment((prevState) => {
        return {
          ...prevState,
          recommendation: filteredAttach,
        };
      });
      setLoading(true);
      resolve();
    });
  };

  return (
    <Card>
      <TablePro
        title={tableTitle}
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        add="external"
        addForm={
          <AttachmentsForm
            loading={loading}
            setLoading={setLoading}
            medicalAttachment={medicalAttachment}
            setMedicalAttachment={setMedicalAttachment}
          />
        }
        removeCallback={handleRemove}
        loading={loading}
        fixedLayout
      />
    </Card>
  );
};
export default ClinicalAttachment;

function AttachmentsForm(restProps) {
  const { setMedicalAttachment, medicalAttachment, handleClose, setLoading } =
    restProps;
  const [formValues, setFormValues] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const contentIdFormData = new FormData();
  const dispatch = useDispatch();

  const config = {
    timeout: AXIOS_TIMEOUT,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      label: "پیوست",
      name: "contentLocation",
      type: "inputFile",
      col: 6,
    },
  ];

  const handleCreate = () => {
    if (formValues.contentLocation) {
      dispatch(
        setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات ...")
      );
      setWaiting(true);
      contentIdFormData.append("file", formValues.contentLocation);
      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/getpersonnelfile",
          contentIdFormData,
          config
        )
        .then((res) => {
          setWaiting(false);
          setMedicalAttachment((prevState) => {
            return {
              ...prevState,
              recommendation: medicalAttachment?.recommendation
                ? [
                    ...medicalAttachment?.recommendation,
                    {
                      contentLocation: res.data?.name,
                      medicalAttachEnumId: "SpDoctorAttach",
                    },
                  ]
                : [
                    {
                      contentLocation: res.data?.name,
                      medicalAttachEnumId: "SpDoctorAttach",
                    },
                  ],
            };
          });
          setFormValues({});
          handleClose();
          setLoading(true);
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد")
          );
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در ارسال اطلاعات !")
          );
          setWaiting(false);
        });
    } else {
      dispatch(
        setAlertContent(ALERT_TYPES.WARNING, "ابتدا یک فایل انتخاب کنید.")
      );
    }
  };

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={handleCreate}
      resetCallback={() => {
        setFormValues({});
        handleClose();
        setWaiting(false);
      }}
      actionBox={
        <ActionBox>
          <Button
            type="submit"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            {"افزودن"}
          </Button>
          <Button type="reset" role="secondary">
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
