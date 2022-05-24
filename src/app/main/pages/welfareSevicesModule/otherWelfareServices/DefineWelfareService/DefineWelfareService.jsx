import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FusePageSimple } from "@fuse";
import {
  Card,
  CardContent,
  Button,
  CardHeader,
  Box,
  Typography,
} from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import TabPro from "app/main/components/TabPro";
import TablePro from "app/main/components/TablePro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SERVER_URL } from "configs";
import axios from "axios";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import VerificatinLevel from "app/main/pages/tasks/forms/PerformanceEvaluations/difineEvaluation/steps/evaluatorDetermination/VerificatinLevel";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function DefineWelfareService() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [tableContentGroupList, setTableContentGroupList] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [
    welfareGroupPartyClassificationId,
    setWelfareGroupPartyClassificationId,
  ] = useState("");
  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "code",
      label: "کد ",
      type: "text",
      required: true,
      // validator: (values) => {
      //   const ind = tableContentGroupList?.findIndex(
      //     (row) =>
      //       row.standardCode == values.standardCode &&
      //       row?.welfareGroupPartyClassificationId !=
      //         values?.welfareGroupPartyClassificationId
      //   );
      //   return new Promise((resolve) => {
      //     if (/[^a-z0-9]/i.test(values.standardCode)) {
      //       resolve({
      //         error: true,
      //         helper:
      //           "کد گروه خدمات رفاهی فقط می تواند شامل اعداد و حروف لاتین باشد!",
      //       });
      //     }
      //     if (ind > -1) {
      //       resolve({ error: true, helper: "کد وارد شده تکراری است." });
      //     } else {
      //       resolve({ error: false, helper: "" });
      //     }
      //   });
      // },
      col: 3,
    },
    {
      name: "description",
      label: "  عنوان  خدمات رفاهی",
      type: "text",
      required: true,
      col: 3,
    },
    {
      name: "createDate",
      label: "  تاریخ ایجاد",
      type: "date",
      required: true,
      col: 3,
    },
    {
      name: "status",
      label: "  وضعیت",
      type: "select",
      options:[{id:1,value:"فعال"},{id:2,value:"غیر فعال"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
    {
      name: "service",
      label: "  جنس خدمت",
      type: "select",
      options:[{id:1,value:"رزروی"},{id:2,value:"پرداختی"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
    {
      name: "useMetod",
      label: "  نحوه استفاده",
      type: "select",
      options:[{id:1,value:"نیاز به پرداخت"},{id:2,value:"بدون نیاز به پرداخت"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
    {
      name: "serviceType",
      label: "  نوع خدمت رفاهی",
      type: "select",
      options:[{id:1,value:"سفر"},{id:2,value:"تفریح"},{id:3,value:"سایر"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
    {
      name: "useLimitations",
      label: "  محدودیت استفاده",
      type: "multiselect",
      options:[{id:1,value:"پرسنل شرکت"},{id:2,value:"پرسنل شرکت زیر مجموعه"},{id:3,value:"سایر"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
    {
      name: "Audience",
      label: "  مخاطب",
      type: "multiselect",
      options:[{id:1,value:"پرسنل"},{id:2,value:"همسر "},{id:3,value:"فرزند"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    }, {
      name: "gender",
      label: "  جنسیت",
      type: "select",
      options:[{id:1,value:"مرد "},{id:2,value:"زن"}],
      optionIdField: "id",
      optionLabelField: "value",
      required: true,
      col:3,
    },
  ];


  const groupListCols = [
    {
      name: "standardCode",
      label: "کد ",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "description",
      label: "عنوان خدمت رفاهی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "parent",
      label: "خدمات رفاهی سرگروه",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "creatDate",
      label: "تاریخ ایجاد",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "welfareGroupStatus",
      label: "وضعیت",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getStatusSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/StatusItem?statusTypeId=WelfareGroupStatus",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareGroupStatus: res.data.status,
          };
        });
      });
  };

  const getCompanyPositions = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/companyInfo", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            emplPositions: res.data.emplPosition,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت پست‌های سازمانی!")
        );
      });
  };

  const getWelfareGroupList = () => {
    setLoading(true);
    axios
      .get(SERVER_URL + "/rest/s1/welfare/welfareGroup", axiosKey)
      .then((res) => {
        setTableContentGroupList(res.data?.welfareGroup);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست گروه خدمات رفاهی!"
          )
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {

  };

  const editCallback = (row) => {
    setFormValues(row);
    setWelfareGroupPartyClassificationId(
      row?.welfareGroupPartyClassificationId
    );
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setWaiting(true);
    setLoading(true);
    axios
      .put(SERVER_URL + "/rest/s1/welfare/welfareGroup", formValues, axiosKey)
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareGroupStatus: fieldsInfo?.welfareGroupStatus.find(
            (item) => item.statusId == formValues.welfareGroupStatusId
          ).description,
        };
        const editedTableContent = [...tableContentGroupList];
        const welfareGroupIndex = tableContentGroupList.findIndex(
          (row) =>
            row.welfareGroupPartyClassificationId ==
            welfareGroupPartyClassificationId
        );
        editedTableContent[welfareGroupIndex] = {
          ...editedTableContent[welfareGroupIndex],
          ...completedFormValues,
        };
        setTableContentGroupList(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش گروه خدمات رفاهی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };
  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      setWaiting(true);
      setLoading(true);
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/welfareGroup?welfareGroupPartyClassificationId=${row?.welfareGroupPartyClassificationId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContentGroupList.filter(
            (welfare) =>
              welfare.welfareGroupPartyClassificationId !=
              row?.welfareGroupPartyClassificationId
          );
          setTableContentGroupList(filteredTable);
          setWaiting(false);
          setLoading(false);
          if (
            welfareGroupPartyClassificationId ==
            row?.welfareGroupPartyClassificationId
          ) {
            handleReset();
          }
          resolve();
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف گروه خدمات رفاهی!")
          );
          setWaiting(false);
          setLoading(false);
          reject();
        });
    });
  };

  const handleReset = () => {
    setWaiting(false);
    setLoading(false);
    setFormValues((prevState) => {
      return {
        welfareGroupStatusId: "ActiveWelfareGroup",
      };
    });
    setWelfareGroupPartyClassificationId("");
  };

  useEffect(() => {
    getStatusSelectFields();
    getCompanyPositions();
    setFormValues((prevState) => {
      return {
        welfareGroupStatusId: "ActiveWelfareGroup",
      };
    });
  }, []);

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">خدمات رفاهی</Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              <Typography color="textSecondary">سایر خدمات رفاهی</Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              تعریف  خدمات رفاهی
            </Box>
          }
        />
      }
      content={
        <>
          <Box p={2}>
            <Card variant="outlined">
              <CardContent>
                <FormPro
                  append={formStructure}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formValidation={formValidation}
                  setFormValidation={setFormValidation}
                  submitCallback={() =>
                    welfareGroupPartyClassificationId
                      ? checkPermis(
                          "welfareServices/welfareServicesGroup/update",
                          datas
                        ) && handleEdit()
                      : checkPermis(
                          "welfareServices/welfareServicesGroup/add",
                          datas
                        ) && handleSubmit()
                  }
                  resetCallback={handleReset}
                  actionBox={
                    <ActionBox>
                      <Button
                        type="submit"
                        role="primary"
                        disabled={
                          waiting || welfareGroupPartyClassificationId
                            ? !checkPermis(
                                "welfareServices/welfareServicesGroup/update",
                                datas
                              )
                            : !checkPermis(
                                "welfareServices/welfareServicesGroup/add",
                                datas
                              )
                        }
                        endIcon={
                          waiting ? <CircularProgress size={20} /> : null
                        }
                      >
                        {welfareGroupPartyClassificationId ? "ویرایش" : "ثبت"}
                      </Button>
                      <Button type="reset" role="secondary" disabled={waiting}>
                        لغو
                      </Button>
                    </ActionBox>
                  }
                />
                <Box p={2} />
             <Card>
               <VerificatinLevel verificationTitle="مراحل تامین" />
             </Card>
              </CardContent>
            </Card>
          </Box>
          <Box p={2}>
            <Card variant="outlined">
              <CardContent>
                <TablePro
                  title="لیست  خدمات رفاهی"
                  loading={loading}
                  columns={groupListCols}
                  rows={tableContentGroupList}
                  setRows={setTableContentGroupList}
                  removeCondition={() =>
                    checkPermis(
                      "welfareServices/welfareServicesGroup/delete",
                      datas
                    )
                  }
                  removeCallback={handleRemove}
                  editCondition={() =>
                    checkPermis(
                      "welfareServices/welfareServicesGroup/update",
                      datas
                    )
                  }
                  edit="callback"
                  editCallback={editCallback}
                />
              </CardContent>
            </Card>
          </Box>
        </>
      }
    />
  );
}
