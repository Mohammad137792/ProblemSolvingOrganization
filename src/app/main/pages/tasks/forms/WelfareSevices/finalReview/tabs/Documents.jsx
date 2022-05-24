import React, { useState, useEffect } from "react";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import { Image } from "@material-ui/icons";

export default function Documents({
  submitWaiting,
  borrowerAttach,
  guarantorTable,
  setGuarantorTable,
  guarantorLoading,
  borrowerLoading,
  setBorrowerLoading,
}) {
  const [guarantorformValues, setGuarantorFormValues] = useState({});
  const [borrowerTable, setBorrowerTable] = useState([]);

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
      style: { width: "30%" },
    },
  ];

  const getBorrowerAttach = () => {
    if (borrowerAttach?.length > 0) {
      let tableDataArray = [];
      [...borrowerAttach].map((item, index) => {
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
        if (index == borrowerAttach?.length - 1) {
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
    getBorrowerAttach();
  }, [borrowerAttach]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <TablePro
            title="لیست ضامن‌های مورد نیاز"
            columns={guarantorCols}
            rows={guarantorTable}
            setRows={setGuarantorTable}
            loading={guarantorLoading}
            edit="external"
            editCondition={() => !submitWaiting}
            editForm={
              <GuarantorForm
                formValues={guarantorformValues}
                setFormValues={setGuarantorFormValues}
                editing={true}
                submitWaiting={submitWaiting}
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
            columns={borrowerCols}
            rows={borrowerTable}
            setRows={setBorrowerTable}
            loading={borrowerLoading}
          />
        </CardContent>
      </Card>
    </>
  );
}

function GuarantorForm({ editing = false, ...restProps }) {
  const { handleClose, formValues, setFormValues, submitWaiting } = restProps;
  const [attachments, setAttachments] = useState([]);
  const [attachLoading, setAttachLoading] = useState(false);

  const AttachCols = [
    {
      name: "welfareDocEnum",
      label: "نوع مدرک",
      type: "text",
    },
    {
      name: "observeFile",
      label: "دانلود فایل",
      style: { width: "50%" },
    },
  ];

  const guarantorStructure = [
    {
      name: "nationalCode",
      label: "کد ملی",
      type: "number",
      readOnly: true,
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
      readOnly: true,
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      readOnly: true,
    },
    {
      name: "FatherName",
      label: "نام پدر",
      type: "text",
      readOnly: true,
    },
    {
      name: "idNumber",
      label: "شماره شناسنامه ",
      type: "number",
      readOnly: true,
    },
    {
      name: "Cityplaceofissue",
      label: "استان محل صدور",
      type: "text",
      readOnly: true,
    },
    {
      name: "birthDate",
      label: "تاریخ تولد",
      type: "date",
      readOnly: true,
    },
    {
      name: "PlaceOfBirthGeoID",
      label: "محل تولد",
      type: "text",
      readOnly: true,
    },
    {
      name: "phoneHomeNumber",
      label: "شماره تلفن ثابت",
      type: "number",
      readOnly: true,
    },
    {
      name: "phoneMobileNumber",
      label: "تلفن همراه",
      type: "number",
      readOnly: true,
    },
    {
      name: "postalCode",
      label: "کد پستی",
      type: "number",
      readOnly: true,
    },
    {
      name: "email",
      label: "نشانی پست الکترونیک",
      type: "text",
      readOnly: true,
    },
    {
      name: "accountNumber",
      label: "شماره حساب بانکی",
      type: "number",
      readOnly: true,
    },
    {
      name: "bankName",
      label: "عنوان بانک",
      type: "text",
      readOnly: true,
    },
    {
      name: "routingNumber",
      label: "کد شعبه",
      type: "number",
      readOnly: true,
    },
    {
      name: "terms",
      label: "شرایط ضامن",
      type: "textarea",
      readOnly: true,
      col: 10,
    },
  ];

  const handleReset = () => {
    setFormValues({});
    handleClose();
  };

  const getGuarantorAttach = () => {
    setAttachLoading(true);
    if (formValues?.attachments?.length > 0) {
      let tableDataArray = [];
      [...formValues?.attachments].map((item, index) => {
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
        if (index == formValues?.attachments?.length - 1) {
          setAttachments(tableDataArray);
          setAttachLoading(false);
        }
      });
    } else {
      setAttachments([]);
      setAttachLoading(false);
    }
  };
  useEffect(() => {
    getGuarantorAttach();
  }, []);

  return (
    <>
      <FormPro
        prepend={guarantorStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        resetCallback={handleReset}
        actionBox={
          <ActionBox>
            <Button type="reset" role="secondary" disabled={submitWaiting}>
              لغو
            </Button>
          </ActionBox>
        }
      >
        <TablePro
          title="مدارک ضامن"
          columns={AttachCols}
          rows={attachments}
          setRows={setAttachments}
          loading={attachLoading}
          fixedLayout
        />
      </FormPro>
    </>
  );
}
