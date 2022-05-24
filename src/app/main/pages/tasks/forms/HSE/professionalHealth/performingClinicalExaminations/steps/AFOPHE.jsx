import { Card, CardContent, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SERVER_URL, AXIOS_TIMEOUT } from "configs";
import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../store/actions/fadak";
import checkPermis from "app/main/components/CheckPermision";
import { Image } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-jalaali";

const AFOPHE = ({
  setMedicalAttachment,
  medicalAttachment,
  medicalNote,
  setMedicalNote,
}) => {
  const occupationalExaminationDate = moment(new Date().getTime()).format(
    "YYYY-MM-DD"
  );

  const [formValues, setFormValues] = useState({
    ...medicalNote,
    occupationalExaminationDate,
  });
  const datas = useSelector(({ fadak }) => fadak);

  const formStructure = [
    {
      name: "occupationalExaminationDate",
      label: "تاریخ تکمیل",
      type: "date",
      disabled: true,
      col: 3,
    },
    {
      name: "MNTHealth",
      label: "توضیحات نهایی و ملاحظات کارشناس بهداشت حرفه ای",
      type: "textarea",
      col: 12,
    },
  ];

  useEffect(() => {
    setMedicalNote((prevState) => {
      return { ...prevState, MNTHealth: formValues.MNTHealth };
    });
  }, [formValues.MNTHealth]);

  return (
    <Card>
      <CardContent>
        <FormPro
          prepend={formStructure}
          formValues={formValues}
          setFormValues={setFormValues}
        />
        <CardContent>
          <Attachment
            datas={datas}
            medicalAttachment={medicalAttachment}
            setMedicalAttachment={setMedicalAttachment}
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default AFOPHE;

function Attachment({ setMedicalAttachment, medicalAttachment, datas }) {
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableCols = [
    { name: "observeFile", label: "دانلود فایل", style: { width: "50%" } },
  ];

  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);

  const getData = () => {
    if (medicalAttachment?.FinalOccuational?.length > 0) {
      let tableDataArray = [];
      [...medicalAttachment?.FinalOccuational].map((item, index) => {
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
        if (index == medicalAttachment?.FinalOccuational?.length - 1) {
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
      const filteredAttach = medicalAttachment?.FinalOccuational.filter(
        (attach) => attach.contentLocation != row.contentLocation
      );
      setMedicalAttachment((prevState) => {
        return {
          ...prevState,
          FinalOccuational: filteredAttach,
        };
      });
      setLoading(true);
      resolve();
    });
  };

  return (
    <TablePro
      title="پیوست مدارک"
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
  );
}

function AttachmentsForm(restProps) {
  const { setMedicalAttachment, medicalAttachment, handleClose, setLoading } =
    restProps;
  const [formValues, setFormValues] = useState({});
  const [waiting, setWaiting] = useState(false);
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
              FinalOccuational: medicalAttachment?.FinalOccuational
                ? [
                    ...medicalAttachment?.FinalOccuational,
                    {
                      contentLocation: res.data?.name,
                      medicalAttachEnumId: "FinalOccuational",
                    },
                  ]
                : [
                    {
                      contentLocation: res.data?.name,
                      medicalAttachEnumId: "FinalOccuational",
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
