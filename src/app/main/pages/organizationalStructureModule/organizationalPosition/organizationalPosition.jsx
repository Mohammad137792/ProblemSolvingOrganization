import React, { useState, useEffect, createRef } from "react";
import FormPro from "../../../components/formControls/FormPro";
import { FusePageSimple } from "@fuse";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import PostTable from "./organizationalPositionTable";
import TablePro from "../../../components/TablePro";
import ActionBox from "../../../components/ActionBox";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import TabPro from "../../../components/TabPro";
import { CSVLink } from "react-csv";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ModalPro from "../../../components/ModalPro";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

var promiseResolve;
function ExternalForm({
  editing = false,
  tableData,
  setPersonsChanged,
  activePost,
  initData,
  setOpenModal,
  organizationUnit,
  setPersonData,
  closeForm,
  setPersonTableLoading,
  ...restProps
}) {
  const {
    formValues,
    setFormValues,
    oldData,
    successCallback,
    failedCallback,
    handleClose,
  } = restProps;
  const [formValidation, setFormValidation] = React.useState({});
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "partyId",
      label: "نام",
      type: "select",
      options: initData?.personList,
      required: true,
      optionLabelField: "fullName",
      optionIdField: "partyId",
      disabled: editing,
    },
    {
      name: "roleTypeId",
      label: "نقش",
      type: "select",
      options: initData?.roles,
      required: true,
      optionLabelField: "description",
      optionIdField: "roleTypeId",
      disabled: editing,
    },
    {
      name: "partyFromDate",
      label: "از تاریخ",
      type: "date",
      required: true,
      disabled: editing,
    },
    { name: "partyThruDate", label: "تا تاریخ", type: "date" },
    { name: "occupancyRate", label: "درصد اشتغال", type: "number" },
    { name: "mainPosition", label: "اصلی", type: "indicator" },
  ];

  const checkNewPerson = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      let managerExist = initData?.managers.find(
        (x) => x.unit == organizationUnit && x.partyId != newData.partyId
      );
      let hasMain = initData?.postList.find(
        (x) =>
          x.partyId == newData.partyId &&
          x.emplPositionId != activePost &&
          x.mainPosition == "Y" &&
          x.statusId == "EmpsActive"
      );
      let samePost = initData?.postList.find(
        (x) =>
          x.partyId == newData.partyId &&
          x.emplPositionId == activePost &&
          x.partyThruDate == null
      );
      let data = {
        ...newData,
        emplPositionId: activePost,
        fromDate: newData.partyFromDate,
        thruDate: newData.partyThruDate,
      };
      promiseResolve = successCallback;
      if (!editing && samePost) {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "هر فرد تنها یک ارتباط فعال با پست می تواند داشته باشد."
          )
        );
      } else {
        if (
          initData?.ceo &&
          newData.roleTypeId == "ChiefExecutiveOfficer" &&
          (!editing ||
            (editing &&
              (!newData.partyThruDate || newData.partyThruDate == "") &&
              (newData.partyId != initData?.ceo?.id ||
                newData.partyFromDate != initData?.ceo?.formDate)))
        ) {
          // if( || ){
          setOpenModal("ceo");
          setPersonData(data);
          // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مدیرعامل برای این شرکت انتخاب شده است.'));
        } else if (newData.roleTypeId == "OrgRManager" && managerExist) {
          setOpenModal("manager");
          setPersonData(data);
          // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در هر واحد سازمانی تنها یک مدیر می تواند حضور داشته باشد.'));
        } else if (newData.mainPosition == "Y" && hasMain) {
          setOpenModal("main");
          setPersonData(data);
          // dispatch(setAlertContent(ALERT_TYPES.WARNING, 'برای این فرد پست اصلی دیگری انتخاب شده است.'));
        } else {
          setPersonTableLoading(true);
          dispatch(
            setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات")
          );
          addPerson(data)
            .then((res) => {
              // setPersonTableLoading(false)
              dispatch(
                setAlertContent(
                  ALERT_TYPES.SUCCESS,
                  "اطلاعات با موفقیت  ثبت شد"
                )
              );
              resolve(newData);
              successCallback(data);
              setFormValues({});
              setPersonsChanged((prevState) => {
                return !prevState;
              });
            })
            .catch(() => {
              dispatch(
                setAlertContent(
                  ALERT_TYPES.WARNING,
                  "مشکلی در ارسال اطلاعات رخ داده است."
                )
              );
              reject();
            });
        }
      }
    });
  };

  useEffect(() => {
    if (closeForm) {
      setFormValues({});
      handleClose();
    }
  }, [closeForm]);

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={() => {
        checkNewPerson(formValues);
      }}
      resetCallback={() => {
        setFormValues({});
        handleClose();
      }}
      actionBox={
        <ActionBox>
          <Button type="submit" role="primary">
            {editing ? "ویرایش" : "افزودن"}
          </Button>
          <Button type="reset" role="secondary">
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}

const addPerson = (data, replace = false, organization) => {
  return axios.post(
    SERVER_URL + "/rest/s1/training/addPersonToPost",
    { data: data, replace: replace, organization: organization },
    {
      headers: { api_key: localStorage.getItem("api_key") },
    }
  );
};

const OrganizationalPosition = () => {
  const moment = require("moment-jalaali");
  const formDefaultValues = {
    fromDate: moment().format("Y-MM-DD"),
    statusId: true,
  };

  const [formValues, setFormValues] = useState(formDefaultValues);
  const [formValidation, setFormValidation] = useState({});
  const [initData, setInitData] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personTableLoading, setPersonTableLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [postTableContent, setPostTableContent] = useState([]);
  const [personsChanged, setPersonsChanged] = useState(false);
  const [personData, setPersonData] = useState(false);
  const [reset, setreset] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [closeForm, setCloseForm] = useState(false);

  const dispatch = useDispatch();
  const txtField = createRef(0);
  const classes = useStyles();

  const formStructure = [
    {
      label: "کد پست",
      name: "pseudoId",
      type: "text",
      required: true,
    },
    {
      label: "عنوان پست",
      name: "description",
      type: "text",
      required: true,
    },
    {
      label: "تاریخ ایجاد",
      name: "fromDate",
      type: "date",
      disabled: true,
    },
    {
      label: "وضعیت",
      name: "statusId",
      type: "select",
      options: initData?.emplPositionStatus,
      optionLabelField: "description",
      optionIdField: "statusId",
    },
    {
      label: "نوع پست",
      name: "positionTypeEnumId",
      type: "select",
      options: initData?.positionType,
    },
    {
      label: "رده سازمان",
      name: "gradeTypeEnumId",
      type: "select",
      options: initData?.gradeType,
    },
    {
      label: "رتبه شغلی",
      name: "payGradeId",
      type: "select",
      optionLabelField: "description",
      optionIdField: "payGradeId",
      options: initData?.payGrade,
    },
    {
      label: "واحد سازمان",
      name: "organizationPartyId",
      type: "select",
      required: true,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      options: initData?.userOrgans?.organizationUnit,
    },
    {
      label: "شغل",
      name: "jobId",
      type: "select",
      optionLabelField: "jobTitle",
      optionIdField: "jobId",
      options: initData?.jobs,
      filterOptions: (options) =>
        formValues["jobGradeId"]
          ? options.filter((item) => {
              let rowJobId = initData?.jobGrades.find(
                (x) => x.jobGradeId == formValues["jobGradeId"]
              )?.jobId;
              return item.jobId == rowJobId;
            })
          : options,
    },
    {
      label: "عنوان طبقه شغلی",
      name: "jobGradeId",
      type: "select",
      optionLabelField: "jobGTitle",
      optionIdField: "jobGradeId",
      disabled: !(formValues.jobId && formValues.jobId != ""),
      options: initData?.jobGrades,
      filterOptions: (options) =>
        formValues["jobId"]
          ? options.filter((item) => {
              return item.jobId == formValues["jobId"];
            })
          : options,
    },
    {
      label: "طبقه",
      name: "grade",
      type: "text",
      disabled: true,
    },
    {
      label: "امتیاز شغل",
      name: "jobScore",
      type: "text",
      disabled: true,
    },
    {
      label: "شرح",
      name: "jobDescription",
      type: "textarea",
      disabled: true,
      col: 12,
    },
  ];

  const tableCols = [
    {
      name: "partyId",
      label: "نام",
      type: "select",
      options: initData?.personList,
      required: true,
      optionLabelField: "fullName",
      optionIdField: "partyId",
    },
    {
      name: "roleTypeId",
      label: "نقش",
      type: "select",
      options: initData?.roles,
      required: true,
      optionLabelField: "description",
      optionIdField: "roleTypeId",
    },
    {
      name: "partyFromDate",
      label: "از تاریخ",
      type: "date",
      withTime: true,
      required: true,
    },
    { name: "partyThruDate", label: "تا تاریخ", type: "date" },
    { name: "mainPosition", label: "اصلی", type: "indicator" },
    { name: "occupancyRate", label: "درصد اشتغال", type: "number" },
  ];

  const tableCulomns = [
    {
      name: "title",
      label: "عنوان",
      type: "text",
      options: [],
      required: true,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
    },
    {
      name: "unit",
      label: "واحد سازمان",
      type: "text",
      options: [],
      required: true,
    },
    { name: "gradeType", label: "رده سازمان", type: "text" },
    { name: "job", label: "شغل", type: "text" },
    { name: "jobGrade", label: "عنوان طبقه شغلی", type: "text" },
    { name: "status", label: "وضعیت", type: "text" },
  ];

  const getInitData = () => {
    let config = {
      method: "get",
      url: `${SERVER_URL}/rest/s1/training/getPostInitData`,
      headers: { api_key: localStorage.getItem("api_key") },
    };
    axios(config).then((response) => {
      setInitData(response.data);
      setLoading(false);
      setTimeout(() => {
        if (activePost) {
          let selectedRow = response?.data?.postGroup?.find(
            (x) => x.emplPositionId == activePost
          );
          setTableContent(selectedRow?.history);
          setPersonTableLoading(false);
        }
      }, 500);
    });
  };

  useEffect(() => {
    getInitData();
  }, [reset, personsChanged]);

  useEffect(() => {
    let job = initData?.jobs?.find((x) => x.jobId == formValues.jobId),
      jobGrade = initData?.jobGrades?.find(
        (x) => x.jobGradeId == formValues.jobGradeId
      ),
      newValue = {
        ...formValues,
        jobDescription: job?.jobDescription,
        jobScore: jobGrade?.jobScore,
        grade: jobGrade?.jobGEnum,
      };
    if (!formValues.jobId || formValues.jobId == "") {
      newValue = { ...newValue, jobGradeId: null };
    }
    setTimeout(() => {
      setFormValues(newValue);
    }, 300);
  }, [formValues.jobId, formValues.jobGradeId]);

  useEffect(() => {
    if (formValues.pseudoId) {
      let str = formValues.pseudoId.replace(/[^\w]/g, "");
      setFormValues({ ...formValues, pseudoId: str });
    }
  }, [formValues.pseudoId]);

  const submitPost = () => {
    let idExist = initData?.postGroup?.find(
        (x) => x.pseudoId == formValues.pseudoId
      ),
      hasManager = initData?.postGroup?.filter((x) => {
        if (
          x.statusId &&
          x.organizationPartyId == formValues.organizationPartyId &&
          x.emplPositionId != activePost
        ) {
          return x.history.find(
            (x) => x.roleTypeId == "OrgRManager" && !x.partyThruDate
          );
        }
        return false;
      }),
      activePostHasManager = initData?.postGroup?.filter((x) => {
        if (formValues.statusId && x.emplPositionId == activePost) {
          return x.history.find(
            (x) => x.roleTypeId == "OrgRManager" && !x.partyThruDate
          );
        }
        return false;
      });

    if (idExist && !editing) {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "کد وارد شده تکراری است."));
    } else if (
      formValues.jobId &&
      formValues.jobId != "" &&
      (!formValues.jobGradeId || formValues.jobGradeId == "")
    ) {
      dispatch(
        setAlertContent(
          ALERT_TYPES.WARNING,
          "انتخاب عنوان طبقه شغلی اجباری است."
        )
      );
    } else if (
      editing &&
      hasManager.length > 0 &&
      activePostHasManager.length > 0
    ) {
      setOpenModal("hasManager");
    } else {
      sendPost();
    }
  };

  const sendPost = (hasManager) => {
    let data = { ...formValues, emplPositionId: activePost },
      config = {
        method: "post",
        url: `${SERVER_URL}/rest/s1/training/createPost`,
        headers: { api_key: localStorage.getItem("api_key") },
        data: { data: data, hasManager: hasManager },
      };
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات..."));
    axios(config).then((response) => {
      setActivePost(response.data.positionId);
      setOpenModal(false);
      if (editing) {
        setFormValues(formDefaultValues);
        setActivePost(null);
        setTableContent([]);
        setPersonTableLoading(false);
      }
      setEditing((prevState) => !prevState);
      setreset((prevState) => !prevState);

      dispatch(
        setAlertContent(ALERT_TYPES.SUCCESS, "عملیات با موفقیت انجام شد.")
      );
    });
  };

  const deletePost = (item) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          SERVER_URL + "/rest/s1/training/deletePost",
          { data: item },
          {
            headers: { api_key: localStorage.getItem("api_key") },
          }
        )
        .then((res) => {
          resolve();
          resetForm();
          setreset((prevState) => !prevState);
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در ارسال اطلاعات رخ داده است."
            )
          );
          reject();
        });
    });
  };

  const editPost = (row) => {
    setEditing(true);
    setFormValues(row);
    setTableContent(row.history);
    setPersonTableLoading(false);
    setActivePost(row.emplPositionId);
  };

  const csvData = () => {
    let data = [],
      init = initData?.postList;

    for (let i = 0; i < init?.length; i++) {
      let data0 = [
          "description",
          "emplPositionId",
          "fromDate",
          "gradeTypeEnumId",
          "jobGradeId",
          "mainPosition",
          "occupancyRate",
          "organizationName",
          "organizationPartyId",
          "partyFromDate",
          "partyId",
          "partyThruDate",
          "payGradeId",
          "pseudoId",
          "roleTypeId",
          "statusId",
          "gradeType",
          "jobGrade",
          "payGrade",
          "role",
          "gradeType",
          "name",
        ],
        arr = [];

      for (let prp of data0) {
        if (
          prp == "companyPartyId" ||
          prp == "emplPositionId" ||
          prp == "gradeTypeEnumId" ||
          prp == "jobGradeId" ||
          prp == "organizationPartyId" ||
          prp == "fromDate" ||
          prp == "partyId" ||
          prp == "payGradeId" ||
          prp == "roleTypeId"
        )
          continue;
        let res =
          prp == "partyFromDate" || prp == "thruDate" || prp == "partyThruDate"
            ? init[i][prp]
              ? moment(init[i][prp])
                  .locale("fa", { useGregorianParser: true })
                  .format("jYYYY/jMM/jDD")
              : "-"
            : prp == "statusId"
            ? init[i][prp] == "EmpsActive"
              ? "فعال"
              : "غیر فعال"
            : prp == "mainPosition"
            ? init[i][prp] == "Y"
              ? "فعال"
              : "غیر فعال"
            : init[i][prp];
        arr.push(res);
      }

      if (i == 0) {
        data[0] = [
          "پست",
          "پست اصلی",
          "درصد اشتغال",
          "واحد سازمانی",
          "از تاریخ",
          "تا تاریخ",
          "کد پست",
          "وضعیت",
          "نوع پست",
          "طبقه شغلی",
          "رتبه شغلی",
          "نقش",
          "رده سازمانی",
          "نام و نام خانوادگی",
        ];
      }

      data.push(arr);
    }
    return data;
  };

  const resetForm = () => {
    setFormValues(formDefaultValues);
    setActivePost(null);
    setEditing(false);
    setTableContent([]);
    setPersonTableLoading(false);
  };

  const deletePersonFromPost = (item) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          SERVER_URL + "/rest/s1/training/deletePersonFromPost",
          { person: { ...item, emplPositionId: activePost } },
          {
            headers: { api_key: localStorage.getItem("api_key") },
          }
        )
        .then((res) => {
          resolve();
          setCloseForm(true);
          setPersonsChanged((prevState) => {
            return !prevState;
          });
          setTimeout(() => {
            setCloseForm(false);
          }, 1000);
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در ارسال اطلاعات رخ داده است."
            )
          );
        });
    });
  };

  const exportTable = () => {
    txtField.current.link.click();
  };

  const confirmModal = () => {
    if (openModal == "hasManager") {
      sendPost(true);
    } else {
      let actv = activePost;
      setPersonTableLoading(true);
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      addPerson(personData, true, formValues.organizationPartyId)
        .then((res) => {
          setOpenModal(false);

          promiseResolve(personData);

          setPersonsChanged((prevState) => {
            return !prevState;
          });
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "مشکلی در ارسال اطلاعات رخ داده است."
            )
          );
        });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">
                مدیریت ساختار سازمانی
              </Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              پست سازمانی
            </Box>
          }
        />
      }
      content={
        <Box p={2}>
          <Card m={2}>
            <CardContent>
              <Grid container p={2} spacing={2}>
                <FormPro
                  append={formStructure}
                  formValues={formValues}
                  formDefaultValues={formDefaultValues}
                  setFormValues={setFormValues}
                  formValidation={formValidation}
                  setFormValidation={setFormValidation}
                  submitCallback={submitPost}
                  resetCallback={resetForm}
                  actionBox={
                    <ActionBox>
                      <Button type="submit" role="primary">
                        {editing ? "ویرایش" : "افزودن"}
                      </Button>
                      <Button type="reset" role="secondary">
                        لغو
                      </Button>
                    </ActionBox>
                  }
                />
              </Grid>
              <Box mt={2}>
                <Card>
                  {activePost && (
                    <Box mt={2}>
                      <TabPro
                        tabs={[
                          {
                            label: "افراد در پست",
                            panel: (
                              <TablePro
                                title="افراد"
                                columns={tableCols}
                                rows={tableContent}
                                loading={personTableLoading}
                                add="external"
                                addForm={
                                  <ExternalForm
                                    tableData={tableContent}
                                    setPersonsChanged={setPersonsChanged}
                                    organizationUnit={
                                      formValues.organizationPartyId
                                    }
                                    activePost={activePost}
                                    initData={initData}
                                    setOpenModal={setOpenModal}
                                    setPersonData={setPersonData}
                                    closeForm={closeForm}
                                    setPersonTableLoading={
                                      setPersonTableLoading
                                    }
                                  />
                                }
                                edit="external"
                                editForm={
                                  <ExternalForm
                                    tableData={tableContent}
                                    setPersonsChanged={setPersonsChanged}
                                    organizationUnit={
                                      formValues.organizationPartyId
                                    }
                                    initData={initData}
                                    activePost={activePost}
                                    editing={true}
                                    setOpenModal={setOpenModal}
                                    setPersonData={setPersonData}
                                    setPersonTableLoading={
                                      setPersonTableLoading
                                    }
                                    closeForm={closeForm}
                                  />
                                }
                                setRows={setTableContent}
                                removeCallback={deletePersonFromPost}
                              />
                            ),
                          },
                        ]}
                      />
                    </Box>
                  )}
                </Card>
              </Box>

              <PostTable
                title="پست ها"
                columns={tableCulomns}
                rows={initData?.postGroup}
                loading={loading}
                removeCallback={deletePost}
                edit={"callback"}
                editCallback={editPost}
                setRows={setPostTableContent}
                actions={[
                  {
                    title: "خروجی اکسل",
                    icon: AssignmentReturnedIcon,
                    onClick: exportTable,
                  },
                ]}
              />
              {/* <CollapsibleTable initData={initData?.postGroup}/> */}
              <div style={{ display: "none" }}>
                <CSVLink
                  ref={txtField}
                  filename={"Organization_Positions.csv"}
                  data={initData?.postList ? csvData() : []}
                >
                  <Tooltip title="خروجی اکسل">
                    <ToggleButton size={"small"}>
                      <AssignmentReturnedIcon />
                    </ToggleButton>
                  </Tooltip>
                </CSVLink>
              </div>
            </CardContent>
          </Card>
          <ModalPro
            title={"توجه!"}
            open={openModal}
            setOpen={setOpenModal}
            maxWidth="sm"
            fullWidth={false}
            content={
              <Box p={3}>
                <div style={{ marginBottom: "16px" }}>
                  {openModal == "hasManager"
                    ? "واحد سازمانی مورد نظر دارای یک مدیر فعال است. آیا مایل به تغییر مدیر این واحد سازمانی می باشید ؟"
                    : openModal == "ceo"
                    ? "شرکت دارای یک مدیرعامل فعال می باشد، ِآیا مایل به تغییر مدیرعامل می باشید؟"
                    : openModal == "manager"
                    ? "این واحد دارای یک مدیر فعال است. آیا مایل به جایگزینی مدیر واحد می باشید؟"
                    : "برای این فرد نقش اصلی دیگری انتخاب شده است مایلید تا نقش اصلی فرد تغییر کند؟"}
                </div>
                <ActionBox>
                  <Button type="submit" onClick={confirmModal} role="primary">
                    بله
                  </Button>
                  <Button type="reset" onClick={closeModal} role="secondary">
                    خیر
                  </Button>
                </ActionBox>
              </Box>
            }
          />
        </Box>
      }
    />
  );
};
export default OrganizationalPosition;
