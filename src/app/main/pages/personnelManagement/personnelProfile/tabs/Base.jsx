import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import axios from "../../../../api/axiosRest";
import useListState from "../../../../reducers/listState";
import { useDispatch, useSelector } from "react-redux";
import FormPro from "../../../../components/formControls/FormPro";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import ActionBox from "../../../../components/ActionBox";
import { Button, Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormInput from "../../../../components/formControls/FormInput";
import CardContent from "@material-ui/core/CardContent";
import checkPermis from "../../../../components/CheckPermision";
import Alert from "@material-ui/lab/Alert";
import UploadImage from "../../../../components/UploadImage";
import sampleSignature from "./sample_signature.png";
import blue from "@material-ui/core/colors/lightBlue";
import { useDialogReducer } from "../../../../components/ConfirmDialog";
import ModalPro from "../../../../components/ModalPro";
import { SERVER_URL } from "../../../../../../configs";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DisplayField from "../../../../components/DisplayField";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import { imageFileTypes } from "../../../filesManagement/fileManager/FileTypeIcon";
import DownloadIcon from "@material-ui/icons/GetApp";

function join(list) {
  const n = list.length;
  if (n === 1) return list[0];
  else return list.slice(0, n - 1).join("، ") + " و " + list.slice(-1);
}

export default function Base({
  partyId,
  partyRelationshipId,
  avatar,
  setAvatar,
  origin,
}) {
  const datas = useSelector(({ fadak }) => fadak);
  const [values, set_values] = useState({});
  const [loading, set_loading] = useState(true);

  const forOther = origin === "search";
  const forUser = origin === "userProfile";
  const forNew = origin === "register";

  const accountPermissions = {
    emailAddress:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/account/emailAddress",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/account/emailAddress",
          datas
        ))||
      (forNew &&
        checkPermis(
          "personnelInformationManagement/addNewPersonnel/addInformation/base/account/emailAddress",
          datas
        )),
    accountStatus:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/account/accountStatus",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/account/accountStatus",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/account/accountStatus",
            datas
          )),
    fromDate:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/account/fromDate",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/account/fromDate",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/account/fromDate",
            datas
          )),
    thruDate:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/account/thruDate",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/account/thruDate",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/account/thruDate",
            datas
          )),
  };

  const personalInfoPermissions = {
    edit:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/personalInfo/edit",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/personalInfo/edit",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/personalInfo/edit",
            datas
          )),
  };

  const signaturePermissions = {
    edit:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/signature/edit",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/signature/edit",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/personalInfo/edit",
            datas
          )),
  };

  const attachmentPermissions = {
    add:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/attachment/add",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/attachment/add",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/attachment/add",
            datas
          )),
    delete:
      (forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/attachment/delete",
          datas
        )) ||
      (forUser &&
        checkPermis(
          "personnelManagement/personnelBaseInformation/base/attachment/delete",
          datas
        ))||
        (forNew &&
          checkPermis(
            "personnelInformationManagement/addNewPersonnel/addInformation/base/attachment/delete",
            datas
          )),
  };

  useEffect(() => {
    axios
      .get("/s1/fadak/UserBasicInfo", {
        params: { partyId, partyRelationshipId },
      })
      .then((res) => {
        set_values(res.data);
        set_loading(false);
      })
      .catch(() => {});
  }, []);

  return (
    <Box p={2}>
      <Card>
        <Grid container>
          <Grid item xs={12} sm={4} md={4} xl={5}>
            {((forOther &&
              checkPermis(
                "personnelInformationManagement/searchPersonnelList/editPersonnel/base/account",
                datas
              )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/base/account",
                  datas
                )) ||
                (forNew &&
                  checkPermis(
                    "personnelInformationManagement/addNewPersonnel/addInformation/base/account",
                    datas
                  ))) && (
              <Box p={2}>
                {loading ? (
                  <Skeleton variant="rect" height={300} />
                ) : (
                  <ColAccount
                    values={values.userAccountInfo}
                    partyId={partyId}
                    partyRelationshipId={partyRelationshipId}
                    permission={accountPermissions}
                  />
                )}
              </Box>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            md={4}
            xl={5}
            style={{ border: "1px #ddd solid", margin: "-1px" }}
          >
            {((forOther &&
              checkPermis(
                "personnelInformationManagement/searchPersonnelList/editPersonnel/base/password",
                datas
              )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/base/password",
                  datas
                )) ||
                (forNew &&
                  checkPermis(
                    "personnelInformationManagement/addNewPersonnel/addInformation/base/password",
                    datas
                  ))) && (
              <Box p={2}>
                {loading ? (
                  <Skeleton variant="rect" height={300} />
                ) : (
                  <ColPassword
                    partyId={partyId}
                    partyRelationshipId={partyRelationshipId}
                  />
                )}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={4} md={4} xl={2}>
            {((forOther &&
              checkPermis(
                "personnelInformationManagement/searchPersonnelList/editPersonnel/base/profilePicture",
                datas
              )) ||
              (forUser &&
                checkPermis(
                  "personnelManagement/personnelBaseInformation/base/profilePicture",
                  datas
                ))||
                (forNew &&
                  checkPermis(
                    "personnelInformationManagement/addNewPersonnel/addInformation/base/profilePicture",
                    datas
                  ))) && (
              <Box p={2}>
                {loading ? (
                  <Skeleton variant="rect" height={300} />
                ) : (
                  <ColAvatar
                    avatar={avatar}
                    setAvatar={setAvatar}
                    partyId={partyId}
                    partyRelationshipId={partyRelationshipId}
                  />
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Card>
      <Box m={2} />
      {((forOther &&
        checkPermis(
          "personnelInformationManagement/searchPersonnelList/editPersonnel/base/personalInfo",
          datas
        )) ||
        (forUser &&
          checkPermis(
            "personnelManagement/personnelBaseInformation/base/personalInfo",
            datas
          ))||
          (forNew &&
            checkPermis(
              "personnelInformationManagement/addNewPersonnel/addInformation/base/personalInfo",
              datas
            ))) && (
        <>
          <CardPersonalInfo
            values={values.personInfo}
            partyId={partyId}
            partyRelationshipId={partyRelationshipId}
            permission={personalInfoPermissions}
            loading={loading}
          />
          <Box m={2} />
        </>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7} xl={9}>
          {((forOther &&
            checkPermis(
              "personnelInformationManagement/searchPersonnelList/editPersonnel/base/attachment",
              datas
            )) ||
            (forUser &&
              checkPermis(
                "personnelManagement/personnelBaseInformation/base/attachment",
                datas
              ))||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/base/attachment",
                  datas
                ))) && (
            <CardAttachment
              attachments={values.attachments}
              partyId={partyId}
              partyRelationshipId={partyRelationshipId}
              permission={attachmentPermissions}
            />
          )}
        </Grid>
        <Grid item xs={12} md={5} xl={3} className="h-full">
          {((forOther &&
            checkPermis(
              "personnelInformationManagement/searchPersonnelList/editPersonnel/base/signature",
              datas
            )) ||
            (forUser &&
              checkPermis(
                "personnelManagement/personnelBaseInformation/base/signature",
                datas
              ))||
              (forNew &&
                checkPermis(
                  "personnelInformationManagement/addNewPersonnel/addInformation/base/signature",
                  datas
                ))) && (
            <CardSignature
              signatureLocation={values.signatureImage}
              partyId={partyId}
              partyRelationshipId={partyRelationshipId}
              permission={signaturePermissions}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

function ColAccount({ values, partyId, partyRelationshipId, permission }) {
  const [formValues, set_formValues] = useState({});
  const [waiting, set_waiting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    set_formValues(values);
  }, [values]);

  const form = [
    {
      name: "username",
      label: "نام کاربری",
      type: "text",
      readOnly: true,
    },
    {
      name: "emailAddress",
      label: "ایمیل بازیابی",
      type: "text",
      readOnly: !permission.emailAddress,
    },
    {
      name: "disabled",
      label: "وضعیت حساب کاربری",
      type: "select",
      options: [
        { enumId: "N", description: "فعال" },
        { enumId: "Y", description: "غیر فعال" },
      ],
      disableClearable: true,
      readOnly: !permission.accountStatus,
    },
    {
      name: "fromDate",
      label: "تاریخ استخدام",
      type: "date",
      readOnly: !permission.fromDate,
    },
    {
      name: "thruDate",
      label: "تاریخ پایان کار",
      type: "date",
      readOnly: !permission.thruDate,
    },
  ];
  function handle_cancel() {
    set_formValues(values);
  }
  function handle_put() {
    set_waiting(true);
    let packet = { ...formValues, partyId, partyRelationshipId };
    axios
      .put("/s1/fadak/userAccount", packet)
      .then(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "ویرایش اطلاعات حساب کاربری با موفقیت انجام شد."
          )
        );
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      })
      .finally(() => {
        set_waiting(false);
      });
  }
  return (
    <Grid container spacing={2}>
      {form.map((field) => (
        <FormInput
          key={field.name}
          {...field}
          col={12}
          valueObject={formValues}
          valueHandler={set_formValues}
        />
      ))}
      {(permission.emailAddress ||
        permission.accountStatus ||
        permission.fromDate ||
        permission.thruDate) && (
        <>
          <Grid item xs={12} md={4}>
            <Button
              onClick={handle_cancel}
              variant="outlined"
              disabled={waiting}
              fullWidth
            >
              لغو
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <Button
              onClick={handle_put}
              variant="contained"
              color="secondary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              ویرایش
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
}

function ColPassword({ partyId, partyRelationshipId }) {
  const [formValues, set_formValues] = useState({});
  const [formValidation, set_formValidation] = useState({});
  const [waiting, set_waiting] = useState(false);
  const dispatch = useDispatch();
  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const form = [
    {
      name: "oldPassword",
      label: "رمز عبور فعلی",
      type: "password",
      required: true,
      col: 12,
    },
    {
      name: "newPassword",
      label: "رمز عبور جدید",
      type: "password",
      required: true,
      col: 12,
      validator: (values) =>
        new Promise((resolve) => {
          if (strongRegex.test(values.newPassword)) {
            resolve({ error: false, helper: "" });
          } else {
            resolve({
              error: true,
              helper:
                "حداقل 8 کاراکتر و شامل حروف کوچک و بزرگ لاتین، اعداد و علائم ویژه!",
            });
          }
        }),
    },
    {
      name: "newPasswordVerify",
      label: "تکرار رمز عبور",
      type: "password",
      required: true,
      col: 12,
      validator: (values) =>
        new Promise((resolve) => {
          if (values.newPassword !== values.newPasswordVerify) {
            resolve({ error: true, helper: "تکرار رمز عبور صحیح نیست!" });
          } else {
            resolve({ error: false, helper: "" });
          }
        }),
    },
  ];
  function handle_put() {
    set_waiting(true);
    let packet = { ...formValues, partyId, partyRelationshipId };
    axios
      .put("/s1/fadak/ChangePassword", packet)
      .then((res) => {
        if (res.data.messages.includes("Password incorrect for user")) {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "رمز عبور فعلی اشتباه است!")
          );
        } else {
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "ویرایش رمز عبور با موفقیت انجام شد."
            )
          );
          set_formValues({});
        }
      })
      .catch((err) => {
        if (
          err.response.data.errors ===
          "Found issues with password so not updating\n"
        ) {
          dispatch(
            setAlertContent(
              ALERT_TYPES.ERROR,
              "این رمز عبور قبلا استفاده شده است!"
            )
          );
        } else {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
        }
      })
      .finally(() => {
        set_waiting(false);
      });
  }
  return (
    <FormPro
      append={form}
      formValues={formValues}
      setFormValues={set_formValues}
      formValidation={formValidation}
      setFormValidation={set_formValidation}
      submitCallback={handle_put}
      actionBox={
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button
              type="reset"
              variant="outlined"
              disabled={waiting}
              fullWidth
            >
              لغو
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
              fullWidth
            >
              ویرایش رمز عبور
            </Button>
          </Grid>
        </Grid>
      }
    >
      <Grid item xs={12}>
        <Alert
          severity="info"
          variant="outlined"
          style={{ fontSize: "small", color: blue["900"] }}
        >
          رمز عبور باید حداقل 8 کاراکتر و شامل حروف کوچک و بزرگ لاتین، اعداد و
          علائم ویژه باشد!
        </Alert>
      </Grid>
    </FormPro>
  );
}

function ColAvatar({ avatar, setAvatar, partyId, partyRelationshipId }) {
  const dispatch = useDispatch();
  const [file, set_file] = useState(null);
  const handle_post = () =>
    new Promise((resolve, reject) => {
      const packet = new FormData();
      packet.append("file", file);
      packet.append("partyContentTypeEnumId", "PcntFaceImage");
      packet.append("partyId", partyId);
      packet.append("partyRelationshipId", partyRelationshipId);
      axios
        .post("/s1/fadak/createPartyContent", packet)
        .then((res) => {
          setAvatar(res.data.contentLocation);
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "بارگذاری تصویر پروفایل با موفقیت انجام شد."
            )
          );
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
          reject();
        });
    });
  return (
    <UploadImage
      imageLocation={avatar}
      label="تصویر پروفایل"
      card
      cardVariant="outlined"
      setValue={set_file}
      onSubmit={handle_post}
    />
  );
}

function CardPersonalInfo({
  values = {},
  partyId,
  partyRelationshipId,
  permission,
  loading,
}) {
  const dispatch = useDispatch();
  const [formValues, set_formValues] = useState({});
  const [formValidation, set_formValidation] = useState({});
  const [waiting, set_waiting] = useState(false);
  const [partyRelationshipType, setPartyRelationshipType] = useState([]);

  const getStatusSelectFields = () => {
    axios
      .get("/s1/fadak/entity/StatusItem?statusTypeId=PartyRelationship")
      .then((res) => {
        setPartyRelationshipType(res.data.status);
      });
  };

  useEffect(() => {
    set_formValues(values);
  }, [values]);

  useEffect(() => {
    getStatusSelectFields();
  }, []);

  const accessAtr = {
    readOnly: !permission.edit,
  };

  const formStructure = [
    {
      name: "personalTitle",
      label: "عنوان",
      type: "select",
      options: "PersonalTitleType",
      ...accessAtr,
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
      required: true,
      ...accessAtr,
    },
    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
      required: true,
      ...accessAtr,
    },
    {
      name: "suffix",
      label: "پسوند",
      type: "text",
      ...accessAtr,
    },
    {
      name: "gender",
      label: "جنسیت",
      type: "select",
      options: "Gender",
      changeCallback: () =>
        set_formValues((prevState) => ({
          ...prevState,
          militaryStateId: null,
        })),
      ...accessAtr,
    },
    {
      name: "FatherName",
      label: "نام پدر",
      type: "text",
      required: true,
      ...accessAtr,
    },
    {
      name: "PlaceOfBirthGeoID",
      label: "محل تولد",
      type: "text",
      required: true,
      ...accessAtr,
    },
    {
      name: "birthDate",
      label: "تاریخ تولد",
      type: "date",
      required: true,
      ...accessAtr,
    },
    {
      name: "nationalcode",
      label: "کد ملی",
      type: "number",
      required: true,
      validator: (obj) =>
        new Promise((resolve) => {
          const nationalId = obj.nationalcode.toString();
          if (nationalId.length !== 10) {
            resolve({ error: true, helper: "کد ملی اشتباه است." });
          } else {
            resolve({ error: false, helper: "" });
          }
        }),
      ...accessAtr,
    },
    {
      name: "idNumber",
      label: "شماره شناسنامه",
      type: "number",
      required: true,
      ...accessAtr,
    },
    {
      name: "serialnumber",
      label: "سری شناسنامه",
      type: "text",
      ...accessAtr,
    },
    {
      name: "CountryGeoId",
      label: "ملیت",
      type: "select",
      options: "Country",
      optionIdField: "geoId",
      optionLabelField: "geoName",
      required: true,
      ...accessAtr,
    },
    {
      name: "Cityplaceofissue",
      label: "استان محل صدور",
      type: "select",
      options: "Province",
      optionIdField: "geoId",
      optionLabelField: "geoName",
      ...accessAtr,
    },
    {
      name: "Regionplaceofissue",
      label: "بخش محل صدور",
      type: "text",
      ...accessAtr,
    },
    {
      name: "ReligionEnumID",
      label: "دین",
      type: "select",
      options: "ReligionEnumId",
      changeCallback: () =>
        set_formValues((prev) => ({ ...prev, sectEnumID: null })),
      ...accessAtr,
    },
    {
      name: "sectEnumID",
      label: "مذهب",
      type: "select",
      options: "SectEnumId",
      filterOptions: (options) =>
        options.filter(
          (opt) => opt.parentEnumId === formValues["ReligionEnumID"]
        ),
      disabled: !formValues["ReligionEnumID"],
      ...accessAtr,
    },
    {
      name: "residenceStatusEnumId",
      label: "وضعیت اسکان",
      type: "select",
      options: "ResidenceStatus",
      required: true,
      ...accessAtr,
    },
    {
      name: "employmentStatusEnumId",
      label: "نوع استخدام",
      type: "select",
      options: "EmploymentStatus",
      required: true,
      ...accessAtr,
    },
    {
      name: "maritalStatusEnumId",
      label: "وضعیت تاهل",
      type: "select",
      options: "MaritalStatus",
      required: true,
      ...accessAtr,
    },
    {
      name: "NumberofKids",
      label: "تعداد فرزندان",
      type: "number",
      ...accessAtr,
    },
    {
      name: "baseInsuranceTypeEnumId",
      label: "نوع بیمه",
      type: "select",
      options: "BaseInsuranceType",
      ...accessAtr,
    },
    {
      name: "boorsCode",
      label: "کد بورسی",
      type: "text",
      ...accessAtr,
    },
    {
      name: "militaryStateId",
      label: "وضعیت نظام وظیفه",
      type: "select",
      options: "MilitaryState",
      disabled: formValues?.gender !== "Y",
      ...accessAtr,
    },
    {
      name: "MilitaryCode",
      label: "کد نظام وظیفه",
      type: "text",
      ...accessAtr,
    },
    {
      name: "passportNumber",
      label: "شماره گذرنامه",
      type: "text",
      ...accessAtr,
    },
    {
      name: "passportExpireDate",
      label: "تاریخ گذرنامه",
      type: "date",
      ...accessAtr,
    },
    {
      name: "personStatusId",
      label: "وضعیت پرسنل",
      type: "select",
      options: partyRelationshipType,
      optionLabelField: "description",
      optionIdField: "statusId",
      ...accessAtr,
    },
    {
      name: "criminalRecord",
      label: "دارای سوابق کیفری",
      type: "indicator",
      ...accessAtr,
    },
    {
      name: "description",
      label: "توضیحات",
      type: "textarea",
      col: 12,
      ...accessAtr,
    },
  ];

  function handle_put() {
    set_waiting(true);
    let packet = { ...formValues, partyId, partyRelationshipId };
    axios
      .put("/s1/fadak/UserBasicInfo", packet)
      .then((res) => {
        let errors = [];
        let validations = {};
        const mapFields = {
          isNationalCodeDuplicated: "nationalcode",
          isBoorsCodeDuplicated: "boorsCode",
          isIdNumberDuplicated: "idNumber",
          isSerialnumberDuplicated: "serialnumber",
          isPassportNumberDuplicated: "passportNumber",
        };
        Object.entries(res.data).map(([key, val]) => {
          if (val === "true") {
            validations[mapFields[key]] = { error: true };
            errors.push(
              formStructure.find((item) => item.name === mapFields[key]).label
            );
          }
        });
        if (errors.length > 0) {
          set_formValidation((prevState) => ({ ...prevState, ...validations }));
          const fields = join(errors);
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              `مقدار ${fields} تکراری است و در سیستم ثبت شده است؛ ویرایش سایر اطلاعات انجام شد.`
            )
          );
        } else {
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "ویرایش اطلاعات پایه پرسنلی با موفقیت انجام شد."
            )
          );
        }
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      })
      .finally(() => {
        set_waiting(false);
      });
  }

  return (
    <Card>
      <CardContent>
        {loading ? (
          <Grid container spacing={2}>
            {Array(26)
              .fill(0)
              .map((item, index) => (
                <Grid item xs={12} md={4} lg={3} key={index}>
                  <Skeleton variant="rect" height={54} />
                </Grid>
              ))}
            <Grid item xs={12}>
              <Skeleton variant="rect" height={103} />
            </Grid>
          </Grid>
        ) : (
          <FormPro
            formValues={formValues}
            setFormValues={set_formValues}
            formDefaultValues={values}
            formValidation={formValidation}
            setFormValidation={set_formValidation}
            prepend={formStructure}
            actionBox={
              permission.edit && (
                <ActionBox>
                  <Button
                    type="submit"
                    role="primary"
                    disabled={waiting}
                    endIcon={waiting ? <CircularProgress size={20} /> : null}
                  >
                    ویرایش
                  </Button>
                  <Button type="reset" role="secondary" disabled={waiting}>
                    لغو
                  </Button>
                </ActionBox>
              )
            }
            submitCallback={handle_put}
          />
        )}
      </CardContent>
    </Card>
  );
}

function CardSignature({
  signatureLocation,
  partyId,
  partyRelationshipId,
  permission,
}) {
  const dispatch = useDispatch();
  const [signature, set_signature] = useState(null);
  const [file, set_file] = useState(null);

  useEffect(() => {
    if (signatureLocation) set_signature(signatureLocation);
  }, [signatureLocation]);

  const handle_post = () =>
    new Promise((resolve, reject) => {
      const packet = new FormData();
      packet.append("file", file);
      packet.append("partyContentTypeEnumId", "signatureImage");
      packet.append("partyId", partyId);
      packet.append("partyRelationshipId", partyRelationshipId);
      axios
        .post("/s1/fadak/createPartyContent", packet)
        .then((res) => {
          set_signature(res.data.contentLocation);
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "بارگذاری تصویر امضاء با موفقیت انجام شد."
            )
          );
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
          reject();
        });
    });
  return (
    <Card>
      <Box p={5}>
        {permission.edit ? (
          <UploadImage
            imageLocation={signature}
            defaultImage={sampleSignature}
            label="تصویر امضاء"
            setValue={set_file}
            onSubmit={handle_post}
            fitContain
          />
        ) : signature ? (
          <Avatar
            variant="square"
            src={
              SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + signature
            }
            className="w-full h-auto"
            imgProps={{ className: "object-contain w-full" }}
          />
        ) : (
          <img src={sampleSignature} className="w-full h-auto" alt="" />
        )}
      </Box>
    </Card>
  );
}

function CardAttachment({
  attachments = [],
  partyId,
  partyRelationshipId,
  permission,
}) {
  const dispatch = useDispatch();
  const primaryKey = "partyContentId";
  const dataList = useListState(primaryKey);
  const modalPreview = useDialogReducer();

  useEffect(() => {
    dataList.set(Object.assign([], attachments));
  }, [attachments.length]);

  function handle_remove(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          "/s1/fadak/entity/PartyContent?partyContentId=" + row.partyContentId
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
  function handle_download(row) {
    const contentLocation = row.contentLocation;
    axios
      .get("/s1/fadak/getpersonnelfile1?name=" + contentLocation, {
        responseType: "blob",
      })
      .then((res) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", contentLocation);
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت فایل!"));
      });
  }

  return (
    <Card>
      <TablePro
        title="پیوست ها"
        columns={[
          {
            name: "partyContentTypeEnumId",
            label: "نوع پیوست",
            type: "select",
            options: "PartyContentType",
          },
          { name: "contentDate", label: "تاریخ بارگذاری", type: "date" },
        ]}
        rows={dataList.list || []}
        setRows={dataList.set}
        loading={dataList.list === null}
        removeCallback={permission.delete ? handle_remove : null}
        add={permission.add ? "external" : false}
        addForm={
          <AttachmentTableForm
            dataList={dataList}
            partyId={partyId}
            partyRelationshipId={partyRelationshipId}
          />
        }
        rowActions={[
          {
            title: "نمایش",
            icon: VisibilityIcon,
            onClick: modalPreview.show,
            display: (row) =>
              imageFileTypes.indexOf(row.contentLocation?.split(".")[1]) > -1,
          },
          {
            title: "دانلود",
            icon: DownloadIcon,
            onClick: handle_download,
            // display: (row) => imageFileTypes.indexOf(row.contentLocation.split(".")[1]) === -1
          },
        ]}
      />
      <ModalPro
        title={
          <DisplayField
            value={modalPreview.data.partyContentTypeEnumId}
            options="PartyContentType"
            variant="raw"
          />
        }
        open={modalPreview.display}
        setOpen={modalPreview.close}
        children={
          <img
            src={
              SERVER_URL +
              "/rest/s1/fadak/getpersonnelfile1?name=" +
              modalPreview.data.contentLocation
            }
            width="100%"
            alt={modalPreview.data.partyContentTypeEnumId}
          />
        }
        maxWidth="sm"
      />
    </Card>
  );
}

function AttachmentTableForm({
  dataList,
  partyId,
  partyRelationshipId,
  ...restProps
}) {
  const [formValidation, setFormValidation] = useState({});
  const {
    formValues,
    setFormValues,
    oldData = {},
    successCallback,
    failedCallback,
    handleClose,
  } = restProps;
  const [waiting, set_waiting] = useState(false);
  const dispatch = useDispatch();
  const formDefaultValues = {};

  const formStructure = [
    {
      name: "partyContentTypeEnumId",
      label: "نوع پیوست",
      type: "select",
      options: "PartyContentType",
      required: true,
      col: 5,
      filterOptions: (options) =>
        options.filter((opt) => opt.parentEnumId === "Attachment"),
    },
    {
      name: "file",
      label: "فایل پیوست",
      type: "file",
      required: true,
      col: 7,
    },
  ];

  const handle_add = () => {
    const packet = new FormData();
    packet.append("file", formValues.file);
    packet.append("partyContentTypeEnumId", formValues.partyContentTypeEnumId);
    packet.append("partyId", partyId);
    packet.append("partyRelationshipId", partyRelationshipId);
    axios
      .post("/s1/fadak/createPartyContent", packet)
      .then((res) => {
        setFormValues(formDefaultValues);
        set_waiting(false);
        successCallback({
          partyContentTypeEnumId: formValues.partyContentTypeEnumId,
          ...res.data,
        });
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formDefaultValues={formDefaultValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={() => {
        set_waiting(true);
        dispatch(
          setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات...")
        );
        handle_add();
      }}
      resetCallback={() => {
        handleClose();
      }}
      actionBox={
        <ActionBox>
          <Button
            type="submit"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            افزودن
          </Button>
          <Button type="reset" role="secondary" disabled={waiting}>
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
