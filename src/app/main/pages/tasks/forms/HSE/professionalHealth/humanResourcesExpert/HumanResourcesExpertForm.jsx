import FormPro from "app/main/components/formControls/FormPro";
import { useState, useEffect } from "react";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import CommentBox from "app/main/components/CommentBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import useListState from "../../../../../../reducers/listState";
import TransferList from "app/main/components/TransferList";
import UserFullName from "app/main/components/formControls/UserFullName";
import UserCompany from "app/main/components/formControls/UserCompany";
import PersonnelFilterForm from "./PersonnelFilterForm";
import moment from "moment-jalaali";

const HumanResourcesExpertForm = ({ formVariables, submitCallback, reset }) => {
  const [waiting, setWaiting] = useState(false);
  const [users, setUsers] = useState([]); // all user when load page
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formDefaultValues, setFormDefaultValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const comments = useListState(
    "id",
    formVariables?.unitManager?.value.comments || []
  );
  const datas = useSelector(({ fadak }) => fadak);
  const primaryKey = "partyRelationshipId";
  const personnel = useListState(primaryKey);
  const selectedPersonnel = useListState(primaryKey);

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
      col: 4,
    },
    {
      type: "component",
      component: (
        <UserFullName
          label="نام و نام خانوادگی تنظیم کننده"
          name="requesterPartyRelationshipId"
          name3="userPartyRelationshipId"
          setValue={setFormDefaultValues}
        />
      ),
      col: 4,
    },
    {
      name: "requesterEmplPositionId",
      label: "پست سازمانی تنظیم کننده",
      type: "select",
      options: fieldsInfo?.requesterEmplPositionId,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt?.pseudoId} ─ ${opt?.description}` || "؟",
      required: true,
      readOnly: formVariables?.unitManager?.value?.unitOrganizationId,
      col: 4,
    },
    {
      type: "component",
      component: <UserCompany setValue={setFormDefaultValues} />,
      col: 4,
    },
    {
      name: "examinationTypeEnumId",
      label: "نوع معاینه",
      type: "select",
      options: fieldsInfo?.ExaminationType,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          occupationalPartyRelationshipId: null,
          questionnaireId: null,
        })),
      col: 4,
    },
    {
      name: "examinationLocation",
      label: "محل انجام معاینه",
      type: "select",
      options: fieldsInfo?.ExaminationLocation,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      col: 4,
    },
    {
      name: "doctorPartyRelationshipId",
      label: "پزشک معاینه کننده",
      type: "select",
      options: fieldsInfo?.doctor,
      optionIdField: "partyRelationshipId",
      optionLabelField: "fullName",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      required: true,
      col: 4,
    },
    {
      name: "occupationalPartyRelationshipId",
      label: "کارشناس بهداشت حرفه ای معاینه کننده",
      type: "select",
      options: fieldsInfo?.occupational,
      optionIdField: "partyRelationshipId",
      optionLabelField: "fullName",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      required: formValues.examinationTypeEnumId != "ETSpecial",
      display: formValues.examinationTypeEnumId != "ETSpecial",
      col: 4,
    },
    {
      name: "questionnaireId",
      label: "نوع پرسشنامه",
      type: "select",
      options: fieldsInfo?.questionnaires,
      optionIdField: "questionnaireId",
      optionLabelField: "name",
      required: formValues.examinationTypeEnumId == "ETSpecial",
      display: formValues.examinationTypeEnumId == "ETSpecial",
      col: 4,
    },
    {
      name: "createdDate",
      label: "تاریخ درخواست",
      type: "date",
      readOnly: true,
      col: 4,
    },
  ];
  const getBasicPersonnel = (loadPage = true) => {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: { ...filterValues, justCompanyPartyId: "Y" },
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

  const getBasicSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=ExaminationLocation,ExaminationType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            ExaminationLocation: res.data.enums.ExaminationLocation,
            ExaminationType: res.data.enums.ExaminationType,
          };
        });
        getQuestionnaires();
        getUserPosition();
        getDoctorAndOccupational();
      });
  };

  const getQuestionnaires = () => {
    let filter = {
      categoryEnumId: "QcHSEModule",
      subCategoryEnumId: "QcSpecialExaminations",
    };
    axios
      .get(SERVER_URL + "/rest/s1/questionnaire/archive", {
        headers: { api_key: localStorage.getItem("api_key") },
        params: filter,
      })
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            questionnaires: res.data.questionnaires,
          };
        });
      })
      .catch(() => {});
  };

  const getDoctorAndOccupational = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/healthAndCare/DoctorsAndOccupationals",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            occupational: res.data.occupationals,
            doctor: res.data.medicalDoctors,
          };
        });
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
        if (formVariables?.unitManager?.value?.unitOrganizationId) {
          defaultvalue = {
            ...formVariables.examinationProcess.value,
            trackingCode: formVariables.trackingCode.value,
          };
          setFormValues((prevState) => {
            return { ...prevState, ...defaultvalue };
          });
          setFormDefaultValues((prevState) => {
            return { ...prevState, ...defaultvalue };
          });
        } else {
          defaultvalue.requesterEmplPositionId = res.data.emplPositionId;
          defaultvalue.requesterFullName = res.data.fullName;
          defaultvalue.requesterPseudoId = res.data.pseudoId;
          defaultvalue.createdDate = moment(new Date().getTime()).format(
            "YYYY-MM-DD"
          );
          setFormDefaultValues((prevState) => {
            return { ...prevState, ...defaultvalue };
          });
        }
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن اطلاعات اولیه!")
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

  const handle_add_participant = (parties) =>
    new Promise((resolve, reject) => {
      if (formVariables?.unitManager?.value?.unitOrganizationId) {
        const filteredExaminers = parties.filter(
          (examiner) =>
            examiner.unitOrganizationId ==
            formVariables?.unitManager.value.unitOrganizationId
        );
        resolve(filteredExaminers);
      } else {
        resolve(parties);
      }
      // const invalidPersonnel = parties.filter(
      //   (person) =>
      //     !person.firstName ||
      //     !person.lastName ||
      //     !person.FatherName ||
      //     !person.nationalCode ||
      //     !person.birthDate ||
      //     !person.employeementDate ||
      //     !person.jobTitle ||
      //     !person.jobDescription
      // );
      // const validPersonnel = parties.filter(
      //   (vPerson) =>
      //     invalidPersonnel.some(
      //       (iPerson) => vPerson.partyId === iPerson.partyId
      //     ) == false
      // );
      // if (invalidPersonnel.length > 0) {
      //   const invalidPseudoId = [];
      //   invalidPersonnel.map((person) => invalidPseudoId.push(person.pseudoId));
      //   const someInvalidPseudoId = invalidPseudoId.slice(0, 5).join("، ");
      //   dispatch(
      //     setAlertContent(
      //       ALERT_TYPES.WARNING,
      //       `اطلاعات پرسنلی افراد  با کد پرسنلی ${someInvalidPseudoId} کامل نیست.`
      //     )
      //   );
      // }
      // resolve(validPersonnel);
    });

  const handle_delete_participant = (parties) =>
    new Promise((resolve, reject) => {
      resolve(parties);
    });

  const handleSubmit = () => {
    setWaiting(true);
    const doctorInfo = fieldsInfo?.doctor.find(
      (user) => user.partyRelationshipId == formValues.doctorPartyRelationshipId
    );
    const occupationalInfo = fieldsInfo?.occupational.find(
      (user) =>
        user.partyRelationshipId == formValues?.occupationalPartyRelationshipId
    );
    formValues.requesterPartyRelationshipId =
      formValues.userPartyRelationshipId;

    formValues.requesterEmplPosition = fieldsInfo?.requesterEmplPositionId.find(
      (emp) => emp.emplPositionId == formValues.requesterEmplPositionId
    )?.description;

    formValues.doctorName = `${doctorInfo?.fullName} ─ ${doctorInfo?.pseudoId}`;

    formValues.occupationalName = `${occupationalInfo?.fullName} ─ ${occupationalInfo?.pseudoId}`;

    formValues.examinationTypeEnum = fieldsInfo?.ExaminationType.find(
      (exam) => exam.enumId == formValues.examinationTypeEnumId
    )?.description;

    formValues.examinationLocationEnum = fieldsInfo?.ExaminationLocation.find(
      (exam) => exam.enumId == formValues.examinationLocation
    )?.description;

    formValues.questionnaireName =
      fieldsInfo?.questionnaires.find(
        (questionnaire) =>
          questionnaire.questionnaireId == formValues?.questionnaireId
      )?.name || null;

    const occuationalUsername = occupationalInfo?.username || null;

    const doctorUsername = doctorInfo.username;

    if (formVariables?.unitManager?.value?.unitOrganizationId) {
      const filteredExaminers = formVariables.examiners.value.filter(
        (examiner) =>
          examiner.unitOrganizationId !==
            formVariables?.unitManager.value.unitOrganizationId ||
          selectedPersonnel.list.some((row) => examiner.partyId === row.partyId)
      );
      const initialData = {
        examiners: filteredExaminers,
        unitManager: {
          ...formVariables?.unitManager.value,
          comments: comments.list,
        },
        examinationProcess: { ...formValues },
        occuationalUsername: occuationalUsername,
        doctorUsername: doctorUsername,
      };
      submitCallback(initialData);
      handleReset();
    } else {
      axios
        .post(
          SERVER_URL + "/rest/s1/healthAndCare/examinersManager",
          {
            basicExaminers: [...selectedPersonnel.list],
          },
          axiosKey
        )
        .then((res) => {
          const initialData = {
            examinationProcess: { ...formValues },
            examiners: [...selectedPersonnel.list],
            unitManagers: [...res.data.unitManagers],
            occuationalUsername: occuationalUsername,
            doctorUsername: doctorUsername,
            processType: "HSE",
          };
          submitCallback(initialData);
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در یافتن مدیران!"));
          setWaiting(false);
        });
    }
  };

  const handleReset = () => {
    setFormValues(formDefaultValues);
    setFilterValues({});
    if (formVariables?.unitManager?.value?.unitOrganizationId) {
      selectedPersonnel.set([
        ...formVariables.examiners.value.filter(
          (examiner) =>
            examiner.unitOrganizationId ==
            formVariables?.unitManager.value.unitOrganizationId
        ),
      ]);
      comments.set(formVariables?.unitManager?.value.comments || []);
    } else {
      personnel.set(users);
      selectedPersonnel.set([]);
    }
    setWaiting(false);
  };

  useEffect(() => {
    if (formVariables?.unitManager?.value?.unitOrganizationId) {
      selectedPersonnel.set([
        ...formVariables.examiners.value.filter(
          (examiner) =>
            examiner.unitOrganizationId ==
            formVariables?.unitManager.value.unitOrganizationId
        ),
      ]);
    } else {
      selectedPersonnel.set([]);
    }
    getBasicSelectFields();
    getBasicPersonnel(true);
  }, []);

  useEffect(() => {
    if (!formVariables?.unitManager?.value?.unitOrganizationId) {
      setFormValues(formDefaultValues);
    }
  }, [formDefaultValues]);

  useEffect(() => {
    if (
      formVariables?.unitManager?.value?.unitOrganizationId &&
      selectedPersonnel.list?.length > 0 &&
      users.length > 0
    ) {
      personnel.set(
        users.filter(
          (user) =>
            selectedPersonnel.list.findIndex(
              (person) => user.partyId === person.partyId
            ) == -1
        )
      );
    }
  }, [users, selectedPersonnel.list]);

  useEffect(() => {
    if (reset == "success" || reset == "error") {
      handleReset();
    }
  }, [reset]);

  return (
    <Card>
      <CardContent>
        <FormPro
          prepend={formStructure}
          formValues={formValues}
          setFormValues={setFormValues}
          submitCallback={handleSubmit}
          resetCallback={handleReset}
          formValidation={formValidation}
          setFormValidation={setFormValidation}
          actionBox={
            <ActionBox>
              {checkPermis(
                "hse/professionalHealth/humanResourcesExpert/submit",
                datas
              ) && (
                <Button
                  type="submit"
                  role="primary"
                  disabled={waiting || selectedPersonnel.list?.length == 0}
                  endIcon={waiting ? <CircularProgress size={20} /> : null}
                >
                  {"تایید و ارسال"}
                </Button>
              )}

              <Button type="reset" role="secondary" disabled={waiting}>
                لغو
              </Button>
              {checkPermis(
                "hse/professionalHealth/humanResourcesExpert/print",
                datas
              ) && (
                <Button
                  type="reset"
                  role="secondary"
                  disabled={true}
                  // disabled={waiting}
                >
                  چاپ معرفی نامه
                </Button>
              )}
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
              onMoveLeft={handle_add_participant}
              onMoveRight={handle_delete_participant}
              rightFilterForm={
                checkPermis(
                  "hse/professionalHealth/humanResourcesExpert/filter",
                  datas
                ) && (
                  <PersonnelFilterForm
                    search={getBasicPersonnel}
                    formValues={filterValues}
                    setFormValues={setFilterValues}
                    personnel={personnel}
                    users={users}
                  />
                )
              }
            />
          </Grid>
          {formVariables?.unitManager?.value?.unitOrganizationId && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CommentBox context={comments} />
              </Card>
            </Grid>
          )}
        </FormPro>
      </CardContent>
    </Card>
  );
};

export default HumanResourcesExpertForm;
