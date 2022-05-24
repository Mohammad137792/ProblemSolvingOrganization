import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, Button, Box } from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import TabPro from "app/main/components/TabPro";
import TablePro from "app/main/components/TablePro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import axios from "axios";
//tabs
import SubUnits from "./tabs/SubUnits";
import UnitPositions from "./tabs/UnitPositions";
import UnitAddress from "./tabs/UnitAddress";
import UnitTel from "./tabs/UnitTel";
import UnitHistory from "./tabs/UnitHistory";
import OtherInfo from "../../personnelBaseInformation/tabs/OtherInfo/OtherInfo";
import moment from "moment-jalaali";

export default function OrganizationalUnitForm({ myScrollElement }) {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [filterFormValues, setFilterFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [partyId, setPartyId] = useState("");
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
      name: "pseudoId",
      label: "کد واحد سازمانی",
      type: "text",
      required: true,
      validator: (values) => {
        const ind = tableContent?.findIndex(
          (row) =>
            row.pseudoId == values.pseudoId && row?.partyId != values?.partyId
        );
        return new Promise((resolve) => {
          if (/[^a-z0-9]/i.test(values.pseudoId)) {
            resolve({
              error: true,
              helper:
                "کد واحد سازمانی فقط می تواند شامل اعداد و حروف لاتین باشد!",
            });
          }
          if (ind > -1) {
            resolve({ error: true, helper: "کد وارد شده تکراری است." });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
    },
    {
      name: "organizationName",
      label: "عنوان واحد سازمانی",
      type: "text",
      required: true,
      validator: (values) => {
        const ind = tableContent?.findIndex(
          (row) =>
            row.organizationName == values.organizationName &&
            row?.partyId != values?.partyId
        );
        return new Promise((resolve) => {
          if (ind > -1) {
            resolve({ error: true, helper: "عنوان وارد شده تکراری است." });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
    },

    {
      name: "partyClassificationId",
      label: "سطح سازمانی",
      type: "select",
      options: fieldsInfo.organizationType,
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
      otherOutputs: [
        { name: "partyClassification", optionIdField: "description" },
      ],
      required: true,
    },
    {
      name: "fromDate",
      label: "تاریخ ایجاد",
      type: "date",
      required: true,
      readOnly: true,
    },
    {
      name: "ownerPartyId",
      label: "واحد سازمانی بالاتر",
      type: "select",
      options: partyId
        ? tableContent.filter(
            (row) => row.ownerPartyId != partyId && row.partyId != partyId
          )
        : tableContent,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      otherOutputs: [{ name: "ownerName", optionIdField: "organizationName" }],
    },
    {
      name: "organizationTypeEnumId",
      label: "نوع واحد سازمانی",
      type: "select",
      options: fieldsInfo.orgUnitType,
      optionLabelField: "description",
      optionIdField: "enumId",
      otherOutputs: [
        { name: "organizationTypeEnum", optionIdField: "description" },
      ],
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          propertyEnumId: null,
        })),
      required: true,
    },
    {
      name: "propertyEnumId",
      label: "ویژگی‌های واحد سازمانی",
      type: "multiselectCategory",
      options: fieldsInfo?.partyPropertyType?.sort(
        (a, b) => -b.parentEnumId.localeCompare(a.parentEnumId)
      ),
      optionLabelField: "description",
      optionIdField: "enumId",
      groupBy: (option) => option.parentEnum,
      display: formValues.organizationTypeEnumId == "BranchUnit",
      required: formValues.organizationTypeEnumId == "BranchUnit",
      validator: (values) => {
        const propertyEnumIds = values.propertyEnumId
          ? JSON.parse(values.propertyEnumId)
          : [];
        const parentEnumIds = fieldsInfo?.partyPropertyType
          .filter(
            (entry) =>
              propertyEnumIds.findIndex((enumId) => entry.enumId === enumId) >=
              0
          )
          .map((item) => item.parentEnumId);

        const requiredProperty = fieldsInfo?.requiredProperty
          .filter((entry) => !parentEnumIds.includes(entry.enumId))
          ?.map((item) => item?.description);

        return new Promise((resolve) => {
          if (
            propertyEnumIds?.length == 0 &&
            formValues.organizationTypeEnumId == "BranchUnit"
          ) {
            resolve({
              error: true,
              helper: "تعیین این فیلد الزامی است!",
            });
          }
          if (parentEnumIds.length !== new Set(parentEnumIds).size) {
            resolve({
              error: true,
              helper: "از هر گروه ویژگی فقط یک مورد را انتخاب کنید.",
            });
          }
          if (requiredProperty?.length > 0) {
            resolve({
              error: true,
              helper: `از گروه ویژگی (${requiredProperty?.join(
                "،"
              )}) یک مورد را انتخاب کنید.`,
            });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
    },
    {
      name: "disabled",
      label: "وضعیت",
      type: "select",
      options: [
        { disabled: "N", description: "فعال" },
        { disabled: "Y", description: "غیر فعال" },
      ],
      optionLabelField: "description",
      optionIdField: "disabled",
      required: true,
    },
    {
      name: "startDate",
      label: "تاریخ شروع به کار",
      type: "date",
      required: true,
      validator: (values) => {
        return new Promise((resolve) => {
          if (
            formValues?.endDate &&
            new Date(values?.startDate) > new Date(formValues?.endDate)
          ) {
            resolve({
              error: true,
              helper: "تاریخ شروع به کار باید از تاریخ پایان کار کوچکتر باشد",
            });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
    },
    {
      name: "endDate",
      label: "تاریخ پایان کار",
      type: "date",
    },
    {
      name: "noteText",
      label: "توضیحات",
      type: "textarea",
      col: 9,
    },
  ];

  const tabs = [
    {
      label: "واحدهای زیر مجموعه",
      panel: <SubUnits partyId={partyId} />,
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/subUnits",
          datas
        ),
    },
    {
      label: "پست‌های سازمانی",
      panel: <UnitPositions partyId={partyId} />,
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/unitPositions",
          datas
        ),
    },
    {
      label: "آدرس",
      panel: (
        <UnitAddress
          externalPartyId={partyId}
          contactMechTypeEnumId={"CmtOrgPostalAddress"}
          addPermis={
            "organizationChartManagement/organizationalUnit/unitAddress/add"
          }
          updatePermis={
            "organizationChartManagement/organizationalUnit/unitAddress/update"
          }
          deletePermis={
            "organizationChartManagement/organizationalUnit/unitAddress/delete"
          }
        />
      ),
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/unitAddress",
          datas
        ),
    },
    {
      label: "اطلاعات تماس",
      panel: (
        <UnitTel
          externalPartyId={partyId}
          electronicWay={true}
          addPermis={
            "organizationChartManagement/organizationalUnit/unitTel/addTel"
          }
          updatePermis={
            "organizationChartManagement/organizationalUnit/unitTel/updateTel"
          }
          deletePermis={
            "organizationChartManagement/organizationalUnit/unitTel/deleteTel"
          }
          addPermisElectronic={
            "organizationChartManagement/organizationalUnit/unitTel/addElectronic"
          }
          updatePermisElectronic={
            "organizationChartManagement/organizationalUnit/unitTel/updateElectronic"
          }
          deletePermisElectronic={
            "organizationChartManagement/organizationalUnit/unitTel/deleteElectronic"
          }
        />
      ),
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/unitTel",
          datas
        ),
    },
    {
      label: "سایر اطلاعات",
      panel: (
        <OtherInfo
          externalPartyId={partyId}
          settingTypeEnumId={"OtherOrgInfo"}
          oraganUnit={true}
        />
      ),
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/otherInfo",
          datas
        ),
    },
    {
      label: "تاریخچه درجه واحد سازمانی",
      panel: <UnitHistory partyId={partyId} />,
      display:
        partyId &&
        checkPermis(
          "organizationChartManagement/organizationalUnit/unitHistory",
          datas
        ),
    },
  ];

  const tableCols = [
    {
      name: "pseudoId",
      label: "کد واحد سازمانی",
      type: "text",
    },
    {
      name: "organizationName",
      label: "عنوان واحد سازمانی",
      type: "text",
    },

    {
      name: "partyClassification",
      label: "سطح واحد سازمانی",
      type: "text",
    },
    {
      name: "organizationTypeEnum",
      label: "نوع واحد سازمانی",
      type: "text",
    },
    {
      name: "ownerName",
      label: "واحد سازمانی بالاتر",
      type: "text",
    },
    {
      name: "disabled",
      label: "وضعیت",
      type: "render",
      render: (row) => {
        return row.disabled == "N" ? "فعال" : "غیر فعال";
      },
      style: { minWidth: "100px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=OrgUnitType,PartyPropertyType",
        axiosKey
      )
      .then((res) => {
        const partyProperty = res.data.enums.PartyPropertyType;
        const requiredProperty = partyProperty.filter(
          (property) =>
            property?.optionIndicator == "Y" && property.parentEnumId == null
        );
        const partyPropertyType = partyProperty.map((item) => {
          return {
            ...item,
            parentEnum: partyProperty.find(
              (entry) => entry.enumId == item.parentEnumId
            )?.description,
          };
        });
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            orgUnitType: res.data.enums.OrgUnitType,
            requiredProperty: requiredProperty,
            partyPropertyType: partyPropertyType.filter(
              (item) => item.parentEnumId != null
            ),
          };
        });
      });
  };

  const getOrganizationTypes = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/PartyClassification?classificationTypeEnumId=organizationType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            organizationType: res.data.result,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت سطح سازمانی!")
        );
      });
  };

  const getOrganizationalUnit = (filter = false) => {
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/orgStructure/unit/filterUnits",
        {
          filteredData: filter ? { ...filterFormValues } : {},
        },
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.units);
        if (!filter) {
          setFieldsInfo((prevState) => {
            return {
              ...prevState,
              units: res.data?.units,
            };
          });
        }
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست واحدهای سازمانی!"
          )
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setWaiting(true);
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/orgStructure/unit/organizationalUnit",
        formValues,
        axiosKey
      )
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          partyId: res.data?.partyId,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        setWaiting(false);
        setLoading(false);
        setPartyId(res.data?.partyId);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ایجاد واحد سازمانی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const editCallback = (row) => {
    setFormValues(row);
    setPartyId(row?.partyId);
    myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setWaiting(true);
    setLoading(true);
    axios
      .put(
        SERVER_URL + "/rest/s1/orgStructure/unit/organizationalUnit",
        formValues,
        axiosKey
      )
      .then((res) => {
        const editedTableContent = [...tableContent];
        const unitIndex = tableContent.findIndex(
          (row) => row.partyId == partyId
        );
        editedTableContent[unitIndex] = {
          ...editedTableContent[unitIndex],
          ...formValues,
        };
        setTableContent(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش واحد سازمانی!")
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
            `/rest/s1/orgStructure/unit/organizationalUnit?partyId=${row?.partyId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (unit) => unit.partyId != row?.partyId
          );
          setTableContent(filteredTable);
          setWaiting(false);
          setLoading(false);
          if (partyId == row?.partyId) {
            handleReset();
          }
          resolve();
        })
        .catch((error) => {
          if (error.response.data.errors.includes("hasEmplPositions")) {
            dispatch(
              setAlertContent(
                ALERT_TYPES.ERROR,
                "این واحد سازمانی دارای پست سازمانی است و قابل حذف نیست!"
              )
            );
          } else if (error.response.data.errors.includes("hasChildParty")) {
            dispatch(
              setAlertContent(
                ALERT_TYPES.ERROR,
                "این واحد سازمانی دارای واحد سازمانی زیرمجموعه است و قابل حذف نیست!"
              )
            );
          } else {
            dispatch(
              setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف واحد سازمانی!")
            );
          }
          setWaiting(false);
          setLoading(false);
          // reject();
        });
    });
  };

  const handleReset = () => {
    setWaiting(false);
    setLoading(false);
    setFormValues((prevState) => {
      return {
        disabled: "N",
        fromDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
      };
    });
    setPartyId("");
  };

  useEffect(() => {
    getEnumSelectFields();
    getOrganizationTypes();
    getOrganizationalUnit();
    setFormValues((prevState) => {
      return {
        disabled: "N",
        fromDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
      };
    });
  }, []);

  return (
    <>
      {checkPermis(
        "organizationChartManagement/organizationalUnit/add",
        datas
      ) && (
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
                  partyId
                    ? checkPermis(
                        "organizationChartManagement/organizationalUnit/update",
                        datas
                      ) && handleEdit()
                    : checkPermis(
                        "organizationChartManagement/organizationalUnit/add",
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
                        waiting || partyId
                          ? !checkPermis(
                              "welfareServices/welfareServicesGroup/update",
                              datas
                            )
                          : !checkPermis(
                              "welfareServices/welfareServicesGroup/add",
                              datas
                            )
                      }
                      endIcon={waiting ? <CircularProgress size={20} /> : null}
                    >
                      {partyId ? "ویرایش" : "ثبت"}
                    </Button>
                    <Button type="reset" role="secondary" disabled={waiting}>
                      لغو
                    </Button>
                  </ActionBox>
                }
              />
              <Box p={2} />
              {partyId && (
                <Card variant="outlined">
                  <TabPro tabs={tabs} />
                </Card>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
      <Box p={2}>
        <Card variant="outlined">
          <CardContent>
            <TablePro
              title="لیست واحدهای سازمانی"
              loading={loading}
              columns={tableCols}
              rows={tableContent}
              setRows={setTableContent}
              removeCondition={() =>
                checkPermis(
                  "organizationChartManagement/organizationalUnit/delete",
                  datas
                )
              }
              removeCallback={handleRemove}
              editCondition={() =>
                checkPermis(
                  "organizationChartManagement/organizationalUnit/update",
                  datas
                )
              }
              edit="callback"
              editCallback={editCallback}
              filter="external"
              filterForm={
                <FilterForm
                  formValues={filterFormValues}
                  setFormValues={setFilterFormValues}
                  fieldsInfo={fieldsInfo}
                  setFieldsInfo={setFieldsInfo}
                  waiting={waiting}
                  handleFilter={getOrganizationalUnit}
                />
              }
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

function FilterForm({ ...restProps }) {
  const {
    formValues,
    setFormValues,
    fieldsInfo,
    setFieldsInfo,
    waiting,
    handleFilter,
  } = restProps;
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "pseudoId",
      label: "کد واحد سازمانی",
      type: "text",
    },
    {
      name: "organizationName",
      label: "عنوان واحد سازمانی",
      type: "text",
    },

    {
      name: "partyClassificationId",
      label: "سطح سازمانی",
      type: "multiselect",
      options: fieldsInfo.organizationType,
      optionLabelField: "description",
      optionIdField: "partyClassificationId",
    },
    {
      name: "ownerPartyId",
      label: "واحد سازمانی بالاتر",
      type: "multiselect",
      options: fieldsInfo.units,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
    },
    {
      name: "organizationTypeEnumId",
      label: "نوع واحد سازمانی",
      type: "multiselect",
      options: fieldsInfo.orgUnitType,
      optionLabelField: "description",
      optionIdField: "enumId",
    },
    {
      name: "disabled",
      label: "وضعیت",
      type: "select",
      options: [
        { disabled: "N", description: "فعال" },
        { disabled: "Y", description: "غیر فعال" },
      ],
      optionLabelField: "description",
      optionIdField: "disabled",
    },
    {
      name: "fromDate",
      label: "تاریخ ایجاد",
      type: "date",
    },
    {
      name: "startDate",
      label: "تاریخ شروع به کار",
      type: "date",
    },
    {
      name: "endDate",
      label: "تاریخ پایان کار",
      type: "date",
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=LoanType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
          };
        });
      });
  };

  const handleReset = () => {
    setFormValues((prevState) => {
      return {
        disabled: "N",
      };
    });
    handleFilter(false);
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  useEffect(() => {
    setFormValues((prevState) => {
      return {
        disabled: "N",
      };
    });
  }, []);

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        submitCallback={() => handleFilter(true)}
        resetCallback={handleReset}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              فیلتر
            </Button>
            <Button type="reset" role="secondary" disabled={waiting}>
              لغو
            </Button>
          </ActionBox>
        }
      />
    </CardContent>
  );
}
