import React, { useState, useEffect } from "react";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL, AXIOS_TIMEOUT } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import Attachment from "./tempComponent/Attachment";
import { Image } from "@material-ui/icons";

export default function Documents({
  submitWaiting,
  borrowerTable,
  setBorrowerTable,
  guarantorTable,
  setGuarantorTable,
  inResponsibleStep,
}) {
  const [guarantorformValues, setGuarantorFormValues] = useState({});
  const [borrowerformValues, setBorrowerFormValues] = useState({});
  const [guarantorLoading, setGuarantorLoading] = useState(false);
  const [borrowerLoading, setBorrowerLoading] = useState(false);

  const guarantorCols = [
    {
      name: "guarantorTypeEnum",
      label: "نوع ضامن",
      type: "text",
    },
    {
      name: "welfareDocEnum",
      label: "مدارک موردنیاز ضامن",
      type: "text",
    },
    {
      name: "status",
      label: "وضعیت",
      type: "text",
    },
  ];

  const borrowerCols = [
    {
      name: "welfareDocEnum",
      label: "مدرک موردنیاز",
      type: "text",
    },
    {
      name: "observeFile",
      label: "دانلود فایل",
      style: { width: "50%" },
    },
    {
      name: "status",
      label: "وضعیت",
      type: "text",
    },
  ];

  const getBorrowerAttach = () => {
    setBorrowerLoading(true);
    if (borrowerTable?.length > 0) {
      let tableDataArray = [];
      [...borrowerTable].map((item, index) => {
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
        if (index == borrowerTable?.length - 1) {
          setBorrowerTable(tableDataArray);
          setBorrowerLoading(false);
        }
      });
    } else {
      setBorrowerTable([]);
      setBorrowerLoading(false);
    }
  };

  useEffect(() => {
    if (inResponsibleStep) {
      getBorrowerAttach();
    }
  }, []);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <TablePro
            title="لیست ضامن‌های مورد نیاز"
            loading={guarantorLoading}
            columns={guarantorCols}
            rows={guarantorTable}
            setRows={setGuarantorTable}
            edit="external"
            editCondition={(row) =>
              !submitWaiting && row.statusId != "Confirmation"
            }
            editForm={
              <GuarantorForm
                formValues={guarantorformValues}
                setFormValues={setGuarantorFormValues}
                editing={true}
                submitWaiting={submitWaiting}
                setLoading={setGuarantorLoading}
                guarantorTable={guarantorTable}
                setGuarantorTable={setGuarantorTable}
              />
            }
          />
        </CardContent>
      </Card>
      <Box p={2} />
      <Card variant="outlined">
        <CardContent>
          <TablePro
            title="مدارک مورد نیاز وام گیرنده"
            loading={borrowerLoading}
            columns={borrowerCols}
            rows={borrowerTable}
            setRows={setBorrowerTable}
            edit="external"
            editCondition={() => !submitWaiting}
            editForm={
              <BorrowerForm
                formValues={borrowerformValues}
                setFormValues={setBorrowerFormValues}
                editing={true}
                submitWaiting={submitWaiting}
                setLoading={setBorrowerLoading}
                borrowerTable={borrowerTable}
                setBorrowerTable={setBorrowerTable}
              />
            }
          />
        </CardContent>
      </Card>
    </>
  );
}

function GuarantorForm({ editing = false, ...restProps }) {
  const {
    handleClose,
    setLoading,
    formValues,
    setFormValues,
    guarantorTable,
    setGuarantorTable,
    submitWaiting,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [attachments, setAttachments] = useState(formValues?.attachments || []);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const guarantorStructure = [
    {
      name: "nationalCode",
      label: "کد ملی",
      type: "number",
      required: true,
      autoFocus: true,
      col: 9,
      validator: (values) => {
        const nationalId = values.nationalCode.toString();
        const ind = guarantorTable?.findIndex(
          (row) =>
            row.nationalCode == values.nationalCode &&
            row.guarantorIndex != values?.guarantorIndex
        );
        return new Promise((resolve) => {
          if (nationalId.length !== 10) {
            resolve({ error: true, helper: "کد ملی باید 10 رقم باشد." });
          }
          if (ind > -1) {
            resolve({ error: true, helper: "کد ملی وارد شده تکراری است." });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
    },
    {
      name: "empty",
      label: "",
      type: "text",
      style: { visibility: "hidden" },
      col: 3,
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "FatherName",
      label: "نام پدر",
      type: "text",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "idNumber",
      label: "شماره شناسنامه ",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "Cityplaceofissue",
      label: "استان محل صدور",
      type: "text",
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "birthDate",
      label: "تاریخ تولد",
      type: "date",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "PlaceOfBirthGeoID",
      label: "محل تولد",
      type: "text",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "phoneHomeNumber",
      label: "شماره تلفن ثابت",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "phoneMobileNumber",
      label: "تلفن همراه",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "postalCode",
      label: "کد پستی",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "email",
      label: "نشانی پست الکترونیک",
      type: "text",
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
      validator: (values) => {
        const email = values.email;
        return new Promise((resolve) => {
          if (
            !email ||
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              email
            )
          ) {
            resolve({ error: false, helper: "" });
          } else {
            resolve({ error: true, helper: "آدرس ایمیل اشتباه است." });
          }
        });
      },
    },
    {
      name: "accountNumber",
      label: "شماره حساب بانکی",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "bankName",
      label: "عنوان بانک",
      type: "text",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "routingNumber",
      label: "کد شعبه",
      type: "number",
      required: true,
      readOnly: formValues?.guarantorTypeEnumId == "InternalGuarantor",
    },
    {
      name: "terms",
      label: "شرایط ضامن",
      type: "textarea",
      readOnly: true,
      col: 9,
    },
    {
      type: "component",
      component: (
        <Attachment
          attachments={attachments}
          setAttachments={setAttachments}
          partyContentType={formValues?.partyContentType}
        />
      ),
      col: 12,
    },
  ];

  useEffect(() => {
    if (
      formValues.nationalCode &&
      formValues?.guarantorTypeEnumId == "InternalGuarantor"
    ) {
      axios
        .get(
          SERVER_URL +
            `/rest/s1/welfare/guarantorDetailInfo?nationalCode=${formValues?.nationalCode}`,
          axiosKey
        )
        .then((res) => {
          setFormValues((prevState) => ({
            ...prevState,
            ...res.data?.guarantorInfo,
          }));
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت مشخصات ضامن!")
          );
        });
    }
  }, [formValues.nationalCode]);

  const handleEdit = () => {
    setWaiting(true);
    const editedGuarantorTable = [...guarantorTable];
    const guarantorIndex = guarantorTable?.findIndex(
      (guarantor) =>
        guarantor?.guarantorIndex == formValues?.guarantorIndex &&
        guarantor?.guarantorTypeEnumId == formValues?.guarantorTypeEnumId
    );
    editedGuarantorTable[guarantorIndex] = {
      ...formValues,
      statusId: "Completed",
      status: "تکمیل شده",
      attachments: attachments.map(
        ({ observeFile, ...keepAttrs }) => keepAttrs
      ),
    };
    setGuarantorTable(editedGuarantorTable);
    dispatch(
      setAlertContent(
        ALERT_TYPES.SUCCESS,
        "اطلاعات ضامن مورد نظر با موفقیت ثبت شد."
      )
    );
    handleClose();
    setWaiting(false);
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={guarantorStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={handleEdit}
        resetCallback={handleReset}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting || submitWaiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              افزودن ضامن
            </Button>
            <Button
              type="reset"
              role="secondary"
              disabled={waiting || submitWaiting}
            >
              لغو
            </Button>
          </ActionBox>
        }
      />
    </CardContent>
  );
}
function BorrowerForm({ editing = false, ...restProps }) {
  const {
    handleClose,
    setLoading,
    formValues,
    setFormValues,
    borrowerTable,
    setBorrowerTable,
    submitWaiting,
  } = restProps;
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

  const handleUpload = () => {
    if (formValues.contentLocation) {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال فایل ..."));
      setWaiting(true);
      setLoading(true);
      contentIdFormData.append("file", formValues.contentLocation);
      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/getpersonnelfile",
          contentIdFormData,
          config
        )
        .then((res) => {
          setWaiting(false);
          setLoading(false);
          const editedBorrowerTable = [...borrowerTable];
          const borrowerIndex = borrowerTable?.findIndex(
            (borrower) => borrower?.borrowerIndex == formValues?.borrowerIndex
          );
          editedBorrowerTable[borrowerIndex] = {
            ...formValues,
            statusId: "Completed",
            status: "تکمیل شده",
            contentLocation: res.data?.name,
            observeFile: (
              <Button
                variant="outlined"
                color="primary"
                href={
                  SERVER_URL +
                  "/rest/s1/fadak/getpersonnelfile1?name=" +
                  res.data?.name
                }
                target="_blank"
              >
                {" "}
                <Image />{" "}
              </Button>
            ),
          };
          setBorrowerTable(editedBorrowerTable);
          handleReset();
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت بارگذاری شد")
          );
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در بارگذاری فایل !")
          );
          setWaiting(false);
          setLoading(false);
        });
    } else {
      dispatch(
        setAlertContent(ALERT_TYPES.WARNING, "ابتدا یک فایل انتخاب کنید")
      );
    }
  };

  const handleReset = () => {
    setFormValues({});
    handleClose();
    setWaiting(false);
    setLoading(false);
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        actionBox={
          <ActionBox>
            <Button
              type="button"
              role="primary"
              disabled={waiting || submitWaiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
              onClick={handleUpload}
            >
              {"افزودن"}
            </Button>
            <Button
              type="button"
              role="secondary"
              onClick={handleReset}
              disabled={waiting || submitWaiting}
            >
              لغو
            </Button>
          </ActionBox>
        }
      />
    </CardContent>
  );
}
