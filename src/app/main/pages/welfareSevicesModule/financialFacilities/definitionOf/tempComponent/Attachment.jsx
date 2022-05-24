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
} from "../../../../../../store/actions/fadak";
import { SERVER_URL, AXIOS_TIMEOUT } from "configs";
import axios from "axios";
import { Image } from "@material-ui/icons";
import { useDispatch } from "react-redux";

const Attachment = ({ datas, setAttachments, attachments, welfareId }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

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
    if (attachments?.length > 0) {
      let tableDataArray = [];
      [...attachments].map((item, index) => {
        let data = {
          ...item,
          observeFile: checkPermis(
            "welfareServices/financialFacilities/definitionOfFinancialFacilitation/downloadAttach",
            datas
          ) && (
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
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/welfareContent?welfareContentId=${row?.welfareContentId}`,
          axiosKey
        )
        .then((res) => {
          const filteredAttach = attachments.filter(
            (attach) => attach.welfareContentId != row.welfareContentId
          );
          setAttachments(filteredAttach);
          setLoading(true);
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف فایل!"));
          reject();
        });
    });
  };

  return (
    <Card>
      <TablePro
        title="پیوست"
        columns={tableCols}
        rows={attachments}
        setRows={setAttachments}
        add={
          checkPermis(
            "welfareServices/financialFacilities/definitionOfFinancialFacilitation/uploadAttach",
            datas
          ) && "external"
        }
        addForm={
          <AttachmentsForm
            loading={loading}
            setLoading={setLoading}
            attachments={attachments}
            setAttachments={setAttachments}
            welfareId={welfareId}
          />
        }
        removeCallback={(row) =>
          checkPermis(
            "welfareServices/financialFacilities/definitionOfFinancialFacilitation/removeAttach",
            datas
          ) && handleRemove(row)
        }
        loading={loading}
        fixedLayout
      />
    </Card>
  );
};
export default Attachment;

function AttachmentsForm(restProps) {
  const { setAttachments, attachments, handleClose, setLoading, welfareId } =
    restProps;
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
          axios
            .post(
              SERVER_URL + "/rest/s1/welfare/welfareContent",
              { contentLocation: res.data?.name, welfareId: welfareId },
              axiosKey
            )
            .then((finalRes) => {
              setAttachments((prevState) => {
                return [
                  ...prevState,
                  {
                    welfareContentId: finalRes.data?.welfareContentId,
                    contentLocation: res.data?.name,
                    welfareContentTypeEnumId: "LoanContent",
                  },
                ];
              });
              dispatch(
                setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت ذخیره شد.")
              );
              setFormValues({});
              handleClose();
              setWaiting(false);
              setLoading(true);
            })
            .catch(() => {
              dispatch(
                setAlertContent(ALERT_TYPES.ERROR, "خطا در ذخیره فایل!")
              );
              setWaiting(false);
            });
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ارسال فایل !"));
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
