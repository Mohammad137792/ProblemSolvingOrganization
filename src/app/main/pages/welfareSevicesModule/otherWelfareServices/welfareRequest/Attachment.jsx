import React, { useState, useEffect } from "react";
import { Card, Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { SERVER_URL, AXIOS_TIMEOUT } from "configs";
import axios from "axios";
import { Image } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";

const Attachment = ({
  datas,
  title = "پیوست",
  setAttachments,
  attachments,
  partyContentType,
}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const tableCols = [
    {
      name: "observeFile",
      label: "دانلود فایل",
      style: { width: "50%" },
    },

    {
      name: "welfareDocEnum",
      label: "نوع مدرک",
      style: { width: "50%" },
    },
  ];

  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);

  const getData = () => {
    if (attachments?.length > 0) {
      let tableDataArray = [];
      [...attachments].map((item, index) => {
        let data = item?.contentLocation
          ? {
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
            }
          : { ...item };
        tableDataArray.push(data);
        if (index == attachments?.length - 1) {
          setAttachments(tableDataArray);
          setLoading(false);
        }
      });
    } else {
      setAttachments([]);
      setLoading(false);
    }
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      const filteredAttach = attachments.filter(
        (attach) => attach.contentLocation != row.contentLocation
      );
      setAttachments(filteredAttach);
      setLoading(true);
      resolve();
    });
  };

  return (
    <Card>
      <TablePro
        title={title}
        columns={tableCols}
        rows={attachments}
        setRows={setAttachments}
        add="external"
        addForm={
          <AttachmentsForm
            loading={loading}
            setLoading={setLoading}
            attachments={attachments}
            setAttachments={setAttachments}
            partyContentType={partyContentType}
          />
        }
        removeCallback={handleRemove}
        loading={loading}
        fixedLayout
      />
    </Card>
  );
};
export default Attachment;

function AttachmentsForm(restProps) {
  const {
    setAttachments,
    attachments,
    handleClose,
    setLoading,
    partyContentType,
  } = restProps;
  const [formValues, setFormValues] = useState({});
  const [waiting, setWaiting] = useState(false);
  const contentIdFormData = new FormData();
  const dispatch = useDispatch();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const config = {
    timeout: AXIOS_TIMEOUT,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "welfareDocEnumId",
      label: "نوع مدرک",
      type: "text",
    //   options: partyContentType,
    //   optionLabelField: "description",
    //   optionIdField: "enumId",
      required: true,

      col: 6,
    },
    {
      label: "پیوست",
      name: "contentLocation",
      type: "inputFile",
      col: 6,
    },
  ];

  const handleCreate = () => {
    if (formValues.contentLocation && formValues.welfareDocEnumId) {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال فایل ..."));
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
          setAttachments((prevState) => {
            return [
              ...prevState,

              {
                contentLocation: res.data?.name,
                welfareDocEnumId: formValues.welfareDocEnumId,
                welfareDocEnum: partyContentType?.find(
                  (enm) => enm.enumId == formValues?.welfareDocEnumId
                )?.description,
              },
            ];
          });
          setFormValues({});
          handleClose();
          setLoading(true);
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت بارگذاری شد")
          );
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در بارگذاری فایل !")
          );
          setWaiting(false);
        });
    } else {
      dispatch(
        setAlertContent(ALERT_TYPES.WARNING, "فایل و نوع مدرک را انتخاب کنید")
      );
    }
  };

  const handleReset = () => {
    setFormValues({});
    handleClose();
    setWaiting(false);
  };

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      actionBox={
        <ActionBox>
          <Button
            type="button"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
            onClick={handleCreate}
          >
            {"افزودن"}
          </Button>
          <Button type="button" role="secondary" onClick={handleReset}>
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
