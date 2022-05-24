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
  Grid,
} from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useHistory } from "react-router-dom";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
import UserFullName from "app/main/components/formControls/UserFullName";
import TransferList from "app/main/components/TransferList";
import useListState from "app/main/reducers/listState";
import CommentBox from "app/main/components/CommentBox";
import moment from "moment-jalaali";
import PersonnelFilterForm from "./PersonnelFilterForm";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function WelfareServiceAllocation() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [users, setUsers] = useState([]); // all user when load page
  const [formValues, setFormValues] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [formDefaultValues, setFormDefaultValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [waiting, setWaiting] = useState(false);
  const primaryKey = "partyRelationshipId";
  const personnel = useListState(primaryKey);
  const selectedPersonnel = useListState(primaryKey);
  const comments = useListState("id", []);

  const datas = useSelector(({ fadak }) => fadak);
  const history = useHistory();
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "trackingCode",
      label: "کد رهگیری",
      type: "number",
      readOnly: true,
    },
    {
      type: "component",
      component: (
        <UserFullName
          label="درخواست دهنده"
          name="requesterPartyRelationshipId"
          name3="userPartyRelationshipId"
          setValue={setFormDefaultValues}
        />
      ),
    },
    {
      name: "requesterEmplPositionId",
      label: "پست سازمانی",
      type: "select",
      options: fieldsInfo?.requesterEmplPositionId,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt?.pseudoId} ─ ${opt?.description}` || "؟",
    },
    {
      name: "createdDate",
      label: "تاریخ ایجاد",
      type: "date",
      readOnly: true,
    },
    {
      name: "welfareId",
      label: "انتخاب خدمت رفاهی",
      type: "select",
      options: "Test1",
    },
    {
      name: "allocationDate",
      label: "تاریخ تخصیص",
      type: "date",
    },
    {
      type: "group",
      items: [
        {
          name: "installmentAmount",
          label: "هزینه تامین",
          type: "float",
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      name: "id2",
      label: "منبع تامین",
      type: "select",
      options: "Test1",
    },
  ];

  const getBasicPersonnel = (loadPage = true) => {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: { ...filterValues },
        },
        axiosKey
      )
      .then((res) => {
        if (loadPage) {
          setUsers(res.data.result);
        }
        personnel.set(res.data.result);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت پرسنل رخ داده است."
          )
        );
      });
  };

  const getUserPosition = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/getCurrentUser", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            requesterEmplPositionId: res.data.emplPositions,
          };
        });
        let defaultvalue = {};

        defaultvalue.requesterEmplPositionId = res.data.emplPositionId;
        defaultvalue.requesterFullName = res.data.fullName;
        defaultvalue.requesterPseudoId = res.data.pseudoId;
        defaultvalue.createdDate = moment(new Date().getTime()).format(
          "YYYY-MM-DD"
        );
        setFormDefaultValues((prevState) => {
          return { ...prevState, ...defaultvalue };
        });

        setFormValues((prevState) => {
          return { ...prevState, ...defaultvalue };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن اطلاعات اولیه!")
        );
      });
  };

  const getCompanyInfo = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/companyInfo?subUnit=Y", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            companies: res.data.companies,
            organizationUnit: res.data.organizationSubUnit,
            emplPositions: res.data.emplPosition,
            myCompany: res.data.companyPartyId,
          };
        });
        setFilterValues((prevState) => {
          return { ...prevState, organizationPartyId: res.data.companyPartyId };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت اطلاعات شرکت!")
        );
      });
  };

  const display_name = (item) => `${item.pseudoId} ─ ${item.fullName}`;

  const display_org_info = (item) => {
    let info = [];
    if (item.emplPosition) info.push(item.emplPosition);
    if (item.unitOrganization) info.push(item.unitOrganization);
    if (item.organizationName) info.push(item.organizationName);
    return info.join("، ") || "─";
  };

  const handleSubmit = () => {
    history.push(`/reviewAllocation`);
  };

  const handleReset = () => {
    setFormValues(formDefaultValues);
    setFilterValues({});
    comments.set([]);
    personnel.set(users);
    selectedPersonnel.set([]);
  };

  useEffect(() => {
    getBasicPersonnel();
    getUserPosition();
    getCompanyInfo();
    selectedPersonnel.set([]);
  }, []);

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">خدمات رفاهی</Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              تخصیص خدمت رفاهی
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
                  prepend={formStructure}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formValidation={formValidation}
                  setFormValidation={setFormValidation}
                  submitCallback={() => handleSubmit()}
                  resetCallback={handleReset}
                  actionBox={
                    <ActionBox>
                      <Button
                        type="submit"
                        role="primary"
                        endIcon={
                          waiting ? <CircularProgress size={20} /> : null
                        }
                      >
                        ثبت
                      </Button>
                      <Button type="reset" role="secondary" disabled={waiting}>
                        لغو
                      </Button>
                    </ActionBox>
                  }
                >
                  <Grid item xs={12}>
                    <TransferList
                      rightTitle="لیست پرسنل"
                      rightContext={personnel}
                      rightItemLabelPrimary={display_name}
                      rightItemLabelSecondary={display_org_info}
                      leftTitle="لیست پرسنل انتخاب شده"
                      leftContext={selectedPersonnel}
                      leftItemLabelPrimary={display_name}
                      leftItemLabelSecondary={display_org_info}
                      rightFilterForm={
                        <PersonnelFilterForm
                          search={getBasicPersonnel}
                          formValues={filterValues}
                          setFormValues={setFilterValues}
                          personnel={personnel}
                          users={users}
                          fieldsInfo={fieldsInfo}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CommentBox context={comments} />
                    </Card>
                  </Grid>
                </FormPro>
              </CardContent>
            </Card>
          </Box>
        </>
      }
    />
  );
}
